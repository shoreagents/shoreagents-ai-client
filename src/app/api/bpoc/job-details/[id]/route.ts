import { NextRequest, NextResponse } from 'next/server'
import { bpocPool } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      )
    }

    if (!bpocPool) {
      return NextResponse.json(
        { error: 'BPOC database connection not configured' },
        { status: 500 }
      )
    }

    // Fetch job details from processed_job_requests table in BPOC database
    // JOIN with members table to get company name
    const { rows: jobData } = await bpocPool.query(
      `SELECT pjr.*, m.company as company_name 
       FROM public.processed_job_requests pjr
       LEFT JOIN public.members m ON pjr.company_id = m.company_id
       WHERE pjr.id = $1`,
      [jobId]
    )

    if (!jobData || jobData.length === 0) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Transform the data to include company name if available
    const transformedJobData = {
      ...jobData[0],
      company_name: jobData[0].company_name || null,
      company: jobData[0].company_name || null  // Also set company field for compatibility
    }

    return NextResponse.json(transformedJobData)

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
