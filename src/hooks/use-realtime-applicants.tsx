import { useEffect, useRef, useState, useCallback } from 'react'

interface ApplicantUpdate {
  type: 'applicant_update'
  data: {
    table: string
    action: 'INSERT' | 'UPDATE' | 'DELETE'
    record: any
    old_record?: any
    timestamp: string
  }
}



interface UseRealtimeApplicantsOptions {
  onApplicantCreated?: (applicant: any) => void
  onApplicantUpdated?: (applicant: any, oldApplicant?: any) => void
  onApplicantDeleted?: (applicant: any) => void
  autoConnect?: boolean
}

// Singleton WebSocket connection for applicants
let globalApplicantsWebSocket: WebSocket | null = null
let globalApplicantsCallbacks: Set<(message: ApplicantUpdate) => void> = new Set()
let globalApplicantsConnectionState = { isConnected: false, error: null as string | null }

// Global WebSocket management for applicants
function getOrCreateApplicantsWebSocket() {
  if (globalApplicantsWebSocket?.readyState === WebSocket.OPEN) {
    return globalApplicantsWebSocket
  }

  if (globalApplicantsWebSocket?.readyState === WebSocket.CONNECTING) {
    return globalApplicantsWebSocket
  }

  // Clean up existing connection
  if (globalApplicantsWebSocket) {
    globalApplicantsWebSocket.close()
    globalApplicantsWebSocket = null
  }

  try {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//${window.location.host}/ws`
    
    console.log('🔄 Creating new Applicants WebSocket connection to:', wsUrl)
    globalApplicantsWebSocket = new WebSocket(wsUrl)

    globalApplicantsWebSocket.onopen = () => {
      console.log('✅ Applicants WebSocket connected')
      globalApplicantsConnectionState.isConnected = true
      globalApplicantsConnectionState.error = null
    }

    globalApplicantsWebSocket.onmessage = (event) => {
      try {
        const message: ApplicantUpdate = JSON.parse(event.data)
        
        // Process applicant updates
        if (message.type === 'applicant_update') {
          console.log('📨 Applicants WebSocket received:', message)
          
          // Notify all registered callbacks
          globalApplicantsCallbacks.forEach(callback => {
            try {
              callback(message)
            } catch (error) {
              console.error('Error in Applicants WebSocket callback:', error)
            }
          })
        }
        

      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }

    globalApplicantsWebSocket.onclose = (event) => {
      console.log('❌ Applicants WebSocket disconnected:', event.code, event.reason)
      globalApplicantsConnectionState.isConnected = false
      globalApplicantsWebSocket = null
      
      // Only reconnect if it wasn't a clean close
      if (event.code !== 1000) {
        setTimeout(() => {
          console.log('🔄 Attempting to reconnect Applicants WebSocket...')
          getOrCreateApplicantsWebSocket()
        }, 5000)
      }
    }

    globalApplicantsWebSocket.onerror = (error) => {
      console.error('❌ Applicants WebSocket error:', error)
      globalApplicantsConnectionState.error = 'WebSocket connection error'
      globalApplicantsConnectionState.isConnected = false
    }

    return globalApplicantsWebSocket
  } catch (error) {
    console.error('Error creating Applicants WebSocket:', error)
    globalApplicantsConnectionState.error = 'Failed to create WebSocket connection'
    return null
  }
}

export function useRealtimeApplicants(options: UseRealtimeApplicantsOptions = {}) {
  const {
    onApplicantCreated,
    onApplicantUpdated,
    onApplicantDeleted,
    autoConnect = true,
  } = options

  const [isConnected, setIsConnected] = useState(globalApplicantsConnectionState.isConnected)
  const [error, setError] = useState<string | null>(globalApplicantsConnectionState.error)
  const callbackRef = useRef<((message: ApplicantUpdate) => void) | null>(null)

  // Create callback function
  const createCallback = useCallback((message: ApplicantUpdate) => {
    console.log('🔍 Real-time callback triggered with message:', message)
    
    if (message.type === 'applicant_update') {
      const { action, record, old_record } = message.data
      console.log('🔍 Processing applicant update:', { action, record, old_record })
      
      switch (action) {
        case 'INSERT':
          console.log('🆕 New applicant created:', record)
          onApplicantCreated?.(record)
          break
        case 'UPDATE':
          console.log('📝 Applicant updated:', record, 'Old:', old_record)
          console.log('🔍 Calling onApplicantUpdated callback...')
          onApplicantUpdated?.(record, old_record)
          console.log('🔍 onApplicantUpdated callback completed')
          break
        case 'DELETE':
          console.log('🗑️ Applicant deleted:', record)
          onApplicantDeleted?.(record)
          break
      }
    }
  }, [onApplicantCreated, onApplicantUpdated, onApplicantDeleted])

  // Register callback
  useEffect(() => {
    if (autoConnect) {
      callbackRef.current = createCallback
      globalApplicantsCallbacks.add(callbackRef.current)
      
      // Get or create WebSocket connection
      getOrCreateApplicantsWebSocket()
    }

    return () => {
      if (callbackRef.current) {
        globalApplicantsCallbacks.delete(callbackRef.current)
      }
    }
  }, [autoConnect, createCallback])



  // Update local state when global state changes
  useEffect(() => {
    const updateState = () => {
      setIsConnected(globalApplicantsConnectionState.isConnected)
      setError(globalApplicantsConnectionState.error)
    }

    // Update immediately
    updateState()

    // Set up interval to check for changes
    const interval = setInterval(updateState, 1000)

    return () => clearInterval(interval)
  }, [])

  const connect = useCallback(() => {
    getOrCreateApplicantsWebSocket()
  }, [])

  const disconnect = useCallback(() => {
    if (globalApplicantsWebSocket) {
      globalApplicantsWebSocket.close(1000) // Clean close
    }
  }, [])

  return {
    isConnected,
    error,
    connect,
    disconnect
  }
}
