import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

// --- CUSTOM ICONS (Inline SVGs) ---
const Icons = {
  BookOpen: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  Layout: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  PlusCircle: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  LogOut: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  Menu: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  X: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  User: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // Clear Educator credentials
    localStorage.removeItem("educatorToken");
    navigate('/login');
  };

  // Helper to determine if link is active
  const isActive = (path) => {
    return location.pathname === path 
      ? "text-amber-800 font-bold bg-amber-50 shadow-sm" 
      : "text-stone-600 hover:text-amber-800 hover:bg-stone-50";
  };

  return (
    <>
      {/* --- Top Navigation Bar --- */}
      <nav className="fixed w-full top-0 z-50 bg-white border-b border-stone-200 shadow-sm transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            
            {/* 1. Logo Section */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-amber-800 rounded-lg flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                  <Icons.BookOpen className="w-5 h-5" />
                </div>
                <span className="font-bold text-xl text-stone-900 tracking-tight">
                  Jifunze<span className="text-amber-800">Educator</span>
                </span>
              </Link>
            </div>

            {/* 2. Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                to="/" 
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive('/')}`}
              >
                <Icons.Layout className="w-4 h-4" />
                Dashboard
              </Link>
              
              <Link 
                to="/create-course" 
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive('/create-course')}`}
              >
                <Icons.PlusCircle className="w-4 h-4" />
                Create Course
              </Link>
              
              {/* Divider */}
              <div className="h-6 w-px bg-stone-300 mx-2"></div>

              {/* Profile / Logout */}
              <div className="flex items-center gap-3">
                <div className="hidden lg:flex flex-col items-end mr-2">
                  <span className="text-xs font-bold text-stone-800">Instructor Mode</span>
                  <span className="text-[10px] text-stone-500">Verified</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-500">
                  <Icons.User className="w-4 h-4" />
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-stone-500 hover:text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  title="Sign Out"
                >
                  <Icons.LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 3. Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-stone-600 hover:text-amber-800 p-2 rounded-md hover:bg-stone-50 transition-colors"
              >
                {isOpen ? <Icons.X className="w-6 h-6" /> : <Icons.Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* 4. Mobile Dropdown */}
        <div 
          className={`md:hidden bg-white border-b border-stone-200 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="px-4 pt-2 pb-4 space-y-1">
            <Link 
              to="/" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-stone-700 hover:bg-amber-50 hover:text-amber-800"
            >
              <Icons.Layout className="w-5 h-5" />
              Dashboard
            </Link>
            <Link 
              to="/create-course" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-stone-700 hover:bg-amber-50 hover:text-amber-800"
            >
              <Icons.PlusCircle className="w-5 h-5" />
              Create Course
            </Link>
            <div className="border-t border-stone-100 my-2"></div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full text-left px-3 py-3 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
            >
              <Icons.LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* --- Main Content Area (Outlet) --- */}
      {/* pt-16 ensures content isn't hidden behind fixed navbar */}
      <main className="pt-16 min-h-screen bg-stone-50">
        <Outlet /> 
      </main>
    </>
  );
};

export default Navbar;