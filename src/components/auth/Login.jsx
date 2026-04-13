import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDemoDropdown, setShowDemoDropdown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  const demoAccounts = [
    { name: '🎓 Buhle Ndlovu', email: 'buhle@campus.edu', password: 'password123', role: 'student', color: 'blue' },
    { name: '🎓 Mpho Dlamini', email: 'mpho@campus.edu', password: 'password123', role: 'student', color: 'blue' },
    { name: '🎓 Karabo Nchabeleng', email: 'karabo@campus.edu', password: 'password123', role: 'student', color: 'blue' },
    { name: '🎓 Kamogelo Molefe', email: 'kamogelo@campus.edu', password: 'password123', role: 'student', color: 'blue' },
    { name: '👨‍🏫 Tebogo Molefe', email: 'tebogo@campus.edu', password: 'password123', role: 'lecturer', color: 'green' },
    { name: '👨‍🏫 Kgotso Khumalo', email: 'kgotso@campus.edu', password: 'password123', role: 'lecturer', color: 'green' },
    { name: '👨‍🏫 Itumeleng Molefe', email: 'itumeleng@campus.edu', password: 'password123', role: 'lecturer', color: 'green' },
    { name: '👨‍🏫 Ishmail Mdlhuli', email: 'ishmail@campus.edu', password: 'password123', role: 'lecturer', color: 'green' },
    { name: '👨‍💼 Sbuda Nkosi', email: 'sbuda@campus.edu', password: 'admin123', role: 'admin', color: 'purple' },
    { name: '👨‍💼 Mpho Mathenjwa', email: 'mpho.mathenjwa@campus.edu', password: 'admin123', role: 'admin', color: 'purple' }
  ];

  const selectDemoAccount = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setShowDemoDropdown(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 relative overflow-hidden p-4">
      {/* Animated Background Circles */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Shapes */}
      <div className="fixed top-20 left-10 animate-float">
        <div className="w-16 h-16 bg-white/10 rounded-2xl rotate-12 backdrop-blur-sm"></div>
      </div>
      <div className="fixed bottom-20 right-10 animate-float-delayed">
        <div className="w-12 h-12 bg-white/10 rounded-full backdrop-blur-sm"></div>
      </div>
      <div className="fixed top-40 right-20 animate-float-slow">
        <div className="w-8 h-8 bg-white/10 rounded-lg rotate-45 backdrop-blur-sm"></div>
      </div>
      <div className="fixed bottom-32 left-20 animate-float-slow">
        <div className="w-10 h-10 bg-white/10 rounded-xl backdrop-blur-sm"></div>
      </div>

      {/* Main Login Card */}
      <div className={`relative z-10 max-w-md w-full transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-5 border border-white/20">
          
          {/* Logo Section */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-lg mb-2 animate-bounce-slow">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Smart Campus Portal</h2>
            <p className="text-gray-500 text-xs mt-1">Sign in to your account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="group">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  required
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white/50 transition-all duration-300"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="group">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full pl-9 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white/50 transition-all duration-300"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-500 transition-colors"
                >
                  {showPassword ? (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-600 transition-all duration-300 transform hover:scale-[1.02] text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-4 w-4 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Accounts Dropdown */}
          <div className="mt-3 relative">
            <button
              onClick={() => setShowDemoDropdown(!showDemoDropdown)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all duration-300 group"
            >
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-gray-500 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Quick Access
              </span>
              <svg className={`w-4 h-4 transition-transform duration-300 ${showDemoDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showDemoDropdown && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden animate-slideDown">
                <div className="max-h-48 overflow-y-auto">
                  {demoAccounts.map((account, index) => (
                    <button
                      key={index}
                      onClick={() => selectDemoAccount(account.email, account.password)}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gradient-to-r transition-all duration-300 ${
                        account.color === 'blue' ? 'hover:bg-blue-50 hover:text-blue-600' :
                        account.color === 'green' ? 'hover:bg-green-50 hover:text-green-600' :
                        'hover:bg-purple-50 hover:text-purple-600'
                      }`}
                    >
                      {account.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Register Link */}
          <div className="mt-3 text-center">
            <Link to="/register" className="text-xs text-blue-600 hover:text-blue-700 hover:underline transition-all duration-300">
              Don't have an account? <span className="font-semibold">Sign up</span>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-3">
          <p className="text-white/50 text-[10px]">© 2024 Smart Campus Portal</p>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(10deg); }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce 2s ease-in-out infinite;
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Login;