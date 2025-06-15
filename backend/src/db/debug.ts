import 'dotenv/config'

import {drizzle } from 'drizzle-orm/node-postgres'
import { userTable } from './schema.js'

const db = drizzle(process.env.DATABASE_URL!)

async function main() {
  const [admin] = await db.insert(userTable).values({
    isAdmin: true,
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@admin.com',
    // Password should be hashed in a real application password: 'adminpassword'
    passwordHash: '$2y$12$Gtby5H6bND3/9J/DkVyMd.FcW.ILcmaS4YP5JVDIZ9yUMFWzxFNiS'
  }).returning()

  console.log('Admin user created:', admin)
}

main()