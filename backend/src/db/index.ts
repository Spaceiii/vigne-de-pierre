import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { languageTable, rangeTable, rangeTranslationTable, wineTable, wineTranslationTable } from './schema.js'
import { insertLanguage, insertRange, insertRangeTranslation, insertWine, insertWineTranslation } from './wine_insert.js'

const db = drizzle(process.env.DATABASE_URL!)

async function main() {
  try {
    console.log('🚀 Starting data insertion...')

    await db.delete(wineTranslationTable)
    await db.delete(rangeTranslationTable)
    await db.delete(wineTable)
    await db.delete(rangeTable)
    await db.delete(languageTable)
    console.log('✅ Deleted existing data successfully!')

    // Insert languages first
    await insertLanguage()

    // Insert ranges
    await insertRange()

    // Insert range translations
    await insertRangeTranslation()

    // Insert wines
    await insertWine()

    // Insert wine translations
    await insertWineTranslation()

    console.log('✅ All data inserted successfully!')
  } catch (error) {
    console.error('❌ Error inserting data:', error)
  }
}

main()
