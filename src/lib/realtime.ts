import { Pool, Client } from 'pg'
import { WebSocketServer } from 'ws'
import { NextApiRequest } from 'next'
import { NextApiResponse } from 'next'

// Create a separate client for listening to notifications
const notificationClient = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

let wss: WebSocketServer | null = null
let isListening = false

// Initialize WebSocket server
export function initializeWebSocketServer(server: any) {
  if (wss) return wss

  wss = new WebSocketServer({ server })
  
  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket')
    
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket')
    })
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error)
    })
  })
  
  return wss
}

// Start listening to PostgreSQL notifications
export async function startListening() {
  if (isListening) return
  
  try {
    await notificationClient.connect()
    console.log('Connected to PostgreSQL for notifications')
    
    // Listen for ticket changes
    await notificationClient.query('LISTEN ticket_changes')
    
    notificationClient.on('notification', (msg: any) => {
      try {
        const payload = JSON.parse(msg.payload)
        console.log('Received notification:', payload)
        
        // Broadcast to all connected WebSocket clients
        if (wss) {
          wss.clients.forEach((client) => {
            if (client.readyState === 1) { // WebSocket.OPEN
              client.send(JSON.stringify({
                type: 'ticket_update',
                data: payload
              }))
            }
          })
        }
      } catch (error) {
        console.error('Error parsing notification:', error)
      }
    })
    
    isListening = true
    console.log('Started listening for PostgreSQL notifications')
  } catch (error) {
    console.error('Error starting notification listener:', error)
  }
}

// Stop listening to notifications
export async function stopListening() {
  try {
    await notificationClient.query('UNLISTEN ticket_changes')
    await notificationClient.end()
    isListening = false
    console.log('Stopped listening for PostgreSQL notifications')
  } catch (error) {
    console.error('Error stopping notification listener:', error)
  }
}

// Get WebSocket server instance
export function getWebSocketServer() {
  return wss
}

// Check if listening
export function isListeningToNotifications() {
  return isListening
} 