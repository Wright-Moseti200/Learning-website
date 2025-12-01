import React, { useState, useEffect } from 'react';

// Inline Icons
const Icons = {
  Video: ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
  FileText: ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  Clock: ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  X: ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
};

const LessonForm = ({ onSave, onCancel, initialData }) => {
  const [lessonData, setLessonData] = useState({
    title: '',
    type: 'video', // 'video' or 'text'
    duration: '',
    url: '', // For video
    content: '' // For text
  });

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setLessonData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(lessonData);
  };

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 shadow-sm animate-fade-in-up">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-stone-800">
          {initialData ? 'Edit Lesson Details' : 'Add New Lesson'}
        </h3>
        <button 
          onClick={onCancel}
          className="text-stone-400 hover:text-stone-600 transition-colors"
        >
          <Icons.X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Lesson Title */}
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-2">Lesson Title</label>
          <input
            type="text"
            required
            value={lessonData.title}
            onChange={(e) => setLessonData({...lessonData, title: e.target.value})}
            className="w-full px-4 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white placeholder-stone-400"
            placeholder="e.g. Introduction to HTML Tags"
          />
        </div>

        {/* Lesson Type Selection */}
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-2">Content Type</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setLessonData({...lessonData, type: 'video'})}
              className={`flex items-center justify-center gap-2 py-3 rounded-lg border-2 transition-all ${
                lessonData.type === 'video'
                  ? 'border-amber-600 bg-amber-50 text-amber-800 font-bold'
                  : 'border-stone-200 bg-white text-stone-500 hover:border-stone-300'
              }`}
            >
              <Icons.Video className="w-5 h-5" /> Video Lesson
            </button>
            <button
              type="button"
              onClick={() => setLessonData({...lessonData, type: 'text'})}
              className={`flex items-center justify-center gap-2 py-3 rounded-lg border-2 transition-all ${
                lessonData.type === 'text'
                  ? 'border-amber-600 bg-amber-50 text-amber-800 font-bold'
                  : 'border-stone-200 bg-white text-stone-500 hover:border-stone-300'
              }`}
            >
              <Icons.FileText className="w-5 h-5" /> Text / Article
            </button>
          </div>
        </div>

        {/* Dynamic Fields based on Type */}
        {lessonData.type === 'video' ? (
          <div className="animate-fade-in">
            <label className="block text-sm font-bold text-stone-700 mb-2">Video URL</label>
            <div className="flex gap-2">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-stone-300 bg-stone-100 text-stone-500 text-sm">
                https://
              </span>
              <input
                type="text"
                value={lessonData.url}
                onChange={(e) => setLessonData({...lessonData, url: e.target.value})}
                className="w-full px-4 py-2.5 rounded-r-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                placeholder="youtube.com/watch?v=..."
              />
            </div>
            <p className="text-xs text-stone-500 mt-1.5">Supports YouTube, Vimeo, or direct .mp4 links.</p>
          </div>
        ) : (
          <div className="animate-fade-in">
            <label className="block text-sm font-bold text-stone-700 mb-2">Lesson Content</label>
            <textarea
              rows="4"
              value={lessonData.content}
              onChange={(e) => setLessonData({...lessonData, content: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 outline-none bg-white"
              placeholder="Write your lesson content here..."
            ></textarea>
          </div>
        )}

        {/* Duration */}
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-2">Duration</label>
          <div className="relative w-1/2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
              <Icons.Clock className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={lessonData.duration}
              onChange={(e) => setLessonData({...lessonData, duration: e.target.value})}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 outline-none bg-white"
              placeholder="e.g. 10:05 or 5 min"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 rounded-lg text-stone-600 font-medium hover:bg-stone-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-stone-800 text-white font-bold hover:bg-stone-900 transition-colors shadow-sm"
          >
            {initialData ? 'Update Lesson' : 'Add Lesson'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default LessonForm;