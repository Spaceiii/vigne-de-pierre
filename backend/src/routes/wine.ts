// routes for wine
import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { languageTable, rangeTable, rangeTranslationTable, wineTable, wineTranslationTable } from '../db/schema.js'
import { eq, and } from 'drizzle-orm'
import express from 'express'
import { authRequired } from '../middleware/authRequired.js'
import { adminOnly } from '../middleware/adminOnly.js'


const router = express.Router()
const db = drizzle(process.env.DATABASE_URL!)


/**
 * @swagger
 * /api/wine/all_wines:
 *   get:
 *     tags:
 *       - Vins
 *     summary: Récupère tous les vins
 *     responses:
 *       200:
 *         description: Liste de tous les vins
 */
router.get('/all_wines/', async (req, res) => {
  const wines = await db.select().from(wineTable)
  res.json(wines)
})


/**
 * @swagger
 * /api/wine/details/{slug}:
 *   get:
 *     tags:
 *       - Vins
 *     summary: Récupère un vin par son slug
 *     parameters:
 *       - name: slug
 *         in: path
 *         required: true
 *         description: Slug du vin à récupérer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vin trouvé avec succès
 *       404:
 *         description: Vin non trouvé
 */
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


/**
 * @swagger
 * /api/wine/range/{slug}:
 *   get:
 *     tags:
 *       - Vins
 *     summary: Récupère les vins par leur gamme
 *     parameters:
 *       - name: slug
 *         in: path
 *         required: true
 *         description: Slug de la gamme à récupérer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des vins trouvés avec succès
 *       404:
 *         description: Aucun vin trouvé pour cette gamme
 */
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


// get range by slug translation

/**
 * @swagger
 * /api/wine/range/translation/{code}:
 *   get:
 *     tags:
 *       - Vins
 *     summary: Récupère la traduction de toute les gammes de vins pour une langue spécifique et traduits
 *     parameters:
 *       - name: code
 *         in: path
 *         required: true
 *         description: Code de la langue à récupérer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Traduction trouvée avec succès
 *       404:
 *         description: Traduction non trouvée
 */
router.get('/range/translation/:code', async (req, res) => {
  const { code } = req.params
  type RangeTranslation = {
    name: string
    description: string
    languageId: number
    slug: string
    wines?: Array<{
      name: string
      nativeName: string
      price: number
    }>
  }

  const translations: RangeTranslation[] =
    await db
      .select({
        name: rangeTranslationTable.name,
        description: rangeTranslationTable.description,
        languageId: rangeTranslationTable.languageId,
        slug: rangeTable.slug
      })
      .from(rangeTranslationTable)
      .where(eq(languageTable.code, code))
      .innerJoin(languageTable, eq(rangeTranslationTable.languageId, languageTable.id))
      .innerJoin(rangeTable, eq(rangeTranslationTable.rangeSlug, rangeTable.slug))

  for (const translation of translations) {
    translation.wines = await db
      .select({
        name: wineTranslationTable.name,
        nativeName: wineTable.nativeName,
        price: wineTable.price
      })
      .from(wineTranslationTable)
      .where(and(
        eq(wineTranslationTable.languageId, translation.languageId),
        eq(wineTranslationTable.wineSlug, wineTable.slug),
        eq(wineTable.rangeSlug, translation.slug)
      ))
      .innerJoin(wineTable, eq(wineTranslationTable.wineSlug, wineTable.slug))
  }
  console.log(`🔎 Selecting range translations for language ${code}`)
  if (translations.length === 0) {
    res.status(404).json({ message: 'Translation not found' })
    console.error(`❌ Translation not found for language ${code}`)
    return
  }
  console.log(`✅ Translations found for language ${code}`)
  res.status(200).json(translations)
})


/**
 * @swagger
 * /api/wine/translation/{code}/{slug}:
 *   get:
 *     tags:
 *       - Vins
 *     summary: Récupère la traduction d'un vin par son slug et le code de la langue
 *     parameters:
 *       - name: code
 *         in: path
 *         required: true
 *         description: Code de la langue à récupérer
 *         schema:
 *           type: string
 *       - name: slug
 *         in: path
 *         required: true
 *         description: Slug du vin à récupérer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Traduction trouvée avec succès
 *       404:
 *         description: Traduction non trouvée
 */
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
        nativeName: wineTable.nativeName,
        price: wineTable.price,
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


