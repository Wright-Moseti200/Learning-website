import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCreator } from '../context/ContextProvider';

// --- Icons ---
const Icons = {
  Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  Users: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  DollarSign: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Star: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363 1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
  Edit: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  MoreVertical: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
};

const TeacherDash = () => {
  const { myCourses, fetchMyCourses, loading, user, deleteCourse } = useCreator();

  // Fetch courses on mount (or when token changes inside provider)
  // useEffect(() => {
  //   fetchMyCourses();
  // }, [fetchMyCourses]);

  const handleDeleteCourse = async (courseId) => {
    if (!courseId) return;
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) return;

    const success = await deleteCourse(courseId);
    if (!success) {
      // Could show a toast or set a local error state
      console.error('Failed to delete course');
    }
  };

  // Calculate Stats Dynamically
  const stats = useMemo(() => {
    const totalStudents = myCourses.reduce((acc, course) => acc + (course.students || 0), 0);
    // Revenue Estimate
    const totalRevenue = myCourses.reduce((acc, course) => acc + ((course.price || 0) * (course.students || 0)), 0);

    return {
      totalStudents,
      totalRevenue,
      averageRating: 4.8
    };
  }, [myCourses]);

  return (
    <div className="min-h-screen bg-stone-50 p-6 md:p-10 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* --- 1. Header Section --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-stone-900">
              {user?.fullName ? `Welcome, ${user.fullName}` : 'Instructor Dashboard'}
            </h1>
            <p className="text-stone-500 mt-1">Manage your courses and track your performance.</p>
          </div>
          <Link
            to="/create-course"
            className="flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Icons.Plus />
            Create New Course
          </Link>
        </div>

        {/* --- 2. Stats Overview --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Students */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
              <Icons.Users />
            </div>
            <div>
              <p className="text-sm font-medium text-stone-500">Total Students</p>
              <h3 className="text-2xl font-bold text-stone-900">{stats.totalStudents.toLocaleString()}</h3>
            </div>
          </div>

          {/* Card 2: Revenue */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-green-50 text-green-600 rounded-xl">
              <Icons.DollarSign />
            </div>
            <div>
              <p className="text-sm font-medium text-stone-500">Est. Revenue</p>
              <h3 className="text-2xl font-bold text-stone-900">${stats.totalRevenue.toLocaleString()}</h3>
            </div>
          </div>

          {/* Card 3: Rating */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-amber-50 text-amber-600 rounded-xl">
              <Icons.Star />
            </div>
            <div>
              <p className="text-sm font-medium text-stone-500">Instructor Rating</p>
              <h3 className="text-2xl font-bold text-stone-900">{stats.averageRating} / 5.0</h3>
            </div>
          </div>
        </div>

        {/* --- 3. My Courses Section --- */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-stone-800">Your Courses</h2>
            <div className="flex gap-2">
              {loading && <span className="text-sm text-amber-600 animate-pulse">Syncing...</span>}
            </div>
          </div>

          {loading && myCourses.length === 0 ? (
            <div className="text-center py-20 text-stone-400">Loading your courses...</div>
          ) : myCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCourses.map((course) => (
                <div key={course._id || course.id} className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden group hover:shadow-md transition-all">

                  {/* Thumbnail Area */}
                  <div className="relative h-48 bg-stone-100 border-b border-stone-100">
                    {course.thumbnail && course.thumbnail.startsWith('http') ? (
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-stone-400">
                        <span className="text-xs font-medium uppercase tracking-wide">No Image</span>
                      </div>
                    )}

                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold shadow-sm bg-green-100 text-green-700 border border-green-200">
                        Published
                      </span>
                    </div>

                    <button className="absolute top-3 right-3 p-1.5 bg-white/90 rounded-md text-stone-600 hover:text-amber-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <Icons.MoreVertical />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-stone-800 text-lg mb-1 leading-tight line-clamp-1">{course.title}</h3>
                    <p className="text-sm text-stone-500 mb-4">${course.price}</p>

                    <div className="flex justify-between items-center text-xs font-medium text-stone-500 border-t border-stone-100 pt-4">
                      <div className="flex items-center gap-1">
                        <Icons.Users />
                        <span>{course.students || 0} students</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-stone-400">Revenue:</span>
                        <span className="text-stone-700 font-bold">
                          ${((course.price || 0) * (course.students || 0)).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex gap-2">
                      <Link
                        to={`/edit-course/${course._id || course.id}`}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-stone-50 text-stone-600 text-sm font-semibold hover:bg-stone-100 transition-colors border border-stone-200"
                      >
                        <Icons.Edit /> Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteCourse(course._id || course.id)}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-100"
                      >
                        <Icons.Trash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-stone-300">
              <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icons.Plus />
              </div>
              <h3 className="text-lg font-bold text-stone-900">No courses yet</h3>
              <p className="text-stone-500 mb-6 max-w-sm mx-auto">Get started by creating your first course and sharing your knowledge with the world.</p>
              <Link
                to="/create-course"
                className="inline-flex items-center gap-2 bg-amber-700 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-amber-800 transition-colors"
              >
                Create First Course
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDash;