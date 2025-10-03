import { NextRequest, NextResponse } from 'next/server'
import { getEmployees } from '@/lib/db-utils'

export async function GET(request: NextRequest) {
  try {
    const memberId = request.nextUrl.searchParams.get('memberId')
    const search = request.nextUrl.searchParams.get('search')
    const department = request.nextUrl.searchParams.get('department')
    const page = request.nextUrl.searchParams.get('page')
    const limit = request.nextUrl.searchParams.get('limit')
    const sortField = request.nextUrl.searchParams.get('sortField')
    const sortDirection = request.nextUrl.searchParams.get('sortDirection')

    console.log('🔍 API: Fetching employees for memberId:', memberId, 'search:', search, 'department:', department, 'page:', page, 'limit:', limit, 'sortField:', sortField, 'sortDirection:', sortDirection)
    
    if (!memberId) {
      console.log('❌ API: No member ID provided')
      return NextResponse.json(
        { error: 'Member ID parameter is required' },
        { status: 400 }
      )
    }

    const data = await getEmployees(memberId, search, department, page, limit, sortField, sortDirection)
    return NextResponse.json(data)

  } catch (error) {
    console.error('Employees fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
