import { NextRequest, NextResponse } from 'next/server'
import { getClientUserByEmail } from '@/lib/db-utils'
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
    const user = await getClientUserByEmail(email)
    if (!user) {
      // Logout from Supabase if user doesn't exist in our database
      await supabase.auth.signOut()
      return NextResponse.json(
        { error: 'User not found or not authorized' },
        { status: 401 }
      )
    }

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