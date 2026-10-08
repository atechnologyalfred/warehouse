import asyncHandler from 'express-async-handler'
import Product from '../models/Product.js'
import StockMovement from '../models/StockMovement.js'
import { httpError } from '../utils/httpError.js'

export const listProducts = asyncHandler(async (req, res) => {
  const { search = '', category, stock, page = '1', limit = '100' } = req.query
  const filter = {}
  if (category) filter.category = category
  if (search.trim()) {
    const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    filter.$or = [{ name: new RegExp(escaped, 'i') }, { sku: new RegExp(escaped, 'i') }]
  }
  if (stock === 'low') filter.$expr = { $lte: ['$quantity', '$reorderLevel'] }
  if (stock === 'in') filter.quantity = { $gt: 0 }
  if (stock === 'out') filter.quantity = 0

  const currentPage = Math.max(1, Number.parseInt(page, 10) || 1)
  const pageSize = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 100))
  const [items, total] = await Promise.all([
    Product.find(filter)
      .populate('supplier', 'name email')
      .sort({ updatedAt: -1 })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize),
    Product.countDocuments(filter),
  ])
  res.json({ success: true, data: items, pagination: { page: currentPage, limit: pageSize, total, pages: Math.ceil(total / pageSize) } })
})

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('supplier', 'name email phone')
  if (!product) throw httpError(404, 'Product not found')
  res.json({ success: true, data: product })
})

export const createProduct = asyncHandler(async (req, res) => {
  const { initialQuantity = 0, ...details } = req.body
  if (initialQuantity < 0) throw httpError(400, 'Initial quantity cannot be negative')
  const product = await Product.create({ ...details, quantity: initialQuantity })
  if (initialQuantity > 0) {
    try {
      await StockMovement.create({
        product: product._id,
        type: 'in',
        quantity: initialQuantity,
        reason: 'Initial stock',
        balanceAfter: initialQuantity,
      })
    } catch (error) {
      await Product.findByIdAndDelete(product._id)
      throw error
    }
  }
  res.status(201).json({ success: true, data: product })
})

export const updateProduct = asyncHandler(async (req, res) => {
  if ('quantity' in req.body) throw httpError(400, 'Use the stock movement endpoint to change stock quantity')
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('supplier', 'name email')
  if (!product) throw httpError(404, 'Product not found')
  res.json({ success: true, data: product })
})

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) throw httpError(404, 'Product not found')
  await StockMovement.deleteMany({ product: product._id })
  await product.deleteOne()
  res.json({ success: true, message: 'Product and its stock history deleted' })
})
