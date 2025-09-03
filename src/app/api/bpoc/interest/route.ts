import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/database"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { applicantId, userId } = body

    if (!applicantId) {
      return NextResponse.json({ error: "Applicant ID is required" }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Check if the applicant exists in bpoc_recruits
    const applicantResult = await pool.query(
      "SELECT id, interested_clients FROM bpoc_recruits WHERE applicant_id = $1",
      [applicantId]
    )

    if (applicantResult.rows.length === 0) {
      return NextResponse.json({ error: "Applicant not found" }, { status: 404 })
    }

    const applicant = applicantResult.rows[0]
    const currentInterestedClients = applicant.interested_clients || []

    // Check if user is already interested and toggle
    let updatedInterestedClients
    let action
    const userIdInt = parseInt(userId)
    
    if (currentInterestedClients.includes(userIdInt)) {
      // Remove user from interested_clients array
      updatedInterestedClients = currentInterestedClients.filter((id: any) => id !== userIdInt)
      action = 'removed'
    } else {
      // Add user to interested_clients array
      updatedInterestedClients = [...currentInterestedClients, userIdInt]
      action = 'added'
    }

    // Update the bpoc_recruits table
    await pool.query(
      "UPDATE bpoc_recruits SET interested_clients = $1, updated_at = NOW() WHERE applicant_id = $2",
      [updatedInterestedClients, applicantId]
    )

    // Also update the talent_pool table if it exists
    await pool.query(
      "UPDATE talent_pool SET interested_clients = $1, updated_at = NOW() WHERE applicant_id = $2",
      [updatedInterestedClients, applicantId]
    )

    return NextResponse.json({ 
      success: true,
      action,
      message: action === 'added' ? "Interest expressed successfully" : "Interest removed successfully"
    })

  } catch (e: any) {
    console.error("Interest POST error:", e)
    const message = e?.detail || e?.message || "Failed to express interest"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const applicantId = searchParams.get("applicantId")
    const userId = searchParams.get("userId")

    if (!applicantId) {
      return NextResponse.json({ error: "Applicant ID is required" }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Check if the user is interested in this applicant
    const result = await pool.query(
      "SELECT interested_clients FROM bpoc_recruits WHERE applicant_id = $1",
      [applicantId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Applicant not found" }, { status: 404 })
    }

    const interestedClients = result.rows[0].interested_clients || []
    const alreadyInterested = interestedClients.includes(parseInt(userId))

    return NextResponse.json({ 
      alreadyInterested,
      interestedClients
    })

  } catch (e: any) {
    console.error("Interest GET error:", e)
    const message = e?.detail || e?.message || "Failed to check interest"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
