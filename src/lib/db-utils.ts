import pool, { bpocPool} from './database'

export type TicketStatus = 'On Hold' | 'In Progress' | 'Approved' | 'Stuck' | 'Actioned' | 'Closed'

export interface TicketCategory {
  id: number
  name: string
}

export interface Ticket {
  id: number
  ticket_id: string
  user_id: number
  concern: string
  details: string | null
  category: string
  category_id: number | null
  status: TicketStatus
  position: number
  resolved_by: number | null
  resolved_at: string | null
  created_at: string
  updated_at: string
  role_id: number | null
  station_id: string | null
  profile_picture: string | null
  first_name: string | null
  last_name: string | null
  employee_id: string | null
  resolver_first_name?: string | null
  resolver_last_name?: string | null
  user_type?: string | null
  member_name?: string | null
  member_color?: string | null
  supporting_files?: string[]
  file_count?: number
}

// Get all tickets (filtered by IT role, excluding For Approval)
export async function getAllTickets(): Promise<Ticket[]> {
  const result = await pool.query(`
    SELECT t.id, t.ticket_id, t.user_id, t.concern, t.details, t.status, t.position, t.created_at, t.resolved_at, t.resolved_by,
           t.role_id, pi.profile_picture, pi.first_name, pi.last_name, s.station_id, tc.name as category_name,
           ji.employee_id,
           resolver_pi.first_name as resolver_first_name, resolver_pi.last_name as resolver_last_name,
           u.user_type,
           t.supporting_files, t.file_count,
           CASE 
             WHEN u.user_type = 'Internal' THEN 'Internal'
             WHEN a.member_id IS NOT NULL THEN m.company
             WHEN c.member_id IS NOT NULL THEN m.company
             ELSE NULL
           END as member_name,
           CASE 
             WHEN u.user_type = 'Internal' THEN NULL
             WHEN a.member_id IS NOT NULL THEN m.badge_color
             WHEN c.member_id IS NOT NULL THEN m.badge_color
             ELSE NULL
           END as member_color
    FROM public.tickets t
    LEFT JOIN public.personal_info pi ON t.user_id = pi.user_id
    LEFT JOIN public.stations s ON t.user_id = s.assigned_user_id
    LEFT JOIN public.ticket_categories tc ON t.category_id = tc.id
    LEFT JOIN public.job_info ji ON t.user_id = ji.agent_user_id OR t.user_id = ji.internal_user_id
    LEFT JOIN public.personal_info resolver_pi ON t.resolved_by = resolver_pi.user_id
    LEFT JOIN public.users u ON t.user_id = u.id
    LEFT JOIN public.agents a ON t.user_id = a.user_id
    LEFT JOIN public.clients c ON t.user_id = c.user_id
    LEFT JOIN public.members m ON (a.member_id = m.id) OR (c.member_id = m.id)
    WHERE t.role_id = 1 AND t.status != 'For Approval'
    ORDER BY t.status, t.position ASC, t.created_at DESC
  `)
  return result.rows
}

// Get tickets by status (filtered by IT role, excluding For Approval)
export async function getTicketsByStatus(status: string, past: boolean = false): Promise<Ticket[]> {
  const result = await pool.query(`
    SELECT t.id, t.ticket_id, t.user_id, t.concern, t.details, t.status, t.position, t.created_at, t.resolved_at, t.resolved_by,
           t.role_id, pi.profile_picture, pi.first_name, pi.last_name, s.station_id, tc.name as category_name,
           ji.employee_id,
           resolver_pi.first_name as resolver_first_name, resolver_pi.last_name as resolver_last_name,
           u.user_type,
           t.supporting_files, t.file_count,
           CASE 
             WHEN u.user_type = 'Internal' THEN 'Internal'
             WHEN a.member_id IS NOT NULL THEN m.company
             WHEN c.member_id IS NOT NULL THEN m.company
             ELSE NULL
           END as member_name,
           CASE 
             WHEN u.user_type = 'Internal' THEN NULL
             WHEN a.member_id IS NOT NULL THEN m.badge_color
             WHEN c.member_id IS NOT NULL THEN m.badge_color
             ELSE NULL
           END as member_color
    FROM public.tickets t
    LEFT JOIN public.personal_info pi ON t.user_id = pi.user_id
    LEFT JOIN public.stations s ON t.user_id = s.assigned_user_id
    LEFT JOIN public.ticket_categories tc ON t.category_id = tc.id
    LEFT JOIN public.job_info ji ON t.user_id = ji.agent_user_id OR t.user_id = ji.internal_user_id
    LEFT JOIN public.personal_info resolver_pi ON t.resolved_by = resolver_pi.user_id
    LEFT JOIN public.users u ON t.user_id = u.id
    LEFT JOIN public.agents a ON t.user_id = a.user_id
    LEFT JOIN public.clients c ON t.user_id = c.user_id
    LEFT JOIN public.members m ON (a.member_id = m.id) OR (c.member_id = m.id)
    WHERE t.status = $1 AND t.role_id = 1 AND t.status != 'For Approval'
    ORDER BY t.position ASC, t.created_at DESC
  `, [status])
  return result.rows
}

// Create new ticket
export async function createTicket(ticket: Omit<Ticket, 'id' | 'created_at' | 'updated_at' | 'resolved_by' | 'resolved_at'>): Promise<Ticket> {
  const result = await pool.query(
    'INSERT INTO public.tickets (ticket_id, user_id, concern, details, category_id, status, role_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [ticket.ticket_id, ticket.user_id, ticket.concern, ticket.details, ticket.category_id, ticket.status, 1] // role_id = 1 for IT
  )
  return result.rows[0]
}

// Update ticket status
export async function updateTicketStatus(id: number, status: string, resolvedBy?: number): Promise<Ticket> {
  try {
    let result
    if (status === 'Completed' || status === 'Closed') {
      // When marking as completed or closed, set resolved_at timestamp and resolved_by
      // Use NOW() AT TIME ZONE 'Asia/Manila' to match the database default
      if (resolvedBy) {
        result = await pool.query(
          'UPDATE public.tickets SET status = $1, resolved_at = (NOW() AT TIME ZONE \'Asia/Manila\'), resolved_by = $3 WHERE id = $2 RETURNING *',
          [status, id, resolvedBy]
        )
      } else {
        result = await pool.query(
          'UPDATE public.tickets SET status = $1, resolved_at = (NOW() AT TIME ZONE \'Asia/Manila\') WHERE id = $2 RETURNING *',
          [status, id]
        )
      }
    } else {
      // For other status changes, clear resolved_at and resolved_by fields
      result = await pool.query(
        'UPDATE public.tickets SET status = $1, resolved_at = NULL, resolved_by = NULL WHERE id = $2 RETURNING *',
        [status, id]
      )
    }
    return result.rows[0]
  } catch (error) {
    console.error('Database update failed:', error)
    throw error
  }
}

// Update ticket
export async function updateTicket(id: number, updates: Partial<Ticket>): Promise<Ticket> {
  const fields = Object.keys(updates).filter(key => 
    key !== 'id' && 
    key !== 'created_at' && 
    key !== 'updated_at' && 
    key !== 'ticket_id'
  )
  const values = Object.values(updates).filter((_, index) => 
    fields[index] !== 'id' && 
    fields[index] !== 'created_at' && 
    fields[index] !== 'updated_at' && 
    fields[index] !== 'ticket_id'
  )
  
  const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ')
  const result = await pool.query(
    `UPDATE public.tickets SET ${setClause} WHERE id = $1 RETURNING *`,
    [id, ...values]
  )
  return result.rows[0]
}

// Delete ticket
export async function deleteTicket(id: number): Promise<void> {
  await pool.query('DELETE FROM public.tickets WHERE id = $1', [id])
}

// Get ticket by ID
export async function getTicketById(id: number): Promise<Ticket | null> {
  const result = await pool.query(`
    SELECT t.id, t.ticket_id, t.user_id, t.concern, t.details, t.status, t.position, t.created_at, t.resolved_at, t.resolved_by,
           t.role_id, pi.profile_picture, pi.first_name, pi.last_name, s.station_id, tc.name as category_name,
           ji.employee_id,
           resolver_pi.first_name as resolver_first_name, resolver_pi.last_name as resolver_last_name,
           t.supporting_files, t.file_count
    FROM public.tickets t
    LEFT JOIN public.personal_info pi ON t.user_id = pi.user_id
    LEFT JOIN public.stations s ON t.user_id = s.assigned_user_id
    LEFT JOIN public.ticket_categories tc ON t.category_id = tc.id
    LEFT JOIN public.job_info ji ON t.user_id = ji.agent_user_id OR t.user_id = ji.internal_user_id
    LEFT JOIN public.personal_info resolver_pi ON t.resolved_by = resolver_pi.user_id
    WHERE t.id = $1 AND t.role_id = 1
  `, [id])
  return result.rows[0] || null
}

// Get ticket by ticket_id
export async function getTicketByTicketId(ticketId: string): Promise<Ticket | null> {
  const result = await pool.query(`
    SELECT t.id, t.ticket_id, t.user_id, t.concern, t.details, t.status, t.position, t.created_at, t.resolved_at, t.resolved_by,
           t.role_id, pi.profile_picture, pi.first_name, pi.last_name, s.station_id, tc.name as category_name,
           ji.employee_id,
           resolver_pi.first_name as resolver_first_name, resolver_pi.last_name as resolver_last_name,
           t.supporting_files, t.file_count
    FROM public.tickets t
    LEFT JOIN public.personal_info pi ON t.user_id = pi.user_id
    LEFT JOIN public.stations s ON t.user_id = s.assigned_user_id
    LEFT JOIN public.ticket_categories tc ON t.category_id = tc.id
    LEFT JOIN public.job_info ji ON t.user_id = ji.agent_user_id OR t.user_id = ji.internal_user_id
    LEFT JOIN public.personal_info resolver_pi ON t.resolved_by = resolver_pi.user_id
    WHERE t.ticket_id = $1 AND t.role_id = 1
  `, [ticketId])
  return result.rows[0] || null
}