/**
 * @swagger
 * /api/wine/translation/{code}:
 *   get:
 *     tags:
 *       - Vins
 *     summary: Récupère tous les vins avec leurs traductions pour une langue spécifique, groupés par gamme
 *     parameters:
 *       - name: code
 *         in: path
 *         required: true
 *         description: Code de la langue à récupérer (ex. fr, en, jp)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des vins avec leurs traductions, groupés par gamme
 *       404:
 *         description: Aucune traduction trouvée pour cette langue
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/translation/:code', async (req, res) => {
  const { code } = req.params
  console.log(`🔎 Selecting all wines with translations in language ${code}`)

  try {
    const wines = await db
      .select({
        name: wineTranslationTable.name,
        description: wineTranslationTable.description,
        tasting: wineTranslationTable.tasting,
        conservation: wineTranslationTable.conservation,
        suggestion: wineTranslationTable.suggestion,
        wineSlug: wineTable.slug,
        nativeName: wineTable.nativeName,
        price: wineTable.price,
        rangeSlug: wineTable.rangeSlug,
        rangeName: rangeTranslationTable.name,
        rangeDescription: rangeTranslationTable.description
      })
      .from(wineTranslationTable)
      .where(eq(languageTable.code, code))
      .innerJoin(languageTable, eq(wineTranslationTable.languageId, languageTable.id))
      .innerJoin(wineTable, eq(wineTranslationTable.wineSlug, wineTable.slug))
      .innerJoin(rangeTable, eq(wineTable.rangeSlug, rangeTable.slug))
      .innerJoin(rangeTranslationTable, and(
        eq(rangeTranslationTable.rangeSlug, wineTable.rangeSlug),
        eq(rangeTranslationTable.languageId, languageTable.id)
      ))

    if (wines.length === 0) {
      res.status(404).json({ message: 'No translations found for this language' })
      console.error(`❌ No translations found for language ${code}`)
      return
    }

    const result: Record<string, any> = {}

    const rangeMap: Record<string, {
      name: string,
      description: string,
      wines: any[]
    }> = {}

    for (const wine of wines) {
      const { rangeSlug, rangeName, rangeDescription, ...wineData } = wine

      // Initialize the range entry if it doesn't exist
      if (!rangeMap[rangeSlug]) {
        rangeMap[rangeSlug] = {
          name: rangeName,
          description: rangeDescription,
          wines: []
        }
      }

      rangeMap[rangeSlug].wines.push(wineData)
    }

    Object.entries(rangeMap).forEach(([slug, rangeData]) => {
      result[slug] = rangeData
    })

    console.log(`✅ Found ${wines.length} wines with translations in language ${code}`)
    res.json(result)
  } catch (e) {
    res.status(500).json({ error: e.message })
    console.error(`❌ Error getting wines with translations: ${e.message}`)
  }
})



/**
 * @swagger
 * /api/wine/range/create:
 *   post:
 *     tags:
 *       - Vins
 *     summary: Crée une nouvelle gamme de vin
 *     description: Crée une nouvelle gamme de vin avec les informations fournies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom de la gamme
 *                 example: "Pierreries"
 *               slug:
 *                 type: string
 *                 description: Slug de la gamme
 *                 example: "pierreries"
 *               description:
 *                 type: string
 *                 description: Description de la gamme
 *                 example: "Une sélection de vins d'exception"
 *     responses:
 *       201:
 *         description: Gamme créée avec succès
 *       400:
 *         description: Requête invalide
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/range/create', authRequired, adminOnly, async (req, res) => {
  const {
    name,
    slug,
    description
  } = req.body

  const newRange = {
    name,
    slug,
    description
  }

  if (!name || !slug || !description) {
    res.status(400).json({ message: 'Missing required fields' })
    return
  }
  let createdRange
  try {
    createdRange = await db.insert(rangeTable).values(newRange)
    console.log(`🍷 Created new range: ${JSON.stringify(createdRange)}`)
    res.status(201).json(createdRange)
  } catch (e) {
    res.status(500).json({ error: e.message })
    console.error(`❌ Error creating range: ${e.message}`)
  }
})


// changer le nom d'une gamme
/**
 * @swagger
 * /api/wine/range/update/{slug}:
 *   put:
 *     tags:
 *       - Vins
 *     summary: Met à jour le nom d'une gamme de vin
 *     description: Met à jour le nom d'une gamme de vin avec les informations fournies
 *     parameters:
 *       - name: slug
 *         in: path
 *         required: true
 *         description: Slug de la gamme à mettre à jour
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nouveau nom de la gamme
 *                 example: "Nouveau nom"
 *     responses:
 *       200:
 *         description: Gamme mise à jour avec succès
 *       500:
 *         description: Erreur interne du serveur
 */
