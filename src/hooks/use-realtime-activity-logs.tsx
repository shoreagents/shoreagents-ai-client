import { useState, useEffect, useCallback, useRef } from 'react'
import React from 'react' // Added for React.useMemo

// Generic interfaces that can work with any table
export interface BaseRecord {
  id: number
  created_at: string
  updated_at: string
  user_id: number
  first_name?: string | null
  last_name?: string | null
  profile_picture?: string | null
  user_name?: string
}

export interface CommentRecord extends BaseRecord {
  comment: string
  [key: string]: any // Allow additional fields like member_id, ticket_id, etc.
}

export interface ActivityLogRecord extends BaseRecord {
  action: string
  fieldName: string
  oldValue: string | null
  newValue: string | null
  [key: string]: any // Allow additional fields like member_id, ticket_id, etc.
}

export interface NotificationData {
  table: string
  action: 'INSERT' | 'UPDATE' | 'DELETE'
  record: any
  old_record: any
  timestamp: string
}

export interface RealtimeTableConfig {
  tableName: string
  recordId: number
  recordIdField: string // e.g., 'member_id', 'ticket_id', 'applicant_id'
  messageType: string // e.g., 'member_comment_update', 'ticket_activity_update'
  apiEndpoints: {
    comments: string // e.g., '/api/members/{id}/comments'
    activityLogs: string // e.g., '/api/members/{id}/activity'
  }
  crudFunctions?: {
    getComments?: (id: number) => Promise<CommentRecord[]>
    addComment?: (id: number, userId: number, comment: string) => Promise<number>
    deleteComment?: (commentId: number, userId: number) => Promise<boolean>
    getActivityLogs?: (id: number) => Promise<ActivityLogRecord[]>
  }
}

