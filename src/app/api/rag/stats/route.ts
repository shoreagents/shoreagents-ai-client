import { NextRequest, NextResponse } from "next/server"
import { getCollectionStats } from "@/lib/rag"

export async function GET(req: NextRequest) {
  try {
    const stats = await getCollectionStats()
    
    if (!stats) {
      return NextResponse.json({ 
        error: "Qdrant not available or collection not found" 
      }, { status: 503 })
    }

    return NextResponse.json({ 
      success: true, 
      data: stats 
    })
  } catch (error: any) {
    console.error("Stats retrieval error:", error)
    return NextResponse.json({ 
      error: "Failed to retrieve collection stats",
      details: error.message 
    }, { status: 500 })
  }
}
