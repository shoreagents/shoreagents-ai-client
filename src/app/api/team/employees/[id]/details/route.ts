import { NextRequest, NextResponse } from 'next/server'
import { getEmployeeDetails } from '@/lib/db-utils'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { fields } = await request.json()
    const { id: employeeId } = await params
    
    if (!employeeId) {
      return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 })
    }
    
    const data = await getEmployeeDetails(employeeId, fields)
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('❌ Error fetching employee details:', error)
    
    if (error instanceof Error && error.message === 'Employee not found') {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch employee details' },
      { status: 500 }
    )
  }
}