router.put('/range/update/:slug', authRequired, adminOnly, async (req, res) => {
  const { slug } = req.params
  const { name } = req.body

  if (!name) {
    res.status(400).json({ message: 'Missing required fields' })
    return
  }

  try {
    const updatedRange = await db.update(rangeTable).set({ name }).where(eq(rangeTable.slug, slug))
    console.log(`🍷 Updated range: ${JSON.stringify(updatedRange)}`)
    res.status(200).json(updatedRange)
  } catch (e) {
    res.status(500).json({ error: e.message })
    console.error(`❌ Error updating range: ${e.message}`)
  }
})

/**
 * @swagger
 * /api/wine/range/delete/{slug}:
 *   delete:
 *     tags:
 *       - Vins
 *     summary: Supprime une gamme de vin
 *     description: Supprime une gamme de vin avec le slug fourni
 *     parameters:
 *       - name: slug
 *         in: path
 *         required: true
 *         description: Slug de la gamme à supprimer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Gamme supprimée avec succès
 *       500:
 *         description: Erreur interne du serveur
 */
router.delete('/range/delete/:slug', authRequired, adminOnly, async (req, res) => {
  const { slug } = req.params

  try {
    const deletedRange = await db.delete(rangeTable).where(eq(rangeTable.slug, slug))
    console.log(`🍷 Deleted range: ${JSON.stringify(deletedRange)}`)
    res.status(200).json(deletedRange)
  } catch (e) {
    res.status(500).json({ error: e.message })
    console.error(`❌ Error deleting range: ${e.message}`)
  }
})


/**
 * @swagger
 * /api/wine/create:
 *   post:
 *     tags:
 *       - Vins
 *     summary: Crée un nouveau vin
 *     description: Crée un nouveau vin avec les informations fournies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom du vin
 *                 example: "Chardonnay"
 *               slug:
 *                 type: string
 *                 description: Slug du vin
 *                 example: "chardonnay"
 *               nativeName:
 *                 type: string
 *                 description: Nom natif du vin
 *                 example: "Chardonnay"
 *               price:
 *                 type: integer
 *                 description: Prix du vin
 *                 example: 20
 *               rangeSlug:
 *                 type: string
 *                 description: Slug de la gamme du vin
 *                 example: "pierreries"
 *     responses:
 *       201:
 *         description: Vin créé avec succès
 *       400:
 *         description: Requête invalide
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/create', authRequired, adminOnly, async (req, res) => {
  const {
    name,
    slug,
    nativeName,
    price,
    rangeSlug
  } = req.body

  const newWine = {
    name,
    slug,
    nativeName,
    price,
    rangeSlug
  }

  if (!name || !slug || !nativeName || !price || !rangeSlug) {
    res.status(400).json({ message: 'Missing required fields' })
    return
  }
  let createdWine
  try {
    createdWine = await db.insert(wineTable).values(newWine)
    console.log(`🍷 Created new wine: ${JSON.stringify(createdWine)}`)
    res.status(201).json(createdWine)
  } catch (e) {
    res.status(500).json({ error: e.message })
    console.error(`❌ Error creating wine: ${e.message}`)
  }
})


/**
 * @swagger
 * /api/wine/update/{slug}:
 *   put:
 *     tags:
 *       - Vins
 *     summary: Met à jour un vin
 *     description: Met à jour un vin avec les informations fournies
 *     parameters:
 *       - name: slug
 *         in: path
 *         required: true
 *         description: Slug du vin à mettre à jour
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nativeName:
 *                 type: string
 *                 description: Nouveau nom natif du vin
 *                 example: "Nouveau Chardonnay"
 *               price:
 *                 type: integer
 *                 description: Nouveau prix du vin
 *                 example: 25
 *               rangeSlug:
 *                 type: string
 *                 description: Nouveau slug de la gamme du vin
 *                 example: "nouvelle-gamme"
 *     responses:
 *       200:
 *         description: Vin mis à jour avec succès
 *       400:
 *         description: Requête invalide
 *       500:
 *         description: Erreur interne du serveur
 */
