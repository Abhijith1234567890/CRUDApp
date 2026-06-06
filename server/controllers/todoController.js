import mongoose from 'mongoose'
import Todo from '../models/todoModel.js'

const asyncHandler = fn => (req, res, next) => fn(req, res, next).catch(next)

export const getTodos = asyncHandler(async (_request, response) => {
  const todos = await Todo.find().sort({ createdAt: 1 })
  response.json(todos)
})

export const addTodo = asyncHandler(async (request, response) => {
  const title = request.body.title?.trim()

  if (!title) {
    return response.status(400).json({ message: 'Todo title is required' })
  }

  const todo = await Todo.create({ title })
  response.status(201).json(todo)
})

export const updateTodo = asyncHandler(async (request, response) => {
  const { id } = request.params

  if (!mongoose.isValidObjectId(id)) {
    return response.status(400).json({ message: 'Invalid todo ID' })
  }

  const { title, completed } = request.body
  const updates = {}

  if (title !== undefined) {
    const trimmed = title.trim()
    if (!trimmed) {
      return response.status(400).json({ message: 'Todo title cannot be empty' })
    }
    updates.title = trimmed
  }

  if (completed !== undefined) {
    updates.completed = Boolean(completed)
  }

  if (Object.keys(updates).length === 0) {
    return response.status(400).json({ message: 'No valid fields to update' })
  }

  const todo = await Todo.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true },
  )

  if (!todo) {
    return response.status(404).json({ message: 'Todo not found' })
  }

  response.json(todo)
})

export const deleteTodo = asyncHandler(async (request, response) => {
  const { id } = request.params

  if (!mongoose.isValidObjectId(id)) {
    return response.status(400).json({ message: 'Invalid todo ID' })
  }

  const todo = await Todo.findByIdAndDelete(id)

  if (!todo) {
    return response.status(404).json({ message: 'Todo not found' })
  }

  response.json({ message: 'Todo deleted' })
})