import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

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

      const dailyTrendQueryAll = `
        WITH base AS (
          SELECT ad.user_id,
                 ad.today_date,
                 ad.today_active_seconds,
                 ad.today_inactive_seconds
          FROM activity_data ad
          JOIN users u ON ad.user_id = u.id
          JOIN agents ag ON ag.user_id = u.id
          WHERE u.user_type = 'Agent'
            AND ad.today_date BETWEEN $1 AND $2
        ),
        totals_by_day AS (
          SELECT today_date,
                 SUM(today_active_seconds)::int AS total_active_seconds,
                 SUM(today_inactive_seconds)::int AS total_inactive_seconds
          FROM base
          GROUP BY today_date
        ),
        ranked AS (
          SELECT b.today_date,
                 b.user_id,
                 b.today_active_seconds,
                 ROW_NUMBER() OVER (PARTITION BY b.today_date ORDER BY b.today_active_seconds DESC) AS rn
          FROM base b
        )
        SELECT r.today_date AS date,
               t.total_active_seconds,
               t.total_inactive_seconds,
               (MAX(CASE WHEN r.rn = 1 THEN (
                   json_build_object(
                     'user_id', r.user_id,
                     'first_name', pi.first_name,
                     'last_name', pi.last_name,
                     'profile_picture', pi.profile_picture,
                     'points', r.today_active_seconds
                   )::text
               ) END))::json AS top1,
               (MAX(CASE WHEN r.rn = 2 THEN (
                   json_build_object(
                     'user_id', r.user_id,
                     'first_name', pi.first_name,
                     'last_name', pi.last_name,
                     'profile_picture', pi.profile_picture,
                     'points', r.today_active_seconds
                   )::text
               ) END))::json AS top2,
               (MAX(CASE WHEN r.rn = 3 THEN (
                   json_build_object(
                     'user_id', r.user_id,
                     'first_name', pi.first_name,
                     'last_name', pi.last_name,
                     'profile_picture', pi.profile_picture,
                     'points', r.today_active_seconds
                   )::text
               ) END))::json AS top3,
               (MAX(CASE WHEN r.rn = 4 THEN (
                   json_build_object(
                     'user_id', r.user_id,
                     'first_name', pi.first_name,
                     'last_name', pi.last_name,
                     'profile_picture', pi.profile_picture,
                     'points', r.today_active_seconds
                   )::text
               ) END))::json AS top4,
               (MAX(CASE WHEN r.rn = 5 THEN (
                   json_build_object(
                     'user_id', r.user_id,
                     'first_name', pi.first_name,
                     'last_name', pi.last_name,
                     'profile_picture', pi.profile_picture,
                     'points', r.today_active_seconds
                   )::text
               ) END))::json AS top5
        FROM ranked r
        JOIN personal_info pi ON pi.user_id = r.user_id
        JOIN totals_by_day t ON t.today_date = r.today_date
        GROUP BY r.today_date, t.total_active_seconds, t.total_inactive_seconds
        ORDER BY r.today_date
      `

      const dailyTrendQueryByMember = `
        WITH base AS (
          SELECT ad.user_id,
                 ad.today_date,
                 ad.today_active_seconds,
                 ad.today_inactive_seconds
          FROM activity_data ad
          JOIN users u ON ad.user_id = u.id
          JOIN agents ag ON ag.user_id = u.id
          WHERE u.user_type = 'Agent'
            AND ag.member_id = $3
            AND ad.today_date BETWEEN $1 AND $2
        ),
        totals_by_day AS (
          SELECT today_date,
                 SUM(today_active_seconds)::int AS total_active_seconds,
                 SUM(today_inactive_seconds)::int AS total_inactive_seconds
          FROM base
          GROUP BY today_date
        ),
        ranked AS (
          SELECT b.today_date,
                 b.user_id,
                 b.today_active_seconds,
                 ROW_NUMBER() OVER (PARTITION BY b.today_date ORDER BY b.today_active_seconds DESC) AS rn
          FROM base b
        )
        SELECT r.today_date AS date,
               t.total_active_seconds,
               t.total_inactive_seconds,
               (MAX(CASE WHEN r.rn = 1 THEN (
                   json_build_object(
                     'user_id', r.user_id,
                     'first_name', pi.first_name,
                     'last_name', pi.last_name,
                     'profile_picture', pi.profile_picture,
                     'points', r.today_active_seconds
                   )::text
               ) END))::json AS top1,
               (MAX(CASE WHEN r.rn = 2 THEN (
                   json_build_object(
                     'user_id', r.user_id,
                     'first_name', pi.first_name,
                     'last_name', pi.last_name,
                     'profile_picture', pi.profile_picture,
                     'points', r.today_active_seconds
                   )::text
               ) END))::json AS top2,
               (MAX(CASE WHEN r.rn = 3 THEN (
                   json_build_object(
                     'user_id', r.user_id,
                     'first_name', pi.first_name,
                     'last_name', pi.last_name,
                     'profile_picture', pi.profile_picture,
                     'points', r.today_active_seconds
                   )::text
               ) END))::json AS top3,
               (MAX(CASE WHEN r.rn = 4 THEN (
                   json_build_object(
                     'user_id', r.user_id,
                     'first_name', pi.first_name,
                     'last_name', pi.last_name,
                     'profile_picture', pi.profile_picture,
                     'points', r.today_active_seconds
                   )::text
               ) END))::json AS top4,
               (MAX(CASE WHEN r.rn = 5 THEN (
                   json_build_object(
                     'user_id', r.user_id,
                     'first_name', pi.first_name,
                     'last_name', pi.last_name,
                     'profile_picture', pi.profile_picture,
                     'points', r.today_active_seconds
                   )::text
               ) END))::json AS top5
        FROM ranked r
        JOIN personal_info pi ON pi.user_id = r.user_id
        JOIN totals_by_day t ON t.today_date = r.today_date
        GROUP BY r.today_date, t.total_active_seconds, t.total_inactive_seconds
        ORDER BY r.today_date
      `

      const dailyTrendResult = memberId === 'all'
        ? await pool.query(dailyTrendQueryAll, [startISO, endISO])
        : await pool.query(dailyTrendQueryByMember, [startISO, endISO, memberId])

      const trendDaily = dailyTrendResult.rows.map((row: any) => ({
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

      const weeklyTrendQueryAll = `
        WITH base AS (
          SELECT was.user_id,
                 was.week_start_date,
                 was.week_end_date,
                 COALESCE(was.total_active_seconds, 0)   AS total_active_seconds,
                 COALESCE(was.total_inactive_seconds, 0) AS total_inactive_seconds
          FROM weekly_activity_summary was
          JOIN users u ON was.user_id = u.id
          JOIN agents ag ON ag.user_id = u.id
          WHERE u.user_type = 'Agent'
            AND was.week_start_date <= $2
            AND was.week_end_date >= $1
        ),
        avg_by_week AS (
          SELECT week_start_date,
                 week_end_date,
                 AVG(total_active_seconds)::int   AS avg_active_seconds,
                 AVG(total_inactive_seconds)::int AS avg_inactive_seconds
          FROM base
          GROUP BY week_start_date, week_end_date
        ),
        ranked AS (
          SELECT b.week_start_date,
                 b.week_end_date,
                 b.user_id,
                 b.total_active_seconds,
                 ROW_NUMBER() OVER (
                   PARTITION BY b.week_start_date, b.week_end_date
                   ORDER BY b.total_active_seconds DESC
                 ) AS rn
          FROM base b
        )
        SELECT r.week_start_date,
               r.week_end_date,
               a.avg_active_seconds,
               a.avg_inactive_seconds,
               MAX(CASE WHEN r.rn = 1 THEN json_build_object(
                 'user_id', r.user_id,
                 'first_name', pi1.first_name,
                 'last_name', pi1.last_name,
                 'profile_picture', pi1.profile_picture,
                 'points', r.total_active_seconds
               ) END) AS top1,
               MAX(CASE WHEN r.rn = 2 THEN json_build_object(
                 'user_id', r.user_id,
                 'first_name', pi2.first_name,
                 'last_name', pi2.last_name,
                 'profile_picture', pi2.profile_picture,
                 'points', r.total_active_seconds
               ) END) AS top2,
               MAX(CASE WHEN r.rn = 3 THEN json_build_object(
                 'user_id', r.user_id,
                 'first_name', pi3.first_name,
                 'last_name', pi3.last_name,
                 'profile_picture', pi3.profile_picture,
                 'points', r.total_active_seconds
               ) END) AS top3
        FROM ranked r
        LEFT JOIN personal_info pi1 ON (r.rn = 1 AND pi1.user_id = r.user_id)
        LEFT JOIN personal_info pi2 ON (r.rn = 2 AND pi2.user_id = r.user_id)
        LEFT JOIN personal_info pi3 ON (r.rn = 3 AND pi3.user_id = r.user_id)
        JOIN avg_by_week a ON a.week_start_date = r.week_start_date AND a.week_end_date = r.week_end_date
        GROUP BY r.week_start_date, r.week_end_date, a.avg_active_seconds, a.avg_inactive_seconds
        ORDER BY r.week_start_date
      `

      const weeklyTrendQueryByMember = `
        WITH base AS (
          SELECT was.user_id,
                 was.week_start_date,
                 was.week_end_date,
                 COALESCE(was.total_active_seconds, 0)   AS total_active_seconds,
                 COALESCE(was.total_inactive_seconds, 0) AS total_inactive_seconds
          FROM weekly_activity_summary was
          JOIN users u ON was.user_id = u.id
          JOIN agents ag ON ag.user_id = u.id
          WHERE u.user_type = 'Agent'
            AND ag.member_id = $3
            AND was.week_start_date <= $2
            AND was.week_end_date >= $1
        ),
        avg_by_week AS (
          SELECT week_start_date,
                 week_end_date,
                 AVG(total_active_seconds)::int   AS avg_active_seconds,
                 AVG(total_inactive_seconds)::int AS avg_inactive_seconds
          FROM base
          GROUP BY week_start_date, week_end_date
        ),
        ranked AS (
          SELECT b.week_start_date,
                 b.week_end_date,
                 b.user_id,
                 b.total_active_seconds,
                 ROW_NUMBER() OVER (
                   PARTITION BY b.week_start_date, b.week_end_date
                   ORDER BY b.total_active_seconds DESC
                 ) AS rn
          FROM base b
        )
        SELECT r.week_start_date,
               r.week_end_date,
               a.avg_active_seconds,
               a.avg_inactive_seconds,
               MAX(CASE WHEN r.rn = 1 THEN json_build_object(
                 'user_id', r.user_id,
                 'first_name', pi1.first_name,
                 'last_name', pi1.last_name,
                 'profile_picture', pi1.profile_picture,
                 'points', r.total_active_seconds
               ) END) AS top1,
               MAX(CASE WHEN r.rn = 2 THEN json_build_object(
                 'user_id', r.user_id,
                 'first_name', pi2.first_name,
                 'last_name', pi2.last_name,
                 'profile_picture', pi2.profile_picture,
                 'points', r.total_active_seconds
               ) END) AS top2,
               MAX(CASE WHEN r.rn = 3 THEN json_build_object(
                 'user_id', r.user_id,
                 'first_name', pi3.first_name,
                 'last_name', pi3.last_name,
                 'profile_picture', pi3.profile_picture,
                 'points', r.total_active_seconds
               ) END) AS top3
        FROM ranked r
        LEFT JOIN personal_info pi1 ON (r.rn = 1 AND pi1.user_id = r.user_id)
        LEFT JOIN personal_info pi2 ON (r.rn = 2 AND pi2.user_id = r.user_id)
        LEFT JOIN personal_info pi3 ON (r.rn = 3 AND pi3.user_id = r.user_id)
        JOIN avg_by_week a ON a.week_start_date = r.week_start_date AND a.week_end_date = r.week_end_date
        GROUP BY r.week_start_date, r.week_end_date, a.avg_active_seconds, a.avg_inactive_seconds
        ORDER BY r.week_start_date
      `

      const weeklyTrendResult = memberId === 'all'
        ? await pool.query(weeklyTrendQueryAll, [startISO, endISO])
        : await pool.query(weeklyTrendQueryByMember, [startISO, endISO, memberId])

      const trendWeekly = weeklyTrendResult.rows.map((row: any) => ({
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
    const limitClause = limit ? `LIMIT ${parseInt(limit)}` : ''
    
    const productivityQuery = memberId === 'all' ? `
      SELECT 
        ps.id,
        ps.user_id,
        ps.month_year,
        ps.productivity_score,
        ps.total_active_seconds,
        ps.total_inactive_seconds,
        ps.total_seconds,
        ps.active_percentage,
        ps.created_at,
        ps.updated_at,
        pi.first_name,
        pi.last_name,
        pi.profile_picture,
        u.email,
        d.name as department_name,
        a.exp_points
      FROM productivity_scores ps
      LEFT JOIN personal_info pi ON ps.user_id = pi.user_id
      LEFT JOIN users u ON ps.user_id = u.id
      LEFT JOIN agents a ON ps.user_id = a.user_id
      LEFT JOIN departments d ON a.department_id = d.id
      WHERE ps.month_year = $1
        AND u.user_type = 'Agent'
      ORDER BY ps.total_active_seconds DESC, ps.active_percentage DESC
      ${limitClause}
    ` : `
      SELECT 
        ps.id,
        ps.user_id,
        ps.month_year,
        ps.productivity_score,
        ps.total_active_seconds,
        ps.total_inactive_seconds,
        ps.total_seconds,
        ps.active_percentage,
        ps.created_at,
        ps.updated_at,
        pi.first_name,
        pi.last_name,
        pi.profile_picture,
        u.email,
        d.name as department_name,
        a.exp_points
      FROM productivity_scores ps
      LEFT JOIN personal_info pi ON ps.user_id = pi.user_id
      LEFT JOIN users u ON ps.user_id = u.id
      LEFT JOIN agents a ON ps.user_id = a.user_id
      LEFT JOIN departments d ON a.department_id = d.id
      WHERE ps.month_year = $1
        AND u.user_type = 'Agent'
        AND a.member_id = $2
      ORDER BY ps.total_active_seconds DESC, ps.active_percentage DESC
      ${limitClause}
    `

    console.log('📊 API: Executing productivity scores query for memberId:', memberId, 'monthYear:', targetMonthYear)
    const productivityResult = memberId === 'all' 
      ? await pool.query(productivityQuery, [targetMonthYear])
      : await pool.query(productivityQuery, [targetMonthYear, memberId])
    console.log('📊 API: Found', productivityResult.rows.length, 'productivity scores')

    // Get statistics
    const statsQuery = memberId === 'all' ? `
      SELECT 
        COUNT(*) as total_agents,
        AVG(ps.productivity_score) as average_productivity,
        AVG(ps.active_percentage) as average_active_percentage,
        MAX(ps.productivity_score) as highest_productivity,
        MIN(ps.productivity_score) as lowest_productivity
      FROM productivity_scores ps
      LEFT JOIN users u ON ps.user_id = u.id
      LEFT JOIN agents a ON ps.user_id = a.user_id
      WHERE ps.month_year = $1
        AND u.user_type = 'Agent'
    ` : `
      SELECT 
        COUNT(*) as total_agents,
        AVG(ps.productivity_score) as average_productivity,
        AVG(ps.active_percentage) as average_active_percentage,
        MAX(ps.productivity_score) as highest_productivity,
        MIN(ps.productivity_score) as lowest_productivity
      FROM productivity_scores ps
      LEFT JOIN users u ON ps.user_id = u.id
      LEFT JOIN agents a ON ps.user_id = a.user_id
      WHERE ps.month_year = $1
        AND u.user_type = 'Agent'
        AND a.member_id = $2
    `

    console.log('📊 API: Executing stats query for memberId:', memberId, 'monthYear:', targetMonthYear)
    const statsResult = memberId === 'all'
      ? await pool.query(statsQuery, [targetMonthYear])
      : await pool.query(statsQuery, [targetMonthYear, memberId])
    console.log('📊 API: Stats result:', statsResult.rows[0])

    const productivityScores = productivityResult.rows.map((row, index) => ({
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

    const stats = statsResult.rows[0] || {
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
