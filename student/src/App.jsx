import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import CourseRoom from './pages/CourseRoom'
import ProtectedRoute from './ProtectedRoute'
import Login from './pages/Login'
import { StudentProvider } from './context/ContextProvider'

const App = () => {
  return (
    <StudentProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Navbar /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="/course/:courseId" element={<CourseRoom />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StudentProvider>
  )
}

export default App
