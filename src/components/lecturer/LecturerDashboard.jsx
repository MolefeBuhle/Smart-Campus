// src/components/lecturer/LecturerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAppointments } from '../../contexts/AppointmentContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LecturerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getPendingRequests, getLecturerAppointments, acceptAppointment, rescheduleAppointment, appointments } = useAppointments();
  
  const [pendingRequests, setPendingRequests] = useState([]);
  const [confirmedAppointments, setConfirmedAppointments] = useState([]);
  const [stats, setStats] = useState({ pendingCount: 0 });
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
  }, [user, appointments]);

  const loadData = () => {
    const pending = getPendingRequests();
    const confirmed = getLecturerAppointments().filter(apt => apt.status === 'confirmed');
    setPendingRequests(pending);
    setConfirmedAppointments(confirmed);
    setStats({ pendingCount: pending.length });
  };

  const handleCardClick = (type) => {
    if (type === 'timetable') {
      navigate('/lecturer-timetable');
    } else if (type === 'appointments') {
      navigate('/manage-appointments');
    }
  };

  const handleAccept = async (appointmentId, e) => {
    e.stopPropagation();
    await acceptAppointment(appointmentId);
    // loadData will re-run due to appointments dependency
  };

  const handleReschedule = (appointment, e) => {
    e.stopPropagation();
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
      // loadData will re-run automatically
    }
  };

  const getLecturerInfo = () => {
    const info = {
      'tebogo@campus.edu': { name: 'Tebogo Molefe', department: 'Computer Science' },
      'kgotso@campus.edu': { name: 'Kgotso Khumalo', department: 'Mathematics' },
      'itumeleng@campus.edu': { name: 'Itumeleng Molefe', department: 'Physics' },
      'ishmail@campus.edu': { name: 'Ishmail Mdlhuli', department: 'English' }
    };
    return info[user?.email] || { name: user?.name, department: 'Lecturer' };
  };

  const lecturerInfo = getLecturerInfo();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-500 to-secondary-600 rounded-xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Welcome, {lecturerInfo.name}!</h1>
        <p className="text-primary-100">Department of {lecturerInfo.department}</p>
      </div>
      
      {/* Two Cards: Timetable & All Appointments – side by side, fit the space */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Timetable Card */}
        <div 
          onClick={() => handleCardClick('timetable')}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer hover:bg-blue-50"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl">📅</span>
            <span className="text-2xl font-bold text-primary-600">Timetable</span>
          </div>
          <h3 className="text-gray-600 font-medium">View your teaching schedule</h3>
          <p className="text-xs text-primary-500 mt-1">Click to open →</p>
        </div>

        {/* All Appointments Card */}
        <div 
          onClick={() => handleCardClick('appointments')}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer hover:bg-green-50"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl">📋</span>
            <span className="text-2xl font-bold text-green-600">All Appointments</span>
          </div>
          <h3 className="text-gray-600 font-medium">Manage all appointment requests</h3>
          <p className="text-xs text-green-500 mt-1">Click to open →</p>
        </div>
      </div>
      
      {/* Pending Requests Section (unchanged) */}
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
                      onClick={(e) => handleAccept(request.id, e)}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={(e) => handleReschedule(request, e)}
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

      {/* Reschedule Modal (unchanged) */}
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
                  className="flex-1 bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600"
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