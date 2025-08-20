import { NextRequest, NextResponse } from 'next/server'
import { getMemberById } from '@/lib/db-utils'

export async function GET(request: NextRequest) {
  try {
    const memberId = request.nextUrl.searchParams.get('memberId')
    console.log('🔍 API: Fetching member info for memberId:', memberId)
    
    if (!memberId) {
      console.log('❌ API: No member ID provided')
      return NextResponse.json(
        { error: 'Member ID parameter is required' },
        { status: 400 }
      )
    }

    console.log('📊 API: Executing member query for memberId:', memberId)
    const member = await getMemberById(memberId)
    console.log('📊 API: Found', member ? 1 : 0, 'members')

    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }
    
    const response = {
      id: member.id,
      company: member.company,
      address: member.address,
      phone: member.phone,
      logo: member.logo,
      service: member.service,
      status: member.status,
      badgeColor: member.badge_color,
      country: member.country,
      website: member.website
    }
    
    console.log('✅ API: Returning response:', response)
    return NextResponse.json(response)

  } catch (error) {
    console.error('Member fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
