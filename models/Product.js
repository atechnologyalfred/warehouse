import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true, unique: true, trim: true, uppercase: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 1000, default: '' },
    category: { type: String, required: true, trim: true, maxlength: 80 },
    quantity: { type: Number, min: 0, default: 0 },
    reorderLevel: { type: Number, min: 0, default: 10 },
    unitPrice: { type: Number, min: 0, required: true },
    location: { type: String, trim: true, maxlength: 80, default: '' },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', default: null },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
)

productSchema.index({ name: 'text', sku: 'text', category: 'text' })
productSchema.virtual('isLowStock').get(function () {
  return this.quantity <= this.reorderLevel
})

export default mongoose.model('Product', productSchema)
