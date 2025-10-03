import { NextRequest, NextResponse } from 'next/server'
import { getActivitiesByDate, getActivityStats } from '@/lib/db-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: memberId } = await params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const date = searchParams.get('date')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    console.log('📊 API: Fetching member activities for memberId:', memberId, 'page:', page, 'limit:', limit)

    if (!memberId) {
      return NextResponse.json({ error: 'Member ID is required' }, { status: 400 })
    }

    // Determine date range
    let targetStartDate: string
    let targetEndDate: string

    if (date) {
      targetStartDate = date
      targetEndDate = date
    } else if (startDate && endDate) {
      targetStartDate = startDate
      targetEndDate = endDate
    } else {
      // Default to current date in Asia/Manila timezone
      const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' })
      targetStartDate = today
      targetEndDate = today
    }

    const activities = await getActivitiesByDate(memberId, targetStartDate, targetEndDate)
    const stats = await getActivityStats(memberId, targetStartDate, targetEndDate)

    // Transform activities to match expected format
    const entries = activities.map((activity: any) => ({
      id: activity.id,
      type: 'activity',
      activity: activity.activity_type,
      createdAt: activity.created_at,
      userName: activity.user_name || 'Unknown User',
      userId: activity.user_id,
      details: activity.details
    }))

    return NextResponse.json({ 
      entries,
      stats,
      pagination: {
        page,
        limit,
        total: entries.length,
        totalCount: entries.length,
        hasMore: false // For now, no pagination
      },
      dateRange: {
        startDate: targetStartDate,
        endDate: targetEndDate
      }
    })

  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch member activities' },
      { status: 500 }
    )
  }
}
