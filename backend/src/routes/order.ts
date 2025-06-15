import express from 'express';
import { drizzle } from 'drizzle-orm/node-postgres';
import { orderTable, orderItemTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { AuthenticatedRequest, authRequired } from '../middleware/authRequired.js';

const router = express.Router();
const db = drizzle(process.env.DATABASE_URL!);

/**
 * @swagger
 * /api/order/create:
 *   post:
 *     tags:
 *       - Commandes
 *     summary: Crée une nouvelle commande
 *     description: Crée une nouvelle commande avec les informations fournies
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pickupInfo:
 *                 type: string
 *                 description: Informations de retrait en magasin
 *               contactPhone:
 *                 type: string
 *                 description: Numéro de téléphone de contact
 *               contactEmail:
 *                 type: string
 *                 description: Email de contact
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     wineSlug:
 *                       type: string
 *                       description: Slug du vin
 *                     name:
 *                       type: string
 *                       description: Nom du vin
 *                     quantity:
 *                       type: integer
 *                       description: Quantité
 *                     price:
 *                       type: integer
 *                       description: Prix unitaire
 *     responses:
 *       201:
 *         description: Commande créée avec succès
 *       400:
 *         description: Requête invalide
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/create', authRequired, async (req: AuthenticatedRequest, res) => {
  const { pickupInfo, contactPhone, contactEmail, items } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }

  if (!pickupInfo || !contactPhone || !contactEmail || !items || !items.length) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  // Calculate total price
  const totalPrice = items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  try {
    // Start a transaction
    const result = await db.transaction(async (tx) => {
      // Create the order
      const [order] = await tx.insert(orderTable).values({
        userId,
        status: 'pending',
        totalPrice,
        pickupInfo,
        contactPhone,
        contactEmail,
      }).returning();

      // Create order items
      const orderItems = [];
      for (const item of items) {
        const [orderItem] = await tx.insert(orderItemTable).values({
          orderId: order.id,
          wineSlug: item.wineSlug,
          quantity: item.quantity,
          price: item.price,
        }).returning();
        orderItems.push(orderItem);
      }

      return { order, orderItems };
    });

    console.log(`🛒 Created new order: ${JSON.stringify(result.order)}`);
    res.status(201).json(result);
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error(`❌ Error creating order: ${errorMessage}`);
    res.status(500).json({ error: errorMessage });
  }
});

/**
 * @swagger
 * /api/order/user:
 *   get:
 *     tags:
 *       - Commandes
 *     summary: Récupère toutes les commandes de l'utilisateur connecté
 *     description: Récupère la liste des commandes de l'utilisateur authentifié
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des commandes récupérée avec succès
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/user', authRequired, async (req: AuthenticatedRequest, res) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }

  // Ensure userId is a valid integer
  console.log(`Fetching orders for user ID: ${userId}`);
  if (isNaN(Number(userId))) {
    res.status(400).json({ error: 'Invalid user ID' });
    return;
  }

  try {
    // Get all orders for the user
    const orders = await db.select().from(orderTable).where(eq(orderTable.userId, Number(userId)));

    // Get order items for each order
    const ordersWithItems = await Promise.all(orders.map(async (order) => {
      if (!order.id || isNaN(Number(order.id))) {
        return { ...order, items: [] };
      }
      const orderItems = await db.select().from(orderItemTable).where(eq(orderItemTable.orderId, Number(order.id)));
      return { ...order, items: orderItems };
    }));

    res.json(ordersWithItems);
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error(`❌ Error fetching user orders: ${errorMessage}`);
    res.status(500).json({ error: errorMessage });
  }
});

/**
 * @swagger
 * /api/order/all:
 *   get:
 *     tags:
 *       - Commandes
 *     summary: Récupère toutes les commandes (admin uniquement)
 *     description: Retourne toutes les commandes du système. Requiert les droits admin.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des commandes
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé
 *       500:
 *         description: Erreur serveur
 */
router.get('/all', authRequired, async (req, res) => {
  const user = req.user;

  if (!user?.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  try {
    const orders = await db.select().from(orderTable);
    res.json(orders);
  } catch (err: any) {
    console.error('❌ Error fetching all orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

/**
 * @swagger
 * /api/order/{id}:
 *   get:
 *     tags:
 *       - Commandes
 *     summary: Récupère une commande par son ID
 *     description: Récupère les détails d'une commande spécifique
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la commande
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Commande trouvée avec succès
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Commande non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/:id', authRequired, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const isAdmin = req.user?.isAdmin;

  if (!userId) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }

  // Ensure userId is a valid integer
  if (isNaN(Number(userId))) {
    res.status(400).json({ error: 'Invalid user ID' });
    return;
  }

  // Ensure id is a valid integer
  const orderId = parseInt(id);
  console.log(`Fetching order with ID: ${orderId}`);
  if (isNaN(orderId)) {
    res.status(400).json({ error: 'Invalid order ID' });
    return;
  }

  try {
    // Get the order
    const order = await db.select().from(orderTable).where(eq(orderTable.id, orderId));

    if (order.length === 0) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    // Check if the user is authorized to view this order
    if (!isAdmin && order[0].userId !== Number(userId)) {
      res.status(401).json({ error: 'Not authorized to view this order' });
      return;
    }

    // Get the order items
    const orderItems = await db.select().from(orderItemTable).where(eq(orderItemTable.orderId, orderId));

    res.json({ ...order[0], items: orderItems });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error(`❌ Error fetching order: ${errorMessage}`);
    res.status(500).json({ error: errorMessage });
  }
});

/**
 * @swagger
 * /api/order/{id}/status:
 *   put:
 *     tags:
 *       - Commandes
 *     summary: Met à jour le statut d'une commande
 *     description: Met à jour le statut d'une commande spécifique
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la commande
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: Nouveau statut de la commande
 *                 enum: [pending, confirmed, ready_for_pickup, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Statut de la commande mis à jour avec succès
 *       400:
 *         description: Requête invalide
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Commande non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.put('/:id/status', authRequired, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user?.id;
  const isAdmin = req.user?.isAdmin;

  if (!userId) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }

  // Ensure userId is a valid integer
  if (isNaN(Number(userId))) {
    res.status(400).json({ error: 'Invalid user ID' });
    return;
  }

  if (!status || !['pending', 'confirmed', 'ready_for_pickup', 'delivered', 'cancelled'].includes(status)) {
    res.status(400).json({ error: 'Invalid status' });
    return;
  }

  // Ensure id is a valid integer
  const orderId = parseInt(id);
  if (isNaN(orderId)) {
    res.status(400).json({ error: 'Invalid order ID' });
    return;
  }

  try {
    // Get the order
    const order = await db.select().from(orderTable).where(eq(orderTable.id, orderId));

    if (order.length === 0) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    // Check if the user is authorized to update this order
    if (!isAdmin && order[0].userId !== Number(userId)) {
      res.status(401).json({ error: 'Not authorized to update this order' });
      return;
    }

    // Update the order status
    const updatedOrder = await db.update(orderTable)
      .set({ status, updatedAt: new Date() })
      .where(eq(orderTable.id, orderId))
      .returning();

    res.json(updatedOrder[0]);
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error(`❌ Error updating order status: ${errorMessage}`);
    res.status(500).json({ error: errorMessage });
  }
});

export default router;
