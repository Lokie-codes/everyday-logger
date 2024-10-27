// models/TaskCompletion.ts
import mongoose from 'mongoose';

const TaskCompletionSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  date: { type: Date, required: true },
  completed: { type: Boolean, required: true },
}, {
  timestamps: true
});

export default mongoose.models.TaskCompletion || mongoose.model('TaskCompletion', TaskCompletionSchema);