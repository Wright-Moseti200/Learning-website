import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useStudent } from '../context/ContextProvider';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useStudent();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper for active link styling (Brown/Amber theme)
  const isActive = (path) => {
    return location.pathname === path
      ? "text-amber-700 bg-amber-50 font-semibold"
      : "text-stone-600 hover:text-amber-700 hover:bg-stone-50";
  };

  return (
    <>
      {/* --- Fixed Navigation Bar --- */}
      <nav className="fixed w-full top-0 z-50 bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">

            {/* 1. Logo Section */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 group">
                {/* Custom Book Icon (Inline SVG) */}
                <div className="w-10 h-10 bg-amber-700 rounded-lg flex items-center justify-center text-white shadow-md transition-transform duration-300 group-hover:scale-105">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span className="font-bold text-2xl text-stone-800 tracking-tight">
                  Jifunze<span className="text-amber-700">Hub</span>
                </span>
              </Link>
            </div>

            {/* 2. Desktop Menu (Hidden on Mobile) */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-200 ${isActive('/')}`}
              >
                {/* Dashboard Icon */}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Dashboard
              </Link>

              <div className="h-6 w-px bg-stone-300 mx-2"></div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-stone-500 text-sm font-medium">
                  {/* User Icon */}
                  <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span>{user?.fullName || 'Student'}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-stone-500 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  {/* Logout Icon */}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </div>
            </div>

            {/* 3. Mobile Menu Button (Visible on Small Screens) */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-stone-600 hover:text-amber-700 focus:outline-none p-2 rounded-md hover:bg-stone-100 transition-colors"
              >
                {isOpen ? (
                  /* Close (X) Icon */
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  /* Hamburger Menu Icon */
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 4. Mobile Dropdown Menu */}
        <div
          className={`md:hidden bg-white border-b border-stone-200 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-3 rounded-md text-base font-medium text-stone-700 hover:bg-amber-50 hover:text-amber-700"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left block px-3 py-3 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* --- Main Content Area --- */}
      {/* CRITICAL: This <main> contains the <Outlet />. 
         Without this, Dashboard and CourseRoom will NOT show.
         pt-20 creates space for the fixed navbar.
      */}
      <main className="pt-20 min-h-screen bg-stone-50 text-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default Navbar;