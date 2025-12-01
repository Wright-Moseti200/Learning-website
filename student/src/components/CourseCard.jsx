import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  // Destructure with default values to prevent crashes if data is missing
  const {
    title = "Untitled Course",
    instructor = "Jifunze Instructor",
    thumbnail,
    progress = 0,
    totalLessons = 0,
    completedLessons = 0
  } = course || {};

  // Resolve ID from various possible fields
  const id = course?.courseId || course?._id || course?.id;

  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full group">

      {/* --- 1. Thumbnail Section --- */}
      <div className="relative h-48 bg-stone-100 overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          /* Fallback Placeholder Pattern if no image */
          <div className="w-full h-full flex items-center justify-center bg-amber-50 text-amber-200">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )}

        {/* Floating Play Icon on Hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <svg className="w-5 h-5 text-amber-700 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* --- 2. Card Body --- */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title & Instructor */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-stone-800 leading-snug line-clamp-2 mb-1 group-hover:text-amber-700 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-stone-500 font-medium">
            {instructor}
          </p>
        </div>

        {/* Progress Section */}
        <div className="mt-auto">
          <div className="flex justify-between items-end text-xs font-semibold text-stone-600 mb-1">
            <span>{progress}% Completed</span>
            <span>{completedLessons}/{totalLessons} Lessons</span>
          </div>

          {/* Progress Bar Container */}
          <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
            {/* Animated Progress Fill */}
            <div
              className="bg-amber-600 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* --- 3. Action Button --- */}
        <Link
          to={`/course/${id}`}
          className="mt-6 w-full block text-center py-2.5 rounded-lg text-sm font-bold transition-all duration-200
            bg-stone-50 text-stone-700 border border-stone-200 
            hover:bg-amber-700 hover:text-white hover:border-amber-700 hover:shadow-md"
        >
          {progress === 0 ? 'Start Learning' : 'Continue Course'}
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;