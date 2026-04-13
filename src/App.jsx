import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AppointmentProvider } from './contexts/AppointmentContext';
import { MaintenanceProvider } from './contexts/MaintenanceContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import RegistrationWizard from './components/auth/RegistrationWizard';
import LecturerWizard from './components/auth/LecturerWizard';
import Layout from './components/Layout/Layout';

// Student Components
import StudentDashboard from './components/student/StudentDashboard';
import MyAppointments from './components/student/MyAppointments';
import MyCourses from './components/student/MyCourses';
import MyIssues from './components/student/MyIssues';
import AppointmentsBooking from './components/student/AppointmentsBooking';
import StudentTimetable from './components/student/StudentTimetable';

// Lecturer Components
import LecturerDashboard from './components/lecturer/LecturerDashboard';
import AppointmentRequests from './components/lecturer/AppointmentRequests';
import LecturerTimetable from './components/lecturer/LecturerTimetable';
import MyStudents from './components/lecturer/MyStudents';
import MyClasses from './components/lecturer/MyClasses';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import IssueManagement from './components/admin/IssueManagement';
import AllUsers from './components/admin/AllUsers';
import IssueAnalytics from './components/admin/IssueAnalytics';

// Shared Components
import MaintenanceForm from './components/common/MaintenanceForm';

function AppWrapper() {
  const { isAuthenticated, user, loading, logout } = useAuth();
  
  console.log("AppWrapper - isAuthenticated:", isAuthenticated);
  console.log("AppWrapper - user:", user);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Check if user exists properly
  if (!user || !user.role) {
    logout();
    return <Navigate to="/login" />;
  }
  
  // Check if hardcoded user (skip wizard)
  const isHardcodedStudent = user?.id === 'student_1' || user?.id === 'student_2' || user?.id === 'student_3' || user?.id === 'student_4';
  const isHardcodedLecturer = user?.id === 'lecturer_1' || user?.id === 'lecturer_2' || user?.id === 'lecturer_3' || user?.id === 'lecturer_4';
  const isHardcodedAdmin = user?.id === 'admin_1' || user?.id === 'admin_2';
  const isHardcodedUser = isHardcodedStudent || isHardcodedLecturer || isHardcodedAdmin;
  
  // Check if new user needs to complete registration wizard
  const needsStudentWizard = user?.role === 'student' && !user?.registrationCompleted && !isHardcodedUser;
  const needsLecturerWizard = user?.role === 'lecturer' && !user?.registrationCompleted && !isHardcodedUser;
  
  if (needsStudentWizard) {
    return <Navigate to="/registration-wizard" />;
  }
  if (needsLecturerWizard) {
    return <Navigate to="/lecturer-wizard" />;
  }
  
  const getDashboardComponent = () => {
    if (user?.role === 'student') return <StudentDashboard />;
    if (user?.role === 'lecturer') return <LecturerDashboard />;
    if (user?.role === 'admin') return <AdminDashboard />;
    return <div>Unknown role: {user?.role}</div>;
  };
  
  return (
    <Layout>
      <Routes>
        <Route path="/dashboard" element={getDashboardComponent()} />
        <Route path="/appointments" element={<AppointmentsBooking />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/my-issues" element={<MyIssues />} />
        <Route path="/timetable" element={<StudentTimetable />} />
        <Route path="/manage-appointments" element={<AppointmentRequests />} />
        <Route path="/my-students" element={<MyStudents />} />
        <Route path="/my-classes" element={<MyClasses />} />
        <Route path="/lecturer-timetable" element={<LecturerTimetable />} />
        <Route path="/maintenance" element={<MaintenanceForm />} />
        <Route path="/issues" element={<IssueManagement />} />
        <Route path="/all-users" element={<AllUsers />} />
        <Route path="/issue-analytics" element={<IssueAnalytics />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <NotificationProvider>
          <AppointmentProvider>
            <MaintenanceProvider>
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#22c55e',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/registration-wizard" element={<RegistrationWizard />} />
                <Route path="/lecturer-wizard" element={<LecturerWizard />} />
                <Route path="/*" element={<AppWrapper />} />
              </Routes>
            </MaintenanceProvider>
          </AppointmentProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;