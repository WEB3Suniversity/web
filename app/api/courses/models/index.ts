// models/Course.js
import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  level: { type: String, required: true },
  category: { type: String, required: true },
  modules: { type: Number, required: true },
  hours: { type: Number, required: true },
  rewards: { type: Number, required: true },
  price: { type: Number, required: true },
  contractCourseId: { type: Number },
  status: { 
    type: String, 
    enum: ['pending', 'active', 'failed'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Course || mongoose.model('Course', CourseSchema);
