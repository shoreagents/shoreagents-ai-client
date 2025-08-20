import { NextRequest, NextResponse } from 'next/server'
import { getEmployees } from '@/lib/db-utils'

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

    const data = await getEmployees(memberId, search, department)
    return NextResponse.json(data)

  } catch (error) {
    console.error('Employees fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
