import { Router } from 'express'
import { getDashboard } from '../controllers/dashboardController.js'

const router = Router()

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get warehouse overview metrics and recent activity
 *     tags: [Dashboard]
 *     responses:
 *       200: { description: Dashboard summary }
 */
router.get('/', getDashboard)

export default router
