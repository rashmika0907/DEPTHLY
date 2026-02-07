import mongoose from 'mongoose';

const historySchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  topic: { type: String, required: true },
  level: { type: String, required: true },
  content: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('History', historySchema);
