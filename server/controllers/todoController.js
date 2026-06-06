import {
  createTodo,
  getAllTodos,
  removeTodo,
  updateTodoById,
} from '../models/todoModel.js'

export async function getTodos(_request, response) {
  const todos = await getAllTodos()
  response.json(todos)
}

export async function addTodo(request, response) {
  const title = request.body.title?.trim()

  if (!title) {
    return response.status(400).json({ message: 'Todo title is required' })
  }

  const todo = await createTodo(title)
  response.status(201).json(todo)
}

export async function updateTodo(request, response) {
  const title = request.body.title?.trim()
  const completed = request.body.completed

  if (!title) {
    return response.status(400).json({ message: 'Todo title is required' })
  }

  const todo = await updateTodoById(request.params.id, title, completed)

  if (!todo) {
    return response.status(404).json({ message: 'Todo not found' })
  }

  response.json(todo)
}

export async function deleteTodo(request, response) {
  const deleted = await removeTodo(request.params.id)

  if (!deleted) {
    return response.status(404).json({ message: 'Todo not found' })
  }

  response.json({ message: 'Todo deleted' })
}
