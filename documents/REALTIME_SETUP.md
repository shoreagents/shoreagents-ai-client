# Real-Time PostgreSQL Notifications Setup

This guide explains how to set up real-time notifications for your tickets system using PostgreSQL's `NOTIFY` and `LISTEN` functionality.

## Overview

The real-time system consists of:
1. **PostgreSQL Triggers** - Automatically send notifications when tickets are modified
2. **WebSocket Server** - Receives notifications and broadcasts to connected clients
3. **React Hook** - Manages WebSocket connections and provides real-time updates to components

## Setup Instructions

### 1. Apply Database Schema

Run the script to add notification triggers to your database:

```bash
npm run apply-realtime
```

This will create:
- `notify_ticket_change()` function
- Triggers for INSERT, UPDATE, and DELETE operations
- Notification channel: `ticket_changes`

### 2. Install Dependencies

The required packages are already installed:
- `ws` - WebSocket server
- `@types/ws` - TypeScript types for WebSocket
- `pg` - PostgreSQL client

### 3. Start the Server

Use the custom server that includes WebSocket support:

```bash
# Development
npm run dev:web

# Production
npm run start
```

The server will:
- Start the Next.js application
- Initialize WebSocket server
- Connect to PostgreSQL and listen for notifications
- Broadcast updates to connected clients

## How It Works

### Database Level
1. When a ticket is created, updated, or deleted, PostgreSQL triggers fire
2. Triggers call `notify_ticket_change()` function
3. Function sends notification via `pg_notify('ticket_changes', payload)`

### Server Level
1. Custom server connects to PostgreSQL with `LISTEN ticket_changes`
2. When notification received, it's parsed and broadcast to all WebSocket clients
3. WebSocket clients receive real-time updates

### Client Level
1. React components use `useRealtimeTickets()` hook
2. Hook establishes WebSocket connection
3. Updates are automatically applied to component state

## Usage in Components

```tsx
import { useRealtimeTickets } from '@/hooks/use-realtime-tickets'

function TicketsPage() {
  const [tickets, setTickets] = useState([])
  
  const { isConnected } = useRealtimeTickets({
    onTicketCreated: (newTicket) => {
      setTickets(prev => [...prev, newTicket])
    },
    onTicketUpdated: (updatedTicket) => {
      setTickets(prev => prev.map(t => 
        t.id === updatedTicket.id ? updatedTicket : t
      ))
    },
    onTicketDeleted: (deletedTicket) => {
      setTickets(prev => prev.filter(t => t.id !== deletedTicket.id))
    }
  })

  return (
    <div>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        <span>{isConnected ? 'Live' : 'Offline'}</span>
      </div>
      {/* Your tickets UI */}
    </div>
  )
}
```

## Notification Payload Structure

```json
{
  "table": "tickets",
  "action": "INSERT|UPDATE|DELETE",
  "record": {
    "id": 1,
    "ticket_id": "TKT-000001",
    "user_id": 1,
    "concern": "Computer not turning on",
    "category": "Computer & Equipment",
    "status": "For Approval",
    // ... other fields
  },
  "old_record": {
    // Only present for UPDATE operations
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## Troubleshooting

### Connection Issues
1. Check that `DATABASE_URL` environment variable is set
2. Verify database connection in server logs
3. Ensure PostgreSQL supports notifications (most cloud providers do)

### WebSocket Issues
1. Check browser console for connection errors
2. Verify server is running on correct port
3. Check firewall settings if using custom port

### Notifications Not Working
1. Run `npm run apply-realtime` to ensure triggers are created
2. Check server logs for PostgreSQL connection errors
3. Verify that database operations are actually happening

## Performance Considerations

- Notifications are lightweight and don't impact database performance
- WebSocket connections are efficient for real-time updates
- Consider implementing reconnection logic for production
- Monitor WebSocket connection count in high-traffic scenarios

## Security Notes

- WebSocket connections are unauthenticated by default
- Consider adding authentication for production use
- Database notifications are internal and secure
- Validate all incoming data before applying updates

## Production Deployment

1. Ensure your PostgreSQL provider supports notifications
2. Set up proper environment variables
3. Consider using a process manager like PM2
4. Monitor WebSocket connection health
5. Implement proper error handling and logging 