// Search tickets
export async function searchTickets(searchTerm: string): Promise<Ticket[]> {
  const result = await pool.query(`
    SELECT t.id, t.ticket_id, t.user_id, t.concern, t.details, t.status, t.position, t.created_at, t.resolved_at, t.resolved_by,
           t.role_id, pi.profile_picture, pi.first_name, pi.last_name, s.station_id, tc.name as category_name,
           ji.employee_id,
           resolver_pi.first_name as resolver_first_name, resolver_pi.last_name as resolver_last_name
    FROM public.tickets t
    LEFT JOIN public.personal_info pi ON t.user_id = pi.user_id
    LEFT JOIN public.stations s ON t.user_id = s.assigned_user_id
    LEFT JOIN public.ticket_categories tc ON t.category_id = tc.id
    LEFT JOIN public.job_info ji ON t.user_id = ji.agent_user_id OR t.user_id = ji.internal_user_id
    LEFT JOIN public.personal_info resolver_pi ON t.resolved_by = resolver_pi.user_id
    WHERE (t.concern ILIKE $1 OR t.details ILIKE $1 OR t.ticket_id ILIKE $1) AND t.role_id = 1 AND t.status != 'For Approval'
    ORDER BY t.created_at DESC
  `, [`%${searchTerm}%`])
  return result.rows
}

// Resolve ticket
export async function resolveTicket(id: number, resolvedBy: number): Promise<Ticket> {
  const result = await pool.query(
    'UPDATE public.tickets SET status = $1, resolved_by = $2, resolved_at = (NOW() AT TIME ZONE \'Asia/Manila\') WHERE id = $3 RETURNING *',
    ['Completed', resolvedBy, id]
  )
  return result.rows[0]
}

// Get tickets by user
export async function getTicketsByUser(userId: number): Promise<Ticket[]> {
  const result = await pool.query(`
    SELECT t.id, t.ticket_id, t.user_id, t.concern, t.details, t.status, t.position, t.created_at, t.resolved_at, t.resolved_by,
           t.role_id, pi.profile_picture, pi.first_name, pi.last_name, s.station_id, tc.name as category_name,
           ji.employee_id,
           resolver_pi.first_name as resolver_first_name, resolver_pi.last_name as resolver_last_name
    FROM public.tickets t
    LEFT JOIN public.personal_info pi ON t.user_id = pi.user_id
    LEFT JOIN public.stations s ON t.user_id = s.assigned_user_id
    LEFT JOIN public.ticket_categories tc ON t.category_id = tc.id
    LEFT JOIN public.job_info ji ON t.user_id = ji.agent_user_id OR t.user_id = ji.internal_user_id
    LEFT JOIN public.personal_info resolver_pi ON t.resolved_by = resolver_pi.user_id
    WHERE t.user_id = $1 AND t.role_id = 1 AND t.status != 'For Approval'
    ORDER BY t.created_at DESC
  `, [userId])
  return result.rows
}

// Generate unique ticket ID using existing database sequence
export async function generateTicketId(): Promise<string> {
  const result = await pool.query('SELECT nextval(\'ticket_id_seq\') as next_id')
  const nextId = result.rows[0].next_id
  return `TKT-${nextId.toString().padStart(6, '0')}`
}

// Update ticket position (for reordering within same status)
export async function updateTicketPosition(id: number, position: number): Promise<Ticket> {
  try {
    const result = await pool.query(
      'UPDATE public.tickets SET position = $1 WHERE id = $2 RETURNING *',
      [position, id]
    )
    return result.rows[0]
  } catch (error) {
    console.error('Database position update failed:', error)
    throw error
  }
}

// Update ticket positions for reordering within same status
export async function updateTicketPositions(tickets: { id: number, position: number }[]): Promise<void> {
  try {
    for (const ticket of tickets) {
      await pool.query(
        'UPDATE public.tickets SET position = $1 WHERE id = $2',
        [ticket.position, ticket.id]
      )
    }
  } catch (error) {
    console.error('Database positions update failed:', error)
    throw error
  }
}

// Get user's assigned station
export async function getUserStation(userId: number): Promise<string | null> {
  const result = await pool.query(`
    SELECT station_id
    FROM public.stations
    WHERE assigned_user_id = $1
  `, [userId])
  return result.rows[0]?.station_id || null
}

// Assign user to station
export async function assignUserToStation(userId: number, stationId: string): Promise<void> {
  // First, remove any existing assignment for this user
  await pool.query(`
    UPDATE public.stations
    SET assigned_user_id = NULL
    WHERE assigned_user_id = $1
  `, [userId])
  
  // Then assign to the new station
  await pool.query(`
    UPDATE public.stations
    SET assigned_user_id = $1
    WHERE station_id = $2
  `, [userId, stationId])
}

// Get all stations
export async function getAllStations(): Promise<{ id: number, station_id: string, assigned_user_id: number | null }[]> {
  const result = await pool.query(`
    SELECT id, station_id, assigned_user_id
    FROM public.stations
    ORDER BY station_id
  `)
  return result.rows
}

// Get all ticket categories
export async function getAllTicketCategories(): Promise<TicketCategory[]> {
  const result = await pool.query(`
    SELECT id, name
    FROM public.ticket_categories
    ORDER BY name
  `)
  return result.rows
}

// Get ticket category by ID
export async function getTicketCategoryById(id: number): Promise<TicketCategory | null> {
  const result = await pool.query(`
    SELECT id, name
    FROM public.ticket_categories
    WHERE id = $1
  `, [id])
  return result.rows[0] || null
}

// Create ticket category
export async function createTicketCategory(name: string): Promise<TicketCategory> {
  const result = await pool.query(`
    INSERT INTO public.ticket_categories (name)
    VALUES ($1)
    RETURNING id, name
  `, [name])
  return result.rows[0]
}

// Update ticket category
export async function updateTicketCategory(id: number, name: string): Promise<TicketCategory> {
  const result = await pool.query(`
    UPDATE public.ticket_categories
    SET name = $1
    WHERE id = $2
    RETURNING id, name
  `, [name, id])
  return result.rows[0]
}

// Delete ticket category
export async function deleteTicketCategory(id: number): Promise<void> {
  await pool.query(`
    DELETE FROM public.ticket_categories
    WHERE id = $1
  `, [id])
}

// Get count of tickets resolved by a specific user
export async function getTicketsResolvedByUserCount(userId: number, status: string = 'Closed'): Promise<number> {
  const result = await pool.query(`
    SELECT COUNT(*) as total
    FROM public.tickets t
    WHERE t.status = $1 AND t.role_id = 1 AND t.status != 'For Approval'
      AND t.resolved_by = $2
  `, [status, userId])
  
  return parseInt(result.rows[0]?.total || '0')
}

// Get tickets by status with pagination, sorting, and filtering
// Helper function to map frontend sort fields to database column names
function getSortField(sortField: string): string {
  const fieldMapping: Record<string, string> = {
    'ticket_id': 't.ticket_id',
    'category_name': 'tc.name',
    'first_name': 'pi.first_name',
    'concern': 't.concern',
    'details': 't.details',
    'created_at': 't.created_at',
    'resolved_at': 't.resolved_at',
    'resolver_first_name': 'resolver_pi.first_name'
  }
  return fieldMapping[sortField] || 't.resolved_at'
}

export async function getTicketsByStatusWithPagination(
  status: string, 
  past: boolean = false, 
  page: number = 1, 
  limit: number = 20, 
  search: string = '', 
  sortField: string = 'resolved_at', 
  sortDirection: string = 'desc', 
  categoryId: string = '',
  userId: string = ''
): Promise<{ tickets: Ticket[], totalCount: number }> {
  const offset = (page - 1) * limit
  
  let whereConditions = ['t.role_id = 1']
  let queryParams: any[] = []
  let paramIndex = 1
  
  // Only add status condition if status is provided
  if (status) {
    whereConditions.push('t.status = $1')
    queryParams.push(status)
    paramIndex = 2
  }
  
  if (search) {
    // Handle special "you" search for current user's resolved tickets
    if (search.toLowerCase() === 'you' && userId) {
      whereConditions.push(`t.resolved_by = $${paramIndex}`)
      queryParams.push(parseInt(userId))
      paramIndex++
    } else {
      whereConditions.push(`(
        t.concern ILIKE $${paramIndex} OR 
        t.details ILIKE $${paramIndex} OR 
        t.ticket_id ILIKE $${paramIndex} OR
        pi.first_name ILIKE $${paramIndex} OR
        pi.last_name ILIKE $${paramIndex} OR
        ji.employee_id ILIKE $${paramIndex} OR
        s.station_id ILIKE $${paramIndex} OR
        resolver_pi.first_name ILIKE $${paramIndex} OR
        resolver_pi.last_name ILIKE $${paramIndex} OR
        tc.name ILIKE $${paramIndex}
      )`)
      queryParams.push(`%${search}%`)
      paramIndex++
    }
  }
  
  if (categoryId) {
    whereConditions.push(`t.category_id = $${paramIndex}`)
    queryParams.push(categoryId)
    paramIndex++
  }
  
  if (past) {
    whereConditions.push('t.resolved_at IS NOT NULL')
  }
  
  const whereClause = whereConditions.join(' AND ')
  
  // Count total records
  const countQuery = `
    SELECT COUNT(*) as total
    FROM public.tickets t
    LEFT JOIN public.personal_info pi ON t.user_id = pi.user_id
    LEFT JOIN public.stations s ON t.user_id = s.assigned_user_id
    LEFT JOIN public.ticket_categories tc ON t.category_id = tc.id
    LEFT JOIN public.job_info ji ON t.user_id = ji.agent_user_id OR t.user_id = ji.internal_user_id
    LEFT JOIN public.personal_info resolver_pi ON t.resolved_by = resolver_pi.user_id
    WHERE ${whereClause}
  `
  
  const countResult = await pool.query(countQuery, queryParams)
  const totalCount = parseInt(countResult.rows[0]?.total || '0')
  
  // Get paginated results
  const dataQuery = `
    SELECT t.id, t.ticket_id, t.user_id, t.concern, t.details, t.status, t.position, t.created_at, t.resolved_at, t.resolved_by,
           t.role_id, pi.profile_picture, pi.first_name, pi.last_name, s.station_id, tc.name as category_name,
           ji.employee_id,
           resolver_pi.first_name as resolver_first_name, resolver_pi.last_name as resolver_last_name,
           t.supporting_files, t.file_count,
           CASE
             WHEN u.user_type = 'Internal' THEN 'Internal'
             WHEN a.member_id IS NOT NULL THEN m.company
             WHEN c.member_id IS NOT NULL THEN m.company
             ELSE NULL
           END as member_name,
           CASE
             WHEN u.user_type = 'Internal' THEN NULL
             WHEN a.member_id IS NOT NULL THEN m.badge_color
             WHEN c.member_id IS NOT NULL THEN m.badge_color
             ELSE NULL
           END as member_color,
           u.user_type
    FROM public.tickets t
    LEFT JOIN public.personal_info pi ON t.user_id = pi.user_id
    LEFT JOIN public.stations s ON t.user_id = s.assigned_user_id
    LEFT JOIN public.ticket_categories tc ON t.category_id = tc.id
    LEFT JOIN public.job_info ji ON t.user_id = ji.agent_user_id OR t.user_id = ji.internal_user_id
    LEFT JOIN public.personal_info resolver_pi ON t.resolved_by = resolver_pi.user_id
    LEFT JOIN public.users u ON t.user_id = u.id
    LEFT JOIN public.agents a ON t.user_id = a.user_id
    LEFT JOIN public.clients c ON t.user_id = c.user_id
    LEFT JOIN public.members m ON (a.member_id = m.id) OR (c.member_id = m.id)
    WHERE ${whereClause}
    ORDER BY ${getSortField(sortField)} ${sortDirection.toUpperCase()}
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `
  
  const dataParams = [...queryParams, limit, offset]
  const dataResult = await pool.query(dataQuery, dataParams)
  
  return {
    tickets: dataResult.rows,
    totalCount
  }
}

