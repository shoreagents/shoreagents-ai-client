import { useEffect, useRef, useState, useCallback } from 'react'

interface BpocJobStatusUpdate {
  type: 'bpoc_job_status_update'
  data: {
    application_id: string
    user_id: string
    job_id: number
    old_status: string
    new_status: string
    timestamp: string
  }
}

interface UseRealtimeBpocJobStatusOptions {
  onJobStatusUpdate?: (update: BpocJobStatusUpdate['data']) => void
  autoConnect?: boolean
}

// Singleton WebSocket connection for BPOC job status updates
let globalBpocJobStatusWebSocket: WebSocket | null = null
let globalBpocJobStatusCallbacks: Set<(message: BpocJobStatusUpdate) => void> = new Set()
let globalBpocJobStatusConnectionState = { isConnected: false, error: null as string | null }

// Global WebSocket management for BPOC job status updates
function getOrCreateBpocJobStatusWebSocket() {
  if (globalBpocJobStatusWebSocket?.readyState === WebSocket.OPEN) {
    return globalBpocJobStatusWebSocket
  }

  if (globalBpocJobStatusWebSocket?.readyState === WebSocket.CONNECTING) {
    return globalBpocJobStatusWebSocket
  }

  // Clean up existing connection
  if (globalBpocJobStatusWebSocket) {
    globalBpocJobStatusWebSocket.close()
    globalBpocJobStatusWebSocket = null
  }

  try {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//${window.location.host}/ws`
    
    console.log('🔄 Creating new BPOC Job Status WebSocket connection to:', wsUrl)
    globalBpocJobStatusWebSocket = new WebSocket(wsUrl)

    globalBpocJobStatusWebSocket.onopen = () => {
      console.log('✅ BPOC Job Status WebSocket connected')
      globalBpocJobStatusConnectionState.isConnected = true
      globalBpocJobStatusConnectionState.error = null
    }

    globalBpocJobStatusWebSocket.onmessage = (event) => {
      try {
        const message: BpocJobStatusUpdate = JSON.parse(event.data)
        console.log('📨 BPOC Job Status WebSocket received:', message)
        
        // Process BPOC job status updates
        if (message.type === 'bpoc_job_status_update') {
          console.log('📨 BPOC Job Status WebSocket received:', message)
          
          // Notify all registered callbacks
          globalBpocJobStatusCallbacks.forEach(callback => {
            try {
              callback(message)
            } catch (error) {
              console.error('Error in BPOC Job Status WebSocket callback:', error)
            }
          })
        }
      } catch (error) {
        console.error('Error parsing BPOC Job Status WebSocket message:', error)
      }
    }

    globalBpocJobStatusWebSocket.onclose = (event) => {
      console.log('❌ BPOC Job Status WebSocket disconnected:', event.code, event.reason)
      globalBpocJobStatusConnectionState.isConnected = false
      globalBpocJobStatusWebSocket = null
      
      // Only reconnect if it wasn't a clean close
      if (event.code !== 1000) {
        setTimeout(() => {
          console.log('🔄 Attempting to reconnect BPOC Job Status WebSocket...')
          getOrCreateBpocJobStatusWebSocket()
        }, 5000)
      }
    }

    globalBpocJobStatusWebSocket.onerror = (error) => {
      console.error('❌ BPOC Job Status WebSocket error:', error)
      globalBpocJobStatusConnectionState.error = 'WebSocket connection error'
      globalBpocJobStatusConnectionState.isConnected = false
    }

    return globalBpocJobStatusWebSocket
  } catch (error) {
    console.error('Error creating BPOC Job Status WebSocket:', error)
    globalBpocJobStatusConnectionState.error = 'Failed to create WebSocket connection'
    return null
  }
}

export function useRealtimeBpocJobStatus(options: UseRealtimeBpocJobStatusOptions = {}) {
  const {
    onJobStatusUpdate,
    autoConnect = true,
  } = options

  const [isConnected, setIsConnected] = useState(globalBpocJobStatusConnectionState.isConnected)
  const [error, setError] = useState<string | null>(globalBpocJobStatusConnectionState.error)
  const callbackRef = useRef<((message: BpocJobStatusUpdate) => void) | null>(null)

  // Create callback function
  const createCallback = useCallback((message: BpocJobStatusUpdate) => {
    console.log('🔍 Real-time BPOC job status callback triggered with message:', message)
    
    if (message.type === 'bpoc_job_status_update') {
      console.log('🔍 Processing BPOC job status update:', message.data)
      onJobStatusUpdate?.(message.data)
    }
  }, [onJobStatusUpdate])

  // Register callback
  useEffect(() => {
    if (autoConnect) {
      callbackRef.current = createCallback
      globalBpocJobStatusCallbacks.add(callbackRef.current)
      
      // Get or create WebSocket connection
      getOrCreateBpocJobStatusWebSocket()
    }

    return () => {
      if (callbackRef.current) {
        globalBpocJobStatusCallbacks.delete(callbackRef.current)
      }
    }
  }, [autoConnect, createCallback])

  // Update local state when global state changes
  useEffect(() => {
    const updateState = () => {
      setIsConnected(globalBpocJobStatusConnectionState.isConnected)
      setError(globalBpocJobStatusConnectionState.error)
    }

    // Update immediately
    updateState()

    // Set up interval to check for changes
    const interval = setInterval(updateState, 1000)

    return () => clearInterval(interval)
  }, [])

  const connect = useCallback(() => {
    getOrCreateBpocJobStatusWebSocket()
  }, [])

  const disconnect = useCallback(() => {
    if (globalBpocJobStatusWebSocket) {
      globalBpocJobStatusWebSocket.close(1000) // Clean close
    }
  }, [])

  return {
    isConnected,
    error,
    connect,
    disconnect
  }
}
