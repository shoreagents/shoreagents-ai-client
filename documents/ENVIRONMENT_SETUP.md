# Environment Setup Guide

## 🔧 Required Environment Variables

You need to set up your environment variables for the real-time tickets system and AI chatbot functionality to work properly.

### **Step 1: Create Environment File**

Create a `.env.local` file in your project root with the following content:

```bash
# Database Configuration
DATABASE_URL=your_postgresql_connection_string_here

# Supabase Configuration (if using Supabase)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Redis Configuration (OPTIONAL - for AI chatbot caching)
# Comment these out to use in-memory caching (recommended for development)
# REDIS_URL=redis://localhost:6379
# REDIS_PASSWORD=your_redis_password_here

# Claude AI Configuration (for chatbot)
CLAUDE_API_KEY=your_claude_api_key_here

# Environment
NODE_ENV=development
```

### **Step 2: Get Your Database URL**

#### **If using Railway:**
1. Go to your Railway dashboard
2. Select your PostgreSQL database
3. Click "Connect" 
4. Copy the "Postgres Connection URL"
5. It should look like: `postgresql://postgres:password@containers-us-west-1.railway.app:5432/railway`

#### **If using local PostgreSQL:**
```bash
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
```

#### **If using other providers (Supabase, Neon, etc.):**
Copy the connection string from your provider's dashboard.

### **Step 2.5: Set up Redis (Optional - for AI Chatbot Caching)**

⚠️ **Redis is OPTIONAL** - The AI chatbot will work without Redis using in-memory caching as a fallback.

#### **Option A: Skip Redis (Recommended for Development)**
Simply don't set `REDIS_URL` or leave it empty. The application will automatically use in-memory caching and display:
```
Redis not configured - running without caching
```

#### **Option B: Local Redis (Development)**
1. Install Redis locally:
   ```bash
   # Windows (using Docker - Recommended)
   docker run -d --name redis -p 6379:6379 redis:alpine
   
   # macOS
   brew install redis
   brew services start redis
   
   # Ubuntu/Debian
   sudo apt install redis-server
   sudo systemctl start redis-server
   ```

2. Set up the connection in `.env.local`:
   ```bash
   REDIS_URL=redis://localhost:6379
   # REDIS_PASSWORD= (leave empty for local development)
   ```

#### **Option C: Cloud Redis (Production)**
Use services like:
- **Upstash Redis** (recommended for serverless)
- **Railway Redis**  
- **AWS ElastiCache**
- **Digital Ocean Managed Redis**

Get your connection URL from your provider's dashboard and add it to `.env.local`.

### **Step 2.6: Set up Claude API Key**

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or sign in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env.local`:
   ```bash
   CLAUDE_API_KEY=sk-ant-api03-your-key-here
   ```

**Note:** Keep this key secure and never commit it to version control!

### **Step 3: Test Database Connection**

After setting up your `.env.local` file, test the connection:

```bash
npm run test-db
```

You should see:
```
Testing database connection...
DATABASE_URL: Set
✅ Database connection successful!
✅ Database query successful: { now: '2024-01-01T12:00:00.000Z' }
```

### **Step 4: Apply Real-time Schema**

Once the database connection works, apply the real-time schema:

```bash
npm run apply-realtime
```

### **Step 5: Start the Server**

```bash
npm run dev:web
```

## 🚨 Common Issues

### **Redis Connection Issues**
### **Issue: "Redis Client Error [AggregateError: ] { code: 'ECONNREFUSED' }"**
**This is expected if you haven't set up Redis!** The application will automatically fall back to in-memory caching.

**Solutions:**
1. **Ignore it (Recommended)** - The app works fine without Redis
2. **Install Redis locally** (see Step 2.5 above)
3. **Use a cloud Redis service** for production
4. **Remove REDIS_URL** from your `.env.local` to stop connection attempts

### **Database Issues**

### **Issue: "DATABASE_URL: Not set"**
- Make sure you created `.env.local` (not `.env`)
- Check that the file is in the project root
- Verify the variable name is exactly `DATABASE_URL`

### **Issue: "client password must be a string"**
- Check that your connection string includes a password
- Make sure there are no extra spaces or quotes
- Verify the connection string format

### **Issue: "Connection refused"**
- Check that your database is running
- Verify the host and port in your connection string
- Ensure your IP is whitelisted (for cloud databases)

## 📝 Example .env.local

```bash
# Database Configuration
# Railway PostgreSQL
DATABASE_URL=postgresql://postgres:your_password@containers-us-west-1.railway.app:5432/railway

