import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 200,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false },
)

todoSchema.set('toJSON', {
  transform(_document, todo) {
    todo.id = todo._id.toString()
    delete todo._id
    return todo
  },
})

export default mongoose.model('Todo', todoSchema)