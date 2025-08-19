import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'
import poolBPOC from '@/lib/database-bpoc'

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

    // Look up applicant/user id for this talent_pool id in main DB
    const lookupQuery = `
      SELECT applicant_id
      FROM talent_pool
      WHERE id = $1
    `
    const lookupResult = await pool.query(lookupQuery, [id])
    if (lookupResult.rows.length === 0) {
      return NextResponse.json({ error: 'Talent not found' }, { status: 404 })
    }

    const applicantId = lookupResult.rows[0].applicant_id

    // Fetch AI analysis from BPOC database (unique per user_id)
    const analysisQuery = `
      SELECT 
        id,
        user_id,
        session_id,
        original_resume_id,
        overall_score,
        ats_compatibility_score,
        content_quality_score,
        professional_presentation_score,
        skills_alignment_score,
        key_strengths,
        strengths_analysis,
        improvements,
        recommendations,
        improved_summary,
        salary_analysis,
        career_path,
        section_analysis,
        analysis_metadata,
        portfolio_links,
        files_analyzed,
        created_at,
        updated_at,
        candidate_profile,
        skills_snapshot,
        experience_snapshot,
        education_snapshot
      FROM ai_analysis_results
      WHERE user_id = $1
      LIMIT 1
    `
    const analysisResult = await poolBPOC.query(analysisQuery, [applicantId])

    if (analysisResult.rows.length === 0) {
      return NextResponse.json({ hasAnalysis: false, analysis: null })
    }

    const a = analysisResult.rows[0]

    // Convert to camelCase for frontend
    const analysis = {
      id: a.id,
      userId: a.user_id,
      sessionId: a.session_id,
      originalResumeId: a.original_resume_id,
      overallScore: a.overall_score,
      atsCompatibilityScore: a.ats_compatibility_score,
      contentQualityScore: a.content_quality_score,
      professionalPresentationScore: a.professional_presentation_score,
      skillsAlignmentScore: a.skills_alignment_score,
      keyStrengths: a.key_strengths,
      strengthsAnalysis: a.strengths_analysis,
      improvements: a.improvements,
      recommendations: a.recommendations,
      improvedSummary: a.improved_summary,
      salaryAnalysis: a.salary_analysis,
      careerPath: a.career_path,
      sectionAnalysis: a.section_analysis,
      analysisMetadata: a.analysis_metadata,
      portfolioLinks: a.portfolio_links,
      filesAnalyzed: a.files_analyzed,
      createdAt: a.created_at,
      updatedAt: a.updated_at,
      candidateProfile: a.candidate_profile,
      skillsSnapshot: a.skills_snapshot,
      experienceSnapshot: a.experience_snapshot,
      educationSnapshot: a.education_snapshot,
    }

    return NextResponse.json({ hasAnalysis: true, analysis })
  } catch (error) {
    console.error('Error in GET /api/talent-pool/[id]/ai-analysis:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}


