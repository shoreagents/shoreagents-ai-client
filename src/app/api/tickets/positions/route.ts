import { NextRequest, NextResponse } from 'next/server'
import { updateTicketPositions } from '@/lib/db-utils'

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { positions } = body
    
    if (!positions || !Array.isArray(positions)) {
      return NextResponse.json(
        { error: 'Invalid positions data' },
        { status: 400 }
      )
    }
    
    await updateTicketPositions(positions)
    
    return NextResponse.json({ message: 'Positions updated successfully' })
  } catch (error) {
    console.error('Error updating ticket positions:', error)
    return NextResponse.json(
      { error: 'Failed to update ticket positions' },
      { status: 500 }
    )
  }
}