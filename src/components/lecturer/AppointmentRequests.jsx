import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAppointments } from '../../contexts/AppointmentContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AppointmentRequests = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getPendingRequests, getLecturerAppointments, acceptAppointment, rescheduleAppointment } = useAppointments();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [confirmedAppointments, setConfirmedAppointments] = useState([]);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    loadAppointments();
    const slots = JSON.parse(localStorage.getItem('campus_time_slots') || '[]');
    setTimeSlots(slots);
  }, []);

  const loadAppointments = () => {
    // Get ONLY pending requests for THIS lecturer
    const pending = getPendingRequests();
    const confirmed = getLecturerAppointments().filter(apt => apt.status === 'confirmed');
    
    setPendingRequests(pending);
    setConfirmedAppointments(confirmed);
  };

  const handleAccept = async (appointmentId) => {
    await acceptAppointment(appointmentId);
    loadAppointments();
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
      loadAppointments();
      toast.success('Appointment rescheduled!');
    }
  };

  const getLecturerName = () => {
    const lecturers = {
      'tebogo@campus.edu': 'Tebogo Molefe',
      'kgotso@campus.edu': 'Kgotso Khumalo',
      'itumeleng@campus.edu': 'Itumeleng Molefe',
      'ishmail@campus.edu': 'Ishmail Mdlhuli'
    };
    return lecturers[user?.email] || user?.name;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Manage Appointments</h1>
            <p className="text-blue-100">{getLecturerName()} • Review and manage student appointment requests</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Requests - ONLY for this lecturer */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Pending Requests ({pendingRequests.length})
          </h2>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📅</div>
              <p className="text-gray-500">No pending appointment requests</p>
              <p className="text-sm text-gray-400 mt-1">When students book appointments, they will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">{request.studentName}</p>
                      <p className="text-sm text-gray-600">{request.date} at {request.timeSlot}</p>
                      <p className="text-sm text-gray-600 mt-1">Purpose: {request.purpose}</p>
                      <p className="text-xs text-gray-400 mt-2">Requested: {new Date(request.createdAt).toLocaleDateString()}</p>
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

        {/* Confirmed Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Confirmed Appointments ({confirmedAppointments.length})
          </h2>
          {confirmedAppointments.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <p className="text-gray-500">No confirmed appointments</p>
              <p className="text-sm text-gray-400 mt-1">Accepted appointments will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {confirmedAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="font-semibold text-gray-900">{appointment.studentName}</p>
                  <p className="text-sm text-gray-600">{appointment.date} at {appointment.timeSlot}</p>
                  <p className="text-sm text-gray-600 mt-1">Purpose: {appointment.purpose}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reschedule Modal */}
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

export default AppointmentRequests;