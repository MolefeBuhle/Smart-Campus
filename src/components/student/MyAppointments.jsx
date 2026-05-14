// src/components/student/MyAppointments.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAppointments } from '../../contexts/AppointmentContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const MyAppointments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getStudentAppointments, cancelAppointment } = useAppointments();
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [deleteReason, setDeleteReason] = useState('');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = () => {
    const allAppointments = getStudentAppointments();
    setAppointments(allAppointments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  const handleDeleteClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }
    if (selectedAppointment) {
      // Optimistically remove from local state immediately
      setAppointments(prev => prev.filter(apt => apt.id !== selectedAppointment.id));
      setShowDeleteModal(false);
      setSelectedAppointment(null);
      setDeleteReason('');
      
      // Then perform the actual deletion in background (with notification)
      const result = await cancelAppointment(selectedAppointment.id, deleteReason);
      if (!result.success) {
        // If deletion failed, revert the optimistic removal
        loadAppointments();
        toast.error('Failed to cancel appointment');
      }
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-primary-500 to-secondary-600 rounded-xl p-6 text-white shadow-lg mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">My Appointments</h1>
          <p className="text-primary-100">Track and manage your appointments with lecturers</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex gap-3 mb-6 border-b border-gray-200 pb-3">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            All ({appointments.length})
          </button>
          <button 
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            Pending ({appointments.filter(a => a.status === 'pending').length})
          </button>
          <button 
            onClick={() => setFilter('confirmed')}
            className={`px-4 py-2 rounded-lg ${filter === 'confirmed' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            Confirmed ({appointments.filter(a => a.status === 'confirmed').length})
          </button>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-gray-500 text-lg">No appointments found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((apt) => (
              <div key={apt.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{apt.lecturerName}</p>
                    <p className="text-sm text-gray-600 mt-1">📅 {apt.date} at {apt.timeSlot}</p>
                    <p className="text-sm text-gray-600 mt-1">📝 Purpose: {apt.purpose}</p>
                    <p className="text-xs text-gray-400 mt-2">Requested on: {new Date(apt.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 text-sm rounded-full ${getStatusBadge(apt.status)}`}>
                      {apt.status.toUpperCase()}
                    </span>
                    <button
                      onClick={() => handleDeleteClick(apt)}
                      className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1 transition-colors"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Appointment</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to cancel your appointment with <strong>{selectedAppointment.lecturerName}</strong> on <strong>{selectedAppointment.date}</strong> at <strong>{selectedAppointment.timeSlot}</strong>?
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason for cancellation *</label>
              <textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Please tell us why you're cancelling..."
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedAppointment(null);
                  setDeleteReason('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Keep Appointment
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;