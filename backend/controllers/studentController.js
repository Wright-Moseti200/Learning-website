const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Student = require('../models/student');
const Enrollment = require('../models/enrollment');
const Course = require('../models/course');

// --- Helper: Generate JWT ---
const generateToken = (id) => {
  return jwt.sign({ id, role: 'student' }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new student
// @route   POST /api/student/signup
// @access  Public
const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // 1. Check if student exists
    const userExists = await Student.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Student already exists' });
    }

    // 2. Hash password
    const saltRounds = parseInt(process.env.BRCYPT_SALT) || 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create student
    const student = await Student.create({
      fullName,
      email,
      password: hashedPassword,
    });

    if (student) {
      res.status(201).json({
        _id: student.id,
        fullName: student.fullName,
        email: student.email,
        token: generateToken(student.id),
      });
    } else {
      res.status(400).json({ message: 'Invalid student data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate student
// @route   POST /api/student/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check for student email
    const student = await Student.findOne({ email });

    // 2. Check password
    if (student && (await bcrypt.compare(password, student.password))) {
      res.json({
        _id: student.id,
        fullName: student.fullName,
        email: student.email,
        token: generateToken(student.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student's dashboard (Enrolled Courses)
// @route   GET /api/student/dashboard
// @access  Private (Student)
const getMyCourses = async (req, res) => {
  try {
    // Find all enrollment records for this student and populate the course details
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate({
        path: 'course',
        select: 'title description thumbnail price modules', // Select fields to display on dashboard
        populate: {
          path: 'teacher',
          select: 'fullName'
        }
      });

    // Transform data to include progress percentage directly in the response
    const dashboardData = enrollments
      .filter(enrollment => enrollment.course) // Filter out enrollments where course is null (deleted)
      .map(enrollment => {
        // Calculate progress based on completed lessons vs total lessons in course
        // (Simplified logic: assumes course.modules contains lesson count)
        return {
          courseId: enrollment.course._id,
          title: enrollment.course.title,
          thumbnail: enrollment.course.thumbnail,
          instructor: enrollment.course.teacher ? enrollment.course.teacher.fullName : 'Unknown Instructor',
          progress: enrollment.progress, // Stored in Enrollment model
          completedLessonIds: enrollment.completedLessons,
          modules: enrollment.course.modules // Include modules for CourseRoom
        };
      });

    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard', error: error.message });
  }
};

// @desc    Enroll in a course
// @route   POST /api/student/enroll/:courseId
// @access  Private
const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({ student: studentId, course: courseId });
    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Create Enrollment Record
    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      progress: 0,
      completedLessons: []
    });

    res.status(201).json({ message: 'Enrolled successfully', enrollment });
  } catch (error) {
    res.status(500).json({ message: 'Enrollment failed', error: error.message });
  }
};

// @desc    Update Lesson Progress
// @route   PUT /api/student/progress
// @access  Private
const updateProgress = async (req, res) => {
  try {
    const { courseId, lessonId } = req.body;
    const studentId = req.user.id;

    // 1. Find the enrollment record
    const enrollment = await Enrollment.findOne({ student: studentId, course: courseId });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // 2. Check if lesson is already marked complete
    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);

      // 3. Recalculate Progress Percentage (Need total lessons count from Course model)
      const course = await Course.findById(courseId);
      // Helper: Count total lessons across all modules
      let totalLessons = 0;
      course.modules.forEach(mod => totalLessons += mod.lessons.length);

      enrollment.progress = Math.round((enrollment.completedLessons.length / totalLessons) * 100);

      await enrollment.save();
    }

    res.json({
      message: 'Progress updated',
      progress: enrollment.progress,
      completedLessons: enrollment.completedLessons
    });

  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

// @desc    Get all available courses
// @route   GET /api/student/courses
// @access  Private
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({})
      .populate('teacher', 'fullName')
      .select('title description thumbnail price category modules'); // Select fields to display

    // Add student count to each course (optional, for popularity)
    // For now just return the courses
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch courses', error: error.message });
  }
};

module.exports = {
  signup,
  login,
  getMyCourses,
  enrollInCourse,
  updateProgress,
  getAllCourses,
};