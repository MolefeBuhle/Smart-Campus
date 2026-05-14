// src/components/Layout/Layout.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NotificationPanel from '../common/NotificationPanel';
import GroqChat from '../common/GroqChat';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const SidebarLink = ({ to, isActive, children, icon }) => (
    <a
      href={to}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
        setSidebarOpen(false);
      }}
      className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-all duration-200 ${
        isActive 
          ? 'text-primary-600 bg-primary-50/50 border-r-4 border-primary-600' 
          : 'text-gray-600 hover:bg-gray-100/70 hover:scale-[1.02]'
      } ${sidebarCollapsed ? 'justify-center px-2' : ''} rounded-lg mx-2`}
    >
      <span className="text-xl">{icon}</span>
      {!sidebarCollapsed && <span className="font-medium">{children}</span>}
    </a>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* TOP BAR – same as before (responsive) */}
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md z-30">
        <div className="flex items-center justify-between px-4 py-3 lg:grid lg:grid-cols-3">
          {/* LEFT COLUMN */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {/* Desktop user section (hidden on mobile) */}
            <div className="hidden lg:flex lg:items-center lg:gap-2">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 hover:bg-primary-700 rounded-lg px-2 py-1 transition-colors"
              >
                <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-full border-2 border-white" />
                <span className="text-sm font-medium">{user?.name}</span>
                <svg className={`w-4 h-4 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {userDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 bg-white text-gray-800 rounded-lg shadow-lg border border-gray-200 z-40 w-64">
                  <div className="p-3 border-b border-gray-100">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <div className="p-3 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Role:</span><span className="capitalize">{user?.role}</span></div>
                    {user?.studentId && <div className="flex justify-between"><span className="text-gray-500">Student ID:</span><span>{user.studentId}</span></div>}
                    {user?.employeeId && <div className="flex justify-between"><span className="text-gray-500">Employee ID:</span><span>{user.employeeId}</span></div>}
                    {user?.course && <div className="flex justify-between"><span className="text-gray-500">Course:</span><span>{user.course}</span></div>}
                    {user?.department && <div className="flex justify-between"><span className="text-gray-500">Department:</span><span>{user.department}</span></div>}
                    <div className="flex justify-between"><span className="text-gray-500">Joined:</span><span>{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CENTER: Logo + System Name */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">🎓</span>
            <span className="text-lg font-bold tracking-wide">Smart Campus Portal</span>
          </div>

          {/* RIGHT COLUMN: Notification Bell */}
          <div className="flex justify-end">
            <div className="relative">
              <NotificationPanel 
                isOpen={notificationsOpen}
                onClose={() => setNotificationsOpen(!notificationsOpen)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP SIDEBAR (unchanged) */}
      <div className={`hidden lg:flex fixed left-0 top-14 h-[calc(100vh-3.5rem)] bg-white border-r border-gray-200 shadow-sm z-20 flex-col transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-20 bg-white border border-gray-300 rounded-full p-1 shadow-md hover:bg-gray-50 transition-colors z-30"
        >
          <svg className={`w-4 h-4 text-gray-600 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <nav className="flex-1 overflow-y-auto py-4">
          <SidebarLink to="/dashboard" isActive={location.pathname === '/dashboard'} icon="📊">Dashboard</SidebarLink>
          {user?.role === 'student' && (
            <>
              <SidebarLink to="/appointments" isActive={location.pathname === '/appointments'} icon="📅">Book Appointment</SidebarLink>
              <SidebarLink to="/timetable" isActive={location.pathname === '/timetable'} icon="🕐">My Timetable</SidebarLink>
              <SidebarLink to="/maintenance" isActive={location.pathname === '/maintenance'} icon="🔧">Report Issue</SidebarLink>
              <SidebarLink to="/my-issues" isActive={location.pathname === '/my-issues'} icon="📋">My Issues</SidebarLink>
              <SidebarLink to="/my-appointments" isActive={location.pathname === '/my-appointments'} icon="📅">My Appointments</SidebarLink>
            </>
          )}
          {user?.role === 'lecturer' && (
            <>
              <SidebarLink to="/manage-appointments" isActive={location.pathname === '/manage-appointments'} icon="📅">Manage Appointments</SidebarLink>
              <SidebarLink to="/lecturer-timetable" isActive={location.pathname === '/lecturer-timetable'} icon="🕐">My Timetable</SidebarLink>
              <SidebarLink to="/maintenance" isActive={location.pathname === '/maintenance'} icon="🔧">Report Issue</SidebarLink>
              <SidebarLink to="/my-issues" isActive={location.pathname === '/my-issues'} icon="📋">My Issues</SidebarLink>
            </>
          )}
          {user?.role === 'admin' && (
            <>
              <SidebarLink to="/issues" isActive={location.pathname === '/issues'} icon="🔧">Manage Issues</SidebarLink>
              <SidebarLink to="/all-users" isActive={location.pathname === '/all-users'} icon="👥">Manage Users</SidebarLink>
              <SidebarLink to="/issue-analytics" isActive={location.pathname === '/issue-analytics'} icon="📊">Analytics</SidebarLink>
            </>
          )}
        </nav>

        <div className={`p-4 border-t border-gray-200 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
          <button
            onClick={() => { logout(); window.location.href = '/login'; }}
            className={`flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ${sidebarCollapsed ? 'justify-center w-full' : 'w-full'}`}
          >
            <span className="text-xl">🚪</span>
            {!sidebarCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* ========== MODERN MAGICAL MOBILE SIDEBAR ========== */}
      {sidebarOpen && (
        <>
          {/* Backdrop with blur and fade */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 transition-all duration-300"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Sidebar panel */}
          <div className="fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-72 bg-white/95 backdrop-blur-md shadow-2xl z-40 transform transition-transform duration-300 ease-out rounded-r-2xl">
            {/* Header with user info and close button */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <img src={user?.avatar} alt={user?.name} className="w-10 h-10 rounded-full ring-2 ring-primary-500" />
                <div>
                  <p className="font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* User details (compact) */}
            <div className="px-4 py-3 bg-gradient-to-r from-primary-50 to-transparent">
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium text-gray-800 truncate">{user?.email}</p>
              {(user?.studentId || user?.employeeId) && (
                <>
                  <p className="text-xs text-gray-500 mt-2">ID</p>
                  <p className="text-sm font-medium text-gray-800">{user?.studentId || user?.employeeId}</p>
                </>
              )}
            </div>

            {/* Navigation links with glassmorphism */}
            <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
              <SidebarLink to="/dashboard" isActive={location.pathname === '/dashboard'} icon="📊">Dashboard</SidebarLink>
              {user?.role === 'student' && (
                <>
                  <SidebarLink to="/appointments" isActive={location.pathname === '/appointments'} icon="📅">Book Appointment</SidebarLink>
                  <SidebarLink to="/timetable" isActive={location.pathname === '/timetable'} icon="🕐">My Timetable</SidebarLink>
                  <SidebarLink to="/maintenance" isActive={location.pathname === '/maintenance'} icon="🔧">Report Issue</SidebarLink>
                  <SidebarLink to="/my-issues" isActive={location.pathname === '/my-issues'} icon="📋">My Issues</SidebarLink>
                  <SidebarLink to="/my-appointments" isActive={location.pathname === '/my-appointments'} icon="📅">My Appointments</SidebarLink>
                </>
              )}
              {user?.role === 'lecturer' && (
                <>
                  <SidebarLink to="/manage-appointments" isActive={location.pathname === '/manage-appointments'} icon="📅">Manage Appointments</SidebarLink>
                  <SidebarLink to="/lecturer-timetable" isActive={location.pathname === '/lecturer-timetable'} icon="🕐">My Timetable</SidebarLink>
                  <SidebarLink to="/maintenance" isActive={location.pathname === '/maintenance'} icon="🔧">Report Issue</SidebarLink>
                  <SidebarLink to="/my-issues" isActive={location.pathname === '/my-issues'} icon="📋">My Issues</SidebarLink>
                </>
              )}
              {user?.role === 'admin' && (
                <>
                  <SidebarLink to="/issues" isActive={location.pathname === '/issues'} icon="🔧">Manage Issues</SidebarLink>
                  <SidebarLink to="/all-users" isActive={location.pathname === '/all-users'} icon="👥">Manage Users</SidebarLink>
                  <SidebarLink to="/issue-analytics" isActive={location.pathname === '/issue-analytics'} icon="📊">Analytics</SidebarLink>
                </>
              )}
            </nav>

            {/* Logout button with elegant styling */}
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => {
                  logout();
                  window.location.href = '/login';
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-200"
              >
                <span className="text-xl">🚪</span>
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <main className="pt-16">
          <div className="p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      <GroqChat />
    </div>
  );
};

export default Layout;