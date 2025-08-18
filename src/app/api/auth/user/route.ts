import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    // Query to get user data - only allow Client users (matching login route restriction)
    const userQuery = `
      SELECT 
        u.id,
        u.email,
        u.user_type,
        pi.first_name,
        pi.last_name,
        pi.profile_picture,
        c.member_id,
        c.department_id,
        m.company_id as company_uuid
      FROM users u
      LEFT JOIN personal_info pi ON u.id = pi.user_id
      LEFT JOIN clients c ON u.id = c.user_id
      LEFT JOIN members m ON m.id = c.member_id
      WHERE u.email = $1 
        AND u.user_type = 'Client'
        AND c.user_id IS NOT NULL
    `

    const userResult = await pool.query(userQuery, [email])

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found or not authorized. Only Client users are allowed.' },
        { status: 404 }
      )
    }

    const dbUser = userResult.rows[0]
    
    return NextResponse.json({
      user: {
        id: dbUser.id.toString(),
        email: dbUser.email,
        userType: dbUser.user_type,
        firstName: dbUser.first_name,
        lastName: dbUser.last_name,
        profilePicture: dbUser.profile_picture,
        memberId: dbUser.member_id,
        departmentId: dbUser.department_id,
        companyUuid: dbUser.company_uuid,
        isAuthenticated: true
      }
    })

  } catch (error) {
    console.error('User data fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 