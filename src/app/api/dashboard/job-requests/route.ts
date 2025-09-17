import { NextRequest, NextResponse } from "next/server"
import { bpocPool } from "@/lib/database"

export async function GET(req: NextRequest) {
  try {
    // Fetch unique job titles only (most recent of each, limited to 16)
    const { rows } = await bpocPool.query(`
      SELECT DISTINCT ON (job_title) id, job_title, work_arrangement, status, applicants, views, created_at,
             salary_min, salary_max, job_description, requirements, responsibilities,
             benefits, skills, experience_level, application_deadline, industry, department
      FROM public.job_requests
      ORDER BY job_title, created_at DESC
      LIMIT 16
    `)
    
    // Transform data for the infinite moving cards component
    const transformedJobs = rows.map((job: any) => ({
      quote: job.job_title,
      name: "", // Not used in the component
      title: "" // Not used in the component
    }))
    
    return NextResponse.json({ 
      jobs: transformedJobs,
      total: rows.length 
    })
  } catch (e: any) {
    console.error("dashboard job-requests GET error:", e)
    const message = e?.detail || e?.message || "Failed to fetch job requests"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
