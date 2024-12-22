const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // โหลด environment variables จาก .env

const app = express();
const PORT = process.env.PORT || 5000; // ใช้ PORT จาก .env หรือ default = 5000

// ตั้งค่า CORS ให้รองรับทุก origin หรือเฉพาะ origin ที่ต้องการ
app.use(cors({
  origin: '*', // URL ของ Frontend ที่ต้องการอนุญาต
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], // อนุญาต headers ที่จำเป็น
}));

// Middleware
app.use(express.json());

// เชื่อมต่อ MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// สร้าง Schema และ Model สำหรับ Task
const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  dueDate: { type: Date },
  status: { type: String, default: 'Pending' },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

// Routes
// GET: ดึงข้อมูล tasks ทั้งหมด
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(400).json({ error: 'Error fetching tasks: ' + err });
  }
});

// POST: เพิ่ม task ใหม่
app.post('/api/tasks', async (req, res) => {
  const { name, description, category, dueDate } = req.body;

  // ตรวจสอบข้อมูลที่ได้รับจาก client
  if (!name || !category || !dueDate) {
    return res.status(400).json({ error: 'Please provide name, category, and dueDate' });
  }

  try {
    const newTask = new Task({ name, description, category, dueDate });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.error('Error adding task:', err);
    res.status(500).json({ error: 'Internal Server Error: ' + err.message });
  }
});

// PUT: แก้ไข task
app.put('/api/tasks/:id', async (req, res) => {
  const { name, description, category, dueDate, status } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, { name, description, category, dueDate, status }, { new: true });
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: 'Error updating task: ' + err });
  }
});

// DELETE: ลบ task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Error deleting task: ' + err });
  }
});

// Serve static files in production (สำหรับ React frontend)
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, 'frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}

// เปิดเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
