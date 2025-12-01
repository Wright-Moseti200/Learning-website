const mongoose = require('mongoose');

const educatorSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    specialization: {
      type: String,
      required: [true, 'Please specify your field'],
    },
    role: {
      type: String,
      default: 'educator', // distinguish from student
    },
    // Array of Course IDs created by this teacher
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

module.exports = mongoose.model('Educator', educatorSchema);