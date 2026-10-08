import asyncHandler from 'express-async-handler'
import Product from '../models/Product.js'
import StockMovement from '../models/StockMovement.js'
import Supplier from '../models/Supplier.js'

export const getDashboard = asyncHandler(async (_req, res) => {
  const [productCount, supplierCount, stockValue, lowStockCount, outOfStockCount, lowStockItems, recentMovements] =
    await Promise.all([
      Product.countDocuments(),
      Supplier.countDocuments(),
      Product.aggregate([{ $group: { _id: null, value: { $sum: { $multiply: ['$quantity', '$unitPrice'] } } } }]),
      Product.countDocuments({ $expr: { $lte: ['$quantity', '$reorderLevel'] }, quantity: { $gt: 0 } }),
      Product.countDocuments({ quantity: 0 }),
      Product.find({ $expr: { $lte: ['$quantity', '$reorderLevel'] } })
        .sort({ quantity: 1 })
        .limit(5)
        .select('name sku quantity reorderLevel category'),
      StockMovement.find().populate('product', 'name sku').sort({ createdAt: -1 }).limit(6),
    ])
  res.json({
    success: true,
    data: {
      productCount,
      supplierCount,
      stockValue: stockValue[0]?.value || 0,
      lowStockCount,
      outOfStockCount,
      lowStockItems,
      recentMovements,
    },
  })
})
