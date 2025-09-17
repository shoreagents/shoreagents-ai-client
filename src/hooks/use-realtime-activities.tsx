"use client"

import { useState, useEffect, useRef, useCallback } from 'react'

// Global state for WebSocket connection
const globalActivitiesConnectionState = {
  isConnected: false,
  error: null as string | null,
}

// Global set of callbacks
const globalActivitiesCallbacks = new Set<(message: ActivityUpdate) => void>()

// Global WebSocket instance
let globalActivitiesWebSocket: WebSocket | null = null

// Activity entry interface (matching the one in activities page)
export interface ActivityEntry {
  id: number
  user_id: number
  today_date: string
  today_active_seconds: number
  today_inactive_seconds: number
  is_currently_active: boolean
  last_session_start: string | null
  created_at: string
  updated_at: string
  first_name: string
  last_name: string
  email: string
  profile_picture: string | null
  department_name: string | null
  is_on_break: boolean
  current_break_type: string | null
  break_start_time: string | null
  pause_time: string | null
  resume_time: string | null
  is_in_meeting: boolean
  meeting_title: string | null
  meeting_type: string | null
  meeting_start_time: string | null
  is_in_event: boolean
  event_title: string | null
  event_location: string | null
  event_start_time: string | null
  event_end_time: string | null
  is_going: boolean | null
  is_back: boolean | null
  going_at: string | null
  back_at: string | null
  is_in_restroom: boolean
  restroom_count: number
  daily_restroom_count: number
  restroom_went_at: string | null
}

// Activity update message interface
export interface ActivityUpdate {
  type: 'activity_update' | 'restroom_status_update' | 'meeting_status_update' | 'event_attendance_update' | 'break_session_update'
  data: {
    table?: string
    action?: 'INSERT' | 'UPDATE' | 'DELETE'
    data?: {
      id: number
      user_id: number
      today_date?: string
      today_active_seconds?: number
      today_inactive_seconds?: number
      is_currently_active?: boolean
      last_session_start?: string | null
      is_in_restroom?: boolean
      restroom_count?: number
      daily_restroom_count?: number
      created_at: string
      updated_at: string
    }
    timestamp?: string
    // Meeting-specific fields
    meeting_id?: number
    agent_user_id?: number
    is_in_meeting?: boolean
    status?: string
    title?: string
    start_time?: string
    end_time?: string
    operation?: string
    // Event attendance fields
    event_id?: number
    is_going?: boolean
    is_back?: boolean
    going_at?: string
    back_at?: string
    event_data?: any
    user_data?: any
    old_data?: any
    new_data?: any
    // Break session fields
    record?: any
    old_record?: any
  }
}

// Hook options interface
export interface UseRealtimeActivitiesOptions {
  onActivityCreated?: (activity: ActivityEntry) => void
  onActivityUpdated?: (activity: ActivityEntry, oldActivity?: ActivityEntry) => void
  onActivityDeleted?: (activity: ActivityEntry) => void
  autoConnect?: boolean
}