// =============================
// Job Requests (BPOC database)
// =============================

function isUuid(val: any): val is string {
  return typeof val === 'string' && /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i.test(val)
}

function isNumeric(val: any): val is string {
  return typeof val === 'string' && /^[0-9]+$/.test(val)
}

export async function resolveCompanyId(companyParam: string | null): Promise<string | null> {
  if (!companyParam) return null
  if (isUuid(companyParam)) return companyParam
  if (isNumeric(companyParam)) {
    const r = await bpocPool.query(
      'SELECT company_id FROM public.members WHERE id = $1 LIMIT 1',
      [Number(companyParam)]
    )
    return r.rows[0]?.company_id ?? null
  }
  return null
}

export interface JobRequestInsert {
  companyId: string | null
  jobTitle: string
  workArrangement?: string | null
  salaryMin?: number | null
  salaryMax?: number | null
  jobDescription: string
  requirements?: any[] | null
  responsibilities?: any[] | null
  benefits?: any[] | null
  skills?: any[] | null
  experienceLevel?: string | null
  applicationDeadline?: string | null
  industry?: string | null
  department?: string | null
}

export async function getJobRequestsForCompany(companyParam: string | null) {
  const companyId = await resolveCompanyId(companyParam)
  const where = companyId ? 'WHERE company_id = $1' : ''
  const params = companyId ? [companyId] : []
  const { rows } = await bpocPool.query(
    `SELECT id, company_id, job_title, work_arrangement, status, applicants, views, created_at,
            salary_min, salary_max, job_description, requirements, responsibilities,
            benefits, skills, experience_level, application_deadline, industry, department
     FROM public.job_requests
     ${where}
     ORDER BY created_at DESC
     LIMIT 200`,
    params
  )
  return rows
}

export async function insertJobRequest(data: JobRequestInsert) {
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
    data.companyId,
    data.jobTitle,
    data.workArrangement ?? null,
    data.salaryMin ?? null,
    data.salaryMax ?? null,
    data.jobDescription,
    data.requirements ?? [],
    data.responsibilities ?? [],
    data.benefits ?? [],
    data.skills ?? [],
    data.experienceLevel ?? null,
    data.applicationDeadline ?? null,
    data.industry ?? null,
    data.department ?? null,
    'inactive',
  ]

  const { rows } = await bpocPool.query(q, params)
  return rows[0]
}

// =============================
// Talent Pool
// =============================

export async function listTalentPool(search: string, category: string, sortBy: string) {
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

  if (search) {
    paramCount++
    mainQuery += ` AND (
      br.shift ILIKE $${paramCount}
    )`
    queryParams.push(`%${search}%`)
  }

  // Category can be extended in the future
  if (category && category !== 'All') {
    // Placeholder for future category filtering
  }

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

  const mainResult = await pool.query(mainQuery, queryParams)

  const talents = await Promise.all(
    mainResult.rows.map(async (row) => {
      try {
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

        const userResult = await bpocPool.query(userQuery, [row.applicant_id])
        const userData = userResult.rows[0] || {}

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
          comments = commentsResult.rows.map((comment) => ({
            id: comment.id.toString(),
            comment: comment.comment,
            created_at: comment.created_at,
            user_name:
              comment.first_name && comment.last_name
                ? `${comment.first_name} ${comment.last_name}`.trim()
                : comment.email || 'Unknown User',
            user_role: 'Client',
          }))
        } catch (_) {
          comments = []
        }

        return {
          id: row.id.toString(),
          name:
            userData.full_name ||
            `${userData.first_name || ''} ${userData.last_name || ''}`.trim() ||
            `Applicant ${row.applicant_id.slice(0, 8)}`,
          title: userData.user_position || row.shift || 'Available Position',
          location: userData.location || 'Location not specified',
          avatar: userData.avatar_url || '',
          rating: 5.0,
          hourlyRate: row.expected_monthly_salary || 0,
          completedJobs: parseInt(userData.completed_jobs) || 0,
          skills: userData.resume_skills
            ? (() => {
                try {
                  const skillsData = JSON.parse(userData.resume_skills)
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
                    if (skillsData.tools && Array.isArray(skillsData.tools)) {
                      allSkills.push(...skillsData.tools)
                    }
                    Object.keys(skillsData).forEach((category) => {
                      if (
                        category !== 'soft' &&
                        category !== 'technical' &&
                        category !== 'languages' &&
                        category !== 'tools'
                      ) {
                        if (Array.isArray(skillsData[category])) {
                          allSkills.push(...skillsData[category])
                        }
                      }
                    })
                    return allSkills
                  }
                  if (Array.isArray(skillsData)) {
                    return skillsData
                  }
                  return []
                } catch {
                  return []
                }
              })()
            : [],
          originalSkillsData: userData.resume_skills
            ? (() => {
                try {
                  return JSON.parse(userData.resume_skills)
                } catch {
                  return null
                }
              })()
            : null,
          description: userData.resume_summary || row.comment || 'Professional summary not available',
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
          email: userData.email || null,
          bio: userData.bio || null,
          comments,
        }
      } catch (error) {
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
          comments: [],
        }
      }
    })
  )

  return talents
}

// =============================
// Talent AI Analysis (BPOC + main)
// =============================

export async function getAiAnalysisByTalentPoolId(talentId: string) {
  const lookupQuery = `
    SELECT applicant_id
    FROM talent_pool
    WHERE id = $1
  `
  const lookupResult = await pool.query(lookupQuery, [talentId])
  if (lookupResult.rows.length === 0) {
    return { notFound: true as const }
  }

  const applicantId = lookupResult.rows[0].applicant_id

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
  const analysisResult = await bpocPool.query(analysisQuery, [applicantId])
  if (analysisResult.rows.length === 0) {
    return { hasAnalysis: false as const, analysis: null }
  }

  const a = analysisResult.rows[0]
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

  return { hasAnalysis: true as const, analysis }
}

// =============================
// Auth/User helper
// =============================

export async function getClientUserByEmail(email: string) {
  const userQuery = `
    SELECT 
      u.id,
      u.email,
      u.user_type,
      pi.first_name,
      pi.last_name,
      pi.profile_picture,
      c.member_id,
      c.department_id,
      m.company_id as company_uuid
    FROM users u
    LEFT JOIN personal_info pi ON u.id = pi.user_id
    LEFT JOIN clients c ON u.id = c.user_id
    LEFT JOIN members m ON m.id = c.member_id
    WHERE u.email = $1 
      AND u.user_type = 'Client'
      AND c.user_id IS NOT NULL
  `
  const userResult = await pool.query(userQuery, [email])
  return userResult.rows[0] || null
}

// =============================
// Talent Pool Comments
// =============================

export async function getTalentPoolById(talentId: string) {
  const result = await pool.query(
    'SELECT id, applicant_id FROM talent_pool WHERE id = $1',
    [talentId]
  )
  return result.rows[0] || null
}

export async function getTalentPoolCommentsByUser(talentId: string, userId: string) {
  const query = `
    SELECT 
      rc.id,
      rc.comment,
      rc.created_at,
      rc.updated_at,
      rc.comment_type,
      rc.created_by,
      u.email,
      pi.first_name,
      pi.last_name,
      pi.profile_picture
    FROM recruits_comments rc
    LEFT JOIN users u ON rc.created_by = u.id
    LEFT JOIN personal_info pi ON u.id = pi.user_id
    WHERE rc.talent_pool_id = $1 AND rc.created_by = $2
    ORDER BY rc.created_at ASC
  `
  const result = await pool.query(query, [talentId, userId])
  return (result.rows || []).map((row: any) => ({
    id: String(row.id),
    comment: row.comment,
    created_at: row.created_at,
    updated_at: row.updated_at,
    comment_type: row.comment_type,
    user_id: String(row.created_by),
    user_name: row.first_name && row.last_name
      ? `${row.first_name} ${row.last_name}`.trim()
      : row.email || 'Unknown User',
    user_role: 'Client',
    email: row.email || null,
    profile_picture: row.profile_picture || null,
  }))
}

export async function insertTalentPoolComment(talentId: string, userId: string, comment: string) {
  try {
    const insertWithLink = `
      INSERT INTO recruits_comments (comment, created_by, comment_type, talent_pool_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, comment, created_at, updated_at, comment_type
    `
    const result = await pool.query(insertWithLink, [
      comment.trim(),
      userId,
      'talent_pool',
      talentId,
    ])
    return result.rows[0]
  } catch (_e) {
    const insertFallback = `
      INSERT INTO recruits_comments (comment, created_by, comment_type)
      VALUES ($1, $2, $3)
      RETURNING id, comment, created_at, updated_at, comment_type
    `
    const result = await pool.query(insertFallback, [
      comment.trim(),
      userId,
      'talent_pool',
    ])
    return result.rows[0]
  }
}

export async function getBasicUserInfo(userId: string) {
  const q = `
    SELECT 
      u.id,
      u.email,
      pi.first_name,
      pi.last_name,
      pi.profile_picture
    FROM users u
    LEFT JOIN personal_info pi ON u.id = pi.user_id
    WHERE u.id = $1
  `
  const r = await pool.query(q, [userId])
  return r.rows[0] || null
}

