import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { addTicketComment, getTicketComments, getTicketIdByCode, getBasicUserInfoById } from '@/lib/db-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('GET /api/tickets/[id]/comments - Starting...')
    
    // Get the ticket's numeric ID from the Railway database
    const ticketId = await getTicketIdByCode(params.id)
    if (!ticketId) {
      console.log('Ticket not found for ticket_id:', params.id)
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }
    console.log('Ticket found with ID:', ticketId)
    
    // Get comments for the ticket with user information using Railway database
    const comments = await getTicketComments(ticketId)

    console.log('Found comments:', comments.length)
    return NextResponse.json({ comments })
  } catch (error) {
    console.error('Error in GET /api/tickets/[id]/comments:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('POST /api/tickets/[id]/comments - Starting...')
    
    const supabase = createClient()
    
    // Get the current user from Supabase auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.log('Auth error:', authError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('User authenticated:', user.id)

    // Get the ticket's numeric ID from the Railway database
    const ticketId = await getTicketIdByCode(params.id)
    if (!ticketId) {
      console.log('Ticket not found for ticket_id:', params.id)
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }
    console.log('Ticket found:', ticketId)

    const body = await request.json()
    const { comment } = body

    if (!comment || typeof comment !== 'string' || comment.trim().length === 0) {
      return NextResponse.json({ error: 'Comment is required' }, { status: 400 })
    }

    console.log('Comment validated, attempting database insert...')

    // Insert the comment using Railway database
    const newComment = await addTicketComment(ticketId, user.id, comment)
    console.log('Comment inserted successfully:', newComment)

    // Get the user information for the response
    const userInfo = await getBasicUserInfoById(user.id)

    // Create a simple response object
    const responseComment = {
      id: newComment.id,
      ticket_id: newComment.ticket_id,
      user_id: newComment.user_id,
      comment: newComment.comment,
      created_at: newComment.created_at,
      updated_at: newComment.updated_at,
      first_name: userInfo?.first_name || null,
      last_name: userInfo?.last_name || null,
      email: userInfo?.email || null,
      profile_picture: userInfo?.profile_picture || null
    }

    console.log('Returning response comment:', responseComment)
    return NextResponse.json({ comment: responseComment })
  } catch (error) {
    console.error('Error in POST /api/tickets/[id]/comments:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 