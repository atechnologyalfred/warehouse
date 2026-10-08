import { Router } from 'express'
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from '../controllers/productsController.js'

const router = Router()

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: List products with optional search and stock filters
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: stock
 *         schema: { type: string, enum: [low, in, out] }
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 100 }
 *     responses:
 *       200: { description: Paginated product list }
 *   post:
 *     summary: Create a product and optionally record its initial stock
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ProductInput'
 *               - type: object
 *                 properties:
 *                   initialQuantity: { type: integer, minimum: 0 }
 *     responses:
 *       201: { description: Product created }
 *       400: { description: Invalid product data }
 *       409: { description: SKU already exists }
 */
router.route('/').get(listProducts).post(createProduct)

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get one product
 *     tags: [Products]
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       200: { description: Product details }
 *       404: { description: Product not found }
 *   patch:
 *     summary: Update product details (stock changes must use stock movements)
 *     tags: [Products]
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ProductInput' }
 *     responses:
 *       200: { description: Product updated }
 *       400: { description: Invalid product data }
 *   delete:
 *     summary: Delete a product and its stock history
 *     tags: [Products]
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       200: { description: Product deleted }
 *       404: { description: Product not found }
 */
router.route('/:id').get(getProduct).patch(updateProduct).delete(deleteProduct)

export default router
