import { useEffect, useRef, useState, useCallback } from 'react'

interface MemberUpdate {
  type: 'member_update' | 'agent_update' | 'client_update' | 'client_assignment_update' | 'personal_info_update' | 'job_info_update' | 'member_activity_update'
  data: {
    table: string
    action: 'INSERT' | 'UPDATE' | 'DELETE'
    record: any
    old_record?: any
    timestamp: string
  }
}

interface UseRealtimeMembersOptions {
  onMemberCreated?: (member: any) => void
  onMemberUpdated?: (member: any, oldMember?: any) => void
  onMemberDeleted?: (member: any) => void
  onAgentMemberChanged?: (agent: any, oldAgent?: any, notificationData?: any) => void
  onClientMemberChanged?: (client: any, oldClient?: any, notificationData?: any) => void
  onPersonalInfoChanged?: (personalInfo: any, oldPersonalInfo?: any, notificationData?: any) => void
  onJobInfoChanged?: (jobInfo: any, oldJobInfo?: any, notificationData?: any) => void
  autoConnect?: boolean
}

// Singleton WebSocket connection
let globalWebSocket: WebSocket | null = null
let globalCallbacks: Set<(message: MemberUpdate) => void> = new Set()
let globalConnectionState = { isConnected: false, error: null as string | null }

