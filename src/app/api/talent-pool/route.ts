import { NextRequest, NextResponse } from 'next/server'
import { listTalentPool } from '@/lib/db-utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || 'All'
    const sortBy = searchParams.get('sortBy') || 'rating'
    const talents = await listTalentPool(search, category, sortBy)
    return NextResponse.json({ success: true, talents, total: talents.length })

  } catch (error) {
    console.error('Error fetching talent pool:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch talent pool data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
