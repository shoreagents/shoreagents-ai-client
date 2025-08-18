import { Pool } from "pg"

const poolBPOC = new Pool({
  connectionString: process.env.BPOC_DATABASE_URL,
  ssl: process.env.BPOC_DATABASE_URL?.includes("sslmode=require")
    ? undefined
    : { rejectUnauthorized: false },
})

export default poolBPOC
