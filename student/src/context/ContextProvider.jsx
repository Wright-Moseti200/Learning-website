import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';

// Initialize Context
const StudentContext = createContext();

// Base API URL (Adjust based on your backend port)
const API_URL = 'http://localhost:5000/api/student';

export const StudentProvider = ({ children }) => {
  // --- STATE ---
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    const t = localStorage.getItem('studentToken');
    return (t && t !== 'null' && t !== 'undefined') ? t : null;
  });
  const [courses, setCourses] = useState([]); // Dashboard Courses
  const [activeCourse, setActiveCourse] = useState(null); // Current CourseRoom Data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Refs for preventing race conditions
  const loadingRef = useRef(false);
  const fetchDashboardAbortController = useRef(null);

  // Helper to sync ref with state
  const setLoadingState = useCallback((isLoading) => {
    loadingRef.current = isLoading;
    setLoading(isLoading);
  }, []);

  // --- 1. AUTHENTICATION LOGIC ---

  // Check for token on mount to restore session
  useEffect(() => {
    if (token) {
      // In a real app, you might hit an /api/student/me endpoint here to verify token validity
      // For now, we assume if token exists, they are logged in.
      setUser({ token });
      fetchDashboard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = useCallback(async (email, password) => {
    if (loadingRef.current) return false;
    setLoadingState(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Login failed');

      // Success
      localStorage.setItem('studentToken', data.token);
      setToken(data.token);
      setUser(data);
      return true; // Return true to let the component know to redirect
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoadingState(false);
    }
  }, [setLoadingState]);

  const signup = useCallback(async (fullName, email, password) => {
    if (loadingRef.current) return false;
    setLoadingState(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Signup failed');

      // Auto-login after signup
      localStorage.setItem('studentToken', data.token);
      setToken(data.token);
      setUser(data);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoadingState(false);
    }
  }, [setLoadingState]);

  const logout = useCallback(() => {
    localStorage.removeItem('studentToken');
    setToken(null);
    setUser(null);
    setCourses([]);
  }, []);

  // --- 2. DATA FETCHING (DASHBOARD) ---

  const fetchDashboard = useCallback(async () => {
    // Cancel previous request if exists
    if (fetchDashboardAbortController.current) {
      fetchDashboardAbortController.current.abort();
    }
    fetchDashboardAbortController.current = new AbortController();

    setLoadingState(true);
    try {
      const response = await fetch(`${API_URL}/dashboard`, {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        signal: fetchDashboardAbortController.current.signal
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setCourses(data);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message);
      // If auth fails (401), force logout
      if (err.message && err.message.includes('authorized')) logout();
    } finally {
      setLoadingState(false);
    }
  }, [token, logout, setLoadingState]);

  // --- 3. COURSE ROOM LOGIC ---

  const fetchCourse = useCallback(async (courseId) => {
    // Allow fetching course details even if something else is loading (e.g. background refresh)
    // if (loadingRef.current) return;
    setLoadingState(true);
    try {
      // Option A: If Dashboard already loaded this course data, use it to save bandwidth
      // Note: We use a ref or functional update to access latest courses if we want to avoid adding courses to dependency
      // But here we can just add courses to dependency or trust that courses doesn't change too often while fetching
      // Actually, accessing state inside useCallback requires it to be in dependency.
      // To avoid frequent updates, we can use the API always, OR accept that fetchCourse changes when courses changes.

      // For now, let's just fetch from API to ensure fresh data and avoid dependency hell, 
      // OR use the courses from state but add it to dependency.
      // Let's try to find it in the current courses state.

      // WARNING: If we add 'courses' to dependency, fetchCourse changes whenever courses changes.
      // This might be fine.

      const cachedCourse = courses.find(c => c.courseId === courseId || c._id === courseId);

      if (cachedCourse) {
        setActiveCourse(cachedCourse);
        setLoadingState(false);
        return;
      }

      // Option B: Fetch specific course if not in dashboard (e.g., direct link)
      const response = await fetch(`${API_URL}/dashboard`, {
        headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
      });
      const data = await response.json();
      const specificCourse = data.find(c => c.courseId === courseId || c._id === courseId);

      if (specificCourse) {
        setActiveCourse(specificCourse);
      } else {
        throw new Error('Course not found');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingState(false);
    }
  }, [token, courses, setLoadingState]);

  // --- 4. ENROLLMENT LOGIC ---
  const enrollInCourse = useCallback(async (courseId) => {
    if (loadingRef.current) return false;
    setLoadingState(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/enroll/${courseId}`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Enrollment failed');

      // Refresh dashboard to show new course
      await fetchDashboard();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoadingState(false);
    }
  }, [token, fetchDashboard, setLoadingState]);

  // --- 5. PROGRESS TRACKING ---

  const markLessonComplete = useCallback(async (courseId, lessonId) => {
    try {
      // 1. Optimistic Update (Update UI immediately before API responds)
      setActiveCourse(prev => {
        if (!prev) return null;
        const alreadyCompleted = prev.completedLessonIds.includes(lessonId);
        if (alreadyCompleted) return prev;

        return {
          ...prev,
          completedLessonIds: [...prev.completedLessonIds, lessonId],
        };
      });

      // 2. API Call
      const response = await fetch(`${API_URL}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ courseId, lessonId })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      // 3. Sync State with Server Response (Correct % calculation)
      // Update both ActiveCourse AND Dashboard list
      setActiveCourse(prev => ({
        ...prev,
        progress: data.progress,
        completedLessonIds: data.completedLessons
      }));

      setCourses(prevCourses => prevCourses.map(c =>
        c.courseId === courseId
          ? { ...c, progress: data.progress, completedLessonIds: data.completedLessons }
          : c
      ));

    } catch (err) {
      console.error("Progress update failed:", err);
      // Optionally revert optimistic update here
    }
  }, [token]);

  // --- 6. BROWSE COURSES ---
  const fetchAllCourses = useCallback(async () => {
    // Note: We don't block on loadingRef here to allow this to run in parallel with fetchDashboard
    // if (loadingRef.current) return []; 

    // We still set loading state to indicate activity
    setLoadingState(true);
    try {
      const response = await fetch(`${API_URL}/courses`, {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      // If we have multiple concurrent requests, setting this to false might hide the spinner 
      // even if another request is still running. 
      // For a simple app, this is acceptable, or we could use a counter.
      setLoadingState(false);
    }
  }, [token, setLoadingState]);

  return (
    <StudentContext.Provider
      value={{
        // State
        user,
        token,
        courses,
        activeCourse,
        loading,
        error,
        // Actions
        login,
        signup,
        logout,
        fetchDashboard,
        fetchCourse,
        enrollInCourse,
        markLessonComplete,
        fetchAllCourses
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

// Custom Hook for easier imports
export const useStudent = () => useContext(StudentContext);

export default StudentProvider;