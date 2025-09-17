# Qdrant Cloud RAG Setup Guide

This guide explains how to set up and use Qdrant Cloud for the RAG (Retrieval Augmented Generation) system in ShoreAgents AI.

## Overview

Qdrant Cloud is a managed vector database that provides high-performance vector similarity search. It's used as the primary vector store for the RAG system, with an in-memory fallback for development and testing scenarios.

## Quick Start

### 1. Qdrant Cloud Setup

1. Sign up at [qdrant.tech](https://qdrant.tech)
2. Create a new cluster
3. Get your cluster URL and API key

### 2. Environment Variables

Add these environment variables to your `.env.local` file:

```env
# Qdrant Cloud Configuration
QDRANT_URL=https://your-cluster-url.qdrant.tech
QDRANT_API_KEY=your-cloud-api-key
QDRANT_COLLECTION_NAME=talent_pool_documents

# OpenAI API Key (required for embeddings)
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Verify Setup

The system will automatically:
- Connect to Qdrant Cloud
- Create the collection if it doesn't exist
- Fall back to in-memory storage if Qdrant Cloud is unavailable

## Features

### Document Indexing

Index documents with metadata:

```typescript
import { indexDocument } from '@/lib/rag'

await indexDocument(
  "John is a senior React developer with 5 years of experience...",
  {
    talentId: "talent_123",
    type: "profile",
    name: "John Doe",
    skills: ["React", "TypeScript", "Node.js"]
  }
)
```

### Semantic Search

Search documents with enhanced context retrieval:

```typescript
import { enhancedRetrieveContext } from '@/lib/rag'

const { context, sources } = await enhancedRetrieveContext(
  "Find React developers with TypeScript experience",
  "talent_123", // Optional: limit to specific talent
  4 // Number of results
)
```

### API Endpoints

#### Index Document
```bash
POST /api/rag/documents
Content-Type: application/json

{
  "content": "Document content here...",
  "metadata": {
    "talentId": "talent_123",
    "type": "profile",
    "name": "John Doe"
  }
}
```

#### Search Documents
```bash
GET /api/rag/documents?q=react developer&k=5&talentId=talent_123&enhanced=true
```

#### Get Collection Stats
```bash
GET /api/rag/stats
```

## Configuration Options

### Qdrant Cloud Settings

- **URL**: Qdrant Cloud cluster URL (e.g., `https://your-cluster.qdrant.tech`)
- **API Key**: Required authentication key for Qdrant Cloud
- **Collection Name**: Name of the vector collection (default: `talent_pool_documents`)
- **Vector Size**: Embedding dimension (default: 1536 for OpenAI)
- **Distance Metric**: Similarity metric (default: Cosine)

### Embedding Model

The system uses OpenAI's `text-embedding-3-small` model by default, which provides:
- 1536-dimensional vectors
- Cost-effective pricing
- Good performance for most use cases

## Advanced Usage

### Custom Filters

Search with metadata filters:

```typescript
import { searchDocuments } from '@/lib/rag'

const results = await searchDocuments(
  "React developer",
  5,
  {
    skills: { $contains: "React" },
    experience: { $gte: 3 }
  }
)
```

### Batch Indexing

Index multiple documents efficiently:

```typescript
const documents = [
  { content: "Doc 1...", metadata: { talentId: "1" } },
  { content: "Doc 2...", metadata: { talentId: "2" } }
]

for (const doc of documents) {
  await indexDocument(doc.content, doc.metadata)
}
```

## Monitoring

### Health Checks

- Qdrant Cloud health: Check your cluster dashboard
- Collection stats: `GET /api/rag/stats`
- Test connection: `npm run qdrant:test`

### Logs

Monitor the application logs for:
- Qdrant Cloud connection status
- Document indexing success/failures
- Search performance metrics

## Troubleshooting

### Common Issues

1. **Qdrant Cloud Connection Failed**
   - Verify QDRANT_URL is correct (no port number needed)
   - Check QDRANT_API_KEY is valid
   - Ensure cluster is active in Qdrant Cloud dashboard

2. **OpenAI API Key Missing**
   - Add OPENAI_API_KEY to your environment
   - Ensure the key has sufficient credits

3. **Collection Creation Failed**
   - Check Qdrant Cloud cluster status
   - Verify API key permissions
   - Check vector size matches embedding model

### Fallback Behavior

The system gracefully falls back to in-memory storage if Qdrant Cloud is unavailable, ensuring continuous operation.

## Performance Optimization

### Indexing Performance

- Use batch operations for multiple documents
- Consider chunking large documents
- Monitor memory usage during bulk operations

### Search Performance

- Adjust `k` parameter based on use case
- Use metadata filters to narrow search scope
- Consider caching frequent queries

## Security Considerations

- Use API keys in production
- Restrict network access to Qdrant
- Regularly update Qdrant version
- Monitor access logs
