import { useState } from 'react'
import axios from 'axios'
import './App.css'

const API_URL = 'https://crudapp-79bk.onrender.com/api/todos'
const STORAGE_KEY = 'todos'

function getTodosFromStorage() {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved ? JSON.parse(saved) : []
}

function App() {
  const [task, setTask] = useState('')
  const [todos, setTodos] = useState(getTodosFromStorage)
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  function updateTodos(newTodos) {
    setTodos(newTodos)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTodos))
  }

  function addTodo() {
    if (!task.trim()) {
      alert('Please enter a task')
      return
    }

    const tempId = Date.now()
    const newTodo = { id: tempId, text: task.trim(), completed: false }
    const updated = [...todos, newTodo]
    updateTodos(updated)
    setTask('')

    axios
      .post(API_URL, { title: newTodo.text })
      .then(({ data }) => {
        const apiTodo = { id: data.id, text: data.title, completed: data.completed }
        updateTodos(updated.map((t) => (t.id === tempId ? apiTodo : t)))
      })
      .catch(() => console.log('API unavailable, saved locally'))
  }

  function toggleComplete(id) {
    const todo = todos.find((t) => t.id === id)
    if (!todo) return

    const updated = todos.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    )
    updateTodos(updated)

    axios
      .put(`${API_URL}/${id}`, { title: todo.text, completed: !todo.completed })
      .catch(() => console.log('API unavailable, updated locally'))
  }

  function startEdit(todo) {
    setEditingId(todo.id)
    setEditText(todo.text)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditText('')
  }

  function saveEdit(id) {
    const trimmed = editText.trim()
    if (!trimmed) return

    const todo = todos.find((t) => t.id === id)
    if (!todo) return

    const updated = todos.map((t) => (t.id === id ? { ...t, text: trimmed } : t))
    updateTodos(updated)
    setEditingId(null)
    setEditText('')

    axios
      .put(`${API_URL}/${id}`, { title: trimmed, completed: todo.completed })
      .catch(() => console.log('API unavailable, updated locally'))
  }

  function deleteTodo(id) {
    updateTodos(todos.filter((t) => t.id !== id))
    axios.delete(`${API_URL}/${id}`).catch(() => console.log('API unavailable, deleted locally'))
  }

  return (
    <div className="container">
      <h1>My Todo List</h1>

      <div className="input-box">
        <input
          type="text"
          placeholder="Enter task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo.id)}
            />

            {editingId === todo.id ? (
              <input
                className="edit-input"
                value={editText}
                autoFocus
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEdit(todo.id)
                  if (e.key === 'Escape') cancelEdit()
                }}
              />
            ) : (
              <span className={todo.completed ? 'complete' : ''}>{todo.text}</span>
            )}

            {editingId === todo.id ? (
              <>
                <button className="save-btn" onClick={() => saveEdit(todo.id)}>Save</button>
                <button className="cancel-btn" onClick={cancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <button className="edit-btn" onClick={() => startEdit(todo)}>Edit</button>
                <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App