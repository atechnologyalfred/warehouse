import asyncHandler from 'express-async-handler'
import Product from '../models/Product.js'
import StockMovement from '../models/StockMovement.js'
import { httpError } from '../utils/httpError.js'

export const listStockMovements = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1)
  const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 50))
  const filter = req.query.product ? { product: req.query.product } : {}
  const [items, total] = await Promise.all([
    StockMovement.find(filter)
      .populate('product', 'name sku')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    StockMovement.countDocuments(filter),
  ])
  res.json({ success: true, data: items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } })
})

export const createStockMovement = asyncHandler(async (req, res) => {
  const { product: productId, type, quantity, reason, reference, performedBy } = req.body
  if (!Number.isInteger(quantity) || quantity < 1) throw httpError(400, 'Quantity must be a positive whole number')
  if (!['in', 'out', 'adjustment'].includes(type)) throw httpError(400, 'Type must be in, out, or adjustment')
  const change = type === 'out' ? -quantity : quantity
  const filter = { _id: productId }
  if (change < 0) filter.quantity = { $gte: quantity }
  const product = await Product.findOneAndUpdate(filter, { $inc: { quantity: change } }, { new: true })
  if (!product) {
    const exists = await Product.exists({ _id: productId })
    throw httpError(exists ? 409 : 404, exists ? 'Insufficient stock for this operation' : 'Product not found')
  }
  try {
    const movement = await StockMovement.create({
      product: product._id,
      type,
      quantity,
      reason,
      reference,
      performedBy,
      balanceAfter: product.quantity,
    })
    await movement.populate('product', 'name sku')
    res.status(201).json({ success: true, data: movement })
  } catch (error) {
    const rollback = type === 'out' ? quantity : -quantity
    await Product.updateOne({ _id: product._id, quantity: product.quantity }, { $inc: { quantity: rollback } })
    throw error
  }
})
