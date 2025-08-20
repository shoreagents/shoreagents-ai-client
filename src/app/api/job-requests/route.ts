import { NextRequest, NextResponse } from "next/server"
import { getJobRequestsForCompany, insertJobRequest, resolveCompanyId } from "@/lib/db-utils"

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
    const rows = await getJobRequestsForCompany(companyParam)
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
    const companyId = await resolveCompanyId(body.companyId)
    const job = await insertJobRequest({
      companyId,
      jobTitle: body.jobTitle,
      workArrangement: body.workArrangement ?? null,
      salaryMin: body.salaryMin ?? null,
      salaryMax: body.salaryMax ?? null,
      jobDescription: body.jobDescription,
      requirements: body.requirements ?? [],
      responsibilities: body.responsibilities ?? [],
      benefits: body.benefits ?? [],
      skills: body.skills ?? [],
      experienceLevel: body.experienceLevel ?? null,
      applicationDeadline: body.applicationDeadline ?? null,
      industry: body.industry ?? null,
      department: body.department ?? null,
    })
    return NextResponse.json({ ok: true, job }, { status: 201 })
  } catch (e: any) {
    console.error("job-requests POST error:", e)
    const message = e?.detail || e?.message || "Failed to create job"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
