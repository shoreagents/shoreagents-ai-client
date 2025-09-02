"use client"

import { useState, useEffect, useRef, useCallback } from 'react'

// Global state for WebSocket connection
const globalBreaksConnectionState = {
  isConnected: false,
  error: null as string | null,
}

// Global set of callbacks
const globalBreaksCallbacks = new Set<(message: BreakSessionUpdate) => void>()

// Global WebSocket instance
let globalBreaksWebSocket: WebSocket | null = null

// Break session interface
export interface BreakSession {
  id: number
  agent_user_id: number
  break_type: 'Morning' | 'Lunch' | 'Afternoon' | 'NightFirst' | 'NightMeal' | 'NightSecond'
  start_time: string
  end_time: string | null
  duration_minutes: number | null
  created_at: string
  pause_time: string | null
  resume_time: string | null
  pause_used: boolean
  time_remaining_at_pause: number | null
  break_date: string
  updated_at: string
  // Joined data (now provided by database trigger)
  first_name: string | null
  last_name: string | null
  profile_picture: string | null
  email: string | null
  department_name: string | null
}

// Break session update message interface
export interface BreakSessionUpdate {
  type: 'break_session_update'
  data: {
    table: string
    action: 'INSERT' | 'UPDATE' | 'DELETE'
    record: BreakSession
    old_record?: BreakSession
    timestamp: string
  }
}

// Hook options interface
export interface UseRealtimeBreaksOptions {
  onBreakSessionCreated?: (breakSession: BreakSession) => void
  onBreakSessionUpdated?: (breakSession: BreakSession, oldBreakSession?: BreakSession) => void
  onBreakSessionDeleted?: (breakSession: BreakSession) => void
  autoConnect?: boolean
}

// WebSocket connection function
function getOrCreateBreaksWebSocket() {
  if (globalBreaksWebSocket && globalBreaksWebSocket.readyState === WebSocket.OPEN) {
    return globalBreaksWebSocket
  }

  try {
    console.log('🔌 Creating new WebSocket connection for breaks...')
    
    // Determine WebSocket URL based on environment
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = window.location.host
    const wsUrl = `${protocol}//${host}/ws`
    
    console.log('🔌 WebSocket URL:', wsUrl)
    
    const ws = new WebSocket(wsUrl)
    
    ws.onopen = () => {
      console.log('✅ Breaks WebSocket connected')
      globalBreaksConnectionState.isConnected = true
      globalBreaksConnectionState.error = null
    }
    
    ws.onclose = (event) => {
      console.log('🔌 Breaks WebSocket disconnected:', event.code, event.reason)
      globalBreaksConnectionState.isConnected = false
      globalBreaksConnectionState.error = null
      
      // Attempt to reconnect after 3 seconds if not a clean close
      if (event.code !== 1000 && globalBreaksCallbacks.size > 0) {
        setTimeout(() => {
          console.log('🔄 Attempting to reconnect breaks WebSocket...')
          globalBreaksWebSocket = null
          getOrCreateBreaksWebSocket()
        }, 3000)
      }
    }
    
    ws.onerror = (error) => {
      console.error('❌ Breaks WebSocket error:', error)
      globalBreaksConnectionState.error = 'WebSocket connection error'
    }
    
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as BreakSessionUpdate
        console.log('📨 Breaks WebSocket message received:', message)
        
        // Only process break session updates
        if (message.type === 'break_session_update' && message.data) {
          // Call all registered callbacks
          globalBreaksCallbacks.forEach(callback => {
            try {
              callback(message)
            } catch (error) {
              console.error('❌ Error in breaks callback:', error)
            }
          })
        }
      } catch (error) {
        console.error('❌ Error parsing breaks WebSocket message:', error)
        console.error('❌ Raw message data:', event.data)
      }
    }
    
    globalBreaksWebSocket = ws
    return ws
  } catch (error) {
    console.error('❌ Failed to create breaks WebSocket:', error)
    globalBreaksConnectionState.error = 'Failed to create WebSocket connection'
    return null
  }
}

export function useRealtimeBreaks(options: UseRealtimeBreaksOptions = {}) {
  const {
    onBreakSessionCreated,
    onBreakSessionUpdated,
    onBreakSessionDeleted,
    autoConnect = true,
  } = options

  const [isConnected, setIsConnected] = useState(globalBreaksConnectionState.isConnected)
  const [error, setError] = useState<string | null>(globalBreaksConnectionState.error)
  const callbackRef = useRef<((message: BreakSessionUpdate) => void) | null>(null)

  // Create callback function
  const createCallback = useCallback((message: BreakSessionUpdate) => {
    console.log('🔍 Real-time breaks callback triggered with message:', message)
    
    if (message.type === 'break_session_update' && message.data) {
      const { action, record, old_record } = message.data
      console.log('🔍 Processing break session update:', { action, record, old_record })
      
      // Add null check for record
      if (!record) {
        console.warn('🔄 Invalid break session record received:', record)
        return
      }
      
      switch (action) {
        case 'INSERT':
          console.log('🆕 New break session created:', record)
          onBreakSessionCreated?.(record)
          break
        case 'UPDATE':
          console.log('📝 Break session updated:', record, 'Old:', old_record)
          console.log('🔍 Calling onBreakSessionUpdated callback...')
          onBreakSessionUpdated?.(record, old_record)
          console.log('🔍 onBreakSessionUpdated callback completed')
          break
        case 'DELETE':
          console.log('🗑️ Break session deleted:', record)
          onBreakSessionDeleted?.(record)
          break
      }
    }
  }, [onBreakSessionCreated, onBreakSessionUpdated, onBreakSessionDeleted])

  // Register callback
  useEffect(() => {
    if (autoConnect) {
      callbackRef.current = createCallback
      globalBreaksCallbacks.add(callbackRef.current)
      
      // Get or create WebSocket connection
      getOrCreateBreaksWebSocket()
    }

    return () => {
      if (callbackRef.current) {
        globalBreaksCallbacks.delete(callbackRef.current)
      }
    }
  }, [autoConnect, createCallback])

  // Update local state when global state changes
  useEffect(() => {
    const updateState = () => {
      setIsConnected(globalBreaksConnectionState.isConnected)
      setError(globalBreaksConnectionState.error)
    }

    // Update immediately
    updateState()

    // Set up interval to check for changes
    const interval = setInterval(updateState, 1000)

    return () => clearInterval(interval)
  }, [])

  const connect = useCallback(() => {
    getOrCreateBreaksWebSocket()
  }, [])

  const disconnect = useCallback(() => {
    if (globalBreaksWebSocket) {
      globalBreaksWebSocket.close(1000, 'Manual disconnect')
      globalBreaksWebSocket = null
    }
  }, [])

  return {
    isConnected,
    error,
    connect,
    disconnect,
  }
}
