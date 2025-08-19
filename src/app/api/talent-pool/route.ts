import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'
import poolBPOC from '@/lib/database-bpoc'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || 'All'
    const sortBy = searchParams.get('sortBy') || 'rating'
    
    // Build the SQL query for main database (talent_pool and bpoc_recruits)
    let mainQuery = `
      SELECT 
        tp.id,
        tp.applicant_id,
        tp.created_at,
        tp.last_contact_date,
        tp.interested_clients,
        rc_latest.comment as latest_comment,
        rc_latest.created_at as latest_comment_date,
        br.status,
        br.shift,
        br.position as rank_position,
        br.expected_monthly_salary,
        br.current_salary,
        br.video_introduction_url,
        br.resume_slug
      FROM talent_pool tp
      JOIN bpoc_recruits br ON tp.applicant_id = br.applicant_id
      LEFT JOIN LATERAL (
        SELECT rc.comment, rc.created_at
        FROM recruits_comments rc
        WHERE rc.talent_pool_id = tp.id
        ORDER BY rc.created_at DESC
        LIMIT 1
      ) rc_latest ON true
      WHERE br.status = 'passed'
    `

    const queryParams: any[] = []
    let paramCount = 0

    // Add search filter for main database
    if (search) {
      paramCount++
      mainQuery += ` AND (
        br.shift ILIKE $${paramCount}
      )`
      queryParams.push(`%${search}%`)
    }

    // Add category filter (you can extend this based on your needs)
    if (category !== 'All') {
      // For now, we'll use a simple category mapping
      // You can extend this based on your business logic
    }

    // Add sorting for main database
    switch (sortBy) {
      case 'rating':
        mainQuery += ` ORDER BY br.position ASC NULLS LAST`
        break
      case 'rate':
        mainQuery += ` ORDER BY br.expected_monthly_salary DESC NULLS LAST`
        break
      case 'jobs':
        mainQuery += ` ORDER BY tp.created_at DESC`
        break
      default:
        mainQuery += ` ORDER BY tp.created_at DESC`
    }

    // Execute main database query
    const mainResult = await pool.query(mainQuery, queryParams)
    
    console.log('Main database result:', mainResult.rows)
    
    // Get user details from BPOC database for each applicant
    const talents = await Promise.all(mainResult.rows.map(async (row) => {
      try {
        // Query BPOC database for user details using applicant_id
        const userQuery = `
          SELECT 
            u.first_name,
            u.last_name,
            u.full_name,
            u.location,
            u.avatar_url,
            u.position as user_position,
            u.bio,
            u.email,
            (SELECT COUNT(*) FROM applications a2 WHERE a2.user_id = u.id AND a2.status = 'hired') as completed_jobs,
            (SELECT rg.generated_resume_data->>'skills' as resume_skills
             FROM resumes_generated rg
             WHERE rg.user_id = u.id
             LIMIT 1) as resume_skills,
            (SELECT rg.generated_resume_data->>'summary' as resume_summary
             FROM resumes_generated rg
             WHERE rg.user_id = u.id
             LIMIT 1) as resume_summary
          FROM users u
          WHERE u.id = $1
        `
        
        const userResult = await poolBPOC.query(userQuery, [row.applicant_id])
        const userData = userResult.rows[0] || {}
        
        console.log(`User data for applicant ${row.applicant_id}:`, userData)
        
        // Get all comments for this talent pool entry
        let comments: any[] = []
        try {
          const commentsQuery = `
            SELECT 
              rc.id,
              rc.comment,
              rc.created_at,
              rc.comment_type,
              u.email,
              pi.first_name,
              pi.last_name
            FROM recruits_comments rc
            LEFT JOIN users u ON rc.created_by = u.id
            LEFT JOIN personal_info pi ON u.id = pi.user_id
            WHERE rc.talent_pool_id = $1
            ORDER BY rc.created_at DESC
          `
          const commentsResult = await pool.query(commentsQuery, [row.id])
          comments = commentsResult.rows.map(comment => ({
            id: comment.id.toString(),
            comment: comment.comment,
            created_at: comment.created_at,
            user_name: comment.first_name && comment.last_name 
              ? `${comment.first_name} ${comment.last_name}`.trim()
              : comment.email || 'Unknown User',
            user_role: 'Client'
          }))
        } catch (commentError) {
          console.error(`Error fetching comments for talent ${row.id}:`, commentError)
        }
        
        return {
          id: row.id.toString(),
          name: userData.full_name || `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || `Applicant ${row.applicant_id.slice(0, 8)}`,
          title: userData.user_position || row.shift || 'Available Position',
          location: userData.location || 'Location not specified',
          avatar: userData.avatar_url || '',
          rating: 5.0, // Default rating since it's not in the schema
          hourlyRate: row.expected_monthly_salary || 0,
          completedJobs: parseInt(userData.completed_jobs) || 0,
          skills: userData.resume_skills ? (() => {
            try {
              const skillsData = JSON.parse(userData.resume_skills)
              // Handle nested skills structure
              if (typeof skillsData === 'object' && skillsData !== null) {
                const allSkills: string[] = []
                if (skillsData.soft && Array.isArray(skillsData.soft)) {
                  allSkills.push(...skillsData.soft)
                }
                if (skillsData.technical && Array.isArray(skillsData.technical)) {
                  allSkills.push(...skillsData.technical)
                }
                if (skillsData.languages && Array.isArray(skillsData.languages)) {
                  allSkills.push(...skillsData.languages)
                }
                return allSkills
              }
              // Fallback for array format
              if (Array.isArray(skillsData)) {
                return skillsData
              }
              return []
            } catch (e) {
              console.error(`Error parsing skills JSON for ${row.applicant_id}:`, e)
              return []
            }
          })() : [],
          description: userData.resume_summary || row.comment || 'Professional summary not available',
          category: 'General', // Default category
          status: row.status,
          rankPosition: row.rank_position,
          createdAt: row.created_at,
          lastContactDate: row.last_contact_date,
          interestedClients: row.interested_clients || [],
          videoIntroductionUrl: row.video_introduction_url,
          resumeSlug: row.resume_slug,
          currentSalary: row.current_salary,
          expectedSalary: row.expected_monthly_salary,
          email: userData.email || null,
          bio: userData.bio || null,
          comments: comments
        }
      } catch (error) {
        console.error(`Error fetching user data for applicant ${row.applicant_id}:`, error)
        // Return fallback data if BPOC database query fails
        return {
          id: row.id.toString(),
          name: `Applicant ${row.applicant_id.slice(0, 8)}`,
          title: row.shift || 'Available Position',
          location: 'Location not specified',
          avatar: '',
          rating: 5.0,
          hourlyRate: row.expected_monthly_salary || 0,
          completedJobs: 0,
          skills: [],
          description: row.comment || 'Professional summary not available',
          category: 'General',
          status: row.status,
          rankPosition: row.rank_position,
          createdAt: row.created_at,
          lastContactDate: row.last_contact_date,
          interestedClients: row.interested_clients || [],
          videoIntroductionUrl: row.video_introduction_url,
          resumeSlug: row.resume_slug,
          currentSalary: row.current_salary,
          expectedSalary: row.expected_monthly_salary,
          email: null,
          bio: null,
          comments: []
        }
      }
    }))

    return NextResponse.json({ 
      success: true, 
      talents,
      total: talents.length 
    })

  } catch (error) {
    console.error('Error fetching talent pool:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch talent pool data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
