import { NextRequest, NextResponse } from 'next/server'
import { getAiAnalysisByTalentPoolId } from '@/lib/db-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Authenticate via application session cookie (same as comments endpoint)
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

    const result = await getAiAnalysisByTalentPoolId(id)
    if ('notFound' in result) {
      return NextResponse.json({ error: 'Talent not found' }, { status: 404 })
    }
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in GET /api/talent-pool/[id]/ai-analysis:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}


