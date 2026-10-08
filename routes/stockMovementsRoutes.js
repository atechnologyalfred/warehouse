import { Router } from 'express'
import {
  createStockMovement,
  listStockMovements,
} from '../controllers/stockMovementsController.js'

const router = Router()

/**
 * @swagger
 * /api/stock-movements:
 *   get:
 *     summary: List stock movements, newest first
 *     tags: [Stock movements]
 *     parameters:
 *       - in: query
 *         name: product
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 50 }
 *     responses:
 *       200: { description: Paginated stock movement list }
 *   post:
 *     summary: Receive, issue, or increase stock with a positive adjustment
 *     tags: [Stock movements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/StockMovementInput' }
 *     responses:
 *       201: { description: Stock movement recorded }
 *       404: { description: Product not found }
 *       409: { description: Insufficient stock }
 */
router.route('/').get(listStockMovements).post(createStockMovement)

export default router
