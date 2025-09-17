# Environment Setup Guide

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# OpenAI API Key (required for embeddings)
OPENAI_API_KEY=your_openai_api_key_here

# Qdrant Configuration
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=
QDRANT_COLLECTION_NAME=talent_documents

# Database Configuration (if using PostgreSQL)
DATABASE_URL=your_database_url_here

# Claude API Key (for AI generation)
CLAUDE_API_KEY=your_claude_api_key_here
```

## Quick Setup Steps

1. **Copy the environment template:**
   ```bash
   cp ENVIRONMENT_SETUP.md .env.local
   ```

2. **Edit `.env.local` and add your API keys:**
   - Get OpenAI API key from: https://platform.openai.com/api-keys
   - Get Claude API key from: https://console.anthropic.com/

3. **Start Qdrant:**
   ```bash
   npm run qdrant:start
   ```

4. **Test the connection:**
   ```bash
   npm run qdrant:test
   ```

5. **Start your application:**
   ```bash
   npm run dev
   ```

## Environment Variables Explained

### OPENAI_API_KEY
- **Required**: Yes
- **Purpose**: Used for generating embeddings for document search
- **Get it from**: https://platform.openai.com/api-keys
- **Cost**: Pay-per-use, very affordable for embeddings

### QDRANT_URL
- **Required**: No (defaults to http://localhost:6333)
- **Purpose**: Qdrant vector database URL
- **Local development**: http://localhost:6333
- **Production**: Your Qdrant Cloud URL

### QDRANT_API_KEY
- **Required**: No (for local development)
- **Purpose**: Authentication for Qdrant Cloud
- **Local development**: Leave empty
- **Production**: Your Qdrant Cloud API key

### QDRANT_COLLECTION_NAME
- **Required**: No (defaults to talent_documents)
- **Purpose**: Name of the vector collection in Qdrant
- **Default**: talent_documents

### CLAUDE_API_KEY
- **Required**: Yes (for AI generation)
- **Purpose**: Used for AI-powered job generation and chat
- **Get it from**: https://console.anthropic.com/

## Testing Your Setup

Run these commands to verify everything is working:

```bash
# Test Qdrant connection
npm run qdrant:test

# Check if Qdrant is running
curl http://localhost:6333/health

# Start your app
npm run dev
```

## Troubleshooting

### Qdrant Connection Issues
- Make sure Docker is running
- Check if port 6333 is available
- Verify QDRANT_URL in your environment

### OpenAI API Issues
- Verify your API key is correct
- Check if you have credits in your OpenAI account
- Ensure the key has the right permissions

### Memory Issues
- If Qdrant is not available, the system will fall back to in-memory storage
- This is fine for development but not recommended for production
