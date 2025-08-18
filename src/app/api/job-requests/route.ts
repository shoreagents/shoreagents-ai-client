import { NextRequest, NextResponse } from "next/server"
import poolBPOC from "@/lib/database-bpoc"

function isUuid(val: any): val is string {
  return typeof val === "string" && /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i.test(val)
}

function isNumeric(val: any): val is string {
  return typeof val === "string" && /^[0-9]+$/.test(val)
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const companyParam = searchParams.get("companyId")

    let companyId: string | null = null
    if (isUuid(companyParam)) {
      companyId = companyParam
    } else if (isNumeric(companyParam)) {
      // Try to map numeric members.id -> members.company_id in jobs DB if such mapping exists
      const r = await poolBPOC.query(
        "SELECT company_id FROM public.members WHERE id = $1 LIMIT 1",
        [Number(companyParam)]
      )
      companyId = r.rows[0]?.company_id ?? null
    }

    const where = companyId ? "WHERE company_id = $1" : ""
    const params = companyId ? [companyId] : []
    const { rows } = await poolBPOC.query(
      `SELECT id, company_id, job_title, work_arrangement, status, applicants, views, created_at,
              salary_min, salary_max, job_description, requirements, responsibilities,
              benefits, skills, experience_level, application_deadline, industry, department
       FROM public.job_requests
       ${where}
       ORDER BY created_at DESC
       LIMIT 200`,
      params
    )

    return NextResponse.json({ requests: rows })
  } catch (e: any) {
    console.error("job-requests GET error:", e)
    const message = e?.detail || e?.message || "Failed to fetch job requests"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    let companyId: string | null = null
    if (isUuid(body.companyId)) {
      companyId = body.companyId
    } else if (isNumeric(body.companyId)) {
      // Map numeric members.id -> members.company_id (uuid)
      const r = await poolBPOC.query(
        "SELECT company_id FROM public.members WHERE id = $1 LIMIT 1",
        [Number(body.companyId)]
      )
      companyId = r.rows[0]?.company_id ?? null
    }

    const q = `
      INSERT INTO job_requests (
        company_id, job_title, work_arrangement,
        salary_min, salary_max, job_description, requirements, responsibilities,
        benefits, skills, experience_level, application_deadline, industry, department,
        status
      )
      VALUES (
        $1, $2, $3,
        $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14,
        $15
      )
      RETURNING id
    `
    const params = [
      companyId,
      body.jobTitle,
      body.workArrangement || null,
      body.salaryMin ?? null,
      body.salaryMax ?? null,
      body.jobDescription,
      body.requirements ?? [],
      body.responsibilities ?? [],
      body.benefits ?? [],
      body.skills ?? [],
      body.experienceLevel ?? null,
      body.applicationDeadline ?? null,
      body.industry ?? null,
      body.department ?? null,
      'inactive',
    ]

    const { rows } = await poolBPOC.query(q, params)
    return NextResponse.json({ ok: true, job: rows[0] }, { status: 201 })
  } catch (e: any) {
    console.error("job-requests POST error:", e)
    const message = e?.detail || e?.message || "Failed to create job"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
