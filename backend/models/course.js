const mongoose = require('mongoose');

// --- Level 3: Lesson Schema ---
const lessonSchema = mongoose.Schema({
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['video', 'text', 'quiz'], 
    required: true 
  },
  url: { type: String },      // Cloudinary URL for videos
  content: { type: String },  // Markdown/Text content for articles
  duration: { type: String }, // e.g., "10:05"
});

// --- Level 2: Module Schema ---
const moduleSchema = mongoose.Schema({
  title: { type: String, required: true },
  lessons: [lessonSchema], // Array of lessons
});

// --- Level 1: Course Schema ---
const courseSchema = mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Educator',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a course title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    price: {
      type: Number,
      required: true,
      default: 0.0,
    },
    category: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'Beginner',
    },
    thumbnail: {
      type: String, // Cloudinary URL for the cover image
      default: 'https://via.placeholder.com/640x360.png?text=No+Image',
    },
    modules: [moduleSchema], // Array of modules
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Course', courseSchema);