// Memory-only cache implementation
// Simple in-memory caching for chat conversations, talent analysis, and user sessions

// In-memory storage with expiration
const memoryCache = new Map<string, { data: any, expires: number }>()

// Clean up expired memory cache entries
const cleanMemoryCache = () => {
  const now = Date.now()
  for (const [key, value] of memoryCache.entries()) {
    if (value.expires < now) {
      memoryCache.delete(key)
    }
  }
}

// Helper to set data with expiration in memory
const setMemoryCache = (key: string, data: any, ttlSeconds: number) => {
  cleanMemoryCache()
  memoryCache.set(key, {
    data,
    expires: Date.now() + (ttlSeconds * 1000)
  })
}

// Helper to get data from memory cache
const getMemoryCache = (key: string) => {
  cleanMemoryCache()
  const cached = memoryCache.get(key)
  if (cached && cached.expires > Date.now()) {
    return cached.data
  }
  memoryCache.delete(key)
  return null
}

// Cache helper functions
export const cacheHelpers = {
  // Cache chat conversations
  setChatConversation: async (talentId: string, conversationId: string, messages: any[]) => {
    const key = `chat:${talentId}:${conversationId}`
    // Memory cache (1 hour)
    setMemoryCache(key, messages, 3600)
  },

  getChatConversation: async (talentId: string, conversationId: string) => {
    const key = `chat:${talentId}:${conversationId}`
    // Memory cache
    return getMemoryCache(key)
  },

  // Cache talent analysis data
  setTalentAnalysis: async (talentId: string, analysis: any) => {
    const key = `talent_analysis:${talentId}`
    // Memory cache (2 hours)
    setMemoryCache(key, analysis, 7200)
  },

  getTalentAnalysis: async (talentId: string) => {
    const key = `talent_analysis:${talentId}`
    // Memory cache
    return getMemoryCache(key)
  },

  // Cache user session data
  setUserSession: async (userId: string, sessionData: any) => {
    const key = `user_session:${userId}`
    // Memory cache (30 minutes)
    setMemoryCache(key, sessionData, 1800)
  },

  getUserSession: async (userId: string) => {
    const key = `user_session:${userId}`
    // Memory cache
    return getMemoryCache(key)
  },

  // Clear specific cache
  clearCache: async (pattern: string) => {
    // Clear memory cache by pattern
    for (const key of memoryCache.keys()) {
      if (key.includes(pattern.replace('*', ''))) {
        memoryCache.delete(key)
      }
    }
  }
}

// Legacy compatibility - keeping the old name for now
export const redisHelpers = cacheHelpers
