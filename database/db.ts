
import 'dotenv/config'
import { Pool } from 'pg'

const pool = new Pool()

export const query = async (text: string, params: any) => {
  return pool.query(text, params)
}