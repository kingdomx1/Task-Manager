const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  dueDate: { type: Date },
  status: { type: String, default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
