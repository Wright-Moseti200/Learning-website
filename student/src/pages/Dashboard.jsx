import React, { useState, useEffect } from 'react';
import CourseCard from '../components/CourseCard';
import { useStudent } from '../context/ContextProvider';

const Dashboard = () => {
  const { courses, fetchDashboard, user, fetchAllCourses, enrollInCourse } = useStudent();
  const [searchQuery, setSearchQuery] = useState('');
  const [availableCourses, setAvailableCourses] = useState([]);

  // Fetch dashboard data on mount
  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Always fetch available courses to allow browsing
  useEffect(() => {
    const loadAvailable = async () => {
      console.log("Dashboard: Fetching available courses...");
      const data = await fetchAllCourses();
      console.log("Dashboard: Available courses data:", data);
      setAvailableCourses(data);
    };
    loadAvailable();
  }, [fetchAllCourses]);

  // Filter Enrolled Courses
  const enrolledCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (course.instructor && course.instructor.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (course.teacher && course.teacher.fullName && course.teacher.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filter Available Courses (Exclude already enrolled)
  const unenrolledCourses = availableCourses
    .filter(ac => !courses.some(c => (c.courseId && c.courseId === ac._id) || (c._id && c._id === ac._id)))
    .filter(course =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.teacher && course.teacher.fullName && course.teacher.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const handleEnroll = async (courseId) => {
    await enrollInCourse(courseId);
  };

  return (
    <div className="space-y-12 animate-fade-in-up">

      {/* --- 1. Header & Stats Section --- */}
      <div className="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-800">
              Welcome back, <span className="text-amber-700">{user?.fullName || 'Student'}</span>
            </h1>
            <p className="text-stone-500 mt-1">
              {courses.length > 0
                ? `You have ${courses.filter(c => c.progress > 0 && c.progress < 100).length} courses in progress.`
                : "Start your learning journey today!"}
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium bg-amber-50 text-amber-800 px-4 py-2 rounded-full border border-amber-100">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Current Streak: 3 Days</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
            <p className="text-stone-500 text-sm font-medium">Courses Completed</p>
            <p className="text-2xl font-bold text-stone-800 mt-1">
              {courses.filter(c => c.progress === 100).length}
            </p>
          </div>
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
            <p className="text-stone-500 text-sm font-medium">Total Learning Hours</p>
            <p className="text-2xl font-bold text-stone-800 mt-1">24.5h</p>
          </div>
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
            <p className="text-stone-500 text-sm font-medium">Average Score</p>
            <p className="text-2xl font-bold text-stone-800 mt-1">88%</p>
          </div>
        </div>
      </div>

      {/* --- 2. Search Bar --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-bold text-stone-800">Dashboard</h2>

        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 border border-stone-200 rounded-lg leading-5 bg-white placeholder-stone-400 focus:outline-none focus:placeholder-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 sm:text-sm shadow-sm"
          />
        </div>
      </div>

      {/* --- 3. My Courses Section --- */}
      {courses.length > 0 && (
        <section>
          <h3 className="text-lg font-bold text-stone-700 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-amber-500 rounded-full"></span>
            My Courses
          </h3>
          {enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {enrolledCourses.map((course) => (
                <div key={course.courseId || course._id} className="h-full">
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-stone-500 italic">No enrolled courses match your search.</p>
          )}
        </section>
      )}

      {/* --- 4. Available Courses Section --- */}
      <section>
        <h3 className="text-lg font-bold text-stone-700 mb-4 flex items-center gap-2">
          <span className="w-2 h-8 bg-stone-400 rounded-full"></span>
          Available Courses
        </h3>

        {unenrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {unenrolledCourses.map((course) => (
              <div key={course._id} className="h-full relative group">
                <CourseCard course={course} />
                {/* Enroll Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center rounded-xl backdrop-blur-sm">
                  <button
                    onClick={() => handleEnroll(course._id)}
                    className="bg-amber-600 text-white px-8 py-3 rounded-full font-bold hover:bg-amber-700 transform hover:scale-105 transition-all shadow-lg flex items-center gap-2"
                  >
                    <span>Enroll Now</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
            <p className="text-stone-500">
              {availableCourses.length === 0
                ? "Loading available courses..."
                : "No new courses available to enroll in."}
            </p>
          </div>
        )}
      </section>

    </div>
  );
};

export default Dashboard;