export async function getCommentById(commentId: string) {
  const r = await pool.query('SELECT id, created_by FROM recruits_comments WHERE id = $1', [commentId])
  return r.rows[0] || null
}

export async function deleteTalentPoolComment(commentId: string) {
  await pool.query('DELETE FROM recruits_comments WHERE id = $1', [commentId])
}

export async function touchTalentPoolUpdatedAt(talentId: string) {
  try {
    await pool.query('UPDATE talent_pool SET updated_at = NOW() WHERE id = $1', [talentId])
  } catch (_) {
    // ignore
  }
}

// =============================
// Breaks
// =============================

export async function getBreakSessions(memberId: string, date: string) {
  const query = memberId === 'all' ? `
    SELECT 
      bs.id,
      bs.agent_user_id,
      bs.break_type,
      bs.start_time,
      bs.end_time,
      bs.duration_minutes,
      bs.created_at,
      bs.pause_time,
      bs.resume_time,
      bs.pause_used,
      bs.time_remaining_at_pause,
      bs.break_date,
      pi.first_name,
      pi.last_name,
      pi.profile_picture,
      u.email,
      d.name as department_name
    FROM break_sessions bs
    LEFT JOIN personal_info pi ON bs.agent_user_id = pi.user_id
    LEFT JOIN users u ON bs.agent_user_id = u.id
    LEFT JOIN agents a ON bs.agent_user_id = a.user_id
    LEFT JOIN departments d ON a.department_id = d.id
    WHERE bs.break_date = $1
    ORDER BY bs.created_at DESC
  ` : `
    SELECT 
      bs.id,
      bs.agent_user_id,
      bs.break_type,
      bs.start_time,
      bs.end_time,
      bs.duration_minutes,
      bs.created_at,
      bs.pause_time,
      bs.resume_time,
      bs.pause_used,
      bs.time_remaining_at_pause,
      bs.break_date,
      pi.first_name,
      pi.last_name,
      pi.profile_picture,
      u.email,
      d.name as department_name
    FROM break_sessions bs
    LEFT JOIN personal_info pi ON bs.agent_user_id = pi.user_id
    LEFT JOIN users u ON bs.agent_user_id = u.id
    LEFT JOIN agents a ON bs.agent_user_id = a.user_id
    LEFT JOIN departments d ON a.department_id = d.id
    WHERE a.member_id = $1 AND bs.break_date = $2
    ORDER BY bs.created_at DESC
  `
  const params = memberId === 'all' ? [date] : [memberId, date]
  const result = await pool.query(query, params)
  return result.rows
}

export async function getBreakStats(memberId: string, date: string) {
  // Get break session stats
  const breakQuery = memberId === 'all' ? `
    SELECT 
      COUNT(*) as total_sessions,
      COUNT(CASE WHEN end_time IS NULL THEN 1 END) as active_sessions,
      COUNT(CASE WHEN break_date = $1 THEN 1 END) as today_sessions,
      AVG(duration_minutes) as average_duration
    FROM break_sessions bs
    LEFT JOIN agents a ON bs.agent_user_id = a.user_id
    WHERE bs.break_date = $1
  ` : `
    SELECT 
      COUNT(*) as total_sessions,
      COUNT(CASE WHEN end_time IS NULL THEN 1 END) as active_sessions,
      COUNT(CASE WHEN break_date = $2 THEN 1 END) as today_sessions,
      AVG(duration_minutes) as average_duration
    FROM break_sessions bs
    LEFT JOIN agents a ON bs.agent_user_id = a.user_id
    WHERE a.member_id = $1 AND bs.break_date = $2
  `
  
  // Get total agent count for the member
  const agentQuery = memberId === 'all' ? `
    SELECT COUNT(*) as total_agents
    FROM agents a
    INNER JOIN users u ON a.user_id = u.id
    WHERE u.user_type = 'Agent'
  ` : `
    SELECT COUNT(*) as total_agents
    FROM agents a
    INNER JOIN users u ON a.user_id = u.id
    WHERE a.member_id = $1 AND u.user_type = 'Agent'
  `
  
  const breakParams = memberId === 'all' ? [date] : [memberId, date]
  const agentParams = memberId === 'all' ? [] : [memberId]
  
  const [breakResult, agentResult] = await Promise.all([
    pool.query(breakQuery, breakParams),
    pool.query(agentQuery, agentParams)
  ])
  
  const breakStats = breakResult.rows[0] || { total_sessions: 0, active_sessions: 0, today_sessions: 0, average_duration: 0 }
  const agentStats = agentResult.rows[0] || { total_agents: 0 }
  
  return {
    total: parseInt(breakStats.total_sessions) || 0,
    active: parseInt(breakStats.active_sessions) || 0,
    today: parseInt(breakStats.today_sessions) || 0,
    averageDuration: Math.round(parseFloat(breakStats.average_duration) || 0),
    totalAgents: parseInt(agentStats.total_agents) || 0
  }
}

// =============================
// Team Employees
// =============================

export async function getEmployees(memberId: string, search: string | null, department: string | null) {
  let whereClause = `WHERE u.user_type = 'Agent'`
  const params: any[] = []

  if (memberId !== 'all') {
    params.push(memberId)
    whereClause += ` AND a.member_id = $${params.length}`
  }

  if (search) {
    params.push(`%${search}%`)
    whereClause += ` AND (pi.first_name ILIKE $${params.length} OR pi.last_name ILIKE $${params.length})`
  }

  if (department) {
    params.push(department)
    whereClause += ` AND d.name = $${params.length}`
  }

  const employeesQuery = `
    SELECT 
      u.id,
      u.email,
      u.user_type,
      pi.first_name,
      pi.last_name,
      pi.profile_picture,
      pi.phone,
      pi.birthday,
      pi.city,
      pi.address,
      pi.gender,
      a.department_id,
      d.name as department_name,
      d.description as department_description,
      ji.job_title,
      ji.employment_status,
      ji.start_date,
      ji.work_email,
      m.shift
    FROM users u
    LEFT JOIN personal_info pi ON u.id = pi.user_id
    LEFT JOIN agents a ON u.id = a.user_id
    LEFT JOIN departments d ON a.department_id = d.id
    LEFT JOIN job_info ji ON a.user_id = ji.agent_user_id
    LEFT JOIN members m ON a.member_id = m.id
    ${whereClause}
    ORDER BY pi.last_name, pi.first_name
  `

  const employeesResult = await pool.query(employeesQuery, params)

  const statsParams: any[] = []
  let statsWhere = ''
  if (memberId !== 'all') {
    statsParams.push(memberId)
    statsWhere = 'WHERE a.member_id = $1'
  }
  const departmentStatsQuery = `
    SELECT 
      COUNT(DISTINCT d.id) as total_departments,
      COUNT(DISTINCT a.user_id) as total_agents
    FROM departments d
    LEFT JOIN agents a ON d.id = a.department_id
    ${statsWhere}
  `
  const statsResult = await pool.query(departmentStatsQuery, statsParams)

  const employees = employeesResult.rows.map((row: any) => ({
    id: row.id.toString(),
    firstName: row.first_name || '',
    lastName: row.last_name || '',
    email: row.email,
    phone: row.phone,
    department: row.department_name || 'Unassigned',
    position: row.job_title || 'Agent',
    hireDate: row.start_date ? new Date(row.start_date).toISOString().split('T')[0] : null,
    avatar: row.profile_picture,

    departmentId: row.department_id,
    workEmail: row.work_email,
    birthday: row.birthday,
    city: row.city,
    address: row.address,
    gender: row.gender,
    shift: row.shift,
  }))

  const stats = statsResult.rows[0] || { total_departments: 0, total_agents: 0 }
  return {
    employees,
    stats: {
      total: employees.length,
      departments: stats.total_departments,
    },
  }
}

// =============================
// Productivity Scores & Trends
// =============================

