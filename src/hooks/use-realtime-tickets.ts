import { useEffect, useRef, useState, useCallback } from 'react'

interface TicketRecord {
  id: number
  ticket_id: string
  user_id: number
  role_id?: number
  profile_picture?: string
  first_name?: string
  last_name?: string
  employee_id?: string
  [key: string]: unknown
}

interface TicketUpdate {
  type: 'ticket_update'
  data: {
    table: string
    action: 'INSERT' | 'UPDATE' | 'DELETE'
    record: TicketRecord
    old_record?: TicketRecord
    timestamp: string
  }
}

interface UseRealtimeTicketsOptions {
  onTicketCreated?: (ticket: TicketRecord) => void
  onTicketUpdated?: (ticket: TicketRecord, oldTicket?: TicketRecord) => void
  onTicketDeleted?: (ticket: TicketRecord) => void
  autoConnect?: boolean
}

// Singleton WebSocket connection
let globalWebSocket: WebSocket | null = null
const globalCallbacks: Set<(message: TicketUpdate) => void> = new Set()
const globalConnectionState = { isConnected: false, error: null as string | null }

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
    const wsUrl = `${protocol}//${window.location.host}/ws`
    
    console.log('🔄 Creating new WebSocket connection to:', wsUrl)
    globalWebSocket = new WebSocket(wsUrl)

    globalWebSocket.onopen = () => {
      console.log('✅ Global WebSocket connected')
      globalConnectionState.isConnected = true
      globalConnectionState.error = null
    }

    globalWebSocket.onmessage = (event) => {
      try {
        const message: TicketUpdate = JSON.parse(event.data)
        console.log('📨 Global WebSocket received:', message)
        
        // Notify all registered callbacks
        globalCallbacks.forEach(callback => {
          try {
            callback(message)
          } catch (error) {
            console.error('Error in WebSocket callback:', error)
          }
        })
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }

    globalWebSocket.onclose = (event) => {
      console.log('❌ Global WebSocket disconnected:', event.code, event.reason)
      globalConnectionState.isConnected = false
      globalWebSocket = null
      
      // Only reconnect if it wasn't a clean close
      if (event.code !== 1000) {
        setTimeout(() => {
          console.log('🔄 Attempting to reconnect global WebSocket...')
          getOrCreateWebSocket()
        }, 5000)
      }
    }

    globalWebSocket.onerror = (error) => {
      console.error('❌ Global WebSocket error:', error)
      globalConnectionState.error = 'WebSocket connection error'
      globalConnectionState.isConnected = false
    }

    return globalWebSocket
  } catch (error) {
    console.error('Error creating WebSocket:', error)
    globalConnectionState.error = 'Failed to create WebSocket connection'
    return null
  }
}

export function useRealtimeTickets(options: UseRealtimeTicketsOptions = {}) {
  const {
    onTicketCreated,
    onTicketUpdated,
    onTicketDeleted,
    autoConnect = true
  } = options

  const [isConnected, setIsConnected] = useState(globalConnectionState.isConnected)
  const [error, setError] = useState<string | null>(globalConnectionState.error)
  const callbackRef = useRef<((message: TicketUpdate) => void) | null>(null)

  // Create callback function
  const createCallback = useCallback((message: TicketUpdate) => {
    if (message.type === 'ticket_update') {
      const { action, record, old_record } = message.data
      
      switch (action) {
        case 'INSERT':
          onTicketCreated?.(record)
          break
        case 'UPDATE':
          // Refetch the specific ticket to get complete data with profile info
          fetch(`/api/tickets/${record.id}`)
            .then(res => {
              if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`)
              }
              return res.json()
            })
            .then(completeTicket => {
              console.log('Refetched ticket data:', completeTicket)
              console.log('Profile data check:', {
                profile_picture: completeTicket?.profile_picture,
                first_name: completeTicket?.first_name,
                last_name: completeTicket?.last_name,
                user_id: completeTicket?.user_id,
                role_id: completeTicket?.role_id,
                employee_id: completeTicket?.employee_id
              })
              
              // Check if ticket is now IT role (role_id = 1)
              if (completeTicket && completeTicket.role_id === 1) {
                // Ensure we have the complete data with profile info and IT role
                if (completeTicket.profile_picture || completeTicket.first_name || completeTicket.last_name) {
                  console.log('✅ Using complete ticket data with profile info and IT role')
                  
                  // Check if this is a new IT ticket (role_id changed from non-IT to IT)
                  const oldRoleId = old_record?.role_id
                  if (oldRoleId !== 1) {
                    console.log('🆕 Ticket became IT role, adding to UI')
                    onTicketCreated?.(completeTicket)
                  } else {
                    console.log('🔄 Ticket updated (still IT role)')
                    onTicketUpdated?.(completeTicket, old_record)
                  }
                } else {
                  console.warn('❌ Refetched ticket missing profile data, using original data')
                  onTicketUpdated?.(record, old_record)
                }
              } else {
                // Ticket is no longer IT role, should be removed from UI
                console.log('❌ Ticket is no longer IT role (role_id != 1), removing from UI')
                onTicketDeleted?.(record)
              }
            })
            .catch(error => {
              console.error('Error refetching ticket data:', error)
              // Fallback to using the partial data
              onTicketUpdated?.(record, old_record)
            })
          break
        case 'DELETE':
          onTicketDeleted?.(record)
          break
      }
    }
  }, [onTicketCreated, onTicketUpdated, onTicketDeleted])

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
    const updateState = () => {
      setIsConnected(globalConnectionState.isConnected)
      setError(globalConnectionState.error)
    }

    // Update immediately
    updateState()

    // Set up interval to check for changes
    const interval = setInterval(updateState, 1000)

    return () => clearInterval(interval)
  }, [])

  const connect = useCallback(() => {
    getOrCreateWebSocket()
  }, [])

  const disconnect = useCallback(() => {
    if (globalWebSocket) {
      globalWebSocket.close(1000) // Clean close
    }
  }, [])

  return {
    isConnected,
    error,
    connect,
    disconnect
  }
} 