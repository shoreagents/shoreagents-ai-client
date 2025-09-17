const { QdrantClient } = require('@qdrant/js-client-rest')
require('dotenv').config({ path: '.env.local' })

async function testFixedAdd() {
  console.log('🧪 Testing fixed data addition...\n')
  
  const client = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
    checkCompatibility: false,
  })
  
  try {
    const collectionName = process.env.QDRANT_COLLECTION_NAME || 'talent_pool_documents'
    
    // Create a simple test vector (1536 dimensions of zeros)
    const testVector = new Array(1536).fill(0)
    
    console.log('1️⃣ Adding test points with valid IDs...')
    
    const testData = [
      {
        id: 1,
        vector: testVector,
        payload: {
          content: 'John Smith is a senior React developer with 5 years of experience in TypeScript and Node.js.',
          name: 'John Smith',
          type: 'profile',
          skills: ['React', 'TypeScript', 'Node.js'],
          experience: '5 years'
        }
      },
      {
        id: 2,
        vector: testVector,
        payload: {
          content: 'Sarah Johnson is a full-stack developer with 3 years of experience in Python, Django, and PostgreSQL.',
          name: 'Sarah Johnson',
          type: 'profile',
          skills: ['Python', 'Django', 'PostgreSQL'],
          experience: '3 years'
        }
      },
      {
        id: 3,
        vector: testVector,
        payload: {
          content: 'Mike Chen is a DevOps engineer with 4 years of experience in Kubernetes, Docker, and AWS.',
          name: 'Mike Chen',
          type: 'profile',
          skills: ['Kubernetes', 'Docker', 'AWS'],
          experience: '4 years'
        }
      }
    ]
    
    await client.upsert(collectionName, {
      points: testData
    })
    
    console.log('✅ Test points added successfully!')
    
    console.log('\n2️⃣ Verifying data...')
    const collectionInfo = await client.getCollection(collectionName)
    console.log(`Points count: ${collectionInfo.points_count}`)
    
    if (collectionInfo.points_count > 0) {
      console.log('\n3️⃣ Getting points...')
      const points = await client.scroll(collectionName, { limit: 5 })
      console.log(`Found ${points.points.length} points:`)
      points.points.forEach((point, index) => {
        console.log(`  Point ${index + 1}:`)
        console.log(`    ID: ${point.id}`)
        console.log(`    Name: ${point.payload.name}`)
        console.log(`    Skills: ${point.payload.skills.join(', ')}`)
      })
    }
    
    console.log('\n🎉 Data added successfully! Check your Qdrant Cloud UI now.')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error('Full error:', error)
  }
}

testFixedAdd().catch(console.error)

