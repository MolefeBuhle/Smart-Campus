import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAppointments } from '../../contexts/AppointmentContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LecturerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getPendingRequests, getLecturerAppointments, acceptAppointment, rescheduleAppointment } = useAppointments();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [confirmedAppointments, setConfirmedAppointments] = useState([]);
  const [stats, setStats] = useState({
    pendingCount: 0,
    totalStudents: 0,
    todayClasses: 3
  });
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    if (user) {
      loadData();
    }
    const slots = JSON.parse(localStorage.getItem('campus_time_slots') || '[]');
    setTimeSlots(slots);
  }, [user]);

  const loadData = () => {
    const pending = getPendingRequests();
    const confirmed = getLecturerAppointments().filter(apt => apt.status === 'confirmed');
    const allUsers = JSON.parse(localStorage.getItem('campus_users') || '[]');
    const totalStudents = allUsers.filter(u => u.role === 'student').length;
    
    setPendingRequests(pending);
    setConfirmedAppointments(confirmed);
    setStats({
      pendingCount: pending.length,
      totalStudents: totalStudents,
      todayClasses: 3
    });
  };

  const handleNavigate = (type) => {
    if (type === 'pending') {
      navigate('/appointments');
    } else if (type === 'students') {
      navigate('/my-students');
    } else if (type === 'classes') {
      navigate('/my-classes');
    }
  };

  const handleAccept = async (appointmentId) => {
    await acceptAppointment(appointmentId);
    loadData();
    toast.success('Appointment accepted!');
  };

  const handleReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setShowRescheduleModal(true);
  };

  const submitReschedule = async () => {
    if (selectedAppointment && newDate && newTime) {
      await rescheduleAppointment(selectedAppointment.id, newDate, newTime);
      setShowRescheduleModal(false);
      setSelectedAppointment(null);
      setNewDate('');
      setNewTime('');
      loadData();
      toast.success('Appointment rescheduled!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name}!</h1>
        <p className="text-blue-100">Department of {user?.department || 'Computer Science'}</p>
      </div>
      
      {/* Clickable Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => handleNavigate('pending')}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer hover:bg-yellow-50"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl">⏳</span>
            <span className="text-2xl font-bold text-yellow-600">{stats.pendingCount}</span>
          </div>
          <h3 className="text-gray-600 font-medium">Pending Requests</h3>
          <p className="text-xs text-yellow-500 mt-1">Click to manage →</p>
        </div>
        
        <div 
          onClick={() => handleNavigate('students')}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer hover:bg-green-50"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl">👥</span>
            <span className="text-2xl font-bold text-green-600">{stats.totalStudents}</span>
          </div>
          <h3 className="text-gray-600 font-medium">Total Students</h3>
          <p className="text-xs text-green-500 mt-1">Click to view list →</p>
        </div>
        
        <div 
          onClick={() => handleNavigate('classes')}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer hover:bg-blue-50"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl">📚</span>
            <span className="text-2xl font-bold text-blue-600">{stats.todayClasses}</span>
          </div>
          <h3 className="text-gray-600 font-medium">Today's Classes</h3>
          <p className="text-xs text-blue-500 mt-1">Click to view schedule →</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Pending Requests ({pendingRequests.length})
          </h2>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No pending appointment requests</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <div key={request.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{request.studentName}</p>
                      <p className="text-sm text-gray-600">{request.date} at {request.timeSlot}</p>
                      <p className="text-sm text-gray-600 mt-1">Purpose: {request.purpose}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAccept(request.id)}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReschedule(request)}
                        className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                      >
                        Reschedule
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Confirmed Appointments ({confirmedAppointments.length})
          </h2>
          {confirmedAppointments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No confirmed appointments</p>
            </div>
          ) : (
            <div className="space-y-3">
              {confirmedAppointments.map((appointment) => (
                <div key={appointment.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="font-semibold text-gray-900">{appointment.studentName}</p>
                  <p className="text-sm text-gray-600">
                    {appointment.date} at {appointment.timeSlot}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Purpose: {appointment.purpose}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showRescheduleModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Reschedule Appointment with {selectedAppointment.studentName}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Time</label>
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select time</option>
                  {timeSlots.map(slot => (
                    <option key={slot.id} value={slot.display}>{slot.display}</option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={submitReschedule}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Confirm
                </button>
                <button
                  onClick={() => {
                    setShowRescheduleModal(false);
                    setSelectedAppointment(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturerDashboard;