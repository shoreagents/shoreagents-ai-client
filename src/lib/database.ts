import { Pool } from 'pg'

// Main Railway PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

// BPOC database connection
const bpocPool = new Pool({
  connectionString: process.env.BPOC_DATABASE_URL,
  ssl: process.env.BPOC_DATABASE_URL?.includes("sslmode=require")
    ? undefined
    : { rejectUnauthorized: false },
})

export default pool
export { bpocPool }

// Test database connection
export async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()')
    console.log('Database connected successfully:', result.rows[0])
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

// Test BPOC database connection
export async function testBPOCConnection() {
  try {
    const result = await bpocPool.query('SELECT NOW()')
    console.log('BPOC Database connected successfully:', result.rows[0])
    return true
  } catch (error) {
    console.error('BPOC Database connection failed:', error)
    return false
  }
}