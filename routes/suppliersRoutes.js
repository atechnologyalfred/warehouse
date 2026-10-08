import { Router } from 'express'
import {
  createSupplier,
  deleteSupplier,
  listSuppliers,
  updateSupplier,
} from '../controllers/suppliersController.js'

const router = Router()

/**
 * @swagger
 * /api/suppliers:
 *   get:
 *     summary: List suppliers
 *     tags: [Suppliers]
 *     responses:
 *       200: { description: Supplier list }
 *   post:
 *     summary: Add a supplier
 *     tags: [Suppliers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/SupplierInput' }
 *     responses:
 *       201: { description: Supplier created }
 *       400: { description: Invalid supplier data }
 *       409: { description: Email already exists }
 */
router.route('/').get(listSuppliers).post(createSupplier)

/**
 * @swagger
 * /api/suppliers/{id}:
 *   patch:
 *     summary: Update a supplier
 *     tags: [Suppliers]
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/SupplierInput' }
 *     responses:
 *       200: { description: Supplier updated }
 *   delete:
 *     summary: Delete an unused supplier
 *     tags: [Suppliers]
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       200: { description: Supplier deleted }
 *       409: { description: Supplier is linked to products }
 */
router.route('/:id').patch(updateSupplier).delete(deleteSupplier)

export default router
