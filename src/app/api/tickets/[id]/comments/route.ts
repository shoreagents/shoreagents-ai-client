import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import pool from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('GET /api/tickets/[id]/comments - Starting...')
    
    // Get the ticket's numeric ID from the Railway database
    const ticketQuery = `
      SELECT id FROM tickets WHERE ticket_id = $1
    `
    const ticketResult = await pool.query(ticketQuery, [params.id])
    
    if (ticketResult.rows.length === 0) {
      console.log('Ticket not found for ticket_id:', params.id)
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }
    
    const ticket = ticketResult.rows[0]
    console.log('Ticket found with ID:', ticket.id)
    
    // Get comments for the ticket with user information using Railway database
    const query = `
      SELECT 
        tc.id,
        tc.ticket_id,
        tc.user_id,
        tc.comment,
        tc.created_at,
        tc.updated_at,
        u.email,
        pi.first_name,
        pi.last_name,
        pi.profile_picture
      FROM ticket_comments tc
      LEFT JOIN users u ON tc.user_id = u.id
      LEFT JOIN personal_info pi ON u.id = pi.user_id
      WHERE tc.ticket_id = $1
      ORDER BY tc.created_at ASC
    `
    
    const result = await pool.query(query, [ticket.id])
    const comments = result.rows || []

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
    const ticketQuery = `
      SELECT id FROM tickets WHERE ticket_id = $1
    `
    const ticketResult = await pool.query(ticketQuery, [params.id])
    
    if (ticketResult.rows.length === 0) {
      console.log('Ticket not found for ticket_id:', params.id)
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    const ticket = ticketResult.rows[0]
    console.log('Ticket found:', ticket.id)

    const body = await request.json()
    const { comment } = body

    if (!comment || typeof comment !== 'string' || comment.trim().length === 0) {
      return NextResponse.json({ error: 'Comment is required' }, { status: 400 })
    }

    console.log('Comment validated, attempting database insert...')

    // Insert the comment using Railway database
    const insertQuery = `
      INSERT INTO ticket_comments (ticket_id, user_id, comment)
      VALUES ($1, $2, $3)
      RETURNING id, ticket_id, user_id, comment, created_at, updated_at
    `
    
    console.log('Executing insert query with params:', [ticket.id, user.id, comment.trim()])
    
    const result = await pool.query(insertQuery, [
      ticket.id,
      user.id,
      comment.trim()
    ])

    const newComment = result.rows[0]
    console.log('Comment inserted successfully:', newComment)

    // Get the user information for the response
    const userQuery = `
      SELECT 
        u.id,
        u.email,
        pi.first_name,
        pi.last_name,
        pi.profile_picture
      FROM users u
      LEFT JOIN personal_info pi ON u.id = pi.user_id
      WHERE u.id = $1
    `
    
    const userResult = await pool.query(userQuery, [user.id])
    const userInfo = userResult.rows[0]

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