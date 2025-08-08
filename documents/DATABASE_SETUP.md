# Railway PostgreSQL Database Setup

This guide will help you set up a Railway PostgreSQL database for your tickets application.

## Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up or log in with your GitHub account
3. Create a new project

## Step 2: Add PostgreSQL Database

1. In your Railway project dashboard, click "New Service"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically provision a PostgreSQL database
4. Wait for the database to be ready

## Step 3: Get Connection Details

1. Click on your PostgreSQL service in the dashboard
2. Go to the "Connect" tab
3. Copy the connection URL (it looks like: `postgresql://username:password@host:port/database`)

## Step 4: Set Up Environment Variables

Create a `.env.local` file in your project root:

```env
# Railway PostgreSQL Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Next.js Environment Variables
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3001"
```

Replace the `DATABASE_URL` with your actual Railway connection string.

## Step 5: Install Dependencies

```bash
npm install
```

## Step 6: Initialize Database

```bash
npm run setup-db
```

This will:
- Connect to your Railway PostgreSQL database
- Create the tickets table with proper indexes
- Insert sample data
- Set up triggers for automatic timestamp updates

## Step 7: Verify Setup

The setup script will output:
- ✅ Database setup completed successfully!
- 📊 Sample tickets have been inserted.
- 🔗 Your Railway PostgreSQL database is ready to use.

## Database Schema

The database includes:

### Tables
- **public.tickets**: Main table for ticket data
  - `id`: Primary key (auto-increment)
  - `ticket_id`: Unique ticket identifier (TKT-000001 format)
  - `user_id`: User who created the ticket
  - `concern`: Main ticket title/concern
  - `details`: Detailed description (nullable)
  - `category`: Ticket category (Development, Design, Bug Fix, Feature, Testing, Documentation)
  - `status`: Current status (Pending, For Approval, On Hold, In Progress, Completed)
  - `resolved_by`: User who resolved the ticket (nullable)
  - `resolved_at`: Resolution timestamp (nullable)
  - `created_at`: Creation timestamp (Asia/Manila timezone)
  - `updated_at`: Last update timestamp (Asia/Manila timezone)

### Indexes
- Status index for fast filtering
- User ID index for user queries
- Category index for category filtering
- Created date index for sorting
- Ticket ID index for unique lookups

### Triggers
- Automatic `updated_at` timestamp updates

## API Endpoints

The application now includes API routes for database operations:

### GET /api/tickets
- Fetch all tickets
- Optional `status` query parameter to filter by status

### POST /api/tickets
- Create a new ticket
- Automatically generates unique ticket_id

### GET /api/tickets/[id]
- Fetch a specific ticket by ID

### PATCH /api/tickets/[id]
- Update ticket status or other fields

### DELETE /api/tickets/[id]
- Delete a ticket

## Usage

The database utilities are available in `lib/db-utils.ts`:

```typescript
import { getAllTickets, createTicket, updateTicketStatus } from '@/lib/db-utils'

// Get all tickets
const tickets = await getAllTickets()

// Create new ticket
const newTicket = await createTicket({
  ticket_id: "TKT-000007",
  user_id: 1,
  concern: "New Feature",
  details: "Implement new feature",
  category: "Development",
  status: "Pending"
})

// Update ticket status
await updateTicketStatus(1, "In Progress")
```

## Frontend Integration

The tickets page now:
- Fetches data from the database via API
- Shows loading states while fetching
- Handles errors gracefully
- Updates ticket status through drag and drop
- Displays real database data instead of static mock data

## Troubleshooting

### Connection Issues
- Verify your `DATABASE_URL` is correct
- Check that your Railway database is running
- Ensure SSL settings are correct for production

### Schema Issues
- Run `npm run setup-db` again to recreate tables
- Check Railway logs for any SQL errors

### Environment Variables
- Make sure `.env.local` is in your project root
- Verify no spaces around the `=` in environment variables

### API Issues
- Check that the API routes are working
- Verify the database connection in the API
- Check browser console for any fetch errors

## Railway Dashboard

You can monitor your database in the Railway dashboard:
- View connection details
- Monitor usage and performance
- Access logs
- Scale your database as needed

## Next Steps

1. ✅ Database setup and integration complete
2. ✅ API routes implemented
3. ✅ Frontend updated to use database
4. Add user authentication
5. Implement real-time updates
6. Add more advanced filtering and search
7. Set up database migrations for future schema changes