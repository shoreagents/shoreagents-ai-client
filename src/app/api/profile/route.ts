import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID parameter is required' },
        { status: 400 }
      )
    }

    // Get comprehensive profile data
    const profileQuery = `
      SELECT 
        u.id,
        u.email,
        u.user_type,
        pi.first_name,
        pi.last_name,
        pi.middle_name,
        pi.nickname,
        pi.profile_picture,
        pi.phone,
        pi.birthday,
        pi.city,
        pi.address,
        pi.gender,
        c.member_id,
        c.department_id,
        m.company,
        m.website,
        m.country,
        m.service,
        m.status,
        m.company_id as company_uuid
      FROM users u
      LEFT JOIN personal_info pi ON u.id = pi.user_id
      LEFT JOIN clients c ON u.id = c.user_id
      LEFT JOIN members m ON m.id = c.member_id
      WHERE u.id = $1
    `
    
    const profileResult = await pool.query(profileQuery, [userId])
    const profile = profileResult.rows[0]

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      profile: {
        id: profile.id.toString(),
        email: profile.email,
        userType: profile.user_type,
        firstName: profile.first_name,
        lastName: profile.last_name,
        middleName: profile.middle_name,
        nickname: profile.nickname,
        profilePicture: profile.profile_picture,
        phone: profile.phone,
        birthday: profile.birthday,
        city: profile.city,
        address: profile.address,
        gender: profile.gender,
        memberId: profile.member_id,
        departmentId: profile.department_id,
        company: profile.company,
        website: profile.website,
        country: profile.country,
        service: profile.service,
        status: profile.status,
        companyUuid: profile.company_uuid
      }
    })

  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, ...updateData } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Check if personal_info record exists
    const checkQuery = 'SELECT id FROM personal_info WHERE user_id = $1'
    const checkResult = await pool.query(checkQuery, [userId])

    if (checkResult.rows.length === 0) {
      // Create new personal_info record
      const insertQuery = `
        INSERT INTO personal_info (
          user_id, first_name, last_name, middle_name, nickname, 
          phone, birthday, city, address, gender
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `
      
      const insertValues = [
        userId,
        updateData.firstName || '',
        updateData.lastName || '',
        updateData.middleName || null,
        updateData.nickname || null,
        updateData.phone || null,
        updateData.birthday || null,
        updateData.city || null,
        updateData.address || null,
        updateData.gender || null
      ]

      await pool.query(insertQuery, insertValues)
    } else {
      // Update existing personal_info record
      const updateQuery = `
        UPDATE personal_info SET
          first_name = COALESCE($2, first_name),
          last_name = COALESCE($3, last_name),
          middle_name = COALESCE($4, middle_name),
          nickname = COALESCE($5, nickname),
          phone = COALESCE($6, phone),
          birthday = COALESCE($7, birthday),
          city = COALESCE($8, city),
          address = COALESCE($9, address),
          gender = COALESCE($10, gender),
          updated_at = NOW()
        WHERE user_id = $1
        RETURNING *
      `
      
      const updateValues = [
        userId,
        updateData.firstName,
        updateData.lastName,
        updateData.middleName,
        updateData.nickname,
        updateData.phone,
        updateData.birthday,
        updateData.city,
        updateData.address,
        updateData.gender
      ]

      await pool.query(updateQuery, updateValues)
    }

    // Fetch updated profile data
    const profileQuery = `
      SELECT 
        u.id,
        u.email,
        u.user_type,
        pi.first_name,
        pi.last_name,
        pi.middle_name,
        pi.nickname,
        pi.profile_picture,
        pi.phone,
        pi.birthday,
        pi.city,
        pi.address,
        pi.gender,
        c.member_id,
        c.department_id,
        m.company,
        m.website,
        m.country,
        m.service,
        m.status,
        m.company_id as company_uuid
      FROM users u
      LEFT JOIN personal_info pi ON u.id = pi.user_id
      LEFT JOIN clients c ON u.id = c.user_id
      LEFT JOIN members m ON m.id = c.member_id
      WHERE u.id = $1
    `
    
    const profileResult = await pool.query(profileQuery, [userId])
    const profile = profileResult.rows[0]

    return NextResponse.json({
      profile: {
        id: profile.id.toString(),
        email: profile.email,
        userType: profile.user_type,
        firstName: profile.first_name,
        lastName: profile.last_name,
        middleName: profile.middle_name,
        nickname: profile.nickname,
        profilePicture: profile.profile_picture,
        phone: profile.phone,
        birthday: profile.birthday,
        city: profile.city,
        address: profile.address,
        gender: profile.gender,
        memberId: profile.member_id,
        departmentId: profile.department_id,
        company: profile.company,
        website: profile.website,
        country: profile.country,
        service: profile.service,
        status: profile.status,
        companyUuid: profile.company_uuid
      }
    })

  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
