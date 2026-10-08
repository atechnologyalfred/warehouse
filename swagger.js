import path from 'node:path'
import { fileURLToPath } from 'node:url'
import swaggerJsdoc from 'swagger-jsdoc'

const projectDirectory = path.dirname(fileURLToPath(import.meta.url))
const swaggerFiles = [
  path.join(projectDirectory, 'app.js'),
  path.join(projectDirectory, 'routes', '*.js'),
].map((filePath) => filePath.split(path.sep).join('/'))

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Stockroom Warehouse API',
      version: '1.0.0',
      description: 'REST API for warehouse products, suppliers, stock levels, and movement history.',
    },
    servers: [{ url: 'http://localhost:5000', description: 'Local development server' }],
    tags: [
      { name: 'Dashboard' },
      { name: 'Products' },
      { name: 'Suppliers' },
      { name: 'Stock movements' },
    ],
    components: {
      parameters: {
        Id: {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', pattern: '^[a-f\\d]{24}$' },
        },
      },
      schemas: {
        ProductInput: {
          type: 'object',
          required: ['sku', 'name', 'category', 'unitPrice'],
          properties: {
            sku: { type: 'string', example: 'WID-1001' },
            name: { type: 'string', example: 'Wireless barcode scanner' },
            description: { type: 'string' },
            category: { type: 'string', example: 'Electronics' },
            reorderLevel: { type: 'integer', minimum: 0, default: 10 },
            unitPrice: { type: 'number', minimum: 0, example: 49.95 },
            location: { type: 'string', example: 'A-01-03' },
            supplier: { type: 'string', nullable: true },
          },
        },
        SupplierInput: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            name: { type: 'string', example: 'Northstar Supplies' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            address: { type: 'string' },
            notes: { type: 'string' },
          },
        },
        StockMovementInput: {
          type: 'object',
          required: ['product', 'type', 'quantity'],
          properties: {
            product: { type: 'string', description: 'MongoDB product ID' },
            type: { type: 'string', enum: ['in', 'out', 'adjustment'] },
            quantity: { type: 'integer', minimum: 1 },
            reason: { type: 'string' },
            reference: { type: 'string' },
            performedBy: { type: 'string' },
          },
        },
      },
    },
  },
  apis: swaggerFiles,
})
