const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// ─── Logging Middleware ───────────────────────────────
// logs every request like: GET /api/todos 200 5ms
app.use(morgan('combined'));

app.use(cors());
app.use(express.json());

// ─── MongoDB Connection ───────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB error:', err));

// ─── Todo Schema ──────────────────────────────────────
const todoSchema = new mongoose.Schema({
  text:      { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Todo = mongoose.model('Todo', todoSchema);

// ─── Routes ───────────────────────────────────────────

app.get('/api/todos', async (req, res) => {
  try {
    console.log('📋 Fetching all todos...');
    const todos = await Todo.find().sort({ createdAt: -1 });
    console.log(`✅ Found ${todos.length} todos`);
    res.json(todos);
  } catch (err) {
    console.error('❌ Error fetching todos:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/todos', async (req, res) => {
  try {
    console.log('➕ Creating new todo:', req.body.text);
    const todo = new Todo({ text: req.body.text });
    await todo.save();
    console.log('✅ Todo created:', todo._id);
    res.status(201).json(todo);
  } catch (err) {
    console.error('❌ Error creating todo:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.patch('/api/todos/:id', async (req, res) => {
  try {
    console.log('🔄 Toggling todo:', req.params.id);
    const todo = await Todo.findById(req.params.id);
    todo.completed = !todo.completed;
    await todo.save();
    console.log(`✅ Todo ${req.params.id} is now ${todo.completed ? 'completed' : 'incomplete'}`);
    res.json(todo);
  } catch (err) {
    console.error('❌ Error toggling todo:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    console.log('🗑️ Deleting todo:', req.params.id);
    await Todo.findByIdAndDelete(req.params.id);
    console.log('✅ Todo deleted:', req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting todo:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/', (req, res) => res.send('Todo Backend is running ✅'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Logging enabled`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