export async function getDailyTrend(memberId: string, startISO: string, endISO: string) {
  const dailyTrendQueryAll = `
    WITH base AS (
      SELECT ad.user_id,
             ad.today_date,
             ad.today_active_seconds,
             ad.today_inactive_seconds
      FROM activity_data ad
      JOIN users u ON ad.user_id = u.id
      JOIN agents ag ON ag.user_id = u.id
      WHERE u.user_type = 'Agent'
        AND ad.today_date BETWEEN $1 AND $2
    ),
    totals_by_day AS (
      SELECT today_date,
             SUM(today_active_seconds)::int AS total_active_seconds,
             SUM(today_inactive_seconds)::int AS total_inactive_seconds
      FROM base
      GROUP BY today_date
    ),
    ranked AS (
      SELECT b.today_date,
             b.user_id,
             b.today_active_seconds,
             ROW_NUMBER() OVER (PARTITION BY b.today_date ORDER BY b.today_active_seconds DESC) AS rn
      FROM base b
    )
    SELECT r.today_date AS date,
           t.total_active_seconds,
           t.total_inactive_seconds,
           (MAX(CASE WHEN r.rn = 1 THEN (
               json_build_object(
                 'user_id', r.user_id,
                 'first_name', pi.first_name,
                 'last_name', pi.last_name,
                 'profile_picture', pi.profile_picture,
                 'points', r.today_active_seconds
               )::text
           ) END))::json AS top1,
           (MAX(CASE WHEN r.rn = 2 THEN (
               json_build_object(
                 'user_id', r.user_id,
                 'first_name', pi.first_name,
                 'last_name', pi.last_name,
                 'profile_picture', pi.profile_picture,
                 'points', r.today_active_seconds
               )::text
           ) END))::json AS top2,
           (MAX(CASE WHEN r.rn = 3 THEN (
               json_build_object(
                 'user_id', r.user_id,
                 'first_name', pi.first_name,
                 'last_name', pi.last_name,
                 'profile_picture', pi.profile_picture,
                 'points', r.today_active_seconds
               )::text
           ) END))::json AS top3,
           (MAX(CASE WHEN r.rn = 4 THEN (
               json_build_object(
                 'user_id', r.user_id,
                 'first_name', pi.first_name,
                 'last_name', pi.last_name,
                 'profile_picture', pi.profile_picture,
                 'points', r.today_active_seconds
               )::text
           ) END))::json AS top4,
           (MAX(CASE WHEN r.rn = 5 THEN (
               json_build_object(
                 'user_id', r.user_id,
                 'first_name', pi.first_name,
                 'last_name', pi.last_name,
                 'profile_picture', pi.profile_picture,
                 'points', r.today_active_seconds
               )::text
           ) END))::json AS top5
    FROM ranked r
    JOIN personal_info pi ON pi.user_id = r.user_id
    JOIN totals_by_day t ON t.today_date = r.today_date
    GROUP BY r.today_date, t.total_active_seconds, t.total_inactive_seconds
    ORDER BY r.today_date
  `

  const dailyTrendQueryByMember = `
    WITH base AS (
      SELECT ad.user_id,
             ad.today_date,
             ad.today_active_seconds,
             ad.today_inactive_seconds
      FROM activity_data ad
      JOIN users u ON ad.user_id = u.id
      JOIN agents ag ON ag.user_id = u.id
      WHERE u.user_type = 'Agent'
        AND ag.member_id = $3
        AND ad.today_date BETWEEN $1 AND $2
    ),
    totals_by_day AS (
      SELECT today_date,
             SUM(today_active_seconds)::int AS total_active_seconds,
             SUM(today_inactive_seconds)::int AS total_inactive_seconds
      FROM base
      GROUP BY today_date
    ),
    ranked AS (
      SELECT b.today_date,
             b.user_id,
             b.today_active_seconds,
             ROW_NUMBER() OVER (PARTITION BY b.today_date ORDER BY b.today_active_seconds DESC) AS rn
      FROM base b
    )
    SELECT r.today_date AS date,
           t.total_active_seconds,
           t.total_inactive_seconds,
           (MAX(CASE WHEN r.rn = 1 THEN (
               json_build_object(
                 'user_id', r.user_id,
                 'first_name', pi.first_name,
                 'last_name', pi.last_name,
                 'profile_picture', pi.profile_picture,
                 'points', r.today_active_seconds
               )::text
           ) END))::json AS top1,
           (MAX(CASE WHEN r.rn = 2 THEN (
               json_build_object(
                 'user_id', r.user_id,
                 'first_name', pi.first_name,
                 'last_name', pi.last_name,
                 'profile_picture', pi.profile_picture,
                 'points', r.today_active_seconds
               )::text
           ) END))::json AS top2,
           (MAX(CASE WHEN r.rn = 3 THEN (
               json_build_object(
                 'user_id', r.user_id,
                 'first_name', pi.first_name,
                 'last_name', pi.last_name,
                 'profile_picture', pi.profile_picture,
                 'points', r.today_active_seconds
               )::text
           ) END))::json AS top3,
           (MAX(CASE WHEN r.rn = 4 THEN (
               json_build_object(
                 'user_id', r.user_id,
                 'first_name', pi.first_name,
                 'last_name', pi.last_name,
                 'profile_picture', pi.profile_picture,
                 'points', r.today_active_seconds
               )::text
           ) END))::json AS top4,
           (MAX(CASE WHEN r.rn = 5 THEN (
               json_build_object(
                 'user_id', r.user_id,
                 'first_name', pi.first_name,
                 'last_name', pi.last_name,
                 'profile_picture', pi.profile_picture,
                 'points', r.today_active_seconds
               )::text
           ) END))::json AS top5
    FROM ranked r
    JOIN personal_info pi ON pi.user_id = r.user_id
    JOIN totals_by_day t ON t.today_date = r.today_date
    GROUP BY r.today_date, t.total_active_seconds, t.total_inactive_seconds
    ORDER BY r.today_date
  `

  const result = memberId === 'all'
    ? await pool.query(dailyTrendQueryAll, [startISO, endISO])
    : await pool.query(dailyTrendQueryByMember, [startISO, endISO, memberId])
  return result.rows
}

export async function getDailyProductivityTrend(memberId: string, monthYear: string) {
  const dailyProductivityQueryAll = `
    WITH base AS (
      SELECT ps.user_id,
             ps.month_year,
             ps.productivity_score,
             ps.total_active_seconds,
             ps.total_inactive_seconds
      FROM productivity_scores ps
      JOIN users u ON ps.user_id = u.id
      JOIN agents ag ON ag.user_id = u.id
      WHERE u.user_type = 'Agent'
        AND ps.month_year = $1
    ),
    totals_by_month AS (
      SELECT month_year,
             SUM(productivity_score)::numeric(10,2) AS total_productivity_score,
             SUM(total_active_seconds)::int AS total_active_seconds,
             SUM(total_inactive_seconds)::int AS total_inactive_seconds
      FROM base
      GROUP BY month_year
    ),
    ranked AS (
      SELECT b.user_id,
             b.productivity_score,
             ROW_NUMBER() OVER (ORDER BY b.productivity_score DESC) AS rn
      FROM base b
    )
    SELECT t.month_year AS date,
           t.total_productivity_score,
           t.total_active_seconds,
           t.total_inactive_seconds,
           (MAX(CASE WHEN r.rn = 1 THEN (
               json_build_object(
                 'user_id', r.user_id,
                 'first_name', pi.first_name,
                 'last_name', pi.last_name,
                 'profile_picture', pi.profile_picture,
                 'points', r.productivity_score
               )::text
           ) END))::json AS top1,
           (MAX(CASE WHEN r.rn = 2 THEN (
               json_build_object(
                 'user_id', r.user_id,
                 'first_name', pi.first_name,
                 'last_name', pi.last_name,
                 'profile_picture', pi.profile_picture,
                 'points', r.productivity_score
               )::text
           ) END))::json AS top2,
           (MAX(CASE WHEN r.rn = 3 THEN (
               json_build_object(
                 'user_id', r.user_id,
                 'first_name', pi.first_name,
                 'last_name', pi.last_name,
                 'profile_picture', pi.profile_picture,
                 'points', r.productivity_score
               )::text
           ) END))::json AS top3,
           (MAX(CASE WHEN r.rn = 4 THEN (
               json_build_object(
                 'user_id', r.user_id,
                 'first_name', pi.first_name,
                 'last_name', pi.last_name,
                 'profile_picture', pi.profile_picture,
                 'points', r.productivity_score
               )::text
           ) END))::json AS top4,
           (MAX(CASE WHEN r.rn = 5 THEN (
               json_build_object(
                 'user_id', r.user_id,
                 'first_name', pi.first_name,
                 'last_name', pi.last_name,
                 'profile_picture', pi.profile_picture,
                 'points', r.productivity_score
               )::text
           ) END))::json AS top5
    FROM ranked r
    JOIN personal_info pi ON pi.user_id = r.user_id
    JOIN totals_by_month t ON t.month_year = $1
    GROUP BY t.month_year, t.total_productivity_score, t.total_active_seconds, t.total_inactive_seconds
    ORDER BY t.month_year
  `

  const dailyProductivityQueryByMember = `
    WITH base AS (
      SELECT ps.user_id,
             ps.month_year,
             ps.productivity_score,
             ps.total_active_seconds,
             ps.total_inactive_seconds
      FROM productivity_scores ps
      JOIN users u ON ps.user_id = u.id
      JOIN agents ag ON ag.user_id = u.id
      WHERE u.user_type = 'Agent'
        AND ag.member_id = $2
        AND ps.month_year = $1
    ),
    totals_by_month AS (
      SELECT month_year,
             SUM(productivity_score)::numeric(10,2) AS total_productivity_score,
             SUM(total_active_seconds)::int AS total_active_seconds,
             SUM(total_inactive_seconds)::int AS total_inactive_seconds
      FROM base
      GROUP BY month_year
    ),
    ranked AS (
      SELECT b.user_id,
             b.productivity_score,
             ROW_NUMBER() OVER (ORDER BY b.productivity_score DESC) AS rn
      FROM base b
    )
    SELECT t.month_year AS date,
           t.total_productivity_score,
           t.total_active_seconds,
           t.total_inactive_seconds,
           (MAX(CASE WHEN r.rn = 1 THEN (
               json_build_object(
                 'user_id', r.user_id,
                 'first_name', pi.first_name,
                 'last_name', pi.last_name,
                 'profile_picture', pi.profile_picture,
                 'points', r.productivity_score
               )::text
           ) END))::json AS top1,
           (MAX(CASE WHEN r.rn = 2 THEN (
               json_build_object(
                 'user_id', r.user_id,
                 'first_name', pi.first_name,
                 'last_name', pi.last_name,
                 'profile_picture', pi.profile_picture,
                 'points', r.productivity_score
               )::text
           ) END))::json AS top2,
           (MAX(CASE WHEN r.rn = 3 THEN (
               json_build_object(
                 'user_id', r.user_id,
                 'first_name', pi.first_name,
                 'last_name', pi.last_name,
                 'profile_picture', pi.profile_picture,
                 'points', r.productivity_score
               )::text
           ) END))::json AS top3,
           (MAX(CASE WHEN r.rn = 4 THEN (
               json_build_object(
                 'user_id', r.user_id,
                 'first_name', pi.first_name,
                 'last_name', pi.last_name,
                 'profile_picture', pi.profile_picture,
                 'points', r.productivity_score
               )::text
           ) END))::json AS top4,
           (MAX(CASE WHEN r.rn = 5 THEN (
               json_build_object(
                 'user_id', r.user_id,
                 'first_name', pi.first_name,
                 'last_name', pi.last_name,
                 'profile_picture', pi.profile_picture,
                 'points', r.productivity_score
               )::text
           ) END))::json AS top5
    FROM ranked r
    JOIN personal_info pi ON pi.user_id = r.user_id
    JOIN totals_by_month t ON t.month_year = $1
    GROUP BY t.month_year, t.total_productivity_score, t.total_active_seconds, t.total_inactive_seconds
    ORDER BY t.month_year
  `

  const result = memberId === 'all'
    ? await pool.query(dailyProductivityQueryAll, [monthYear])
    : await pool.query(dailyProductivityQueryByMember, [monthYear, memberId])

  return result.rows
}

