import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import swaggerUi from 'swagger-ui-express'
import dashboardRoutes from './routes/dashboardRoutes.js'
import productsRoutes from './routes/productsRoutes.js'
import stockMovementsRoutes from './routes/stockMovementsRoutes.js'
import suppliersRoutes from './routes/suppliersRoutes.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import { swaggerSpec } from './swagger.js'

const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
app.use(express.json({ limit: '1mb' }))
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }))

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check API health
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 status: { type: string, example: ok }
 */
app.get('/api/health', (_req, res) => res.json({ success: true, status: 'ok' }))
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/suppliers', suppliersRoutes)
app.use('/api/stock-movements', stockMovementsRoutes)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.get('/api-docs.json', (_req, res) => res.json(swaggerSpec))
app.use(notFound)
app.use(errorHandler)

export default app
