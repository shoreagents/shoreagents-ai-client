import { NextRequest, NextResponse } from 'next/server'
import { getTicketById, updateTicketStatus, updateTicket, deleteTicket } from '@/lib/db-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ticket = await getTicketById(parseInt(params.id))
    
    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(ticket)
  } catch (error) {
    console.error('Error fetching ticket:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ticket' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const { status, resolvedBy, ...updates } = body
    
    let updatedTicket
    if (status) {
      updatedTicket = await updateTicketStatus(parseInt(params.id), status, resolvedBy)
    } else {
      updatedTicket = await updateTicket(parseInt(params.id), updates)
    }
    
    return NextResponse.json(updatedTicket)
  } catch (error) {
    console.error('Error in PATCH API route:', error)
    return NextResponse.json(
      { error: 'Failed to update ticket' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteTicket(parseInt(params.id))
    return NextResponse.json({ message: 'Ticket deleted successfully' })
  } catch (error) {
    console.error('Error deleting ticket:', error)
    return NextResponse.json(
      { error: 'Failed to delete ticket' },
      { status: 500 }
    )
  }
}