# Authentication Setup - Supabase + Railway PostgreSQL

This document explains the hybrid authentication system using **Supabase for authentication** and **Railway PostgreSQL for business data**.

## Architecture Overview

### **Authentication Layer (Supabase)**
- ✅ **Secure password hashing** - Handled by Supabase Auth
- ✅ **JWT tokens** - Automatic session management
- ✅ **Built-in security** - Rate limiting, MFA support
- ✅ **User management** - Supabase Auth dashboard

### **Business Data Layer (Railway PostgreSQL)**
- ✅ **Your existing schema** - All your tables remain unchanged
- ✅ **Business logic** - Tickets, users, departments, etc.
- ✅ **Real-time features** - PostgreSQL notifications
- ✅ **Custom queries** - Full control over your data

## Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project URL and anon key

### 2. Set Environment Variables

Add these to your `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Railway PostgreSQL (existing)
DATABASE_URL=your_railway_postgresql_url
```

### 3. Setup Database Users

First, run the Railway PostgreSQL script:
```bash
psql -d your_database -f scripts/insert-sample-users.sql
```

Then, create Supabase users:
```bash
node scripts/setup-supabase-users.js
```

## How It Works

### **Login Flow:**
1. **User enters credentials** → Login form
2. **Supabase authenticates** → Password validation, JWT generation
3. **Check Railway database** → Verify user exists in `internal` table
4. **Load user data** → Get profile info from Railway PostgreSQL
5. **Set session** → User logged in with full access

### **Security Features:**
- 🔐 **Supabase handles passwords** - Secure hashing, no plain text
- 🛡️ **JWT tokens** - Stateless authentication
- 🔒 **Database validation** - Only internal users can access
- 🚫 **Automatic logout** - If user not found in Railway database

## Test Accounts

After setup, you can login with:

| Email | Password | Role |
|-------|----------|------|
| `admin@shoreagents.com` | `password123` | Admin |
| `agent1@shoreagents.com` | `password123` | Agent |
| `agent2@shoreagents.com` | `password123` | Agent |

## API Endpoints

The system now uses **Supabase Auth** instead of custom API routes:

- **Login**: `supabase.auth.signInWithPassword()`
- **Logout**: `supabase.auth.signOut()`
- **Check Auth**: `supabase.auth.getUser()`

## Benefits of This Architecture

### **Supabase Auth Benefits:**
- ✅ **Production-ready security**
- ✅ **Built-in password hashing**
- ✅ **JWT token management**
- ✅ **Rate limiting protection**
- ✅ **MFA support**
- ✅ **Email verification**

### **Railway PostgreSQL Benefits:**
- ✅ **Your existing schema** - No changes needed
- ✅ **Full data control** - All business logic stays
- ✅ **Real-time features** - PostgreSQL notifications
- ✅ **Custom queries** - Complex business logic
- ✅ **Data ownership** - Your data, your rules

## Migration Notes

### **What Changed:**
- ❌ Removed custom API routes (`/api/auth/*`)
- ❌ Removed cookie-based sessions
- ✅ Added Supabase client integration
- ✅ Enhanced security with JWT tokens
- ✅ Better error handling

### **What Stayed the Same:**
- ✅ All your database tables
- ✅ All your business logic
- ✅ All your UI components
- ✅ All your real-time features

## Troubleshooting

### **Common Issues:**

1. **"Invalid login credentials"**
   - Check if user exists in Supabase Auth
   - Verify user exists in Railway PostgreSQL `internal` table
   - Ensure email matches between both systems

2. **"User not found or not authorized"**
   - User authenticated with Supabase but not in Railway database
   - Run the database setup scripts
   - Check `internal` table for user

3. **Environment variables missing**
   - Set `NEXT_PUBLIC_SUPABASE_URL`
   - Set `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Set `SUPABASE_SERVICE_ROLE_KEY`

## Production Considerations

1. **Environment Variables** - Set all Supabase keys in production
2. **Database Sync** - Ensure Railway and Supabase users stay in sync
3. **Error Handling** - Monitor authentication failures
4. **User Management** - Use Supabase dashboard for user management
5. **Security** - Enable MFA, email verification in Supabase

## Development Workflow

1. **Local Development** - Use Supabase local development
2. **Testing** - Use the provided test accounts
3. **Deployment** - Set production environment variables
4. **Monitoring** - Check Supabase Auth logs for issues 