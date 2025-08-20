import { NextRequest, NextResponse } from 'next/server'
import { getDailyTrend, getWeeklyTrend, getProductivityScoresRows, getProductivityStatsRow } from '@/lib/db-utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('memberId')
    const timeframe = searchParams.get('timeframe') || 'monthly' // weekly, monthly, quarterly
    const monthYear = searchParams.get('monthYear') // Format: YYYY-MM
    const trend = searchParams.get('trend') // 'daily' for activity_data trend
    const limit = searchParams.get('limit') // Optional limit for top N results

    console.log('📊 API: Fetching productivity scores for memberId:', memberId, 'timeframe:', timeframe, 'monthYear:', monthYear, 'limit:', limit)

    if (!memberId) {
      return NextResponse.json({ error: 'Member ID is required' }, { status: 400 })
    }

    // Determine the month/year to query
    let targetMonthYear = monthYear
    if (!targetMonthYear) {
      const now = new Date()
      targetMonthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    }

    // If requesting daily trend based on activity_data
    if (trend === 'daily') {
      // Compute month date range from targetMonthYear
      const [yearStr, monthStr] = targetMonthYear.split('-')
      const year = parseInt(yearStr, 10)
      const month = parseInt(monthStr, 10)
      const startDate = new Date(Date.UTC(year, month - 1, 1))
      const endDate = new Date(Date.UTC(year, month, 0)) // last day of month

      const startISO = startDate.toISOString().slice(0, 10)
      const endISO = endDate.toISOString().slice(0, 10)

      // Queries moved to db-utils: getDailyTrend()

      const dailyTrendRows = await getDailyTrend(memberId, startISO, endISO)
      const trendDaily = dailyTrendRows.map((row: any) => ({
        date: row.date, // YYYY-MM-DD
        total_active_seconds: Number(row.total_active_seconds) || 0,
        total_inactive_seconds: Number(row.total_inactive_seconds) || 0,
        top1: row.top1 || null,
        top2: row.top2 || null,
        top3: row.top3 || null,
        top4: row.top4 || null,
        top5: row.top5 || null,
      }))

      return NextResponse.json({ trendDaily, monthYear: targetMonthYear })
    }

    // If requesting weekly trend based on weekly_activity_summary, bounded by selected month
    if (trend === 'weekly') {
      const [yearStr, monthStr] = targetMonthYear.split('-')
      const year = parseInt(yearStr, 10)
      const month = parseInt(monthStr, 10)
      const startDate = new Date(Date.UTC(year, month - 1, 1))
      const endDate = new Date(Date.UTC(year, month, 0))

      const startISO = startDate.toISOString().slice(0, 10)
      const endISO = endDate.toISOString().slice(0, 10)

      // Queries moved to db-utils: getWeeklyTrend()

      const weeklyTrendRows = await getWeeklyTrend(memberId, startISO, endISO)
      const trendWeekly = weeklyTrendRows.map((row: any) => ({
        week_start_date: row.week_start_date,
        week_end_date: row.week_end_date,
        avg_active_seconds: Number(row.avg_active_seconds) || 0,
        avg_inactive_seconds: Number(row.avg_inactive_seconds) || 0,
        top1: row.top1 || null,
        top2: row.top2 || null,
        top3: row.top3 || null,
      }))

      return NextResponse.json({ trendWeekly, monthYear: targetMonthYear })
    }

    // Build the query based on memberId and timeframe
    const rows = await getProductivityScoresRows(memberId, targetMonthYear, limit ? parseInt(limit) : undefined)
    console.log('📊 API: Found', rows.length, 'productivity scores')

    // Get statistics
    const statsRow = await getProductivityStatsRow(memberId, targetMonthYear)

    const productivityScores = rows.map((row, index) => ({
      id: row.id,
      user_id: row.user_id,
      month_year: row.month_year,
      productivity_score: parseFloat(row.productivity_score) || 0,
      total_active_seconds: row.total_active_seconds || 0,
      total_inactive_seconds: row.total_inactive_seconds || 0,
      total_seconds: row.total_seconds || 0,
      active_percentage: parseFloat(row.active_percentage) || 0,
      first_name: row.first_name || '',
      last_name: row.last_name || '',
      profile_picture: row.profile_picture,
      email: row.email,
      department_name: row.department_name || 'Unassigned',
      exp_points: row.exp_points || 0,
      rank: index + 1
    }))

    const stats = statsRow || {
      total_agents: 0,
      average_productivity: 0,
      average_active_percentage: 0,
      highest_productivity: 0,
      lowest_productivity: 0
    }

    return NextResponse.json({
      productivityScores,
      stats: {
        total: parseInt(stats.total_agents) || 0,
        averageProductivity: parseFloat(stats.average_productivity) || 0,
        averageActivePercentage: parseFloat(stats.average_active_percentage) || 0,
        highestProductivity: parseFloat(stats.highest_productivity) || 0,
        lowestProductivity: parseFloat(stats.lowest_productivity) || 0
      },
      timeframe,
      monthYear: targetMonthYear
    })

  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch productivity scores' },
      { status: 500 }
    )
  }
}