export function useRealtimeActivityLogs(config: RealtimeTableConfig) {
  const [comments, setComments] = useState<CommentRecord[]>([])
  const [activityLogs, setActivityLogs] = useState<ActivityLogRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)

  // Memoize config values to prevent unnecessary recreations
  const configRef = useRef(config)
  configRef.current = config

  // Load initial data
  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Load comments
      try {
        if (configRef.current.crudFunctions?.getComments) {
          const initialComments = await configRef.current.crudFunctions.getComments(configRef.current.recordId)
          setComments(initialComments)
        } else {
          // Fallback to API
          const commentsResponse = await fetch(
            configRef.current.apiEndpoints.comments.replace('{id}', configRef.current.recordId.toString())
          )
          if (commentsResponse.ok) {
            const data = await commentsResponse.json()
            setComments(data.comments || [])
          }
        }
      } catch (err) {
        console.warn('Failed to load comments:', err)
        setComments([])
      }

      // Load activity logs only (no comments)
      try {
        if (configRef.current.crudFunctions?.getActivityLogs) {
          const initialLogs = await configRef.current.crudFunctions.getActivityLogs(configRef.current.recordId)
          setActivityLogs(initialLogs)
        } else {
          // Fallback to API - but only get activity logs, not comments
          const logsResponse = await fetch(
            configRef.current.apiEndpoints.activityLogs.replace('{id}', configRef.current.recordId.toString())
          )
          if (logsResponse.ok) {
            const data = await logsResponse.json()
            const entries = data.entries || []
            
            // Only get activity logs, ignore comments (they come from comments API)
            const activities = entries.filter((entry: any) => entry.type === 'activity')
            setActivityLogs(activities)
          }
        }
      } catch (err) {
        console.warn('Failed to load activity logs:', err)
        setActivityLogs([])
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }, []) // Remove config dependency

  // Fetch user information for a comment
  const fetchCommentUserInfo = useCallback(async (commentId: number) => {
    try {
      const response = await fetch(
        configRef.current.apiEndpoints.comments.replace('{id}', configRef.current.recordId.toString())
      )
      if (response.ok) {
        const data = await response.json()
        const comment = data.comments.find((c: any) => c.id === commentId)
        return comment || null
      }
    } catch (err) {
      console.warn('Failed to fetch comment user info:', err)
    }
    return null
  }, [])

  // Fetch user information for an activity log
  const fetchActivityLogUserInfo = useCallback(async (activityLogId: number) => {
    try {
      console.log('🔍 Fetching activity log user info for ID:', activityLogId)
      const response = await fetch(
        configRef.current.apiEndpoints.activityLogs.replace('{id}', configRef.current.recordId.toString())
      )
      if (response.ok) {
        const data = await response.json()
        console.log('🔍 Activity API response:', data)
        
        // Look for the specific activity log
        const activityLog = data.entries?.find((entry: any) => 
          entry.id === activityLogId
        )
        
        if (activityLog) {
          console.log('✅ Found enriched activity log:', activityLog)
          return activityLog
        } else {
          console.warn('⚠️ Activity log not found in API response for ID:', activityLogId)
          // Return a basic enriched version if not found
          return {
            id: activityLogId,
            member_id: configRef.current.recordId,
            field_name: 'Unknown',
            action: 'updated',
            old_value: null,
            new_value: null,
            user_id: 2, // Default user ID
            created_at: new Date().toISOString(),
            userName: 'You', // Default user name
            type: 'activity'
          }
        }
      }
    } catch (err) {
      console.warn('Failed to fetch activity log user info:', err)
    }
    return null
  }, [])

  // Handle real-time notifications via WebSocket
  const handleWebSocketMessage = useCallback(async (event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data)
      console.log('🔍 WebSocket message received:', message)
      
      // Handle both comment and activity log updates
      if (message.type === configRef.current.messageType || 
          message.type === 'member_activity_update' || 
          message.type === 'member_update') {
        console.log('✅ Processing message type:', message.type)
        const { action, record, old_record } = message.data
        
        if (record && record[configRef.current.recordIdField] === configRef.current.recordId) {
          console.log('✅ Record matches current member, processing...')
          // Handle comments
          if (record.comment !== undefined) {
            // For new comments, fetch user information to get avatar and name
            if (action === 'INSERT') {
              const enrichedComment = await fetchCommentUserInfo(record.id)
              if (enrichedComment) {
                setComments(prevComments => {
                  // Check if comment already exists to prevent duplication
                  const exists = prevComments.some(c => c.id === enrichedComment.id)
                  if (!exists) {
                    return [enrichedComment, ...prevComments]
                  }
                  return prevComments
                })
              }
            } else {
              // For UPDATE and DELETE, handle normally
              setComments(prevComments => {
                switch (action) {
                  case 'UPDATE':
                    return prevComments.map(comment => 
                      comment.id === record.id ? record : comment
                    )
                  case 'DELETE':
                    return prevComments.filter(comment => comment.id !== old_record.id)
                  default:
                    return prevComments
                }
              })
            }
          }
          
          // Handle activity logs
          if (record.action !== undefined) {
            console.log('🔍 Processing activity log:', record)
            
            // For new activity logs, add them directly with basic user info
            if (action === 'INSERT') {
              const enrichedActivityLog = {
                ...record,
                // Add basic user information since we don't have it from the trigger
                userName: 'You', // Default to current user
                userId: record.user_id,
                type: 'activity',
                // Normalize field names to match what the frontend expects
                createdAt: record.created_at,
                fieldName: record.field_name,
                oldValue: record.old_value,
                newValue: record.new_value
              }
              
              console.log('✅ Enriched activity log:', enrichedActivityLog)
              
              setActivityLogs(prevLogs => {
                // Check if activity log already exists to prevent duplication
                const exists = prevLogs.some(log => log.id === enrichedActivityLog.id)
                if (!exists) {
                  console.log('✅ Adding new activity log to state')
                  return [enrichedActivityLog, ...prevLogs]
                } else {
                  console.log('⚠️ Activity log already exists, skipping')
                  return prevLogs
                }
              })
            } else {
              // For UPDATE and DELETE, handle normally
              setActivityLogs(prevLogs => {
                switch (action) {
                  case 'UPDATE':
                    return prevLogs.map(log => 
                      log.id === record.id ? record : log
                    )
                  case 'DELETE':
                    return prevLogs.filter(log => log.id !== old_record.id)
                  default:
                    return prevLogs
                }
              })
            }
          }
        }
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error)
    }
  }, [fetchCommentUserInfo, fetchActivityLogUserInfo]) // Add both function dependencies

  // Setup WebSocket connection
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//${window.location.host}/ws`
    
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      console.log(`✅ WebSocket connected for ${config.tableName}`)
      setIsConnected(true)
      setError(null)
      
      // Load initial data when connected
      loadData()
    }

    ws.onmessage = handleWebSocketMessage

    ws.onclose = () => {
      console.log(`❌ WebSocket disconnected for ${config.tableName}`)
      setIsConnected(false)
    }

    ws.onerror = (error) => {
      console.error(`❌ WebSocket error for ${config.tableName}:`, error)
      setError('WebSocket connection error')
      setIsConnected(false)
    }

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close()
      }
    }
  }, [loadData, handleWebSocketMessage, config.tableName, config.recordId, config.recordIdField, config.messageType])

  // Add a new comment
  const addComment = useCallback(async (commentText: string, userId: number) => {
    try {
      setError(null)
      
      // Try to use real-time function first
      if (configRef.current.crudFunctions?.addComment) {
        try {
          const newCommentId = await configRef.current.crudFunctions.addComment(configRef.current.recordId, userId, commentText)
          
          // The comment will be added via WebSocket notification, but we can add it optimistically
          const newComment: CommentRecord = {
            id: newCommentId,
            user_id: userId,
            comment: commentText,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            first_name: null,
            last_name: null,
            profile_picture: null,
            user_name: 'You',
            [configRef.current.recordIdField]: configRef.current.recordId
          }
          
          setComments(prev => [newComment, ...prev])
          return newCommentId
        } catch (err) {
          // Fallback to regular API
          const response = await fetch(
            configRef.current.apiEndpoints.comments.replace('{id}', configRef.current.recordId.toString()),
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ comment: commentText, user_id: userId })
            }
          )
          
          if (!response.ok) {
            throw new Error('Failed to add comment')
          }
          
          const data = await response.json()
          
          // Don't reload - let WebSocket handle the real-time update
          // await loadData()
          
          return data.comment_id
        }
      } else {
        // Use API only
        const response = await fetch(
          configRef.current.apiEndpoints.comments.replace('{id}', configRef.current.recordId.toString()),
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ comment: commentText, user_id: userId })
          }
        )
        
        if (!response.ok) {
          throw new Error('Failed to add comment')
        }
        
        const data = await response.json()
        
        // Don't reload - let WebSocket handle the real-time update
        // await loadData()
        
        return data.comment_id
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment')
      throw err
    }
  }, [loadData])

  // Delete a comment
  const deleteComment = useCallback(async (commentId: number, userId: number) => {
    try {
      setError(null)
      
      // Try to use real-time function first
      if (configRef.current.crudFunctions?.deleteComment) {
        try {
          const success = await configRef.current.crudFunctions.deleteComment(commentId, userId)
          
          if (success) {
            // The comment will be removed via WebSocket notification, but we can remove it optimistically
            setComments(prev => prev.filter(comment => comment.id !== commentId))
          }
          
          return success
        } catch (err) {
          // Fallback to regular API
          const response = await fetch(
            `${configRef.current.apiEndpoints.comments.replace('{id}', configRef.current.recordId.toString())}/${commentId}`,
            {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ user_id: userId })
            }
          )
          
          if (!response.ok) {
            throw new Error('Failed to delete comment')
          }
          
          // Reload comments to get the updated list
          await loadData()
          
          return true
        }
      } else {
        // Use API only
        const response = await fetch(
          `${configRef.current.apiEndpoints.comments.replace('{id}', configRef.current.recordId.toString())}/${commentId}`,
          {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId })
          }
        )
        
        if (!response.ok) {
          throw new Error('Failed to delete comment')
        }
        
        // Reload comments to get the updated list
        await loadData()
        
        return true
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comment')
      throw err
    }
  }, [loadData])

  // Refresh data manually
  const refreshData = useCallback(() => {
    loadData()
  }, [loadData])

  // Get combined data (comments + activity logs) sorted by date
  const getAllEntries = useCallback(() => {
    // Normalize data to use consistent field names
    const normalizedComments = comments.map(c => ({ 
      ...c, 
      entryType: 'comment' as const,
      created_at: c.created_at // Comments already have created_at
    }))
    
    const normalizedActivityLogs = activityLogs.map(l => ({ 
      ...l, 
      entryType: 'activity' as const,
      created_at: l.createdAt || l.created_at, // Activity logs have createdAt, fallback to created_at
      user_name: l.userName || l.user_name, // Activity logs have userName, fallback to user_name
      user_id: l.userId || l.user_id // Activity logs have userId, fallback to user_id
    }))
    
    const combined = [...normalizedComments, ...normalizedActivityLogs]
    
    return combined.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
      return dateA - dateB // Oldest first (chronological order)
    })
  }, [comments, activityLogs])

  // Memoize the result to prevent unnecessary recalculations
  const allEntries = React.useMemo(() => getAllEntries(), [getAllEntries])

  return {
    // Individual data
    comments,
    activityLogs,
    
    // Combined data - now memoized
    allEntries,
    
    // State
    loading,
    error,
    isConnected,
    
    // Actions
    addComment,
    deleteComment,
    refreshData,
    
    // Utilities
    config
  }
}

