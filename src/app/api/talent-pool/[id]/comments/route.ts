import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('GET /api/talent-pool/[id]/comments - Starting...')
    const { id } = await params

    // Require auth and restrict to comments created by the current user
    const authSession = request.cookies.get('auth_session')
    if (!authSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    let sessionData: any
    try {
      sessionData = JSON.parse(authSession.value)
    } catch {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }
    if (!sessionData?.isAuthenticated || !sessionData?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get comments for the talent pool entry
    // Prefer selecting by talent_pool_id if the column exists; fallback to single linked comment_id
    const queryByTalent = `
      SELECT 
        rc.id,
        rc.comment,
        rc.created_at,
        rc.updated_at,
        rc.comment_type,
        rc.created_by,
        u.email,
        pi.first_name,
        pi.last_name,
        pi.profile_picture
      FROM recruits_comments rc
      LEFT JOIN users u ON rc.created_by = u.id
      LEFT JOIN personal_info pi ON u.id = pi.user_id
      WHERE rc.talent_pool_id = $1 AND rc.created_by = $2
      ORDER BY rc.created_at ASC
    `
    const result = await pool.query(queryByTalent, [id, sessionData.id])

    const comments = (result.rows || []).map((row) => ({
      id: String(row.id),
      comment: row.comment,
      created_at: row.created_at,
      updated_at: row.updated_at,
      comment_type: row.comment_type,
      user_id: String(row.created_by),
      user_name: row.first_name && row.last_name
        ? `${row.first_name} ${row.last_name}`.trim()
        : row.email || 'Unknown User',
      user_role: 'Client',
      email: row.email || null,
      profile_picture: row.profile_picture || null,
    }))

    console.log('Found comments:', comments.length)
    return NextResponse.json({ comments })
  } catch (error) {
    console.error('Error in GET /api/talent-pool/[id]/comments:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('POST /api/talent-pool/[id]/comments - Starting...')
    const { id } = await params

    // Authenticate via application session cookie
    const authSession = request.cookies.get('auth_session')
    if (!authSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    let sessionData: any
    try {
      sessionData = JSON.parse(authSession.value)
    } catch {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }
    if (!sessionData?.isAuthenticated || !sessionData?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if talent pool entry exists
    const talentQuery = `
      SELECT id, applicant_id FROM talent_pool WHERE id = $1
    `
    const talentResult = await pool.query(talentQuery, [id])
    
    if (talentResult.rows.length === 0) {
      console.log('Talent pool entry not found for id:', id)
      return NextResponse.json({ error: 'Talent pool entry not found' }, { status: 404 })
    }

    const talent = talentResult.rows[0]
    console.log('Talent pool entry found:', talent.id)

    const body = await request.json()
    const { comment } = body

    if (!comment || typeof comment !== 'string' || comment.trim().length === 0) {
      return NextResponse.json({ error: 'Comment is required' }, { status: 400 })
    }

    console.log('Comment validated, attempting database insert...')

    // Insert the comment (prefer schema with talent_pool_id if available)
    let result
    try {
      const insertWithLink = `
        INSERT INTO recruits_comments (comment, created_by, comment_type, talent_pool_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id, comment, created_at, updated_at, comment_type
      `
      console.log('Executing insert (with talent_pool_id)')
      result = await pool.query(insertWithLink, [
        comment.trim(),
        sessionData.id,
        'talent_pool',
        id,
      ])
    } catch (e) {
      const insertFallback = `
        INSERT INTO recruits_comments (comment, created_by, comment_type)
        VALUES ($1, $2, $3)
        RETURNING id, comment, created_at, updated_at, comment_type
      `
      console.log('Executing insert (fallback without talent_pool_id)')
      result = await pool.query(insertFallback, [
        comment.trim(),
        sessionData.id,
        'talent_pool',
      ])
    }

    const newComment = result.rows[0]
    console.log('Comment inserted successfully:', newComment)

    // No longer updating talent_pool.comment_id; linkage is via recruits_comments.talent_pool_id only

    // Get the user information for the response
    const userInfoQuery = `
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
    const userInfoResult = await pool.query(userInfoQuery, [sessionData.id])
    const userInfo = userInfoResult.rows[0]

    // Create response object
    const responseComment = {
      id: newComment.id.toString(),
      comment: newComment.comment,
      created_at: newComment.created_at,
      updated_at: newComment.updated_at,
      comment_type: newComment.comment_type,
      user_id: String(sessionData.id),
      user_name: userInfo ? `${userInfo.first_name || ''} ${userInfo.last_name || ''}`.trim() || userInfo.email : 'Unknown User',
      user_role: 'Client', // Default role for now
      email: userInfo?.email || null,
      profile_picture: userInfo?.profile_picture || null
    }

    console.log('Returning response comment:', responseComment)
    return NextResponse.json({ comment: responseComment })
  } catch (error) {
    console.error('Error in POST /api/talent-pool/[id]/comments:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('DELETE /api/talent-pool/[id]/comments - Starting...')
    const { id } = await params

    // Authenticate via application session cookie
    const authSession = request.cookies.get('auth_session')
    if (!authSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    let sessionData: any
    try {
      sessionData = JSON.parse(authSession.value)
    } catch {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }
    if (!sessionData?.isAuthenticated || !sessionData?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const commentId = searchParams.get('commentId')
    if (!commentId) {
      return NextResponse.json({ error: 'commentId is required' }, { status: 400 })
    }

    // Ensure comment exists and belongs to the current user (or allow admin rules if needed)
    const checkQuery = `
      SELECT id, created_by FROM recruits_comments WHERE id = $1
    `
    const checkResult = await pool.query(checkQuery, [commentId])
    if (checkResult.rows.length === 0) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }
    const comment = checkResult.rows[0]
    if (String(comment.created_by) !== String(sessionData.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete the comment
    const deleteQuery = `
      DELETE FROM recruits_comments WHERE id = $1
      RETURNING id
    `
    await pool.query(deleteQuery, [commentId])

    // If the talent_pool.comment_id was pointing to this comment, clear it
    try {
      const clearTalentQuery = `
        UPDATE talent_pool SET updated_at = NOW()
        WHERE id = $1
      `
      await pool.query(clearTalentQuery, [id])
    } catch (_) {
      // ignore
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/talent-pool/[id]/comments:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
