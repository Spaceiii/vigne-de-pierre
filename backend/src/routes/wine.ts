// routes for wine
import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { languageTable, wineTable, wineTranslationTable } from '../db/schema.js'
import { eq, and } from 'drizzle-orm'
import express from 'express'

const router = express.Router()

const db = drizzle(process.env.DATABASE_URL!)

// get all wines
router.get('/details/', async (req, res) => {
  const wines = await db.select().from(wineTable)
  res.json(wines)
})

// get wine by slug
router.get('/details/:slug', async (req, res) => {
  const { slug } = req.params
  const wine = await db.select().from(wineTable).where(eq(wineTable.slug, slug))
  console.log(`🔎 Selecting wine ${slug}`)
  if (wine.length === 0) {
    res.status(404).json({ message: 'Wine not found' })
    console.error(`❌ Wine not found with slug ${slug}`)
    return
  }
  console.log(`✅ Wine found with slug ${slug}`)
  res.json(wine[0])
})

// get wine by range
router.get('/range/:slug', async (req, res) => {
  const { slug } = req.params
  const wines = await db.select().from(wineTable).where(eq(wineTable.rangeSlug, slug))
  console.log(`🔎 Selecting wines for range ${slug}`)
  if (wines.length === 0) {
    res.status(404).json({ message: 'Wine not found' })
    console.error(`❌ No wines found for range ${slug}`)
    return
  }
  console.log(`✅ Wines found for range ${slug}`)
  res.json(wines)
})

// get translation by wine slug and language code

router.get('/translation/:code/:slug', async (req, res) => {
  const { slug, code } = req.params
  const translation =
    await db
      .select({
        name: wineTranslationTable.name,
        description: wineTranslationTable.description,
        tasting: wineTranslationTable.tasting,
        conservation: wineTranslationTable.conservation,
        suggestion: wineTranslationTable.suggestion,
        rangeSlug: wineTable.rangeSlug,
        nativeName: wineTable.nativeName
      })
      .from(wineTranslationTable)
      .where(and(
        eq(wineTranslationTable.wineSlug, slug),
        eq(languageTable.code, code)
      ))
      .innerJoin(languageTable, eq(wineTranslationTable.languageId, languageTable.id))
      .innerJoin(wineTable, eq(wineTranslationTable.wineSlug, wineTable.slug))

  console.log(`🔎 Selecting translation for wine ${slug} in language ${code}`)
  if (translation.length === 0) {
    res.status(404).json({ message: 'Translation not found' })
    console.error(`❌ Translation not found for wine ${slug} in language ${code}`)
    return
  }

  console.log(`✅ Translation found for wine ${slug} in language ${code}`)
  res.json(translation[0])
})

export default router