// WebSocket connection function
function getOrCreateActivitiesWebSocket() {
  if (globalActivitiesWebSocket && globalActivitiesWebSocket.readyState === WebSocket.OPEN) {
    return globalActivitiesWebSocket
  }

  try {
    console.log('🔌 Creating new WebSocket connection for activities...')
    
    // Determine WebSocket URL based on environment
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = window.location.host
    const wsUrl = `${protocol}//${host}/ws`
    
    console.log('🔌 WebSocket URL:', wsUrl)
    
    const ws = new WebSocket(wsUrl)
    
    ws.onopen = () => {
      console.log('✅ Activities WebSocket connected')
      globalActivitiesConnectionState.isConnected = true
      globalActivitiesConnectionState.error = null
    }
    
    ws.onclose = (event) => {
      console.log('🔌 Activities WebSocket disconnected:', event.code, event.reason)
      globalActivitiesConnectionState.isConnected = false
      globalActivitiesConnectionState.error = null
      
      // Attempt to reconnect after 3 seconds if not a clean close
      if (event.code !== 1000 && globalActivitiesCallbacks.size > 0) {
        setTimeout(() => {
          console.log('🔄 Attempting to reconnect activities WebSocket...')
          globalActivitiesWebSocket = null
          getOrCreateActivitiesWebSocket()
        }, 3000)
      }
    }
    
    ws.onerror = (error) => {
      console.error('❌ Activities WebSocket error:', error)
      globalActivitiesConnectionState.error = 'WebSocket connection error'
    }
    
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as ActivityUpdate
        console.log('📨 Activities WebSocket message received:', message)
        
        // Special logging for meeting messages
        if (message.type === 'meeting_status_update') {
          console.log('🎯 MEETING MESSAGE DETECTED:', message)
        }
        
        // Special logging for event attendance messages
        if (message.type === 'event_attendance_update') {
          console.log('🎯 EVENT ATTENDANCE MESSAGE DETECTED:', message)
        }
        
        // Special logging for break session messages
        if (message.type === 'break_session_update') {
          console.log('🎯 BREAK SESSION MESSAGE DETECTED:', message)
        }
        
        // Process activity, restroom, meeting, event attendance, and break session updates
        if ((message.type === 'activity_update' || message.type === 'restroom_status_update' || message.type === 'meeting_status_update' || message.type === 'event_attendance_update' || message.type === 'break_session_update') && message.data) {
          console.log('✅ Message will be processed by callbacks:', message.type)
          // Call all registered callbacks
          globalActivitiesCallbacks.forEach(callback => {
            try {
              callback(message)
            } catch (error) {
              console.error('❌ Error in activities callback:', error)
            }
          })
        } else {
          console.log('❌ Message not processed:', { type: message.type, hasData: !!message.data })
        }
      } catch (error) {
        console.error('❌ Error parsing activities WebSocket message:', error)
        console.error('❌ Raw message data:', event.data)
      }
    }
    
    globalActivitiesWebSocket = ws
    return ws
  } catch (error) {
    console.error('❌ Failed to create activities WebSocket:', error)
    globalActivitiesConnectionState.error = 'Failed to create WebSocket connection'
    return null
  }
}

