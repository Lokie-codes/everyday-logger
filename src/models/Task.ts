// models/Task.ts
import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
}, {
  timestamps: true
});

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);
