import { NextResponse } from 'next/server'
import { getApplicants } from '@/lib/db-utils'

export async function GET(request: Request) {
  try {
    console.log('🔧 GET request received for applicants')
    
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const statusFilter = searchParams.get('status')
    const diagnose = searchParams.get('diagnose') === 'true'
    
    console.log('🔍 Status filter:', statusFilter)
    console.log('🔍 Diagnose mode:', diagnose)
    const data = await getApplicants({ status: statusFilter, diagnose })
    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ Error fetching applicants:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch applicants',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}








