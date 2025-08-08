import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('memberId')
    const date = searchParams.get('date')

    console.log('📊 API: Fetching break sessions for memberId:', memberId, 'date:', date)

    if (!memberId) {
      return NextResponse.json({ error: 'Member ID is required' }, { status: 400 })
    }

    // Get break sessions with employee information
    const breakSessionsQuery = memberId === 'all' ? `
      SELECT 
        bs.id,
        bs.agent_user_id,
        bs.break_type,
        bs.start_time,
        bs.end_time,
        bs.duration_minutes,
        bs.created_at,
        bs.pause_time,
        bs.resume_time,
        bs.pause_used,
        bs.time_remaining_at_pause,
        bs.break_date,
        pi.first_name,
        pi.last_name,
        pi.profile_picture,
        u.email,
        d.name as department_name
      FROM break_sessions bs
      LEFT JOIN personal_info pi ON bs.agent_user_id = pi.user_id
      LEFT JOIN users u ON bs.agent_user_id = u.id
      LEFT JOIN agents a ON bs.agent_user_id = a.user_id
      LEFT JOIN departments d ON a.department_id = d.id
      WHERE bs.break_date = $1
      ORDER BY bs.created_at DESC
    ` : `
      SELECT 
        bs.id,
        bs.agent_user_id,
        bs.break_type,
        bs.start_time,
        bs.end_time,
        bs.duration_minutes,
        bs.created_at,
        bs.pause_time,
        bs.resume_time,
        bs.pause_used,
        bs.time_remaining_at_pause,
        bs.break_date,
        pi.first_name,
        pi.last_name,
        pi.profile_picture,
        u.email,
        d.name as department_name
      FROM break_sessions bs
      LEFT JOIN personal_info pi ON bs.agent_user_id = pi.user_id
      LEFT JOIN users u ON bs.agent_user_id = u.id
      LEFT JOIN agents a ON bs.agent_user_id = a.user_id
      LEFT JOIN departments d ON a.department_id = d.id
      WHERE a.member_id = $1 AND bs.break_date = $2
      ORDER BY bs.created_at DESC
    `

    console.log('📊 API: Executing break sessions query for memberId:', memberId, 'date:', date)
    const breakSessionsResult = memberId === 'all' 
      ? await pool.query(breakSessionsQuery, [date])
      : await pool.query(breakSessionsQuery, [memberId, date])
    console.log('📊 API: Found', breakSessionsResult.rows.length, 'break sessions')

    // Get statistics
    const statsQuery = memberId === 'all' ? `
      SELECT 
        COUNT(*) as total_sessions,
        COUNT(CASE WHEN end_time IS NULL THEN 1 END) as active_sessions,
        COUNT(CASE WHEN break_date = $1 THEN 1 END) as today_sessions,
        AVG(duration_minutes) as average_duration
      FROM break_sessions bs
      LEFT JOIN agents a ON bs.agent_user_id = a.user_id
      WHERE bs.break_date = $1
    ` : `
      SELECT 
        COUNT(*) as total_sessions,
        COUNT(CASE WHEN end_time IS NULL THEN 1 END) as active_sessions,
        COUNT(CASE WHEN break_date = $2 THEN 1 END) as today_sessions,
        AVG(duration_minutes) as average_duration
      FROM break_sessions bs
      LEFT JOIN agents a ON bs.agent_user_id = a.user_id
      WHERE a.member_id = $1 AND bs.break_date = $2
    `

    console.log('📊 API: Executing stats query for memberId:', memberId, 'date:', date)
    const statsResult = memberId === 'all'
      ? await pool.query(statsQuery, [date])
      : await pool.query(statsQuery, [memberId, date])
    console.log('📊 API: Stats result:', statsResult.rows[0])

    const stats = statsResult.rows[0] || {
      total_sessions: 0,
      active_sessions: 0,
      today_sessions: 0,
      average_duration: 0
    }

    return NextResponse.json({
      breakSessions: breakSessionsResult.rows,
      stats: {
        total: parseInt(stats.total_sessions) || 0,
        active: parseInt(stats.active_sessions) || 0,
        today: parseInt(stats.today_sessions) || 0,
        averageDuration: Math.round(parseFloat(stats.average_duration) || 0)
      }
    })

  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch break sessions' },
      { status: 500 }
    )
  }
}
