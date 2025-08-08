import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const memberId = request.nextUrl.searchParams.get('memberId')
    console.log('🔍 API: Fetching employees for memberId:', memberId)
    
    if (!memberId) {
      console.log('❌ API: No member ID provided')
      return NextResponse.json(
        { error: 'Member ID parameter is required' },
        { status: 400 }
      )
    }

    // Query to get agents (employees) for the specific member_id or all if memberId is 'all'
    const employeesQuery = memberId === 'all' ? `
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
      WHERE u.user_type = 'Agent'
      ORDER BY pi.first_name, pi.last_name
    ` : `
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
      WHERE u.user_type = 'Agent' 
        AND a.member_id = $1
      ORDER BY pi.first_name, pi.last_name
    `

    console.log('📊 API: Executing employees query for memberId:', memberId)
    const employeesResult = memberId === 'all' 
      ? await pool.query(employeesQuery)
      : await pool.query(employeesQuery, [memberId])
    console.log('📊 API: Found', employeesResult.rows.length, 'employees')

    // Get department statistics
    const departmentStatsQuery = memberId === 'all' ? `
      SELECT 
        COUNT(DISTINCT d.id) as total_departments,
        COUNT(DISTINCT a.user_id) as total_agents
      FROM departments d
      LEFT JOIN agents a ON d.id = a.department_id
    ` : `
      SELECT 
        COUNT(DISTINCT d.id) as total_departments,
        COUNT(DISTINCT a.user_id) as total_agents
      FROM departments d
      LEFT JOIN agents a ON d.id = a.department_id
      WHERE a.member_id = $1
    `

    console.log('📊 API: Executing stats query for memberId:', memberId)
    const statsResult = memberId === 'all'
      ? await pool.query(departmentStatsQuery)
      : await pool.query(departmentStatsQuery, [memberId])
    console.log('📊 API: Stats result:', statsResult.rows[0])

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
    
    console.log('✅ API: Returning response:', response)
    return NextResponse.json(response)

  } catch (error) {
    console.error('Employees fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
