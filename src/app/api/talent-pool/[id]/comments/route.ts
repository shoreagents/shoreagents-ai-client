import { NextRequest, NextResponse } from 'next/server'
import { 
  getTalentPoolCommentsByUser,
  getTalentPoolById,
  insertTalentPoolComment,
  getBasicUserInfo,
  getCommentById,
  deleteTalentPoolComment,
  touchTalentPoolUpdatedAt,
} from '@/lib/db-utils'

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
    
    const comments = await getTalentPoolCommentsByUser(id, String(sessionData.id))

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

    const talent = await getTalentPoolById(id)
    if (!talent) {
      console.log('Talent pool entry not found for id:', id)
      return NextResponse.json({ error: 'Talent pool entry not found' }, { status: 404 })
    }

    console.log('Talent pool entry found:', talent.id)

    const body = await request.json()
    const { comment } = body

    if (!comment || typeof comment !== 'string' || comment.trim().length === 0) {
      return NextResponse.json({ error: 'Comment is required' }, { status: 400 })
    }

    console.log('Comment validated, attempting database insert...')

    const newComment = await insertTalentPoolComment(id, String(sessionData.id), comment)
    console.log('Comment inserted successfully:', newComment)

    // No longer updating talent_pool.comment_id; linkage is via recruits_comments.talent_pool_id only

    // Get the user information for the response
    const userInfo = await getBasicUserInfo(String(sessionData.id))

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
    const existing = await getCommentById(commentId)
    if (!existing) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }
    if (String(existing.created_by) !== String(sessionData.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete the comment
    await deleteTalentPoolComment(commentId)

    // If the talent_pool.comment_id was pointing to this comment, clear it
    await touchTalentPoolUpdatedAt(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/talent-pool/[id]/comments:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
