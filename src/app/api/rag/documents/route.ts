import { NextRequest, NextResponse } from "next/server"
import { indexDocument, searchDocuments, enhancedRetrieveContext } from "@/lib/rag"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { content, metadata } = body

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: "Content is required and must be a string" }, { status: 400 })
    }

    if (!metadata || typeof metadata !== 'object') {
      return NextResponse.json({ error: "Metadata is required and must be an object" }, { status: 400 })
    }

    await indexDocument(content, metadata)

    return NextResponse.json({ 
      success: true, 
      message: "Document indexed successfully" 
    })
  } catch (error: any) {
    console.error("Document indexing error:", error)
    return NextResponse.json({ 
      error: "Failed to index document",
      details: error.message 
    }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q')
    const k = parseInt(searchParams.get('k') || '5')
    const talentId = searchParams.get('talentId')
    const enhanced = searchParams.get('enhanced') === 'true'

    if (!query) {
      return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 })
    }

    let results

    if (enhanced) {
      // Use enhanced retrieval with sources
      const { context, sources } = await enhancedRetrieveContext(query, talentId || undefined, k)
      results = {
        context,
        sources,
        query,
        talentId: talentId || null
      }
    } else {
      // Use basic search
      const filter = talentId ? { talentId } : undefined
      const documents = await searchDocuments(query, k, filter)
      results = {
        documents,
        query,
        talentId: talentId || null
      }
    }

    return NextResponse.json({ 
      success: true, 
      data: results 
    })
  } catch (error: any) {
    console.error("Document search error:", error)
    return NextResponse.json({ 
      error: "Failed to search documents",
      details: error.message 
    }, { status: 500 })
  }
}