router.put('/update/:slug', authRequired, adminOnly, async (req, res) => {
  const { slug } = req.params
  const { nativeName, price, rangeSlug } = req.body

  if (!nativeName && !price && !rangeSlug) {
    res.status(400).json({ message: 'At least one field to update is required' })
    return
  }

  const updateData: {
    nativeName?: string | null
    price?: number | null
    rangeSlug?: string | null
  } = {
    nativeName: null,
    price: null,
    rangeSlug: null
  }
  if (nativeName) updateData.nativeName = nativeName
  if (price) updateData.price = price
  if (rangeSlug) updateData.rangeSlug = rangeSlug

  try {
    const updatedWine = await db.update(wineTable).set(updateData).where(eq(wineTable.slug, slug))
    console.log(`🍷 Updated wine: ${JSON.stringify(updatedWine)}`)
    res.status(200).json(updatedWine)
  } catch (e) {
    res.status(500).json({ error: e.message })
    console.error(`❌ Error updating wine: ${e.message}`)
  }
})

/**
 * @swagger
 * /api/wine/delete/{slug}:
 *   delete:
 *     tags:
 *       - Vins
 *     summary: Supprime un vin
 *     description: Supprime un vin avec le slug fourni
 *     parameters:
 *       - name: slug
 *         in: path
 *         required: true
 *         description: Slug du vin à supprimer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vin supprimé avec succès
 *       500:
 *         description: Erreur interne du serveur
 */
router.delete('/delete/:slug', authRequired, adminOnly, async (req, res) => {
  const { slug } = req.params

  try {
    const deletedWine = await db.delete(wineTable).where(eq(wineTable.slug, slug))
    console.log(`🍷 Deleted wine: ${JSON.stringify(deletedWine)}`)
    res.status(200).json(deletedWine)
  } catch (e) {
    res.status(500).json({ error: e.message })
    console.error(`❌ Error deleting wine: ${e.message}`)
  }
})


/**
 * @swagger
 * /api/wine/translation/create:
 *   post:
 *     tags:
 *       - Vins
 *     summary: Crée une nouvelle traduction de vin
 *     description: Crée une nouvelle traduction de vin avec les informations fournies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom du vin
 *                 example: "Chardonnay"
 *               slug:
 *                 type: string
 *                 description: Slug du vin
 *                 example: "chardonnay"
 *               languageId:
 *                 type: integer
 *                 description: ID de la langue
 *                 example: 1
 *               description:
 *                 type: string
 *                 description: Description du vin
 *                 example: "Un vin blanc sec et fruité"
 *               tasting:
 *                 type: string
 *                 description: Notes de dégustation
 *                 example: "Fruits tropicaux, fleurs blanches"
 *               conservation:
 *                 type: string
 *                 description: Informations de conservation
 *                 example: "À consommer dans les 5 ans"
 *               suggestion:
 *                 type: string
 *                 description: Suggestions d'accords mets-vins
 *                 example: "Accompagne parfaitement les fruits de mer"
 *     responses:
 *       201:
 *         description: Traduction créée avec succès
 *       400:
 *         description: Requête invalide
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/translation/create', authRequired, adminOnly, async (req, res) => {
  const {
    name,
    slug,
    languageId,
    description,
    tasting,
    conservation,
    suggestion
  } = req.body

  const newTranslation = {
    name,
    wineSlug: slug,
    languageId,
    description,
    tasting,
    conservation,
    suggestion
  }

  if (!name || !slug || !languageId || !description || !tasting || !conservation || !suggestion) {
    res.status(400).json({ message: 'Missing required fields' })
    return
  }
  let createdTranslation
  try {
    createdTranslation = await db.insert(wineTranslationTable).values(newTranslation)
    console.log(`🍷 Created new translation: ${JSON.stringify(createdTranslation)}`)
    res.status(201).json(createdTranslation)
  } catch (e) {
    res.status(500).json({ error: e.message })
    console.error(`❌ Error creating translation: ${e.message}`)
  }
})


/**
 * @swagger
 * /api/wine/translation/update/{id}:
 *   put:
 *     tags:
 *       - Vins
 *     summary: Met à jour une traduction de vin
 *     description: Met à jour une traduction de vin avec les informations fournies
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la traduction à mettre à jour
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nouveau nom traduit du vin
 *                 example: "Nouveau nom traduit"
 *               description:
 *                 type: string
 *                 description: Nouvelle description du vin
 *                 example: "Nouvelle description du vin"
 *               tasting:
 *                 type: string
 *                 description: Nouvelles notes de dégustation
 *                 example: "Nouvelles notes de dégustation"
 *               conservation:
 *                 type: string
 *                 description: Nouvelles informations de conservation
 *                 example: "Nouvelles informations de conservation"
 *               suggestion:
 *                 type: string
 *                 description: Nouvelles suggestions d'accords mets-vins
 *                 example: "Nouvelles suggestions d'accords mets-vins"
 *     responses:
 *       200:
 *         description: Traduction mise à jour avec succès
 *       400:
 *         description: Requête invalide
 *       500:
 *         description: Erreur interne du serveur
 */