export function useRealtimeActivities(options: UseRealtimeActivitiesOptions = {}) {
  const {
    onActivityCreated,
    onActivityUpdated,
    onActivityDeleted,
    autoConnect = true,
  } = options

  const [isConnected, setIsConnected] = useState(globalActivitiesConnectionState.isConnected)
  const [error, setError] = useState<string | null>(globalActivitiesConnectionState.error)
  const callbackRef = useRef<((message: ActivityUpdate) => void) | null>(null)

  // Create callback function
  const createCallback = useCallback((message: ActivityUpdate) => {
    console.log('🔍 Real-time activities callback triggered with message:', message)
    console.log('🔍 Message type:', message.type)
    console.log('🔍 Message data:', message.data)
    
    if ((message.type === 'activity_update' || message.type === 'restroom_status_update' || message.type === 'meeting_status_update' || message.type === 'event_attendance_update' || message.type === 'break_session_update') && message.data) {
      const { action, data } = message.data
      console.log('🔍 Processing update:', { type: message.type, action, data })
      
      // Special logging for restroom status updates
      if (message.type === 'restroom_status_update' && data) {
        console.log('🚽 Restroom status update received:', {
          user_id: data.user_id,
          is_in_restroom: data.is_in_restroom,
          restroom_count: data.restroom_count,
          daily_restroom_count: data.daily_restroom_count,
          action
        })
      }
      
      // Handle meeting status updates differently since they have a different structure
      if (message.type === 'meeting_status_update') {
        // Meeting data is sent directly as the payload, not nested under data.data
        const meetingData = message.data
        console.log('📅 Meeting status update received:', {
          meeting_id: meetingData.meeting_id,
          agent_user_id: meetingData.agent_user_id,
          is_in_meeting: meetingData.is_in_meeting,
          status: meetingData.status,
          title: meetingData.title,
          operation: meetingData.operation
        })
        
        // For meeting updates, we need to refetch activities to get the updated meeting status
        fetch('/api/activities?memberId=all')
          .then(res => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`)
            }
            return res.json()
          })
          .then(completeData => {
            console.log('Refetched activities data for meeting update:', completeData)
            
            // Find the updated activity in the complete data
            const updatedActivity = completeData.activities.find((activity: ActivityEntry) => 
              activity.user_id === meetingData.agent_user_id
            )
            
            if (updatedActivity) {
              console.log('✅ Found updated activity with meeting status:', updatedActivity)
              onActivityUpdated?.(updatedActivity)
            } else {
              console.warn('❌ Updated activity not found in refetched data for user:', meetingData.agent_user_id)
            }
          })
          .catch(error => {
            console.error('Error refetching activities data for meeting update:', error)
          })
        return
      }
      
      // Handle event attendance updates
      if (message.type === 'event_attendance_update') {
        // Event attendance data is sent directly as the payload, not nested under data.data
        const eventData = message.data
        console.log('🎪 Event attendance update received:', {
          event_id: (eventData as any).event_id,
          user_id: (eventData as any).user_id,
          is_going: (eventData as any).is_going,
          is_back: (eventData as any).is_back,
          going_at: (eventData as any).going_at,
          back_at: (eventData as any).back_at,
          type: (eventData as any).type
        })
        
        // For event attendance updates, we need to refetch activities to get the updated event status
        fetch('/api/activities?memberId=all')
          .then(res => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`)
            }
            return res.json()
          })
          .then(completeData => {
            console.log('Refetched activities data for event attendance update:', completeData)
            
            // Find the updated activity in the complete data
            const updatedActivity = completeData.activities.find((activity: ActivityEntry) => 
              activity.user_id === (eventData as any).user_id
            )
            
            if (updatedActivity) {
              console.log('✅ Found updated activity with event status:', updatedActivity)
              onActivityUpdated?.(updatedActivity)
            } else {
              console.warn('❌ Updated activity not found in refetched data for user:', (eventData as any).user_id)
            }
          })
          .catch(error => {
            console.error('Error refetching activities data for event attendance update:', error)
          })
        return
      }
      
      // Handle break session updates
      if (message.type === 'break_session_update') {
        // Break session data is sent directly as the payload, not nested under data.data
        const breakData = message.data
        console.log('☕ Break session update received:', {
          action: breakData.action,
          agent_user_id: (breakData.record as any)?.agent_user_id,
          break_type: (breakData.record as any)?.break_type,
          end_time: (breakData.record as any)?.end_time,
          pause_time: (breakData.record as any)?.pause_time,
          resume_time: (breakData.record as any)?.resume_time
        })
        
        // For break session updates, we need to refetch activities to get the updated break status
        fetch('/api/activities?memberId=all')
          .then(res => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`)
            }
            return res.json()
          })
          .then(completeData => {
            console.log('Refetched activities data for break session update:', completeData)
            
            // Find the updated activity in the complete data
            const updatedActivity = completeData.activities.find((activity: ActivityEntry) => 
              activity.user_id === (breakData.record as any)?.agent_user_id
            )
            
            if (updatedActivity) {
              console.log('✅ Found updated activity with break status:', updatedActivity)
              onActivityUpdated?.(updatedActivity)
            } else {
              console.warn('❌ Updated activity not found in refetched data for user:', (breakData.record as any)?.agent_user_id)
            }
          })
          .catch(error => {
            console.error('Error refetching activities data for break session update:', error)
          })
        return
      }
      
      // Add null check for data
      if (!data) {
        console.warn('🔄 Invalid data received:', data)
        return
      }
      
      // For both activity and restroom updates, we need to refetch the full data to get user information
      if (action === 'UPDATE' || action === 'INSERT') {
        // For restroom status updates, we can be more efficient by only refetching for the specific user
        if (message.type === 'restroom_status_update') {
          // Refetch activities data to get complete information
          fetch('/api/activities?memberId=all')
            .then(res => {
              if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`)
              }
              return res.json()
            })
            .then(completeData => {
              console.log('Refetched activities data for restroom update:', completeData)
              
              // Find the updated activity in the complete data
              const updatedActivity = completeData.activities.find((activity: ActivityEntry) => 
                activity.user_id === data.user_id
              )
              
              if (updatedActivity) {
                console.log('✅ Found updated activity with restroom status:', updatedActivity)
                
                if (action === 'INSERT') {
                  onActivityCreated?.(updatedActivity)
                } else {
                  onActivityUpdated?.(updatedActivity)
                }
              } else {
                console.warn('❌ Updated activity not found in refetched data for user:', data.user_id)
              }
            })
            .catch(error => {
              console.error('Error refetching activities data for restroom update:', error)
            })
        } else {
          // For regular activity updates, use the existing logic
          fetch('/api/activities?memberId=all')
            .then(res => {
              if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`)
              }
              return res.json()
            })
            .then(completeData => {
              console.log('Refetched activities data:', completeData)
              
              // Find the updated activity in the complete data
              const updatedActivity = completeData.activities.find((activity: ActivityEntry) => 
                activity.user_id === data.user_id
              )
              
              if (updatedActivity) {
                console.log('✅ Found updated activity with complete data:', updatedActivity)
                
                if (action === 'INSERT') {
                  onActivityCreated?.(updatedActivity)
                } else {
                  onActivityUpdated?.(updatedActivity)
                }
              } else {
                console.warn('❌ Updated activity not found in refetched data')
              }
            })
            .catch(error => {
              console.error('Error refetching activities data:', error)
              // Fallback to using the partial data
              const activityEntry: ActivityEntry = {
                id: data.id,
                user_id: data.user_id,
                today_date: data.today_date || new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' }),
                today_active_seconds: data.today_active_seconds || 0,
                today_inactive_seconds: data.today_inactive_seconds || 0,
                is_currently_active: data.is_currently_active || false,
                last_session_start: data.last_session_start || null,
                created_at: data.created_at,
                updated_at: data.updated_at,
                first_name: '',
                last_name: '',
                email: '',
                profile_picture: null,
                department_name: null,
              is_on_break: false,
              current_break_type: null,
              break_start_time: null,
              pause_time: null,
              resume_time: null,
                is_in_meeting: false,
                meeting_title: null,
                meeting_type: null,
                meeting_start_time: null,
                is_in_event: false,
                event_title: null,
                event_location: null,
                event_start_time: null,
                event_end_time: null,
                is_going: null,
                is_back: null,
                going_at: null,
                back_at: null,
                is_in_restroom: data.is_in_restroom || false,
                restroom_count: data.restroom_count || 0,
                daily_restroom_count: data.daily_restroom_count || 0,
                restroom_went_at: null
              }
              
              if (action === 'INSERT') {
                onActivityCreated?.(activityEntry)
              } else {
                onActivityUpdated?.(activityEntry)
              }
            })
        }
      } else if (action === 'DELETE') {
        // For deletes, we can use the basic data
        const activityEntry: ActivityEntry = {
          id: data.id,
          user_id: data.user_id,
          today_date: data.today_date || new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' }),
          today_active_seconds: data.today_active_seconds || 0,
          today_inactive_seconds: data.today_inactive_seconds || 0,
          is_currently_active: data.is_currently_active || false,
          last_session_start: data.last_session_start || null,
          created_at: data.created_at,
          updated_at: data.updated_at,
          first_name: '',
          last_name: '',
          email: '',
          profile_picture: null,
          department_name: null,
              is_on_break: false,
              current_break_type: null,
              break_start_time: null,
              pause_time: null,
              resume_time: null,
          is_in_meeting: false,
          meeting_title: null,
          meeting_type: null,
          meeting_start_time: null,
          is_in_event: false,
          event_title: null,
          event_location: null,
          event_start_time: null,
          event_end_time: null,
          is_going: null,
          is_back: null,
          going_at: null,
          back_at: null,
          is_in_restroom: data.is_in_restroom || false,
          restroom_count: data.restroom_count || 0,
          daily_restroom_count: data.daily_restroom_count || 0,
          restroom_went_at: null
        }
        
        onActivityDeleted?.(activityEntry)
      }
    }
  }, [onActivityCreated, onActivityUpdated, onActivityDeleted])

  // Register callback
  useEffect(() => {
    if (autoConnect) {
      callbackRef.current = createCallback
      globalActivitiesCallbacks.add(callbackRef.current)
      
      // Get or create WebSocket connection
      getOrCreateActivitiesWebSocket()
    }

    return () => {
      if (callbackRef.current) {
        globalActivitiesCallbacks.delete(callbackRef.current)
      }
    }
  }, [autoConnect, createCallback])

  // Update local state when global state changes
  useEffect(() => {
    const updateState = () => {
      setIsConnected(globalActivitiesConnectionState.isConnected)
      setError(globalActivitiesConnectionState.error)
    }

    // Update immediately
    updateState()

    // Set up interval to check for changes
    const interval = setInterval(updateState, 1000)

    return () => clearInterval(interval)
  }, [])

  const connect = useCallback(() => {
    getOrCreateActivitiesWebSocket()
  }, [])

  const disconnect = useCallback(() => {
    if (globalActivitiesWebSocket) {
      globalActivitiesWebSocket.close(1000, 'Manual disconnect')
      globalActivitiesWebSocket = null
    }
  }, [])

  return {
    isConnected,
    error,
    connect,
    disconnect,
  }
}