export async function getWeeklyTrend(memberId: string, startISO: string, endISO: string) {
  const weeklyTrendQueryAll = `
    WITH base AS (
      SELECT was.user_id,
             was.week_start_date,
             was.week_end_date,
             COALESCE(was.total_active_seconds, 0)   AS total_active_seconds,
             COALESCE(was.total_inactive_seconds, 0) AS total_inactive_seconds
      FROM weekly_activity_summary was
      JOIN users u ON was.user_id = u.id
      JOIN agents ag ON ag.user_id = u.id
      WHERE u.user_type = 'Agent'
        AND was.week_start_date <= $2
        AND was.week_end_date >= $1
    ),
    avg_by_week AS (
      SELECT week_start_date,
             week_end_date,
             AVG(total_active_seconds)::int   AS avg_active_seconds,
             AVG(total_inactive_seconds)::int AS avg_inactive_seconds
      FROM base
      GROUP BY week_start_date, week_end_date
    ),
    ranked AS (
      SELECT b.week_start_date,
             b.week_end_date,
             b.user_id,
             b.total_active_seconds,
             ROW_NUMBER() OVER (
               PARTITION BY b.week_start_date, b.week_end_date
               ORDER BY b.total_active_seconds DESC
             ) AS rn
      FROM base b
    )
    SELECT r.week_start_date,
           r.week_end_date,
           a.avg_active_seconds,
           a.avg_inactive_seconds,
           MAX(CASE WHEN r.rn = 1 THEN json_build_object(
             'user_id', r.user_id,
             'first_name', pi1.first_name,
             'last_name', pi1.last_name,
             'profile_picture', pi1.profile_picture,
             'points', r.total_active_seconds
           ) END) AS top1,
           MAX(CASE WHEN r.rn = 2 THEN json_build_object(
             'user_id', r.user_id,
             'first_name', pi2.first_name,
             'last_name', pi2.last_name,
             'profile_picture', pi2.profile_picture,
             'points', r.total_active_seconds
           ) END) AS top2,
           MAX(CASE WHEN r.rn = 3 THEN json_build_object(
             'user_id', r.user_id,
             'first_name', pi3.first_name,
             'last_name', pi3.last_name,
             'profile_picture', pi3.profile_picture,
             'points', r.total_active_seconds
           ) END) AS top3
    FROM ranked r
    LEFT JOIN personal_info pi1 ON (r.rn = 1 AND pi1.user_id = r.user_id)
    LEFT JOIN personal_info pi2 ON (r.rn = 2 AND pi2.user_id = r.user_id)
    LEFT JOIN personal_info pi3 ON (r.rn = 3 AND pi3.user_id = r.user_id)
    JOIN avg_by_week a ON a.week_start_date = r.week_start_date AND a.week_end_date = r.week_end_date
    GROUP BY r.week_start_date, r.week_end_date, a.avg_active_seconds, a.avg_inactive_seconds
    ORDER BY r.week_start_date
  `

  const weeklyTrendQueryByMember = `
    WITH base AS (
      SELECT was.user_id,
             was.week_start_date,
             was.week_end_date,
             COALESCE(was.total_active_seconds, 0)   AS total_active_seconds,
             COALESCE(was.total_inactive_seconds, 0) AS total_inactive_seconds
      FROM weekly_activity_summary was
      JOIN users u ON was.user_id = u.id
      JOIN agents ag ON ag.user_id = u.id
      WHERE u.user_type = 'Agent'
        AND ag.member_id = $3
        AND was.week_start_date <= $2
        AND was.week_end_date >= $1
    ),
    avg_by_week AS (
      SELECT week_start_date,
             week_end_date,
             AVG(total_active_seconds)::int   AS avg_active_seconds,
             AVG(total_inactive_seconds)::int AS avg_inactive_seconds
      FROM base
      GROUP BY week_start_date, week_end_date
    ),
    ranked AS (
      SELECT b.week_start_date,
             b.week_end_date,
             b.user_id,
             b.total_active_seconds,
             ROW_NUMBER() OVER (
               PARTITION BY b.week_start_date, b.week_end_date
               ORDER BY b.total_active_seconds DESC
             ) AS rn
      FROM base b
    )
    SELECT r.week_start_date,
           r.week_end_date,
           a.avg_active_seconds,
           a.avg_inactive_seconds,
           MAX(CASE WHEN r.rn = 1 THEN json_build_object(
             'user_id', r.user_id,
             'first_name', pi1.first_name,
             'last_name', pi1.last_name,
             'profile_picture', pi1.profile_picture,
             'points', r.total_active_seconds
           ) END) AS top1,
           MAX(CASE WHEN r.rn = 2 THEN json_build_object(
             'user_id', r.user_id,
             'first_name', pi2.first_name,
             'last_name', pi2.last_name,
             'profile_picture', pi2.profile_picture,
             'points', r.total_active_seconds
           ) END) AS top2,
           MAX(CASE WHEN r.rn = 3 THEN json_build_object(
             'user_id', r.user_id,
             'first_name', pi3.first_name,
             'last_name', pi3.last_name,
             'profile_picture', pi3.profile_picture,
             'points', r.total_active_seconds
           ) END) AS top3
    FROM ranked r
    LEFT JOIN personal_info pi1 ON (r.rn = 1 AND pi1.user_id = r.user_id)
    LEFT JOIN personal_info pi2 ON (r.rn = 2 AND pi2.user_id = r.user_id)
    LEFT JOIN personal_info pi3 ON (r.rn = 3 AND pi3.user_id = r.user_id)
    JOIN avg_by_week a ON a.week_start_date = r.week_start_date AND a.week_end_date = r.week_end_date
    GROUP BY r.week_start_date, r.week_end_date, a.avg_active_seconds, a.avg_inactive_seconds
    ORDER BY r.week_start_date
  `

  const result = memberId === 'all'
    ? await pool.query(weeklyTrendQueryAll, [startISO, endISO])
    : await pool.query(weeklyTrendQueryByMember, [startISO, endISO, memberId])
  return result.rows
}

export async function getProductivityScoresRows(memberId: string, monthYear: string, limit?: number) {
  const limitClause = limit ? `LIMIT ${parseInt(String(limit))}` : ''
  const query = memberId === 'all' ? `
    SELECT 
      ps.id,
      ps.user_id,
      ps.month_year,
      ps.productivity_score,
      ps.total_active_seconds,
      ps.total_inactive_seconds,
      ps.total_seconds,
      ps.active_percentage,
      ps.created_at,
      ps.updated_at,
      pi.first_name,
      pi.last_name,
      pi.profile_picture,
      u.email,
      d.name as department_name
    FROM productivity_scores ps
    LEFT JOIN personal_info pi ON ps.user_id = pi.user_id
    LEFT JOIN users u ON ps.user_id = u.id
    LEFT JOIN agents a ON ps.user_id = a.user_id
    LEFT JOIN departments d ON a.department_id = d.id
    WHERE ps.month_year = $1
      AND u.user_type = 'Agent'
    ORDER BY ps.productivity_score DESC, ps.active_percentage DESC
    ${limitClause}
  ` : `
    SELECT 
      ps.id,
      ps.user_id,
      ps.month_year,
      ps.productivity_score,
      ps.total_active_seconds,
      ps.total_inactive_seconds,
      ps.total_seconds,
      ps.active_percentage,
      ps.created_at,
      ps.updated_at,
      pi.first_name,
      pi.last_name,
      pi.profile_picture,
      u.email,
      d.name as department_name
    FROM productivity_scores ps
    LEFT JOIN personal_info pi ON ps.user_id = pi.user_id
    LEFT JOIN users u ON ps.user_id = u.id
    LEFT JOIN agents a ON ps.user_id = a.user_id
    LEFT JOIN departments d ON a.department_id = d.id
    WHERE ps.month_year = $1
      AND u.user_type = 'Agent'
      AND a.member_id = $2
    ORDER BY ps.productivity_score DESC, ps.active_percentage DESC
    ${limitClause}
  `
  const result = memberId === 'all'
    ? await pool.query(query, [monthYear])
    : await pool.query(query, [monthYear, memberId])
  return result.rows
}

export async function getProductivityStatsRow(memberId: string, monthYear: string) {
  const query = memberId === 'all' ? `
    SELECT 
      COUNT(*) as total_agents,
      AVG(ps.productivity_score) as average_productivity,
      AVG(ps.active_percentage) as average_active_percentage,
      MAX(ps.productivity_score) as highest_productivity,
      MIN(ps.productivity_score) as lowest_productivity
    FROM productivity_scores ps
    LEFT JOIN users u ON ps.user_id = u.id
    LEFT JOIN agents a ON ps.user_id = a.user_id
    WHERE ps.month_year = $1
      AND u.user_type = 'Agent'
  ` : `
    SELECT 
      COUNT(*) as total_agents,
      AVG(ps.productivity_score) as average_productivity,
      AVG(ps.active_percentage) as average_active_percentage,
      MAX(ps.productivity_score) as highest_productivity,
      MIN(ps.productivity_score) as lowest_productivity
    FROM productivity_scores ps
    LEFT JOIN users u ON ps.user_id = u.id
    LEFT JOIN agents a ON ps.user_id = a.user_id
    WHERE ps.month_year = $1
      AND u.user_type = 'Agent'
      AND a.member_id = $2
  `
  const result = memberId === 'all'
    ? await pool.query(query, [monthYear])
    : await pool.query(query, [monthYear, memberId])
  return result.rows[0] || null
}

// =============================
// Members
// =============================

export async function getMemberById(memberId: string) {
  const memberQuery = `
    SELECT 
      id,
      company,
      address,
      phone,
      logo,
      service,
      status,
      badge_color,
      country,
      website
    FROM members
    WHERE id = $1
  `
  const memberResult = await pool.query(memberQuery, [memberId])
  return memberResult.rows[0] || null
}

// =============================
// Tickets stats helpers
// =============================

export async function countClosedTicketsBetween(startISO: string, endISO: string) {
  const q = `
    SELECT COUNT(*) as count
    FROM public.tickets 
    WHERE status = 'Closed' 
      AND role_id = 1
      AND resolved_at >= $1
      AND resolved_at < $2
  `
  const r = await pool.query(q, [startISO, endISO])
  return parseInt(r.rows[0]?.count || '0')
}

export async function countTotalClosedTickets() {
  const q = `
    SELECT COUNT(*) as count
    FROM public.tickets 
    WHERE status = 'Closed' 
      AND role_id = 1
  `
  const r = await pool.query(q)
  return parseInt(r.rows[0]?.count || '0')
}

export async function countClosedWithResolvedAt() {
  const q = `
    SELECT COUNT(*) as count
    FROM public.tickets 
    WHERE status = 'Closed' 
      AND role_id = 1
      AND resolved_at IS NOT NULL
  `
  const r = await pool.query(q)
  return parseInt(r.rows[0]?.count || '0')
}

// =============================
// Ticket comments
// =============================

