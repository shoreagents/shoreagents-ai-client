import { NextRequest, NextResponse } from 'next/server'
import { getActivitiesByDate, getActivityStats } from '@/lib/db-utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('memberId')
    const userId = searchParams.get('userId') // Optional: filter by specific user
    const date = searchParams.get('date') // Format: YYYY-MM-DD
    const startDate = searchParams.get('startDate') // Format: YYYY-MM-DD
    const endDate = searchParams.get('endDate') // Format: YYYY-MM-DD

    console.log('📊 API: Fetching activities for memberId:', memberId, 'userId:', userId, 'date:', date, 'startDate:', startDate, 'endDate:', endDate)

    if (!memberId) {
      return NextResponse.json({ error: 'Member ID is required' }, { status: 400 })
    }

    // Determine date range
    let targetStartDate: string
    let targetEndDate: string

    if (date) {
      // Single date
      targetStartDate = date
      targetEndDate = date
    } else if (startDate && endDate) {
      // Date range
      targetStartDate = startDate
      targetEndDate = endDate
    } else {
      // Default to current date in Asia/Manila timezone
      const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' })
      targetStartDate = today
      targetEndDate = today
    }

    let activities = await getActivitiesByDate(memberId, targetStartDate, targetEndDate)
    
    // If userId is provided, filter activities for that specific user
    if (userId) {
      const userIdNum = parseInt(userId)
      activities = activities.filter((activity: any) => activity.user_id === userIdNum)
      console.log('📊 API: Filtered activities for userId', userId, ':', activities.length, 'records')
    }
    
    const stats = await getActivityStats(memberId, targetStartDate, targetEndDate)

    return NextResponse.json({ 
      activities, 
      stats,
      dateRange: {
        startDate: targetStartDate,
        endDate: targetEndDate
      }
    })

  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    )
  }
}
