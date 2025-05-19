// routes for wine
import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { languageTable, rangeTable, wineTable, wineTranslationTable } from '../db/schema.js'
import { eq, and } from 'drizzle-orm'
import express from 'express'


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
router.post('/create', async (req, res) => {
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
router.post('/translation/create', async (req, res) => {
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


// Créer une nouvelle gamme

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
router.post('/range/create', async (req, res) => {
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
router.put('/range/update/:slug', async (req, res) => {
  const { slug } = req.params
  const { name } = req.body

  if (!name) {
    res.status(400).json({ message: 'Missing required fields' })
    return
  }

  try {
    const updatedRange = await db.update(rangeTable).set({ name }).where(eq(wineTable.slug, slug))
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
router.delete('/range/delete/:slug', async (req, res) => {
  const { slug } = req.params

  try {
    const deletedRange = await db.delete(rangeTable).where(eq(wineTable.slug, slug))
    console.log(`🍷 Deleted range: ${JSON.stringify(deletedRange)}`)
    res.status(200).json(deletedRange)
  } catch (e) {
    res.status(500).json({ error: e.message })
    console.error(`❌ Error deleting range: ${e.message}`)
  }
})

export default router
