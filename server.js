const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { WebSocketServer } = require('ws')
const { Pool, Client } = require('pg')
const path = require('path')

// Load environment variables from .env.local
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') })

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

// Create Next.js app
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

// PostgreSQL notification client for main database
const notificationClient = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})



let wss = null
let isListening = false

// Start listening to PostgreSQL notifications
async function startListening() {
  console.log('🚀 startListening() function called!')
  
  if (isListening) {
    console.log('⚠️ Already listening, returning early')
    return
  }
  
  try {
    console.log('🔄 Starting notification listeners...')
    console.log('🔍 NODE_ENV:', process.env.NODE_ENV)
    console.log('🔍 BPOC_DATABASE_URL exists:', !!process.env.BPOC_DATABASE_URL)
    
    // Connect to main database
    console.log('🔄 Connecting to main database...')
    await notificationClient.connect()
    console.log('✅ Connected to main PostgreSQL for notifications')
    
    // Listen for main database changes
    await notificationClient.query('LISTEN ticket_changes')
    await notificationClient.query('LISTEN applicant_changes')
    await notificationClient.query('LISTEN member_changes')
    await notificationClient.query('LISTEN member_comment_changes')
    await notificationClient.query('LISTEN member_activity_changes')
    await notificationClient.query('LISTEN agent_assignment_changes')
    await notificationClient.query('LISTEN client_assignment_changes')
    await notificationClient.query('LISTEN talent_pool_changes')
    await notificationClient.query('LISTEN personal_info_changes')
    await notificationClient.query('LISTEN job_info_changes')
    await notificationClient.query('LISTEN break_sessions_changes')

    // Connect to BPOC database for job status notifications
    if (process.env.BPOC_DATABASE_URL) {
      try {
        console.log('🔄 Connecting to BPOC database...')
        const bpocNotificationClient = new Client({
          connectionString: process.env.BPOC_DATABASE_URL,
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        })
        
        await bpocNotificationClient.connect()
        console.log('✅ Connected to BPOC PostgreSQL for notifications')
        
        // Listen for BPOC database changes
        await bpocNotificationClient.query('LISTEN bpoc_job_status_changes')
        
        // Handle BPOC database notifications
        bpocNotificationClient.on('notification', (msg) => {
          try {
            const payload = JSON.parse(msg.payload)
            console.log('Received BPOC database notification:', payload)
            
            // Broadcast BPOC job status updates to all WebSocket clients
            if (wss) {
              const message = JSON.stringify({
                type: 'bpoc_job_status_update',
                data: payload
              })
              console.log('Broadcasting BPOC job status message:', message)
              
              wss.clients.forEach((client) => {
                if (client.readyState === 1) { // WebSocket.OPEN
                  client.send(message)
                }
              })
            }
          } catch (error) {
            console.error('Error parsing BPOC database notification:', error)
          }
        })
        
        console.log('✅ BPOC database notification listener started')
      } catch (bpocError) {
        console.warn('⚠️ Failed to connect to BPOC database for notifications:', bpocError)
        console.log('⚠️ Continuing without BPOC database notifications - job status updates will not be real-time')
      }
    } else {
      console.log('⚠️ BPOC_DATABASE_URL not set - job status updates will not be real-time')
    }
    
    // Handle main database notifications
    notificationClient.on('notification', (msg) => {
      try {
        const payload = JSON.parse(msg.payload)
        console.log('Received main database notification:', payload)
        
        // Determine message type based on channel
        let messageType = 'ticket_update'
        if (msg.channel === 'applicant_changes') {
          messageType = 'applicant_update'
        } else if (msg.channel === 'member_changes') {
          messageType = 'member_update'
        } else if (msg.channel === 'member_detail_changes') {
          messageType = 'member_comment_update'
        } else if (msg.channel === 'member_comment_changes') {
          messageType = 'member_comment_update'
        } else if (msg.channel === 'member_activity_changes') {
          messageType = 'member_activity_update'
        } else if (msg.channel === 'agent_assignment_changes') {
          messageType = 'agent_update'
        } else if (msg.channel === 'client_assignment_changes') {
          messageType = 'client_update'
        } else if (msg.channel === 'talent_pool_changes') {
          messageType = 'talent_pool_update'
        } else if (msg.channel === 'personal_info_changes') {
          messageType = 'personal_info_update'
        } else if (msg.channel === 'job_info_changes') {
          messageType = 'job_info_update'
        } else if (msg.channel === 'break_sessions_changes') {
          messageType = 'break_session_update'
        }
        
        // Broadcast to all connected WebSocket clients
        if (wss) {
          const message = JSON.stringify({
            type: messageType,
            data: payload
          })
          console.log('Broadcasting main database message:', message)
          
          wss.clients.forEach((client) => {
            if (client.readyState === 1) { // WebSocket.OPEN
              client.send(message)
            }
          })
        }
      } catch (error) {
        console.error('Error parsing main database notification:', error)
      }
    })
    
    
    
    isListening = true
    console.log('✅ Started listening for PostgreSQL notifications (main + BPOC databases)')
  } catch (error) {
    console.error('Error starting notification listener:', error)
    console.log('⚠️ Continuing without database notifications - WebSocket server will still work')
  }
}

app.prepare().then(() => {
  console.log('🚀 Next.js app prepared, starting server...')
  
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      
      // Handle API routes and other Next.js routes
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  console.log('🔧 HTTP server created, initializing WebSocket...')

  // Initialize WebSocket server with path
  try {
    wss = new WebSocketServer({ 
      server,
      path: '/ws'
    })
    console.log('✅ WebSocket server initialized')
    
    wss.on('connection', (ws) => {
      console.log('Client connected to WebSocket')
      
      // Send a ping every 30 seconds to keep connection alive
      const pingInterval = setInterval(() => {
        if (ws.readyState === 1) { // WebSocket.OPEN
          ws.ping()
        }
      }, 30000)
      
      ws.on('pong', () => {
        // Client responded to ping
      })
      
      ws.on('close', () => {
        console.log('Client disconnected from WebSocket')
        clearInterval(pingInterval)
      })
      
      ws.on('error', (error) => {
        console.error('WebSocket error:', error)
        clearInterval(pingInterval)
      })
    })
    
    console.log('✅ WebSocket event handlers attached')
  } catch (wsError) {
    console.error('❌ Error initializing WebSocket server:', wsError)
  }

  console.log('🔄 About to call startListening()...')
  
  // Start listening to PostgreSQL notifications
  try {
    startListening()
    console.log('✅ startListening() called successfully')
  } catch (startError) {
    console.error('❌ Error calling startListening():', startError)
  }

  console.log(`🔄 About to start server listening on port ${port}...`)
  
  server.listen(port, (err) => {
    if (err) {
      console.error('❌ Error starting server:', err)
      throw err
    }
    console.log(`✅ Server listening on http://${hostname}:${port}`)
    console.log('🎯 Server startup sequence completed!')
  })
}).catch((error) => {
  console.error('❌ Error in app.prepare():', error)
}) 