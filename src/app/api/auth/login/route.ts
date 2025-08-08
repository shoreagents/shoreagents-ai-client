import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Query to check if user exists and is a Client user
    const userQuery = `
      SELECT 
        u.id,
        u.email,
        u.user_type,
        pi.first_name,
        pi.last_name,
        pi.profile_picture,
        c.member_id,
        c.department_id
      FROM users u
      LEFT JOIN personal_info pi ON u.id = pi.user_id
      LEFT JOIN clients c ON u.id = c.user_id
      WHERE u.email = $1 
        AND u.user_type = 'Client'
        AND c.user_id IS NOT NULL
    `

    // First, authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Now check if user exists in our database and has proper roles
    const userResult = await pool.query(userQuery, [email])

    if (userResult.rows.length === 0) {
      // Logout from Supabase if user doesn't exist in our database
      await supabase.auth.signOut()
      return NextResponse.json(
        { error: 'User not found or not authorized' },
        { status: 401 }
      )
    }

    const user = userResult.rows[0]

    // Create session data (in a real app, you'd use JWT or session management)
    const sessionData = {
      id: user.id,
      email: user.email,
      userType: user.user_type,
      firstName: user.first_name,
      lastName: user.last_name,
      profilePicture: user.profile_picture,
      memberId: user.member_id,
      departmentId: user.department_id,
      isAuthenticated: true
    }

    // Set a cookie for session management
    const response = NextResponse.json(
      { 
        message: 'Login successful',
        user: sessionData
      },
      { status: 200 }
    )

    // Set HTTP-only cookie for session
    response.cookies.set('auth_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 