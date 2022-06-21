
import 'dotenv/config'
import { readFileSync } from 'fs'
import { Pool, PoolConfig } from 'pg'

const { 
  PGHOST,
  PGPORT,
  PGDATABASE,
  PGPASSWORD,
  PGUSER,
  PGSECURE,
  PGCERTPATH
 } = process.env

const config: PoolConfig = {
  connectionString: `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}`
}

if (PGSECURE) {
  config.ssl = {
    rejectUnauthorized: false,
    ca: readFileSync(PGCERTPATH || './ca-certificate.crt').toString()
  }
}

const pool = new Pool(config)

export const query = async (text: string, params: any = []) => {
  return pool.query(text, params)
}