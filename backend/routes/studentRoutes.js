const express = require('express');
const sturouter = express.Router();

// 1. Import Controllers
const {
  signup,
  login,
  getMyCourses,
  enrollInCourse,
  updateProgress,
  getAllCourses,
} = require('../controllers/studentController');

// 2. Import Middleware
const protect = require('../middleware/studentAuth');

// --- PUBLIC ROUTES ---
sturouter.post('/signup', signup);
sturouter.post('/login', login);

// --- PROTECTED ROUTES ---

// Get the main dashboard (Enrolled courses + Progress %)
sturouter.get('/dashboard', protect, getMyCourses);

// Get all available courses (for browsing)
sturouter.get('/courses', protect, getAllCourses);

// Enroll in a specific course
sturouter.post('/enroll/:courseId', protect, enrollInCourse);

// Update progress (Mark a lesson as watched)
sturouter.put('/progress', protect, updateProgress);

module.exports = sturouter;