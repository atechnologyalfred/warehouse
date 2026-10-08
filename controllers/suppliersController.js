import asyncHandler from 'express-async-handler'
import Product from '../models/Product.js'
import Supplier from '../models/Supplier.js'
import { httpError } from '../utils/httpError.js'

export const listSuppliers = asyncHandler(async (_req, res) => {
  const suppliers = await Supplier.find().sort({ name: 1 })
  res.json({ success: true, data: suppliers })
})

export const createSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.create(req.body)
  res.status(201).json({ success: true, data: supplier })
})

export const updateSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!supplier) throw httpError(404, 'Supplier not found')
  res.json({ success: true, data: supplier })
})

export const deleteSupplier = asyncHandler(async (req, res) => {
  const linkedProducts = await Product.countDocuments({ supplier: req.params.id })
  if (linkedProducts) throw httpError(409, 'Reassign or remove this supplier from its products before deleting it')
  const supplier = await Supplier.findByIdAndDelete(req.params.id)
  if (!supplier) throw httpError(404, 'Supplier not found')
  res.json({ success: true, message: 'Supplier deleted' })
})