// ============================================================================
// EXAMPLE USAGE CONFIGURATIONS FOR DIFFERENT TABLES
// ============================================================================

// Example 1: For Members Table
export const createMembersConfig = (memberId: number): RealtimeTableConfig => ({
  tableName: 'members',
  recordId: memberId,
  recordIdField: 'member_id',
  messageType: 'member_comment_update', // Listen for comment updates (will also handle activity logs via additional check)
  apiEndpoints: {
    comments: '/api/members/{id}/comments',
    activityLogs: '/api/members/{id}/activity'
  }
  // Optional: Add crudFunctions if you have them
})

// Example 2: For Tickets Table
export const createTicketsConfig = (ticketId: number): RealtimeTableConfig => ({
  tableName: 'tickets',
  recordId: ticketId,
  recordIdField: 'ticket_id',
  messageType: 'ticket_comment_update',
  apiEndpoints: {
    comments: '/api/tickets/{id}/comments',
    activityLogs: '/api/tickets/{id}/activity'
  }
})

// Example 3: For Applicants Table
export const createApplicantsConfig = (applicantId: number): RealtimeTableConfig => ({
  tableName: 'applicants',
  recordId: applicantId,
  recordIdField: 'applicant_id',
  messageType: 'applicant_comment_update',
  apiEndpoints: {
    comments: '/api/applicants/{id}/comments',
    activityLogs: '/api/applicants/{id}/activity'
  }
})



// ============================================================================
// USAGE EXAMPLES IN COMPONENTS
// ============================================================================

/*
// In a Members component:
const { comments, activityLogs, allEntries, loading, addComment } = useRealtimeActivityLogs(
  createMembersConfig(memberId)
)

// In a Tickets component:
const { comments, activityLogs, allEntries, loading, addComment } = useRealtimeActivityLogs(
  createTicketsConfig(ticketId)
)

// In an Applicants component:
const { comments, activityLogs, allEntries, loading, addComment } = useRealtimeActivityLogs(
  createApplicantsConfig(applicantId)
)

// Custom configuration for a specific use case:
const customConfig: RealtimeTableConfig = {
  tableName: 'custom_table',
  recordId: 123,
  recordIdField: 'custom_id',
  messageType: 'custom_update',
  apiEndpoints: {
    comments: '/api/custom/{id}/comments',
    activityLogs: '/api/custom/{id}/activity'
  }
}

const { comments, activityLogs, allEntries } = useRealtimeActivityLogs(customConfig)
*/
