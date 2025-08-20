import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const memberId = request.nextUrl.searchParams.get('memberId')
    const search = request.nextUrl.searchParams.get('search')
    const department = request.nextUrl.searchParams.get('department')

    console.log('🔍 API: Fetching employees for memberId:', memberId, 'search:', search, 'department:', department)
    
    if (!memberId) {
      console.log('❌ API: No member ID provided')
      return NextResponse.json(
        { error: 'Member ID parameter is required' },
        { status: 400 }
      )
    }

    // Build dynamic WHERE clause with parameters
    let whereClause = `WHERE u.user_type = 'Agent'`
    const params: any[] = []

    if (memberId !== 'all') {
      params.push(memberId)
      whereClause += ` AND a.member_id = $${params.length}`
    }

    if (search) {
      // Search by first or last name (case-insensitive)
      params.push(`%${search}%`)
      whereClause += ` AND (pi.first_name ILIKE $${params.length} OR pi.last_name ILIKE $${params.length})`
    }

    if (department) {
      params.push(department)
      whereClause += ` AND d.name = $${params.length}`
    }

    const employeesQuery = `
      SELECT 
        u.id,
        u.email,
        u.user_type,
        pi.first_name,
        pi.last_name,
        pi.profile_picture,
        pi.phone,
        pi.birthday,
        pi.city,
        pi.address,
        pi.gender,
        a.exp_points,
        a.department_id,
        d.name as department_name,
        d.description as department_description,
        ji.job_title,
        ji.employment_status,
        ji.start_date,
        ji.work_email
      FROM users u
      LEFT JOIN personal_info pi ON u.id = pi.user_id
      LEFT JOIN agents a ON u.id = a.user_id
      LEFT JOIN departments d ON a.department_id = d.id
      LEFT JOIN job_info ji ON a.user_id = ji.agent_user_id
      ${whereClause}
      ORDER BY pi.last_name, pi.first_name
    `

    console.log('📊 API: Executing employees query with', params.length, 'params')
    const employeesResult = await pool.query(employeesQuery, params)
    console.log('📊 API: Found', employeesResult.rows.length, 'employees')

    // Department stats (total departments, total agents) — respect memberId filter when provided
    const statsParams: any[] = []
    let statsWhere = ''
    if (memberId !== 'all') {
      statsParams.push(memberId)
      statsWhere = 'WHERE a.member_id = $1'
    }

    const departmentStatsQuery = `
      SELECT 
        COUNT(DISTINCT d.id) as total_departments,
        COUNT(DISTINCT a.user_id) as total_agents
      FROM departments d
      LEFT JOIN agents a ON d.id = a.department_id
      ${statsWhere}
    `

    console.log('📊 API: Executing stats query')
    const statsResult = await pool.query(departmentStatsQuery, statsParams)

    const employees = employeesResult.rows.map(row => ({
      id: row.id.toString(),
      firstName: row.first_name || '',
      lastName: row.last_name || '',
      email: row.email,
      phone: row.phone,
      department: row.department_name || 'Unassigned',
      position: row.job_title || 'Agent',
      hireDate: row.start_date ? new Date(row.start_date).toISOString().split('T')[0] : null,
      avatar: row.profile_picture,
      expPoints: row.exp_points || 0,
      departmentId: row.department_id,
      workEmail: row.work_email,
      birthday: row.birthday,
      city: row.city,
      address: row.address,
      gender: row.gender
    }))

    const stats = statsResult.rows[0] || { total_departments: 0, total_agents: 0 }
    
    const response = {
      employees,
      stats: {
        total: employees.length,
        departments: stats.total_departments
      }
    }
    
    console.log('✅ API: Returning response')
    return NextResponse.json(response)

  } catch (error) {
    console.error('Employees fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