export async function getTicketIdByCode(ticketCode: string) {
  const r = await pool.query('SELECT id FROM tickets WHERE ticket_id = $1', [ticketCode])
  return r.rows[0]?.id || null
}

export async function getTicketComments(ticketId: number) {
  const q = `
    SELECT 
      tc.id,
      tc.ticket_id,
      tc.user_id,
      tc.comment,
      tc.created_at,
      tc.updated_at,
      u.email,
      pi.first_name,
      pi.last_name,
      pi.profile_picture
    FROM ticket_comments tc
    LEFT JOIN users u ON tc.user_id = u.id
    LEFT JOIN personal_info pi ON u.id = pi.user_id
    WHERE tc.ticket_id = $1
    ORDER BY tc.created_at ASC
  `
  const result = await pool.query(q, [ticketId])
  return result.rows
}

export async function addTicketComment(ticketId: number, userId: string, comment: string) {
  const insertQuery = `
    INSERT INTO ticket_comments (ticket_id, user_id, comment)
    VALUES ($1, $2, $3)
    RETURNING id, ticket_id, user_id, comment, created_at, updated_at
  `
  const result = await pool.query(insertQuery, [ticketId, userId, comment.trim()])
  return result.rows[0]
}

export async function getBasicUserInfoById(userId: string) {
  const q = `
    SELECT 
      u.id,
      u.email,
      pi.first_name,
      pi.last_name,
      pi.profile_picture
    FROM users u
    LEFT JOIN personal_info pi ON u.id = pi.user_id
    WHERE u.id = $1
  `
  const r = await pool.query(q, [userId])
  return r.rows[0] || null
}

export async function getApplicants({ status, diagnose = false }: { status?: string | null; diagnose?: boolean }) {
  if (!pool) throw new Error('Main database is not configured')
  let applicantsQuery = `
    SELECT 
      r.id,
      r.bpoc_application_ids,
      r.applicant_id,
      r.job_ids,
      r.resume_slug,
      r.status,
      r.created_at,
      r.updated_at,
      r.video_introduction_url,
      r.current_salary,
      r.expected_monthly_salary,
      r.shift,
      COALESCE(r.position, 0) as position
    FROM public.bpoc_recruits r
  `
  const params: any[] = []
  if (status) {
    applicantsQuery += ` WHERE r.status = $1`
    params.push(status)
  }
  applicantsQuery += ` ORDER BY COALESCE(r.position, 0), r.created_at DESC LIMIT 500`
  const { rows: applicants } = await pool.query(applicantsQuery, params)
  
  console.log('�� getApplicants: Raw applicants from database:', applicants.length)
  console.log('🔍 getApplicants: Sample applicant:', applicants[0])
  console.log('🔍 getApplicants: BPOC pool available:', !!bpocPool)

  let enrichedData = applicants
  if (diagnose) {
    enrichedData = enrichedData.map((app: any) => ({
      ...app,
      _diagnostic: {
        job_ids_length: app.job_ids ? app.job_ids.length : 0,
        bpoc_app_ids_length: app.bpoc_application_ids ? app.bpoc_application_ids.length : 0,
        has_duplicates: (app.job_ids && app.job_ids.length > 1) || (app.bpoc_application_ids && app.bpoc_application_ids.length > 1)
      }
    }))
  }
  if (!bpocPool) {
    console.log('🔍 getApplicants: No BPOC pool, returning basic data')
    return enrichedData
  }

  try {
    const applicationIds = applicants.flatMap((app: any) => app.bpoc_application_ids || []).filter(Boolean)
    const jobIds = applicants.flatMap((app: any) => app.job_ids || []).filter(Boolean)
    
    console.log('🔍 getApplicants: Application IDs for enrichment:', applicationIds)
    console.log('�� getApplicants: Job IDs for enrichment:', jobIds)
    
    let enrichmentData: any[] = []
    let jobData: any[] = []
    if (applicationIds.length > 0) {
      // Fetch applications from bpoc_application_ids (original approach)
      const enrichmentQuery = `
        SELECT a.id::text, a.user_id::text, u.first_name, u.last_name, u.full_name, u.avatar_url, u.position,
               p.job_title, m.company AS company_name, a.job_id, a.status::text as application_status,
               a.created_at as application_created_at
        FROM public.applications a
        JOIN public.users u ON u.id = a.user_id
        LEFT JOIN public.processed_job_requests p ON p.id = a.job_id
        LEFT JOIN public.members m ON m.company_id = p.company_id
        WHERE a.id IN (${applicationIds.map((_, i) => `$${i + 1}`).join(',')})
      `
      console.log('🔍 getApplicants: Enrichment query:', enrichmentQuery)
      const { rows } = await bpocPool.query(enrichmentQuery, applicationIds)
      enrichmentData = rows
      console.log('🔍 getApplicants: Enrichment data fetched:', enrichmentData.length)
    }
    if (jobIds.length > 0) {
      const jobQuery = `
        SELECT p.id as job_id, p.job_title, m.company AS company_name
        FROM public.processed_job_requests p
        LEFT JOIN public.members m ON m.company_id = p.company_id
        WHERE p.id IN (${jobIds.map((_, i) => `$${i + 1}`).join(',')})
      `
      const { rows } = await bpocPool.query(jobQuery, jobIds)
      jobData = rows
    }
    
    // CRITICAL: Fetch current application statuses for all applicants to get accurate statuses
    let currentJobStatuses: any[] = []
    if (bpocPool) {
      try {
        // Get all applicant IDs
        const applicantIds = applicants.map(a => a.applicant_id).filter(Boolean)
        if (applicantIds.length > 0) {
          // CRITICAL FIX: Fetch statuses by both user_id AND job_id to ensure proper mapping
          const statusQuery = `
            SELECT a.job_id, a.status::text as current_status, a.created_at, a.user_id, a.id as application_id
            FROM public.applications a
            WHERE a.user_id IN (${applicantIds.map((_, i) => `$${i + 1}`).join(',')})
            ORDER BY a.user_id, a.created_at DESC
          `
          const { rows } = await bpocPool.query(statusQuery, applicantIds)
          currentJobStatuses = rows
          console.log('🔍 getApplicants: Current job statuses fetched by applicant ID:', currentJobStatuses.length)
          console.log('🔍 getApplicants: Sample current statuses:', currentJobStatuses.slice(0, 3))
        }
      } catch (error) {
        console.warn('Failed to fetch current job statuses:', error)
      }
    }
                // First, fetch skills data and summary for all applicants
        const skillsMap = new Map<string, any>()
        const originalSkillsMap = new Map<string, any>()
        const summaryMap = new Map<string, string>()
        const emailMap = new Map<string, string>()
        const phoneMap = new Map<string, string>()
        const addressMap = new Map<string, string>()
        const aiAnalysisMap = new Map<string, any>() // Added for AI analysis
        
        if (bpocPool) {
          try {
            const userIds = enrichmentData
              .map((e: any) => e.user_id)
              .filter(Boolean)
              .filter((id: string, index: number, arr: string[]) => arr.indexOf(id) === index) // unique IDs
            
            if (userIds.length > 0) {
              const skillsResult = await bpocPool.query(
                `SELECT rg.user_id, rg.generated_resume_data FROM resumes_generated rg WHERE rg.user_id = ANY($1::uuid[])`,
                [userIds]
              )
              
              for (const row of skillsResult.rows) {
                const resumeData = row.generated_resume_data
                originalSkillsMap.set(row.user_id, resumeData)
                
                // Extract summary from the resume data
                if (resumeData.summary && typeof resumeData.summary === 'string') {
                  summaryMap.set(row.user_id, resumeData.summary)
                }
                
                // Extract skills from different formats
                let allSkills: string[] = []
                if (resumeData.skills && typeof resumeData.skills === 'object') {
                  if (Array.isArray(resumeData.skills.technical)) allSkills = allSkills.concat(resumeData.skills.technical)
                  if (Array.isArray(resumeData.skills.soft)) allSkills = allSkills.concat(resumeData.skills.soft)
                  if (Array.isArray(resumeData.skills.languages)) allSkills = allSkills.concat(resumeData.skills.languages)
                } else if (Array.isArray(resumeData.skills)) {
                  allSkills = resumeData.skills
                } else if (resumeData.sections && resumeData.sections.skills) {
                  allSkills = resumeData.sections.skills
                }
                skillsMap.set(row.user_id, allSkills)
              }
              
              // Fetch email, phone, and location data for all users
              if (userIds.length > 0) {
                const userResult = await bpocPool.query(
                  `SELECT u.id, u.email, u.phone, u.location FROM users u WHERE u.id = ANY($1::uuid[])`,
                  [userIds]
                )
                
                for (const row of userResult.rows) {
                  if (row.email) {
                    emailMap.set(row.id, row.email)
                  }
                  if (row.phone) {
                    phoneMap.set(row.id, row.phone)
                  }
                  if (row.location) {
                    addressMap.set(row.id, row.location)
                  }
                }
              }
              
              // Fetch AI analysis data for all users
              if (userIds.length > 0) {
                console.log('🔍 Fetching AI analysis for user IDs:', userIds)
                const aiResult = await bpocPool.query(
                  `SELECT user_id, overall_score, key_strengths, strengths_analysis, improvements, recommendations, improved_summary, salary_analysis, career_path, section_analysis FROM ai_analysis_results WHERE user_id = ANY($1::uuid[])`,
                  [userIds]
                )
                
                console.log('🔍 AI analysis query result:', aiResult.rows)
                
                for (const row of aiResult.rows) {
                  aiAnalysisMap.set(row.user_id, {
                    overall_score: row.overall_score,
                    key_strengths: row.key_strengths,
                    strengths_analysis: row.strengths_analysis,
                    improvements: row.improvements,
                    recommendations: row.recommendations,
                    improved_summary: row.improved_summary,
                    salary_analysis: row.salary_analysis,
                    career_path: row.career_path,
                    section_analysis: row.section_analysis
                  })
                }
                
                console.log('🔍 AI analysis map populated:', aiAnalysisMap)
              }
                    }
          } catch (e) {
            // Skills fetching failed, continue without skills
          }
        }
    
    enrichedData = applicants.map((applicant: any) => {
      // CRITICAL FIX: Filter applications by job_id, not by application ID
      // The enrichmentData contains applications with job_id field, not application ID
              const applicantApplications = enrichmentData.filter((e: any) => 
          applicant.job_ids?.includes(e.job_id) && e.company_name // Only include jobs from member companies
        )
      const applicantJobs = jobData.filter((j: any) => 
        applicant.job_ids?.includes(j.job_id) && j.company_name // Only include jobs from member companies
      )
      const firstApplication = applicantApplications[0] || enrichmentData.find((e: any) => e.user_id === applicant.applicant_id)
      const applicationJobPairs = applicantApplications
        .filter((app: any) => app.job_title)
        .map((app: any) => ({
          job_title: app.job_title,
          company_name: app.company_name || null,
          application_status: app.application_status || 'submitted',
          application_created_at: app.application_created_at,
        }))
      const directJobPairs = applicantJobs
        .filter((job: any) => job.job_title)
        .map((job: any) => ({
          job_title: job.job_title,
          company_name: job.company_name || null,
          application_status: 'submitted',
          application_created_at: null,
        }))
      // CRITICAL: Maintain exact 1:1 mapping with main database arrays
      // Map each job_id to its corresponding BPOC data, preserving order and length
      const allJobTitles: string[] = []
      const allCompanies: (string | null)[] = []
      const allJobStatuses: string[] = []
      const allJobTimestamps: (string | null)[] = []
      
      // CRITICAL: Create a map of job_id -> status for efficient lookup
      const jobStatusMap = new Map<string, { status: string, timestamp: string | null }>()
      if (currentJobStatuses.length > 0) {
        currentJobStatuses.forEach(statusData => {
          if (statusData.user_id === applicant.applicant_id) {
            const key = String(statusData.job_id)
            jobStatusMap.set(key, {
              status: statusData.current_status,
              timestamp: statusData.created_at
            })
          }
        })
      }
      
      console.log(`�� Created job status map for applicant ${applicant.applicant_id}:`, 
        Array.from(jobStatusMap.entries()).map(([jobId, data]) => `${jobId}: ${data.status}`)
      )
      
              // Filter job_ids to only include jobs from member companies
        const memberJobIds = applicant.job_ids?.filter((jobId: number) => {
          const matchingJob = jobData.find((j: any) => j.job_id === jobId)
          return matchingJob && matchingJob.company_name // Only include jobs from member companies
        }) || []
      
      // Ensure arrays have the same length as filtered job_ids array
      if (memberJobIds && memberJobIds.length > 0) {
        for (let i = 0; i < memberJobIds.length; i++) {
          const jobId = memberJobIds[i]
          const jobIdString = String(jobId)
          
          // Find corresponding job data
          const matchingJob = jobData.find((j: any) => j.job_id === jobId)
          
          // Find corresponding application data (if exists)
          const applicationData = applicantApplications.find(app => app.job_id === jobId)
          
          // CRITICAL FIX: Use the pre-built map for exact job_id matching
          console.log(`�� Processing job ${i + 1}: ID ${jobId} (string: ${jobIdString})`)
          
          // Look up status in the map by exact job_id string match
          const statusData = jobStatusMap.get(jobIdString)
          
          if (statusData) {
            console.log(`🔍 Found status for job ${jobId}:`, statusData.status)
            allJobStatuses.push(statusData.status)
            allJobTimestamps.push(statusData.timestamp)
          } else {
            console.log(`🔍 No status found for job ${jobId}, using fallback:`, applicant.status)
            // Fallback to main database status
            const mainDbStatus = applicant.status || 'submitted'
            allJobStatuses.push(mainDbStatus)
            allJobTimestamps.push(null)
          }
          
          // Use application data if available, otherwise fall back to job data
          if (applicationData) {
            allJobTitles.push(applicationData.job_title || 'Unknown Job')
            allCompanies.push(applicationData.company_name || null)
          } else if (matchingJob) {
            allJobTitles.push(matchingJob.job_title || 'Unknown Job')
            allCompanies.push(matchingJob.company_name || null)
          } else {
            // Fallback for missing data
            allJobTitles.push('Unknown Job')
            allCompanies.push(null)
          }
        }
      }
      
      // Get skills data, summary, email, phone, and address for this applicant 
      const userId = firstApplication?.user_id || applicant.applicant_id
      const skillsData = skillsMap.get(userId) || null
      const originalSkillsData = originalSkillsMap.get(userId) || null
      const summaryData = summaryMap.get(userId) || null
      const emailData = emailMap.get(userId) || null
      const phoneData = phoneMap.get(userId) || null
      const addressData = addressMap.get(userId) || null
      const aiAnalysisData = aiAnalysisMap.get(userId) || null // Added for AI analysis
      
      console.log('🔍 Applicant enrichment data:', { 
        applicantId: applicant.id, 
        userId, 
        hasSkills: !!skillsData,
        hasSummary: !!summaryData,
        hasEmail: !!emailData,
        hasPhone: !!phoneData,
        hasAddress: !!addressData,
        hasAiAnalysis: !!aiAnalysisData,
        aiAnalysisMapSize: aiAnalysisMap.size,
        // Debug job status mapping
        jobIds: applicant.job_ids,
        bpocApplicationIds: applicant.bpoc_application_ids,
        allJobTitles,
        allJobStatuses,
        allJobTimestamps,
        enrichmentDataLength: enrichmentData.length,
        applicationDataSample: enrichmentData.slice(0, 2),
        currentJobStatusesCount: currentJobStatuses.length,
        currentJobStatusesSample: currentJobStatuses.slice(0, 2),
        // Debug current statuses for this applicant
        applicantCurrentStatuses: currentJobStatuses.filter(s => s.user_id === applicant.applicant_id),
        // CRITICAL: Debug array alignment
        arraysAligned: {
          jobIdsLength: applicant.job_ids?.length || 0,
          titlesLength: allJobTitles.length,
          companiesLength: allCompanies.length,
          statusesLength: allJobStatuses.length,
          timestampsLength: allJobTimestamps.length,
          allEqual: (applicant.job_ids?.length || 0) === allJobTitles.length && 
                   allJobTitles.length === allCompanies.length && 
                   allCompanies.length === allJobStatuses.length && 
                   allJobStatuses.length === allJobTimestamps.length
        },
        // CRITICAL: Debug job status mapping accuracy
        jobStatusMapping: {
          jobStatusMapSize: jobStatusMap.size,
          jobStatusMapEntries: Array.from(jobStatusMap.entries()),
          mappedJobIds: applicant.job_ids?.map((id: number) => ({
            jobId: id,
            jobIdString: String(id),
            hasStatus: jobStatusMap.has(String(id)),
            status: jobStatusMap.get(String(id))?.status || 'fallback'
          })) || []
        }
      })
      
              return {
          ...applicant,
          user_id: userId,
          first_name: firstApplication?.first_name || null,
          last_name: firstApplication?.last_name || null,
          full_name: firstApplication?.full_name || null,
          profile_picture: firstApplication?.avatar_url || null,
          email: emailData,
          job_title: firstApplication?.position || null,
          company_name: null,
          job_ids: memberJobIds, // Use filtered job_ids (only from member companies)
          all_job_titles: allJobTitles,
          all_companies: allCompanies,
          all_job_statuses: allJobStatuses,
          all_job_timestamps: allJobTimestamps,
          skills: skillsData,
          originalSkillsData: originalSkillsData,
          summary: summaryData,
          phone: phoneData,
          address: addressData,
          aiAnalysis: aiAnalysisData, // Added AI analysis data
        }
    })
  } catch (e) {
    // fall back to basic data
    return enrichedData
  }
  return enrichedData
}

