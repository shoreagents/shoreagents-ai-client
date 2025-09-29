import { NextRequest, NextResponse } from 'next/server'
import { getEmployeesWithBirthdayToday } from '@/lib/db-utils'

export async function GET(request: NextRequest) {
  try {
    const memberId = request.nextUrl.searchParams.get('memberId')

    console.log('🎂 API: Fetching birthday employees for memberId:', memberId)
    
    if (!memberId) {
      console.log('❌ API: No member ID provided')
      return NextResponse.json(
        { error: 'Member ID parameter is required' },
        { status: 400 }
      )
    }

    const data = await getEmployeesWithBirthdayToday(memberId)
    return NextResponse.json(data)

  } catch (error) {
    console.error('Birthday employees fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
