import { NextRequest, NextResponse } from 'next/server'
import { getAllTicketCategories, createTicketCategory, updateTicketCategory, deleteTicketCategory } from '@/lib/db-utils'

export async function GET(request: NextRequest) {
  try {
    const categories = await getAllTicketCategories()
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching ticket categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ticket categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name } = body
    
    if (!name) {
      return NextResponse.json(
        { error: 'name is required' },
        { status: 400 }
      )
    }
    
    const category = await createTicketCategory(name)
    
    return NextResponse.json(category)
  } catch (error) {
    console.error('Error creating ticket category:', error)
    return NextResponse.json(
      { error: 'Failed to create ticket category' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name } = body
    
    if (!id || !name) {
      return NextResponse.json(
        { error: 'id and name are required' },
        { status: 400 }
      )
    }
    
    const category = await updateTicketCategory(id, name)
    
    return NextResponse.json(category)
  } catch (error) {
    console.error('Error updating ticket category:', error)
    return NextResponse.json(
      { error: 'Failed to update ticket category' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'id parameter is required' },
        { status: 400 }
      )
    }
    
    await deleteTicketCategory(parseInt(id))
    
    return NextResponse.json({ message: 'Ticket category deleted successfully' })
  } catch (error) {
    console.error('Error deleting ticket category:', error)
    return NextResponse.json(
      { error: 'Failed to delete ticket category' },
      { status: 500 }
    )
  }
} 