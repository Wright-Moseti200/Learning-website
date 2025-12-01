import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreator } from '../context/ContextProvider';

// --- CUSTOM ICONS (Inline to ensure no import errors) ---
const Icons = {
  BookOpen: ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  UserCheck: ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>,
  Mail: ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
  Lock: ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  ChevronRight: ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>,
  AlertCircle: ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /><line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /><line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
};

const Login = () => {
  const navigate = useNavigate();
  // Access Context functions
  const { login, signup, loading, error: contextError, user } = useCreator();
  
  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  // Show any upstream API errors from context
  useEffect(() => {
    if (contextError) setLocalError(contextError);
  }, [contextError]);
  
  const [isLogin, setIsLogin] = useState(true);
  const [localError, setLocalError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    specialization: ''
  });

  // Clear errors when switching modes
  useEffect(() => {
    setLocalError('');
  }, [isLogin]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    let success = false;

    if (isLogin) {
      // --- LOGIN FLOW ---
      success = await login(formData.email, formData.password);
    } else {
      // --- SIGNUP FLOW ---
      if (!formData.fullName || !formData.email || !formData.password || !formData.specialization) {
        setLocalError('Please fill in all fields.');
        return;
      }
      success = await signup(
        formData.fullName, 
        formData.email, 
        formData.password, 
        formData.specialization
      );
    }

    if (success) {
      navigate('/'); // Redirect to Dashboard upon success
    }
  };

  // Determine which error to show (local validation or API error)
  const displayError = localError || contextError;

  return (
    <div className="min-h-screen bg-stone-50 flex">
      
      {/* --- Left Side: Hero / Branding --- */}
      <div className="hidden lg:flex lg:w-1/2 bg-amber-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900 to-stone-900 opacity-90"></div>
        
        {/* Decorative Circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-amber-800 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-amber-600 opacity-20 blur-3xl"></div>

        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 shadow-xl border border-white/20">
              <Icons.BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold leading-tight mb-4">
              Share your knowledge,<br/> inspire the future.
            </h1>
            <p className="text-amber-100 text-lg max-w-md leading-relaxed">
              Join Jifunze Hub's community of expert educators. Create courses, track student progress, and earn from your expertise.
            </p>
          </div>

          <div className="flex gap-4 mt-8">
             <div className="flex -space-x-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-10 h-10 rounded-full border-2 border-amber-900 bg-amber-200"></div>
               ))}
             </div>
             <div className="flex flex-col justify-center">
               <span className="font-bold">2,000+</span>
               <span className="text-xs text-amber-200">Active Instructors</span>
             </div>
          </div>
        </div>
      </div>

      {/* --- Right Side: Form --- */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
             <div className="w-10 h-10 bg-amber-700 rounded-lg flex items-center justify-center text-white mb-3">
               <Icons.BookOpen className="w-6 h-6" />
             </div>
             <h2 className="text-2xl font-bold text-stone-900">Jifunze Hub</h2>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-stone-900">
              {isLogin ? 'Instructor Portal' : 'Become an Instructor'}
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              {isLogin ? "Welcome back! Please enter your details." : "Start your journey as a verified educator."}
            </p>
          </div>

          {/* Error Message Alert */}
          {displayError && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
              <Icons.AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span className="text-sm font-medium">{displayError}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Full Name (Signup Only) */}
            {!isLogin && (
              <div className="animate-fade-in-down">
                <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <Icons.UserCheck className="w-5 h-5" />
                  </div>
                  <input
                    name="fullName"
                    type="text"
                    required={!isLogin}
                    value={formData.fullName}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-stone-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-sm transition-colors"
                    placeholder="Prof. John Doe"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Icons.Mail className="w-5 h-5" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className="block w-full pl-10 pr-3 py-2.5 border border-stone-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-sm transition-colors"
                  placeholder="educator@jifunze.com"
                />
              </div>
            </div>

            {/* Specialization (Signup Only) */}
            {!isLogin && (
              <div className="animate-fade-in-down">
                <label className="block text-sm font-medium text-stone-700 mb-1">Primary Subject</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <Icons.BookOpen className="w-5 h-5" />
                  </div>
                  <input
                    name="specialization"
                    type="text"
                    required={!isLogin}
                    value={formData.specialization}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-stone-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-sm transition-colors"
                    placeholder="e.g. Computer Science, Mathematics"
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                 <label className="block text-sm font-medium text-stone-700">Password</label>
                 {isLogin && <button type="button" onClick={(e)=>e.preventDefault()} className="text-xs font-semibold text-amber-700 hover:text-amber-600">Forgot?</button>}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Icons.Lock className="w-5 h-5" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  className="block w-full pl-10 pr-3 py-2.5 border border-stone-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-sm transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-amber-900 hover:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-70 transition-all duration-200"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {isLogin ? 'Access Dashboard' : 'Create Educator Account'} 
                  <Icons.ChevronRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-stone-600">
              {isLogin ? "New to Jifunze Hub?" : "Already have an account?"}
              <button 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({ fullName: '', email: '', password: '', specialization: '' });
                }}
                className="ml-2 font-bold text-amber-700 hover:text-stone-900 transition-colors"
              >
                {isLogin ? "Apply as Instructor" : "Log in"}
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;