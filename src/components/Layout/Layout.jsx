import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NotificationPanel from '../common/NotificationPanel';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const SidebarLink = ({ to, isActive, children }) => (
    <a
      href={to}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
        setSidebarOpen(false);
      }}
      className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
        isActive 
          ? 'text-blue-600 bg-blue-50 border-r-4 border-blue-600' 
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      <span className="font-medium">{children}</span>
    </a>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header with Bell Icon */}
      <div className="fixed top-0 right-0 left-0 lg:left-64 bg-white border-b border-gray-200 z-20">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <h1 className="text-lg font-semibold text-blue-600 lg:hidden">Campus Portal</h1>
          <div className="hidden lg:block"></div>
          
          <div className="relative">
            <NotificationPanel 
              isOpen={notificationsOpen}
              onClose={() => setNotificationsOpen(!notificationsOpen)}
            />
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm z-10">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-800">Campus<span className="text-blue-600">Portal</span></span>
          </div>
        </div>
        
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img src={user?.avatar} alt={user?.name} className="w-10 h-10 rounded-full" />
            <div>
              <p className="font-medium text-gray-800">{user?.name}</p>
              <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
        
        <nav className="py-4">
          {/* Dashboard - Common for all */}
          <SidebarLink to="/dashboard" isActive={location.pathname === '/dashboard'}>
            📊 Dashboard
          </SidebarLink>
          
          {/* Student only links */}
          {user?.role === 'student' && (
            <>
              <SidebarLink to="/appointments" isActive={location.pathname === '/appointments'}>
                📅 Book Appointment
              </SidebarLink>
              <SidebarLink to="/my-courses" isActive={location.pathname === '/my-courses'}>
                📚 My Courses
              </SidebarLink>
              <SidebarLink to="/timetable" isActive={location.pathname === '/timetable'}>
                🕐 My Timetable
              </SidebarLink>
              <SidebarLink to="/maintenance" isActive={location.pathname === '/maintenance'}>
                🔧 Report Issue
              </SidebarLink>
              <SidebarLink to="/my-issues" isActive={location.pathname === '/my-issues'}>
                📋 My Issues
              </SidebarLink>
              <SidebarLink to="/my-appointments" isActive={location.pathname === '/my-appointments'}>
                📅 My Appointments
              </SidebarLink>
            </>
          )}
          
          {/* Lecturer only links */}
          {user?.role === 'lecturer' && (
            <>
              <SidebarLink to="/manage-appointments" isActive={location.pathname === '/manage-appointments'}>
                📅 Manage Appointments
              </SidebarLink>
              <SidebarLink to="/my-classes" isActive={location.pathname === '/my-classes'}>
                📚 My Classes
              </SidebarLink>
              <SidebarLink to="/my-students" isActive={location.pathname === '/my-students'}>
                👥 My Students
              </SidebarLink>
              <SidebarLink to="/maintenance" isActive={location.pathname === '/maintenance'}>
                🔧 Report Issue
              </SidebarLink>
            </>
          )}
          
          {/* Admin only links */}
          {user?.role === 'admin' && (
            <>
              <SidebarLink to="/issues" isActive={location.pathname === '/issues'}>
                🔧 Manage Issues
              </SidebarLink>
              <SidebarLink to="/all-users" isActive={location.pathname === '/all-users'}>
                👥 Manage Users
              </SidebarLink>
              <SidebarLink to="/issue-analytics" isActive={location.pathname === '/issue-analytics'}>
                📊 Analytics
              </SidebarLink>
            </>
          )}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={() => {
              logout();
              window.location.href = '/login';
            }}
            className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed left-0 top-0 h-full w-64 bg-white z-40 lg:hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <span className="text-xl font-bold text-gray-800">Campus<span className="text-blue-600">Portal</span></span>
              <button onClick={() => setSidebarOpen(false)} className="p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <img src={user?.avatar} alt={user?.name} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-medium text-gray-800">{user?.name}</p>
                  <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
            <nav className="py-4">
              <SidebarLink to="/dashboard" isActive={location.pathname === '/dashboard'}>
                📊 Dashboard
              </SidebarLink>
              
              {user?.role === 'student' && (
                <>
                  <SidebarLink to="/appointments" isActive={location.pathname === '/appointments'}>
                    📅 Book Appointment
                  </SidebarLink>
                  <SidebarLink to="/my-courses" isActive={location.pathname === '/my-courses'}>
                    📚 My Courses
                  </SidebarLink>
                  <SidebarLink to="/timetable" isActive={location.pathname === '/timetable'}>
                    🕐 My Timetable
                  </SidebarLink>
                  <SidebarLink to="/maintenance" isActive={location.pathname === '/maintenance'}>
                    🔧 Report Issue
                  </SidebarLink>
                  <SidebarLink to="/my-issues" isActive={location.pathname === '/my-issues'}>
                    📋 My Issues
                  </SidebarLink>
                  <SidebarLink to="/my-appointments" isActive={location.pathname === '/my-appointments'}>
                    📅 My Appointments
                  </SidebarLink>
                </>
              )}
              
              {user?.role === 'lecturer' && (
                <>
                  <SidebarLink to="/manage-appointments" isActive={location.pathname === '/manage-appointments'}>
                    📅 Manage Appointments
                  </SidebarLink>
                  <SidebarLink to="/my-classes" isActive={location.pathname === '/my-classes'}>
                    📚 My Classes
                  </SidebarLink>
                  <SidebarLink to="/my-students" isActive={location.pathname === '/my-students'}>
                    👥 My Students
                  </SidebarLink>
                  <SidebarLink to="/maintenance" isActive={location.pathname === '/maintenance'}>
                    🔧 Report Issue
                  </SidebarLink>
                </>
              )}
              
              {user?.role === 'admin' && (
                <>
                  <SidebarLink to="/issues" isActive={location.pathname === '/issues'}>
                    🔧 Manage Issues
                  </SidebarLink>
                  <SidebarLink to="/all-users" isActive={location.pathname === '/all-users'}>
                    👥 Manage Users
                  </SidebarLink>
                  <SidebarLink to="/issue-analytics" isActive={location.pathname === '/issue-analytics'}>
                    📊 Analytics
                  </SidebarLink>
                </>
              )}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  logout();
                  window.location.href = '/login';
                }}
                className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="lg:ml-64">
        <main className="pt-16">
          <div className="p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;