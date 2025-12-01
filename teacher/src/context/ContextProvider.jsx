import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

const CreatorContext = createContext();

// Base API URL
const API_URL = 'http://localhost:5000/api/educator';

export const CreatorProvider = ({ children }) => {
  // --- STATE ---
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('educatorToken') || null);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ref to track loading state synchronously to prevent multiple clicks
  const loadingRef = useRef(false);
  // Ref to store the AbortController for fetchMyCourses
  const fetchCoursesAbortController = useRef(null);

  const setLoadingState = (state) => {
    setLoading(state);
    loadingRef.current = state;
  };

  // --- 1. AUTHENTICATION (Educator Specific) ---

  const login = async (email, password) => {
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
      if (!response.ok) throw new Error(data.message || 'Failed to login');
      const authToken = data.token || data.accessToken;
      if (authToken) {
        setToken(authToken);
        localStorage.setItem('educatorToken', authToken);
      }
      setUser(data.user || data.educator || { email });
      return true;
    } catch (err) {
      setError(err.message || 'Login failed');
      return false;
    } finally {
      setLoadingState(false);
    }
  };

  const signup = async (fullName, email, password, specialization) => {
    if (loadingRef.current) return false;
    setLoadingState(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, specialization }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Signup failed');

      const authToken = data.token || data.accessToken;
      if (authToken) {
        setToken(authToken);
        localStorage.setItem('educatorToken', authToken);
      }
      setUser(data.user || data.educator || { email, fullName });
      return true;
    } catch (err) {
      setError(err.message || 'Signup failed');
      return false;
    } finally {
      setLoadingState(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('educatorToken');
    setToken(null);
    setUser(null);
    setMyCourses([]);
  };

  // --- 2. COURSE MANAGEMENT ---

  const fetchMyCourses = async () => {
    // Cancel previous request if it exists
    if (fetchCoursesAbortController.current) {
      fetchCoursesAbortController.current.abort();
    }
    fetchCoursesAbortController.current = new AbortController();

    setLoadingState(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/courses`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        signal: fetchCoursesAbortController.current.signal,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch courses');
      // Expecting an array
      setMyCourses(Array.isArray(data) ? data : (data.courses || []));
      return true;
    } catch (err) {
      if (err.name === 'AbortError') return false; // Ignore abort errors
      setError(err.message || 'Failed to fetch courses');
      return false;
    } finally {
      setLoadingState(false);
    }
  };

  const deleteCourse = async (courseId) => {
    if (!courseId) return false;
    if (loadingRef.current) return false;
    setLoadingState(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete course');

      setMyCourses((prev) => prev.filter((c) => (c._id || c.id) !== courseId));
      return true;
    } catch (err) {
      setError(err.message || 'Delete failed');
      return false;
    } finally {
      setLoadingState(false);
    }
  };

  const fetchCourse = async (courseId) => {
    if (loadingRef.current) return null;
    setLoadingState(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/courses/${courseId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch course');
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch course');
      return null;
    } finally {
      setLoadingState(false);
    }
  };

  const updateCourse = async (courseId, courseData, modules) => {
    if (loadingRef.current) return false;
    setLoadingState(true);
    setError(null);
    try {
      // Ensure thumbnail is a URL if it's new
      let thumbnailUrl = courseData.thumbnail;
      if (thumbnailUrl && typeof thumbnailUrl !== 'string') {
        thumbnailUrl = await uploadFile(thumbnailUrl);
      }

      // Upload any file lessons that are File objects
      let modulesWithUrls = modules;
      if (modules) {
        modulesWithUrls = await Promise.all(
          modules.map(async (mod) => {
            const lessons = await Promise.all(
              (mod.lessons || []).map(async (l) => {
                if (l.file) {
                  const url = await uploadFile(l.file);
                  return { ...l, url, file: undefined, uploading: false };
                }
                return l;
              })
            );
            return { ...mod, lessons };
          })
        );
      }

      const payload = {
        ...courseData,
        thumbnail: thumbnailUrl,
        modules: modulesWithUrls,
      };

      const response = await fetch(`${API_URL}/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      console.log('Update Course Response Status:', response.status);

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Update course failed');

      // Update local state
      setMyCourses((prev) =>
        prev.map((c) => ((c._id || c.id) === courseId ? (data.course || data) : c))
      );
      return true;
    } catch (err) {
      setError(err.message || 'Update course failed');
      return false;
    } finally {
      setLoadingState(false);
    }
  };

  // Re-run fetch when token changes (e.g., login/logout)
  useEffect(() => {
    if (token) fetchMyCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // --- 3. CREATE & UPLOAD LOGIC ---

  const uploadFile = async (file) => {
    if (!file) throw new Error('No file provided');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Upload failed');
      // expect data.url or data.fileUrl
      return data.url || data.fileUrl || data.secure_url || data.path;
    } catch (err) {
      setError(err.message || 'Upload failed');
      throw err;
    }
  };

  const createCourse = async (courseData, modules) => {
    if (loadingRef.current) return false;
    setLoadingState(true);
    setError(null);
    try {
      // Ensure thumbnail is a URL
      let thumbnailUrl = courseData.thumbnail;
      if (thumbnailUrl && typeof thumbnailUrl !== 'string') {
        thumbnailUrl = await uploadFile(thumbnailUrl);
      }

      // Upload any file lessons that are File objects
      const modulesWithUrls = await Promise.all(
        modules.map(async (mod) => {
          const lessons = await Promise.all(
            (mod.lessons || []).map(async (l) => {
              if (l.file) {
                const url = await uploadFile(l.file);
                return { ...l, url, file: undefined, uploading: false };
              }
              return l;
            })
          );
          return { ...mod, lessons };
        })
      );

      const payload = {
        title: courseData.title,
        description: courseData.description,
        category: courseData.category,
        price: Number(courseData.price) || 0,
        thumbnail: thumbnailUrl,
        modules: modulesWithUrls,
      };

      const response = await fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Create course failed');

      // Add created course locally
      setMyCourses((prev) => [data.course || data || payload, ...prev]);
      return true;
    } catch (err) {
      setError(err.message || 'Create course failed');
      return false;
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <CreatorContext.Provider
      value={{
        user,
        token,
        myCourses,
        loading,
        error,
        login,
        signup,
        logout,
        fetchMyCourses,
        createCourse,
        uploadFile,
        deleteCourse,
        fetchCourse,
        updateCourse,
      }}
    >
      {children}
    </CreatorContext.Provider>
  );
};

export const useCreator = () => useContext(CreatorContext);

export default CreatorProvider;