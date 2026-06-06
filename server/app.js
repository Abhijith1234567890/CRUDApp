import cors from 'cors'
import express from 'express'
import todoRoutes from './routes/todoRoutes.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (_request, response) => {
  response.send('Todo backend is running')
})

app.use('/api/todos', todoRoutes)

app.use((_request, response) => {
  response.status(404).json({ message: 'Route not found' })
})

export default app
