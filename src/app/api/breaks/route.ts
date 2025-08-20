import { NextRequest, NextResponse } from 'next/server'
import { getBreakSessions, getBreakStats } from '@/lib/db-utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('memberId')
    const date = searchParams.get('date')

    console.log('📊 API: Fetching break sessions for memberId:', memberId, 'date:', date)

    if (!memberId) {
      return NextResponse.json({ error: 'Member ID is required' }, { status: 400 })
    }

    const breakSessions = await getBreakSessions(memberId, date!)
    const stats = await getBreakStats(memberId, date!)

    return NextResponse.json({ breakSessions, stats })

  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch break sessions' },
      { status: 500 }
    )
  }
}
