const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    priority: { type: String, enum: ['low', 'medium', 'high'], required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'userData', required: true },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Task', TaskSchema);
