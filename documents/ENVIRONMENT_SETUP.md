# Environment Setup Guide

## 🔧 Required Environment Variables

You need to set up your environment variables for the real-time tickets system to work properly.

### **Step 1: Create Environment File**

Create a `.env.local` file in your project root with the following content:

```bash
# Database Configuration
DATABASE_URL=your_postgresql_connection_string_here

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
# Railway PostgreSQL
DATABASE_URL=postgresql://postgres:your_password@containers-us-west-1.railway.app:5432/railway

# Local PostgreSQL
# DATABASE_URL=postgresql://postgres:password@localhost:5432/tickets_db

# Environment
NODE_ENV=development
```

## 🔒 Security Notes

- Never commit `.env.local` to version control
- The file is already in `.gitignore`
- Keep your database credentials secure
- Use different databases for development and production

## ✅ Verification Checklist

- [ ] Created `.env.local` file
- [ ] Set `DATABASE_URL` with valid connection string
- [ ] Ran `npm run test-db` successfully
- [ ] Ran `npm run apply-realtime` successfully
- [ ] Server starts without database errors
- [ ] WebSocket connections work
- [ ] Real-time updates function properly 