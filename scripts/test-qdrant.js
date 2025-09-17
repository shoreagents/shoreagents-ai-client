const { QdrantClient } = require('@qdrant/js-client-rest')
require('dotenv').config({ path: '.env.local' })

async function testQdrantConnection() {
  console.log('Testing Qdrant connection...')
  
  const qdrantUrl = process.env.QDRANT_URL
  const qdrantApiKey = process.env.QDRANT_API_KEY || undefined
  
  console.log(`Qdrant URL: ${qdrantUrl}`)
  console.log(`API Key: ${qdrantApiKey ? '***' + qdrantApiKey.slice(-4) : 'Not set'}`)
  
  const client = new QdrantClient({
    url: qdrantUrl,
    apiKey: qdrantApiKey,
    checkCompatibility: false, // Skip version check
  })

  try {
    // Test basic connection
    console.log('✓ Connecting to Qdrant...')
    const collections = await client.getCollections()
    console.log('✓ Connection successful!')
    console.log(`✓ Found ${collections.collections.length} collections`)
    
    // List collections
    if (collections.collections.length > 0) {
      console.log('\nCollections:')
      collections.collections.forEach(col => {
        console.log(`  - ${col.name}`)
      })
    }
    
    // Test collection creation
    const collectionName = 'test_collection'
    console.log(`\n✓ Testing collection creation: ${collectionName}`)
    
    try {
      await client.createCollection(collectionName, {
        vectors: {
          size: 1536,
          distance: 'Cosine',
        },
      })
      console.log('✓ Collection created successfully')
      
      // Clean up test collection
      await client.deleteCollection(collectionName)
      console.log('✓ Test collection cleaned up')
      
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('✓ Collection already exists (expected)')
        await client.deleteCollection(collectionName)
        console.log('✓ Test collection cleaned up')
      } else {
        throw error
      }
    }
    
    console.log('\n🎉 Qdrant is ready to use!')
    console.log('\nNext steps:')
    console.log('1. Add QDRANT_URL and OPENAI_API_KEY to your .env.local')
    console.log('2. Start your Next.js application')
    console.log('3. The RAG system will automatically use Qdrant Cloud')
    
  } catch (error) {
    console.error('❌ Qdrant Cloud connection failed:', error.message)
    console.log('\nTroubleshooting:')
    console.log('1. Verify QDRANT_URL is your Qdrant Cloud cluster URL')
    console.log('2. Check QDRANT_API_KEY is valid')
    console.log('3. Ensure your Qdrant Cloud cluster is active')
    console.log('4. Check network connectivity to Qdrant Cloud')
    process.exit(1)
  }
}

// Run the test
testQdrantConnection().catch(console.error)
