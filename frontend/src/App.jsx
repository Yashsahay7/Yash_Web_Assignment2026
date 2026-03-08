import Todo from './pages/Todo'

function App() {
  return (
    <div style={{ minHeight:'100vh', background:'#f0f4f8', fontFamily:'Segoe UI, sans-serif' }}>
      <nav style={{ background:'#1a1a2e', color:'white', padding:'16px 32px' }}>
        <span style={{ fontSize:'1.3rem', fontWeight:'bold' }}>✅ E-Cell Todo App</span>
      </nav>
      <Todo />
    </div>
  )
}

export default App
