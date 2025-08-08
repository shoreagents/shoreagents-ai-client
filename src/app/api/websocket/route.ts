import { NextRequest, NextResponse } from 'next/server'
import { initializeWebSocketServer, startListening } from '@/lib/realtime'

export async function GET(request: NextRequest) {
  // This route is for WebSocket upgrade
  // The actual WebSocket handling is done in the realtime.ts file
  return NextResponse.json({ message: 'WebSocket endpoint' })
}

// Handle WebSocket upgrade
export async function POST(request: NextRequest) {
  try {
    // Initialize WebSocket server if not already done
    const server = (request as any).socket?.server
    if (server) {
      initializeWebSocketServer(server)
      await startListening()
    }
    
    return NextResponse.json({ message: 'WebSocket server initialized' })
  } catch (error) {
    console.error('Error initializing WebSocket:', error)
    return NextResponse.json(
      { error: 'Failed to initialize WebSocket' },
      { status: 500 }
    )
  }
} 