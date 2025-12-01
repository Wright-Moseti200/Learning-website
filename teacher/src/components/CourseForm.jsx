import React from 'react';

const CourseForm = ({ courseData, setCourseData }) => {
  // Destructure props with default values to prevent undefined errors
  const { 
    title = '', 
    description = '', 
    price = '', 
    category = 'Development', 
    level = 'Beginner',
    thumbnail = null 
  } = courseData || {};

  // Generic handler for all input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    // If you are using this inside a parent state, ensure setCourseData handles object updates
    setCourseData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 md:p-8 space-y-8 animate-fade-in-up">
      
      {/* Header */}
      <div className="border-b border-stone-100 pb-4">
        <h2 className="text-xl font-bold text-stone-800">Basic Information</h2>
        <p className="text-stone-500 text-sm mt-1">
          Help students find your course by providing accurate details.
        </p>
      </div>

      {/* Title Field */}
      <div>
        <label className="block text-sm font-bold text-stone-700 mb-2">
          Course Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={title}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-stone-400 bg-stone-50 focus:bg-white"
          placeholder="e.g. The Complete Web Development Bootcamp 2024"
        />
      </div>

      {/* Description Field */}
      <div>
        <label className="block text-sm font-bold text-stone-700 mb-2">
          Course Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          rows="6"
          value={description}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-stone-400 bg-stone-50 focus:bg-white resize-y"
          placeholder="Describe what students will learn, prerequisites, and target audience..."
        ></textarea>
        <div className="flex justify-end mt-1">
          <span className={`text-xs ${description.length > 1000 ? 'text-red-500' : 'text-stone-400'}`}>
            {description.length}/1000 characters
          </span>
        </div>
      </div>

      {/* Details Grid: Category, Level, Price */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Category Select */}
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-2">Category</label>
          <div className="relative">
            <select
              name="category"
              value={category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 outline-none bg-white appearance-none cursor-pointer"
            >
              <option value="Development">Development</option>
              <option value="Business">Business</option>
              <option value="Finance">Finance</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Health">Health & Fitness</option>
              <option value="Music">Music</option>
            </select>
            {/* Custom Arrow Icon */}
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-stone-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Level Select */}
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-2">Difficulty Level</label>
          <div className="relative">
            <select
              name="level"
              value={level}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 outline-none bg-white appearance-none cursor-pointer"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="All Levels">All Levels</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-stone-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Price Input */}
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-2">Price ($)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-500">
              <span className="font-bold text-lg">$</span>
            </div>
            <input
              type="number"
              name="price"
              value={price}
              onChange={handleChange}
              className="w-full pl-8 pr-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 outline-none bg-stone-50 focus:bg-white"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </div>

      {/* Thumbnail Upload (Visual UI) */}
      <div>
        <label className="block text-sm font-bold text-stone-700 mb-2">Course Thumbnail</label>
        <div className="border-2 border-dashed border-stone-300 rounded-xl p-8 flex flex-col items-center justify-center text-stone-500 hover:bg-amber-50 hover:border-amber-400 transition-all cursor-pointer group">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-white group-hover:shadow-md transition-all">
            {/* Image Icon */}
            <svg className="w-8 h-8 text-stone-400 group-hover:text-amber-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="font-bold text-stone-700 group-hover:text-amber-800 transition-colors">
            Click to upload thumbnail
          </p>
          <p className="text-xs mt-2 text-stone-400 group-hover:text-stone-500">
            SVG, PNG, JPG or GIF (Recommended 1280x720px)
          </p>
        </div>
      </div>

    </div>
  );
};

export default CourseForm;