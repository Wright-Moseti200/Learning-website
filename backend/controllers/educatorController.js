const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Educator = require('../models/educator');
const Course = require('../models/course'); // fixed typo
const Enrollment = require('../models/enrollment');

// --- Helper: Generate JWT ---
const generateToken = (id) => {
  return jwt.sign({ id, role: 'educator' }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new educator
// @route   POST /api/educator/signup
// @access  Public
const signup = async (req, res) => {
  try {
    const { fullName, email, password, specialization } = req.body;

    // 1. Check if user exists
    const userExists = await Educator.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Hash password
    const saltRounds = parseInt(process.env.BRCYPT_SALT) || 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create user
    const educator = await Educator.create({
      fullName,
      email,
      password: hashedPassword,
      specialization,
    });

    if (educator) {
      res.status(201).json({
        _id: educator.id,
        fullName: educator.fullName,
        email: educator.email,
        token: generateToken(educator.id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate educator
// @route   POST /api/educator/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check for user email
    const educator = await Educator.findOne({ email });

    // 2. Check password
    if (educator && (await bcrypt.compare(password, educator.password))) {
      res.json({
        _id: educator.id,
        fullName: educator.fullName,
        email: educator.email,
        token: generateToken(educator.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get educator's courses
// @route   GET /api/educator/courses
// @access  Private
const getMyCourses = async (req, res) => {
  try {
    const educatorId = req.user && req.user.id;
    if (!educatorId) return res.status(401).json({ message: 'Unauthorized' });

    const courses = await Course.find({
      $or: [{ teacher: educatorId }, { createdBy: educatorId }, { creator: educatorId }],
    }).sort({ createdAt: -1 }).lean();

    // Attach student count to each course
    const coursesWithStats = await Promise.all(courses.map(async (course) => {
      const studentCount = await Enrollment.countDocuments({ course: course._id });
      return { ...course, students: studentCount };
    }));

    res.json(coursesWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new course
// @route   POST /api/educator/create-course
// @access  Private (Educator only)
const createCourse = async (req, res) => {
  try {
    const { title, description, price, category, level, thumbnail, modules } = req.body;

    // Create course linked to the logged-in educator (req.user.id comes from auth middleware)
    const course = await Course.create({
      teacher: req.user.id,
      title,
      description,
      price,
      category,
      level,
      thumbnail,
      modules, // Assumes modules is an array of objects containing lesson data
    });

    // Optional: Add course ID to Educator's 'courses' array if you have that relationship
    await Educator.findByIdAndUpdate(req.user.id, {
      $push: { courses: course._id }
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create course', error: error.message });
  }
};

// @desc    Get single course
// @route   GET /api/educator/courses/:id
// @access  Private
const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    // Check ownership
    if (String(course.teacher) !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a course
// @route   PUT /api/educator/courses/:id
// @access  Private
const updateCourse = async (req, res) => {
  try {
    const { title, description, price, category, level, thumbnail, modules } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check ownership
    if (String(course.teacher) !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.price = price !== undefined ? price : course.price;
    course.category = category || course.category;
    course.level = level || course.level;
    course.thumbnail = thumbnail || course.thumbnail;
    course.modules = modules || course.modules;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a course
// @route   DELETE /api/educator/courses/:id
// @access  Private
const deleteCourse = async (req, res) => {
  try {
    const educatorId = req.user && req.user.id;
    const courseId = req.params.id;
    if (!educatorId) return res.status(401).json({ message: 'Unauthorized' });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Only allow deletion if educator is the owner (teacher or createdBy)
    if (String(course.teacher || course.createdBy || course.creator) !== String(educatorId)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await Course.deleteOne({ _id: courseId });
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Handle file upload response
// @route   POST /api/educator/upload
// @access  Private
const uploadMedia = (req, res) => {
  // The middleware 'upload.js' has already processed the file and stored it in Cloudinary.
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Cloudinary returns the URL in req.file.path
  const fileUrl = req.file.path;

  res.status(200).json({
    url: fileUrl,
    format: req.file.mimetype,
    originalName: req.file.originalname
  });
};

module.exports = {
  signup,
  login,
  createCourse,
  getMyCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  uploadMedia,
};