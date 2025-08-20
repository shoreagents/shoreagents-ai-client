import { NextRequest, NextResponse } from 'next/server'
import { getClientUserByEmail } from '@/lib/db-utils'

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    const dbUser = await getClientUserByEmail(email)

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found or not authorized. Only Client users are allowed.' },
        { status: 404 }
      )
    }
    
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