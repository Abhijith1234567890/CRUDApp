import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

todoSchema.set('toJSON', {
  transform(_document, todo) {
    todo.id = todo._id.toString()
    delete todo._id
    delete todo.__v
    return todo
  },
})

const Todo = mongoose.model('Todo', todoSchema)

export async function getAllTodos() {
  return Todo.find().sort({ createdAt: 1 })
}

export async function createTodo(title) {
  return Todo.create({
    title: title.trim(),
  })
}

export async function updateTodoById(id, title, completed) {
  if (!mongoose.isValidObjectId(id)) {
    return null
  }

  return Todo.findByIdAndUpdate(
    id,
    {
      title: title.trim(),
      completed: Boolean(completed),
    },
    { new: true },
  )
}

export async function removeTodo(id) {
  if (!mongoose.isValidObjectId(id)) {
    return false
  }

  const todo = await Todo.findByIdAndDelete(id)
  return Boolean(todo)
}
