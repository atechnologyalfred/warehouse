import mongoose from 'mongoose'

const stockMovementSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    type: { type: String, enum: ['in', 'out', 'adjustment'], required: true },
    quantity: { type: Number, required: true, min: 1 },
    reason: { type: String, trim: true, maxlength: 300, default: '' },
    reference: { type: String, trim: true, maxlength: 80, default: '' },
    performedBy: { type: String, trim: true, maxlength: 120, default: 'Warehouse team' },
    balanceAfter: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
)

stockMovementSchema.index({ createdAt: -1 })

export default mongoose.model('StockMovement', stockMovementSchema)
