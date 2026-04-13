import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAppointments } from '../../contexts/AppointmentContext';
import { useMaintenance } from '../../contexts/MaintenanceContext';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getStudentAppointments } = useAppointments();
  const { getUserIssues } = useMaintenance();
  const [stats, setStats] = useState({
    appointments: 0,
    courses: 0,
    issues: 0
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  useEffect(() => {
    if (user) {
      loadStudentData();
    }
  }, [user]);

  const loadStudentData = () => {
    const myAppointments = getStudentAppointments();
    const pendingAppointments = myAppointments.filter(apt => apt.status === 'pending');
    const confirmedAppointments = myAppointments.filter(apt => apt.status === 'confirmed');
    const myIssues = getUserIssues();
    
    setStats({
      appointments: pendingAppointments.length + confirmedAppointments.length,
      courses: user?.enrolledCourses?.length || 4,
      issues: myIssues.length
    });
    
    setUpcomingAppointments([...pendingAppointments, ...confirmedAppointments].slice(0, 3));
  };

  const handleNavigate = (type) => {
    if (type === 'appointments') {
      navigate('/my-appointments');
    } else if (type === 'courses') {
      navigate('/my-courses');
    } else if (type === 'issues') {
      navigate('/my-issues');
    } else if (type === 'book') {
      navigate('/appointments');
    } else if (type === 'timetable') {
      navigate('/timetable');
    } else if (type === 'maintenance') {
      navigate('/maintenance');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name}!</h1>
        <p className="text-blue-100">Here's your academic summary</p>
      </div>
      
      {/* Clickable Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => handleNavigate('appointments')}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer hover:bg-blue-50"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl">📅</span>
            <span className="text-2xl font-bold text-blue-600">{stats.appointments}</span>
          </div>
          <h3 className="text-gray-600 font-medium">Appointments</h3>
          <p className="text-xs text-blue-500 mt-1">Click to view all →</p>
        </div>
        
        <div 
          onClick={() => handleNavigate('courses')}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer hover:bg-green-50"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl">📚</span>
            <span className="text-2xl font-bold text-green-600">{stats.courses}</span>
          </div>
          <h3 className="text-gray-600 font-medium">Current Courses</h3>
          <p className="text-xs text-green-500 mt-1">Click to view details →</p>
        </div>
        
        <div 
          onClick={() => handleNavigate('issues')}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer hover:bg-yellow-50"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl">🔧</span>
            <span className="text-2xl font-bold text-yellow-600">{stats.issues}</span>
          </div>
          <h3 className="text-gray-600 font-medium">Issues Reported</h3>
          <p className="text-xs text-yellow-500 mt-1">Click to track →</p>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button 
            onClick={() => handleNavigate('book')}
            className="p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-left flex items-center gap-2"
          >
            <span className="text-xl">📅</span>
            <span className="font-medium">Book an Appointment</span>
          </button>
          <button 
            onClick={() => handleNavigate('timetable')}
            className="p-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition text-left flex items-center gap-2"
          >
            <span className="text-xl">📖</span>
            <span className="font-medium">View My Timetable</span>
          </button>
          <button 
            onClick={() => handleNavigate('maintenance')}
            className="p-3 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition text-left flex items-center gap-2"
          >
            <span className="text-xl">🔧</span>
            <span className="font-medium">Report an Issue</span>
          </button>
        </div>
      </div>
      
      {/* Upcoming Appointments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
        {upcomingAppointments.length > 0 ? (
          <div className="space-y-3">
            {upcomingAppointments.map((apt) => (
              <div key={apt.id} className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">With: {apt.lecturerName}</p>
                <p className="text-sm text-gray-600">{apt.date} at {apt.timeSlot}</p>
                <p className="text-sm text-gray-600">Purpose: {apt.purpose}</p>
                <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                  apt.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No upcoming appointments</p>
            <button 
              onClick={() => handleNavigate('book')}
              className="mt-2 text-blue-600 text-sm hover:underline"
            >
              Book your first appointment →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;