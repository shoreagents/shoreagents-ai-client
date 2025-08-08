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

// PostgreSQL notification client
const notificationClient = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

let wss = null
let isListening = false

// Start listening to PostgreSQL notifications
async function startListening() {
  if (isListening) return
  
  try {
    await notificationClient.connect()
    console.log('Connected to PostgreSQL for notifications')
    
    // Listen for ticket changes
    await notificationClient.query('LISTEN ticket_changes')
    
    notificationClient.on('notification', (msg) => {
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

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  // Initialize WebSocket server with path
  wss = new WebSocketServer({ 
    server,
    path: '/ws'
  })
  
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

  // Start listening to PostgreSQL notifications
  startListening()

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
}) 