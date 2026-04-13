import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAppointments } from '../../contexts/AppointmentContext';
import { useNavigate } from 'react-router-dom';

const MyAppointments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getStudentAppointments } = useAppointments();
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = () => {
    const allAppointments = getStudentAppointments();
    setAppointments(allAppointments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">My Appointments</h1>
          <p className="text-blue-100">Track all your appointments with lecturers</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex gap-3 mb-6 border-b border-gray-200 pb-3">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
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
                  <div>
                    <p className="font-semibold text-gray-900">{apt.lecturerName}</p>
                    <p className="text-sm text-gray-600 mt-1">📅 {apt.date} at {apt.timeSlot}</p>
                    <p className="text-sm text-gray-600 mt-1">📝 Purpose: {apt.purpose}</p>
                    <p className="text-xs text-gray-400 mt-2">Requested on: {new Date(apt.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 text-sm rounded-full ${getStatusBadge(apt.status)}`}>
                    {apt.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;