// Global WebSocket management
function getOrCreateWebSocket() {
  if (globalWebSocket?.readyState === WebSocket.OPEN) {
    return globalWebSocket
  }

  if (globalWebSocket?.readyState === WebSocket.CONNECTING) {
    return globalWebSocket
  }

  // Clean up existing connection
  if (globalWebSocket) {
    globalWebSocket.close()
    globalWebSocket = null
  }

  try {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    // Use window.location.host which includes port if present
    const wsUrl = `${protocol}//${window.location.host}/ws`
    
    console.log('🔄 Creating new WebSocket connection for members to:', wsUrl)
    globalWebSocket = new WebSocket(wsUrl)

    globalWebSocket.onopen = () => {
      console.log('✅ Global WebSocket connected for members')
      globalConnectionState.isConnected = true
      globalConnectionState.error = null
    }

    globalWebSocket.onmessage = (event) => {
      try {
        const message: MemberUpdate = JSON.parse(event.data)
        console.log('📨 Global WebSocket received member update:', message)
        console.log('📨 Raw WebSocket data:', event.data)
        
        // Only process member-related updates
        if (message.type === 'member_update' || message.type === 'agent_update' || message.type === 'client_update' || message.type === 'client_assignment_update' || message.type === 'personal_info_update' || message.type === 'job_info_update' || message.type === 'member_activity_update') {
          console.log('✅ Processing member-related update:', message.type)
          // Notify all registered callbacks
          globalCallbacks.forEach(callback => {
            try {
              callback(message)
            } catch (error) {
              console.error('Error in WebSocket callback:', error)
            }
          })
        } else {
          console.log('❌ Ignoring non-member update:', message.type)
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }

    globalWebSocket.onclose = (event) => {
      console.log('❌ Global WebSocket disconnected for members:', event.code, event.reason)
      globalConnectionState.isConnected = false
      globalWebSocket = null
      
      // Only reconnect if it wasn't a clean close
      if (event.code !== 1000) {
        setTimeout(() => {
          console.log('🔄 Attempting to reconnect global WebSocket for members...')
          getOrCreateWebSocket()
        }, 5000)
      }
    }

    globalWebSocket.onerror = (error) => {
      console.error('❌ Global WebSocket error for members:', error)
      globalConnectionState.error = 'WebSocket connection error'
      globalConnectionState.isConnected = false
    }

    return globalWebSocket
  } catch (error) {
    console.error('Error creating WebSocket for members:', error)
    globalConnectionState.error = 'Failed to create WebSocket connection'
    return null
  }
}

export function useRealtimeMembers(options: UseRealtimeMembersOptions = {}) {
  const {
    onMemberCreated,
    onMemberUpdated,
    onMemberDeleted,
    onAgentMemberChanged,
    onClientMemberChanged,
    onPersonalInfoChanged,
    onJobInfoChanged,
    autoConnect = true,
  } = options

  const [isConnected, setIsConnected] = useState(globalConnectionState.isConnected)
  const [error, setError] = useState<string | null>(globalConnectionState.error)
  const callbackRef = useRef<((message: MemberUpdate) => void) | null>(null)

  // Create callback function
  const createCallback = useCallback((message: MemberUpdate) => {
    console.log('🔍 Real-time member callback triggered with message:', message)
    
    if (message.type === 'member_update') {
      const { action, record, old_record } = message.data
      console.log('🔍 Processing member update:', { action, record, old_record })
      
      switch (action) {
        case 'INSERT':
          console.log('🆕 New member created:', record)
          onMemberCreated?.(record)
          break
        case 'UPDATE':
          console.log('📝 Member updated:', record, 'Old:', old_record)
          onMemberUpdated?.(record, old_record)
          break
        case 'DELETE':
          console.log('🗑️ Member deleted:', old_record)
          onMemberDeleted?.(old_record)
          break
      }
    } else if (message.type === 'agent_update') {
      const { action, record, old_record } = message.data
      console.log('🔍 Processing agent update:', { action, record, old_record })
      
      // For agent updates, always call the callback regardless of what changed
      if (action === 'UPDATE') {
        console.log('🔄 Agent updated:', record, 'Old:', old_record)
        onAgentMemberChanged?.(record, old_record, message.data)
      }
    } else if (message.type === 'client_assignment_update') {
      const { action, record, old_record } = message.data
      console.log('🔍 Processing client assignment update:', { action, record, old_record })
      
      // This is specifically for client member assignment changes
      if (action === 'UPDATE' && old_record && 
          record.member_id !== old_record.member_id) {
        console.log('🔄 Client member changed:', record, 'Old member_id:', old_record.member_id, 'New member_id:', record.member_id)
        onClientMemberChanged?.(record, old_record, message.data)
      }
    } else if (message.type === 'personal_info_update') {
      const { action, record, old_record } = message.data
      console.log('🔍 Processing personal info update:', { action, record, old_record })
      
      if (action === 'UPDATE') {
        console.log('🔄 Personal info updated:', record, 'Old:', old_record)
        onPersonalInfoChanged?.(record, old_record, message.data)
      }
    } else if (message.type === 'job_info_update') {
      const { action, record, old_record } = message.data
      console.log('🔍 Processing job info update:', { action, record, old_record })
      
      if (action === 'UPDATE') {
        console.log('🔄 Job info updated:', record, 'Old:', old_record)
        onJobInfoChanged?.(record, old_record, message.data)
      }
    } else if (message.type === 'member_activity_update') {
      const { action, record, old_record } = message.data
      console.log('🔍 Processing member activity update:', { action, record, old_record })
      
      // Activity updates are typically INSERT operations for new activity logs
      if (action === 'INSERT') {
        console.log('🔄 New member activity logged:', record)
        // You can add a callback for activity updates if needed
        // onMemberActivityChanged?.(record, old_record, message.data)
      }
    }
      }, [onMemberCreated, onMemberUpdated, onMemberDeleted, onAgentMemberChanged, onClientMemberChanged, onPersonalInfoChanged, onJobInfoChanged])

  // Register callback
  useEffect(() => {
    if (autoConnect) {
      callbackRef.current = createCallback
      globalCallbacks.add(callbackRef.current)
      
      // Get or create WebSocket connection
      getOrCreateWebSocket()
    }

    return () => {
      if (callbackRef.current) {
        globalCallbacks.delete(callbackRef.current)
      }
    }
  }, [autoConnect, createCallback])

  // Update local state when global state changes
  useEffect(() => {
    const handleStateChange = () => {
      setIsConnected(globalConnectionState.isConnected)
      setError(globalConnectionState.error)
    }

    // Set initial state
    handleStateChange()

    // Listen for state changes
    const interval = setInterval(handleStateChange, 1000)

    return () => clearInterval(interval)
  }, [])

  // Manual connection control
  const connect = useCallback(() => {
    getOrCreateWebSocket()
  }, [])

  const disconnect = useCallback(() => {
    if (globalWebSocket) {
      globalWebSocket.close()
    }
  }, [])

  return {
    isConnected,
    error,
    connect,
    disconnect,
  }
}
