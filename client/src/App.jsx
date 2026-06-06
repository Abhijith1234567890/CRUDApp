import { useState } from 'react'
import axios from 'axios'
import './App.css'

const API_URL = 'http://localhost:5000/api/todos'
const STORAGE_KEY = 'todos'

function getTodosFromStorage() {
  const savedTodos = localStorage.getItem(STORAGE_KEY)

  if (savedTodos) {
    return JSON.parse(savedTodos)
  }

  return []
}

function App() {
  const [task, setTask] = useState('')
  const [todos, setTodos] = useState(getTodosFromStorage)

  function saveToLocalStorage(newTodos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTodos))
  }

  function addTodo() {
    if (task.trim() === '') {
      alert('Please enter a task')
      return
    }

    const newTodo = {
      id: Date.now(),
      text: task,
      completed: false,
    }

    const updatedTodos = [...todos, newTodo]
    setTodos(updatedTodos)
    saveToLocalStorage(updatedTodos)
    setTask('')

    axios
      .post(API_URL, { title: task })
      .then((response) => {
        const savedTodo = {
          id: response.data.id,
          text: response.data.title,
          completed: response.data.completed,
        }

        const apiTodos = updatedTodos.map((todo) => {
          if (todo.id === newTodo.id) {
            return savedTodo
          }

          return todo
        })

        setTodos(apiTodos)
        saveToLocalStorage(apiTodos)
      })
      .catch(() => {
        console.log('Task saved in local storage')
      })
  }

  function completeTodo(id) {
    const currentTodo = todos.find((todo) => todo.id === id)

    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed }
      }

      return todo
    })

    setTodos(updatedTodos)
    saveToLocalStorage(updatedTodos)

    if (currentTodo) {
      axios
        .put(`${API_URL}/${id}`, {
          title: currentTodo.text,
          completed: !currentTodo.completed,
        })
        .catch(() => {
          console.log('Task updated in local storage')
        })
    }
  }

  function deleteTodo(id) {
    const remainingTodos = todos.filter((todo) => todo.id !== id)
    setTodos(remainingTodos)
    saveToLocalStorage(remainingTodos)

    axios.delete(`${API_URL}/${id}`).catch(() => {
      console.log('Task deleted from local storage')
    })
  }

  return (
    <div className="container">
      <h1>My Todo List</h1>

      <div className="input-box">
        <input
          type="text"
          placeholder="Enter task"
          value={task}
          onChange={(event) => setTask(event.target.value)}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => completeTodo(todo.id)}
            />

            <span className={todo.completed ? 'complete' : ''}>
              {todo.text}
            </span>

            <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