# Local PostgreSQL (alternative)
# DATABASE_URL=postgresql://postgres:password@localhost:5432/tickets_db

# Supabase Configuration (if using Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Redis Configuration (OPTIONAL - for AI chatbot caching)
# Leave these commented out to use in-memory caching (recommended for development)
# REDIS_URL=redis://localhost:6379
# REDIS_PASSWORD= (leave empty for local)

# Cloud Redis (production example)
# REDIS_URL=rediss://default:password@redis-host:port

# Claude AI Configuration (for chatbot)
CLAUDE_API_KEY=sk-ant-api03-your-actual-key-here

# Environment
NODE_ENV=development
```

## 🔒 Security Notes

- Never commit `.env.local` to version control
- The file is already in `.gitignore`
- Keep your database credentials secure
- Use different databases for development and production

## ✅ Verification Checklist

### **Database & Core System:**
- [ ] Created `.env.local` file
- [ ] Set `DATABASE_URL` with valid connection string
- [ ] Ran `npm run test-db` successfully
- [ ] Ran `npm run apply-realtime` successfully
- [ ] Server starts without database errors
- [ ] WebSocket connections work
- [ ] Real-time updates function properly

### **AI Chatbot System:**
- [ ] Set `CLAUDE_API_KEY` for AI functionality
- [ ] **Optional:** Set `REDIS_URL` for persistent caching (or skip for in-memory caching)
- [ ] No Redis connection errors (or they're safely ignored with memory fallback)
- [ ] AI chatbot loads in talent detail modal
- [ ] Can switch between Comments and AI Assistant tabs
- [ ] AI assistant responds to questions about talent profiles
- [ ] Conversation history persists during session
- [ ] Conversation starters appear when no messages exist

### **Optional Supabase Integration:**
- [ ] Set `NEXT_PUBLIC_SUPABASE_URL` (if using Supabase)
- [ ] Set `NEXT_PUBLIC_SUPABASE_ANON_KEY` (if using Supabase)
- [ ] Supabase authentication works
- [ ] Supabase data operations function properly

## 🧪 Testing the AI Chatbot

1. **Open any talent profile** in the talent pool
2. **Switch to the "AI Assistant" tab** in the activity panel
3. **Try asking questions** like:
   - "What are this candidate's key strengths?"
   - "How does their experience match our requirements?"
   - "What interview questions should I ask?"
4. **Verify conversation persistence** by refreshing and checking history
5. **Test conversation starters** by clicking the suggested questions

## 🚨 AI Chatbot Troubleshooting

### **Issue: "Failed to process chatbot request"**
- Check that `CLAUDE_API_KEY` is set correctly
- Verify your Anthropic account has available credits
- Check the browser console for detailed error messages

### **Issue: "MODEL_NOT_FOUND" (404 error)**
The app now automatically tries multiple Claude models:
1. **Primary:** claude-3-5-sonnet-20241022 (Claude 3.5 Sonnet)
2. **Fallback:** claude-3-haiku-20240307 (Claude 3 Haiku)

**If both fail:**
- Verify your Claude API key has access to these models
- Check your Anthropic account tier - some models require paid access
- Try creating a new API key in the Anthropic Console

### **Issue: Chatbot responses are slow**
- This is normal - AI responses can take 3-10 seconds
- Check your Redis connection for caching optimization

### **Issue: "Redis Client Error"**
**This is normal if you haven't set up Redis!** 
- **Option 1 (Recommended):** Ignore the errors - the app uses in-memory caching automatically
- **Option 2:** Remove `REDIS_URL` from `.env.local` to stop connection attempts  
- **Option 3:** Set up Redis properly (see Step 2.5 above)
- If using Redis: Verify it's running and connection URL is correct
- If using Redis: Ensure Redis password is correct if using authentication

### **Issue: "Redis unavailable - operations will work without caching"**  
This is a normal info message when Redis isn't available. The app continues working with in-memory caching. 