const express = require('express');
const router = express.Router();

const educatorController = require('../controllers/educatorController');
const auth = require('../middleware/educatorAuth');
const upload = require('../middleware/upload');

// Auth: signup & login
router.post('/signup', educatorController.signup);
router.post('/login', educatorController.login);

// Upload file (protected)
router.post('/upload', auth, upload.single('file'), educatorController.uploadMedia);

// Courses - protected
router.get('/courses', auth, educatorController.getMyCourses);
router.post('/courses', auth, educatorController.createCourse);

// Delete a course
router.delete('/courses/:id', auth, educatorController.deleteCourse);

// Get single course
router.get('/courses/:id', auth, educatorController.getCourse);

// Update course
router.put('/courses/:id', auth, educatorController.updateCourse);

module.exports = router;