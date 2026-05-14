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
      className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
        isActive 
          ? 'text-primary-600 bg-primary-50 border-r-4 border-primary-600' 
          : 'text-gray-600 hover:bg-gray-50'
      } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
    >
      <span className="text-xl">{icon}</span>
      {!sidebarCollapsed && <span className="font-medium">{children}</span>}
    </a>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* TOP BAR – using grid for perfect centering */}
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md z-30">
        <div className="grid grid-cols-3 items-center px-4 py-3">
          {/* LEFT COLUMN: Hamburger (mobile) + User avatar + name + dropdown */}
          <div className="flex items-center gap-3 justify-start">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 hover:bg-primary-700 rounded-lg px-2 py-1 transition-colors"
              >
                <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-full border-2 border-white" />
                <span className="text-sm font-medium hidden md:inline">{user?.name}</span>
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
                    <div className="flex justify-between"><span className="text-gray-500">Joined:</span><span>{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CENTER COLUMN: Logo + System Name (perfectly centered) */}
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
        {/* Toggle button */}
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

      {/* MOBILE SIDEBAR (unchanged) */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-64 bg-white z-40 flex flex-col">
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
            <div className="p-4 border-t border-gray-200">
              <button onClick={() => { logout(); window.location.href = '/login'; }} className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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

      {/* AI Chat Assistant */}
      <GroqChat />
    </div>
  );
};

export default Layout;