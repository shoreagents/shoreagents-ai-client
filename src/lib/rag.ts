import { OpenAIEmbeddings } from "@langchain/openai"
// Use dynamic import for PGVector store to avoid build-time type resolution issues
// and gracefully fall back when the package/extension is unavailable.
import { MemoryVectorStore } from "langchain/vectorstores/memory"
import type { VectorStore } from "@langchain/core/vectorstores"
import pool from "@/lib/database"

type Nullable<T> = T | null

let embeddings: Nullable<OpenAIEmbeddings> = null
let store: Nullable<VectorStore> = null
let initialized = false
let usedMemoryFallback = false

async function ensureEmbeddings(): Promise<OpenAIEmbeddings | null> {
  if (embeddings) return embeddings
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null
  embeddings = new OpenAIEmbeddings({ apiKey })
  return embeddings
}

async function initPgVectorStore(): Promise<VectorStore | null> {
  const embs = await ensureEmbeddings()
  if (!embs) return null
  try {
    // Dynamically import PGVector store (optional dependency)
    // @ts-ignore
    const mod: any = await import("@langchain/community/vectorstores/pgvector").catch(() => null)
    if (!mod?.PGVectorStore) return null
    const PGVectorStore: any = mod.PGVectorStore
    // Initialize or create table if missing
    const pgStore = await PGVectorStore.initialize(embs, {
      pool,
      tableName: "talent_docs",
      schemaName: "public",
    })
    return pgStore
  } catch (_) {
    return null
  }
}

async function initMemoryStore(): Promise<VectorStore | null> {
  const embs = await ensureEmbeddings()
  if (!embs) return null
  const mem = new MemoryVectorStore(embs)
  usedMemoryFallback = true
  return mem
}

async function ensureStore(): Promise<VectorStore | null> {
  if (initialized && store) return store
  if (initialized && !store) return null
  initialized = true
  // Try PGVector first
  store = await initPgVectorStore()
  if (store) return store
  // Fallback to in-memory
  store = await initMemoryStore()
  return store
}

export async function isRagAvailable(): Promise<boolean> {
  const s = await ensureStore()
  return !!s
}

export async function indexTalentProfileDoc(talent: {
  id: string
  name: string
  position?: string
  skills?: string[]
  experience?: string
  description?: string
}): Promise<void> {
  const s = await ensureStore()
  if (!s) return
  const parts: string[] = []
  parts.push(`Name: ${talent.name}`)
  if (talent.position) parts.push(`Position: ${talent.position}`)
  if (talent.experience) parts.push(`Experience: ${talent.experience}`)
  if (Array.isArray(talent.skills) && talent.skills.length > 0) {
    parts.push(`Skills: ${talent.skills.join(", ")}`)
  }
  if (talent.description) parts.push(`Description: ${talent.description}`)

  const pageContent = parts.join("\n")
  await (s as any).addDocuments([
    {
      pageContent,
      metadata: { talentId: talent.id, type: "profile" },
    },
  ])
}

export async function retrieveContextForTalent(
  talentId: string,
  query: string,
  k: number = 4
): Promise<string> {
  const s: any = await ensureStore()
  if (!s) return ""

  let docs: any[] = []
  try {
    // Many vector stores support metadata filters; PGVector does
    docs = await s.similaritySearch(query, k, { talentId })
  } catch (_) {
    try {
      // Fallback: unfiltered search then filter by metadata in-memory
      const all = await s.similaritySearch(query, k * 3)
      docs = all.filter((d: any) => d?.metadata?.talentId === talentId).slice(0, k)
    } catch (_) {
      docs = []
    }
  }

  const context = docs
    .map((d) => (typeof d?.pageContent === "string" ? d.pageContent : ""))
    .filter(Boolean)
    .join("\n\n---\n\n")
  return context
}

export function isUsingMemoryRag(): boolean {
  return usedMemoryFallback
}


