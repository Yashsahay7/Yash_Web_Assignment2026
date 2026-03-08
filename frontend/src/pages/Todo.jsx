import { useState, useEffect } from 'react'

const API = 'http://localhost:5000/api'

function Todo() {
  const [todos, setTodos] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchTodos = async () => {
    try {
      const res = await fetch(`${API}/todos`)
      const data = await res.json()
      setTodos(data)
    } catch {
      console.log('Backend not connected yet')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTodos() }, [])

  const addTodo = async () => {
    if (!text.trim()) return
    const res = await fetch(`${API}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    })
    const newTodo = await res.json()
    setTodos([newTodo, ...todos])
    setText('')
  }

  const toggleTodo = async (id) => {
    const res = await fetch(`${API}/todos/${id}`, { method: 'PATCH' })
    const updated = await res.json()
    setTodos(todos.map(t => t._id === id ? updated : t))
  }

  const deleteTodo = async (id) => {
    await fetch(`${API}/todos/${id}`, { method: 'DELETE' })
    setTodos(todos.filter(t => t._id !== id))
  }

  const completed = todos.filter(t => t.completed).length

  return (
    <div style={{ display:'flex', justifyContent:'center', padding:'40px 16px' }}>
      <div style={{ background:'white', borderRadius:'12px', padding:'36px',
        boxShadow:'0 4px 20px rgba(0,0,0,0.08)', width:'100%', maxWidth:'550px' }}>

        <h2 style={{ marginBottom:'4px' }}>📝 My Tasks</h2>
        <p style={{ color:'#718096', marginBottom:'24px' }}>
          {completed}/{todos.length} tasks completed
        </p>

        {/* Add Todo Input */}
        <div style={{ display:'flex', gap:'8px', marginBottom:'24px' }}>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTodo()}
            placeholder="Add a new task..."
            style={{ flex:1, padding:'10px 14px', border:'1px solid #e2e8f0',
              borderRadius:'8px', fontSize:'0.95rem', outline:'none' }}
          />
          <button onClick={addTodo}
            style={{ padding:'10px 20px', background:'#667eea', color:'white',
              border:'none', borderRadius:'8px', fontWeight:'600', cursor:'pointer' }}>
            Add
          </button>
        </div>

        {/* Todo List */}
        {loading ? (
          <p style={{ textAlign:'center', color:'#a0aec0' }}>Loading...</p>
        ) : todos.length === 0 ? (
          <p style={{ textAlign:'center', color:'#a0aec0' }}>No tasks yet. Add one above! 👆</p>
        ) : (
          <ul style={{ listStyle:'none', padding:0, margin:0 }}>
            {todos.map(todo => (
              <li key={todo._id}
                style={{ display:'flex', alignItems:'center', gap:'12px',
                  padding:'14px 0', borderBottom:'1px solid #e2e8f0' }}>

                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo._id)}
                  style={{ width:'18px', height:'18px', cursor:'pointer' }}
                />

                {/* Task Text */}
                <span style={{ flex:1, fontSize:'0.95rem',
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? '#a0aec0' : '#2d3748' }}>
                  {todo.text}
                </span>

                {/* Delete Button */}
                <button onClick={() => deleteTodo(todo._id)}
                  style={{ background:'#fc8181', color:'white', border:'none',
                    padding:'5px 10px', borderRadius:'6px', cursor:'pointer' }}>
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Todo