router.put('/translation/update/:id', authRequired, adminOnly, async (req, res) => {
  const { id } = req.params
  const { name, description, tasting, conservation, suggestion } = req.body

  if (!name && !description && !tasting && !conservation && !suggestion) {
    res.status(400).json({ message: 'At least one field to update is required' })
    return
  }

  const updateData: {
    name: string | null
    description: string | null
    tasting: string | null
    conservation: string | null
    suggestion: string | null
  } = {
    name: null,
    description: null,
    tasting: null,
    conservation: null,
    suggestion: null
  }
  if (name) updateData.name = name
  if (description) updateData.description = description
  if (tasting) updateData.tasting = tasting
  if (conservation) updateData.conservation = conservation
  if (suggestion) updateData.suggestion = suggestion

  try {
    const updatedTranslation = await db.update(wineTranslationTable)
      .set(updateData)
      .where(eq(wineTranslationTable.id, parseInt(id)))
    console.log(`🍷 Updated translation: ${JSON.stringify(updatedTranslation)}`)
    res.status(200).json(updatedTranslation)
  } catch (e) {
    res.status(500).json({ error: e.message })
    console.error(`❌ Error updating translation: ${e.message}`)
  }
})

/**
 * @swagger
 * /api/wine/translation/delete/{id}:
 *   delete:
 *     tags:
 *       - Vins
 *     summary: Supprime une traduction de vin
 *     description: Supprime une traduction de vin avec l'ID fourni
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la traduction à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Traduction supprimée avec succès
 *       500:
 *         description: Erreur interne du serveur
 */
router.delete('/translation/delete/:id', authRequired, adminOnly, async (req, res) => {
  const { id } = req.params

  try {
    const deletedTranslation = await db.delete(wineTranslationTable)
      .where(eq(wineTranslationTable.id, parseInt(id)))
    console.log(`🍷 Deleted translation: ${JSON.stringify(deletedTranslation)}`)
    res.status(200).json(deletedTranslation)
  } catch (e) {
    res.status(500).json({ error: e.message })
    console.error(`❌ Error deleting translation: ${e.message}`)
  }
})


/**
 * @swagger
 * /api/wine/language/update/{id}:
 *   put:
 *     tags:
 *       - Vins
 *     summary: Met à jour une langue
 *     description: Met à jour une langue avec les informations fournies
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la langue à mettre à jour
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nouveau nom de la langue
 *                 example: "Français"
 *               code:
 *                 type: string
 *                 description: Nouveau code de la langue
 *                 example: "fr"
 *     responses:
 *       200:
 *         description: Langue mise à jour avec succès
 *       400:
 *         description: Requête invalide
 *       500:
 *         description: Erreur interne du serveur
 */
router.put('/language/update/:id', authRequired, adminOnly, async (req, res) => {
  const { id } = req.params
  const { name, code } = req.body

  if (!name && !code) {
    res.status(400).json({ message: 'At least one field to update is required' })
    return
  }

  const updateData: {
    name: string | null
    code: string | null
  } = {
    name: null,
    code: null
  }
  if (name) updateData.name = name
  if (code) updateData.code = code

  try {
    const updatedLanguage = await db.update(languageTable)
      .set(updateData)
      .where(eq(languageTable.id, parseInt(id)))
    console.log(`🍷 Updated language: ${JSON.stringify(updatedLanguage)}`)
    res.status(200).json(updatedLanguage)
  } catch (e) {
    res.status(500).json({ error: e.message })
    console.error(`❌ Error updating language: ${e.message}`)
  }
})

export default router
