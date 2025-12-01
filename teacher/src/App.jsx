import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

// --- Layouts & Guards ---
import Navbar from './components/Navbar';
import ProtectedRoute from './ProtectedRoute'; 

// --- Context Provider ---
import { CreatorProvider } from './context/ContextProvider';

// --- Pages ---
import Login from './pages/Login';
import TeacherDash from './pages/TeacherDash';
import CreateCourse from './pages/CreateCourse';

const App = () => {
  return (
    <CreatorProvider>
      <BrowserRouter>
        <Routes>
          {/* 1. Public Route: Login */}
          <Route path="/login" element={<Login />} />

          {/* 2. Protected Routes (Wrapped in Navbar) */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Navbar />
              </ProtectedRoute>
            }
          >
            <Route index element={<TeacherDash />} />
            <Route path="create-course" element={<CreateCourse />} />
            <Route path="edit-course/:courseId" element={<CreateCourse />} />
          </Route>

          {/* 3. Fallback Route (404) */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center h-screen bg-stone-50 text-stone-600">
              <h1 className="text-4xl font-bold mb-4">404</h1>
              <p className="mb-4">Page not found</p>
              <a href="/" className="text-amber-700 underline">Go back home</a>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </CreatorProvider>
  );
};

export default App;