// =============================
// Activities Data
// =============================

export async function getActivitiesByDate(memberId: string, startDate: string, endDate: string) {
  const query = `
    SELECT 
      ad.id,
      ad.user_id,
      ad.today_date,
      ad.today_active_seconds,
      ad.today_inactive_seconds,
      ad.is_currently_active,
      ad.last_session_start,
      ad.created_at,
      ad.updated_at,
      pi.first_name,
      pi.last_name,
      u.email,
      pi.profile_picture,
      d.name as department_name,
      CASE 
        WHEN bs.id IS NOT NULL AND bs.end_time IS NULL THEN true
        ELSE false
      END as is_on_break,
      bs.break_type as current_break_type,
      bs.pause_time,
      CASE 
        WHEN m.id IS NOT NULL AND m.is_in_meeting = true AND m.status = 'in-progress' THEN true
        ELSE false
      END as is_in_meeting,
      m.title as meeting_title,
      m.meeting_type,
      m.start_time as meeting_start_time
    FROM activity_data ad
    JOIN users u ON ad.user_id = u.id
    LEFT JOIN personal_info pi ON u.id = pi.user_id
    LEFT JOIN agents a ON u.id = a.user_id
    LEFT JOIN departments d ON a.department_id = d.id
    LEFT JOIN break_sessions bs ON ad.user_id = bs.agent_user_id 
      AND bs.break_date = ad.today_date 
      AND bs.end_time IS NULL
    LEFT JOIN meetings m ON ad.user_id = m.agent_user_id 
      AND m.is_in_meeting = true 
      AND m.status = 'in-progress'
      AND DATE(m.start_time) = ad.today_date
    WHERE ad.today_date BETWEEN $1 AND $2
      AND ($3 = 'all' OR u.id IN (
        SELECT user_id FROM agents WHERE member_id = $3::int
      ))
    ORDER BY ad.today_date DESC, ad.today_active_seconds DESC
  `
  
  const result = await pool.query(query, [startDate, endDate, memberId])
  return result.rows
}

export async function getActivityStats(memberId: string, startDate: string, endDate: string) {
  const query = `
    SELECT 
      COUNT(DISTINCT ad.user_id) as total_users,
      COUNT(DISTINCT ad.today_date) as total_days,
      SUM(ad.today_active_seconds) as total_active_seconds,
      SUM(ad.today_inactive_seconds) as total_inactive_seconds,
      AVG(ad.today_active_seconds) as avg_active_seconds,
      AVG(ad.today_inactive_seconds) as avg_inactive_seconds,
      MAX(ad.today_active_seconds) as max_active_seconds,
      MIN(ad.today_active_seconds) as min_active_seconds
    FROM activity_data ad
    JOIN users u ON ad.user_id = u.id
    WHERE ad.today_date BETWEEN $1 AND $2
      AND ($3 = 'all' OR u.id IN (
        SELECT user_id FROM agents WHERE member_id = $3::int
      ))
  `
  
  const result = await pool.query(query, [startDate, endDate, memberId])
  return result.rows[0] || {}
}