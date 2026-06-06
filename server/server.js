import 'dotenv/config'
import app from './app.js'
import connectDB from './config/db.js'

const port = process.env.PORT ?? 5000

async function startServer() {
  await connectDB()

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
  })
}

startServer().catch((error) => {
  console.log(error.message)
})
