import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      jobTitle,
      industry,
      department,
      jobDescription,
      requirements,
      responsibilities,
      skills,
      benefits,
      experienceLevel,
      workArrangement,
      salaryMin,
      salaryMax,
    } = body

    if (!jobTitle) {
      return NextResponse.json({ error: "Job title is required" }, { status: 400 })
    }

    // Claude API configuration
    const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY
    const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages"
    const REQUESTED_MODEL = process.env.CLAUDE_MODEL || "claude-3-5-sonnet-latest"

    if (!CLAUDE_API_KEY) {
      return NextResponse.json({ error: "Claude API key not configured" }, { status: 500 })
    }

    // Create a dynamic prompt that uses provided inputs as drafts to improve
    const providedDraft: Record<string, unknown> = {}
    if (jobTitle && typeof jobTitle === 'string' && jobTitle.trim()) providedDraft.jobTitle = jobTitle
    if (jobDescription && typeof jobDescription === 'string' && jobDescription.trim()) providedDraft.jobDescription = jobDescription
    if (Array.isArray(requirements) && requirements.length) providedDraft.requirements = requirements
    if (Array.isArray(responsibilities) && responsibilities.length) providedDraft.responsibilities = responsibilities
    if (Array.isArray(skills) && skills.length) providedDraft.skills = skills
    if (Array.isArray(benefits) && benefits.length) providedDraft.benefits = benefits
    if (experienceLevel && typeof experienceLevel === 'string') providedDraft.experienceLevel = experienceLevel
    if (workArrangement && typeof workArrangement === 'string') providedDraft.workArrangement = workArrangement
    if (typeof salaryMin === 'number') providedDraft.salaryMin = salaryMin
    if (typeof salaryMax === 'number') providedDraft.salaryMax = salaryMax

    const draftBlock = Object.keys(providedDraft).length
      ? `\n\nExisting user inputs (treat these as drafts to IMPROVE, not to ignore). Preserve intent, fix clarity and formatting, and expand where helpful.\n${JSON.stringify(providedDraft, null, 2)}`
      : ''

    const prompt = `You are an expert HR and job description writer. Generate a comprehensive job request tailored to the role and company context. If there are typos, spelling issues, casing inconsistencies, or uncommon abbreviations in the job title, correct and normalize it to a standard, professional title while preserving user intent.

Job Title: ${jobTitle}
Industry: ${industry || 'Not specified'}
Department: ${department || 'Not specified'}${draftBlock}

Output the following fields in valid JSON only (no extra text):
{
  "jobTitle": string,                 // corrected/normalized title-cased job title
  "jobDescription": string,           // 2 short paragraphs max. Clear, specific, compelling
  "requirements": string[],           // 5-8 items, concise and scannable
  "responsibilities": string[],       // 5-8 items, action-oriented
  "skills": string[],                 // 5-8 items, mix of hard/soft skills
  "benefits": string[],               // 4-6 items, realistic/appealing
  "experienceLevel": "entry-level" | "mid-level" | "senior-level",
  "workArrangement": "onsite" | "remote" | "hybrid",
  "salaryMin": number,                // PHP monthly
  "salaryMax": number                 // PHP monthly
}

Rules:
- If a field is present in the Existing user inputs block, improve it while keeping the original intent and structure; return the improved version in the same field. This includes correcting and normalizing the jobTitle.
- If a field is missing, generate a high-quality, realistic suggestion.
- Use Philippine market context for salary ranges. Keep salaryMin <= salaryMax.
- Keep wording concise and professional. Avoid company-internal jargon. Use neutral tone.
- Return JSON only.`

    const apiKey: string = CLAUDE_API_KEY as string

    async function callClaude(modelName: string): Promise<Response> {
      return fetch(CLAUDE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
          "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: modelName,
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    })
    }

    // Try primary model, then fallback to a lighter model if not found
    let response: Response = await callClaude(REQUESTED_MODEL)
    if (!response.ok) {
      const errTxt: string = await response.text()
      // Retry only on model-not-found
      if (errTxt.includes("not_found_error") || errTxt.includes("model")) {
        const fallbackModel = "claude-3-5-haiku-latest"
        console.warn(`Primary model failed (${REQUESTED_MODEL}). Retrying with ${fallbackModel}...`)
        response = await callClaude(fallbackModel)
      } else {
        console.error("Claude API error:", errTxt)
        return NextResponse.json({ error: "Failed to generate content", detail: errTxt }, { status: 500 })
      }
    }

    if (!response.ok) {
      const errorText: string = await response.text()
      console.error("Claude API error:", errorText)
      return NextResponse.json({ error: "Failed to generate content", detail: errorText }, { status: 500 })
    }

    const data = await response.json()
    const content = data.content[0].text

    // Parse the JSON response from Claude
    let generatedData
    try {
      // Extract JSON from the response (Claude might wrap it in markdown)
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        generatedData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("No JSON found in response")
      }
    } catch (parseError) {
      console.error("Failed to parse Claude response:", parseError)
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: generatedData
    })

  } catch (error: any) {
    console.error("AI generation error:", error)
    return NextResponse.json({ 
      error: error.message || "Failed to generate content" 
    }, { status: 500 })
  }
}
