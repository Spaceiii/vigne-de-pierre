import 'dotenv/config'

import {drizzle } from 'drizzle-orm/node-postgres'
import { userTable, wineTable, wineTranslationTable } from './schema.js'
import { eq } from 'drizzle-orm'

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

async function test() {
  const [test] = await db.select({tasting: wineTranslationTable.tasting}).from(wineTranslationTable).where(eq(wineTranslationTable.wineSlug, 'riesling_emeraude')).limit(1)

  console.log(test)
}

async function test2() {
  const wines = await db.select().from(wineTable).where(
    eq(wineTable.slug, 'test')
  )

  const translations = await db.select().from(wineTranslationTable).where(
    eq(wineTranslationTable.wineSlug, 'test')
  )

  console.log('Wines:', wines)
  console.log('Translations:', translations)
}

test2()