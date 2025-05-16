import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { wineTable } from './schema.js'

const db = drizzle(process.env.DATABASE_URL!)

const wines = await db.select().from(wineTable)

console.log(wines)