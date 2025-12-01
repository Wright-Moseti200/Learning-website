import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudent } from '../context/ContextProvider';

const Login = () => {
  const navigate = useNavigate();
  // State to toggle between Login (true) and Signup (false) views
  const [isLoginView, setIsLoginView] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { login, signup, loading, error } = useStudent();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoginView) {
      // --- SIGNUP LOGIC ---
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      const success = await signup(formData.fullName, formData.email, formData.password);
      if (success) navigate('/');
    } else {
      // --- LOGIN LOGIC ---
      const success = await login(formData.email, formData.password);
      if (success) navigate('/');
    }
  };

  // Function to toggle views and clear sensitive fields
  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">

      {/* --- Header Section --- */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-amber-700 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform duration-500 hover:rotate-12">
            {/* Logo Icon */}
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>

        {/* Conditional Header Text */}
        <h2 className="mt-6 text-center text-3xl font-extrabold text-stone-900 tracking-tight">
          {isLoginView ? 'Welcome back, Scholar' : 'Join Jifunze Hub'}
        </h2>
        <p className="mt-2 text-center text-sm text-stone-600">
          {isLoginView ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={toggleView}
            className="font-bold text-amber-700 hover:text-amber-600 transition-colors focus:outline-none underline decoration-2 decoration-transparent hover:decoration-amber-700/30"
          >
            {isLoginView ? 'Sign up for free' : 'Sign in instead'}
          </button>
        </p>
      </div>

      {/* --- Form Card --- */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-stone-100">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>

            {/* --- SIGNUP ONLY: Full Name --- */}
            {!isLoginView && (
              <div className="animate-fade-in-down">
                <label htmlFor="fullName" className="block text-sm font-medium text-stone-700">
                  Full Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required={!isLoginView}
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  />
                </div>
              </div>
            )}

            {/* --- Email Field (Always Visible) --- */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="student@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>
            </div>

            {/* --- Password Field (Always Visible) --- */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isLoginView ? "current-password" : "new-password"}
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>
            </div>

            {/* --- SIGNUP ONLY: Confirm Password --- */}
            {!isLoginView && (
              <div className="animate-fade-in-down">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-700">
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required={!isLoginView}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  />
                </div>
              </div>
            )}

            {/* --- Submit Button --- */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isLoginView ? 'Signing in...' : 'Creating Account...'}
                  </div>
                ) : (
                  isLoginView ? 'Sign in' : 'Create Account'
                )}
              </button>
            </div>
          </form>

          {/* --- Footer / Terms (Optional) --- */}
          {!isLoginView && (
            <p className="mt-4 text-xs text-center text-stone-500">
              By joining, you agree to our <span className="underline cursor-pointer hover:text-amber-700">Terms</span> and <span className="underline cursor-pointer hover:text-amber-700">Privacy Policy</span>.
            </p>
          )}

        </div>
      </div>
    </div>
  );
};

export default Login;