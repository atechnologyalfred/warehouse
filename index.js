import 'dotenv/config'
import app from './app.js'
import { connectDatabase } from './config/db.js'

const port = Number(process.env.PORT) || 5000

try {
  await connectDatabase()
  const server = app.listen(port, () => console.log(`Stockroom API listening on http://localhost:${port}`))

  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () => {
      server.close(() => process.exit(0))
    })
  }
} catch (error) {
  console.error('Unable to start Stockroom API:', error.message)
  process.exit(1)
}
