import pool from './database'

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
  
  const whereConditions = ['t.role_id = 1']
  const queryParams: unknown[] = []
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
