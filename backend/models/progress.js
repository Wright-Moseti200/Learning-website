const mongoose = require('mongoose');

const enrollmentSchema = mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    // Calculated percentage (0-100)
    progress: {
      type: Number,
      default: 0,
    },
    // Array of Lesson IDs that have been marked as completed
    completedLessons: [
      {
        type: String, // Storing the _id of the sub-document lessons
      },
    ],
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent a student from enrolling in the same course twice
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);