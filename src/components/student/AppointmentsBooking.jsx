import React, { useState, useEffect } from 'react';
import { useAppointments } from '../../contexts/AppointmentContext';
import { useAuth } from '../../contexts/AuthContext';
import { getData, STORAGE_KEYS } from '../../utils/storage';
import toast from 'react-hot-toast';

const AppointmentsBooking = () => {
  const { user } = useAuth();
  const { bookAppointment } = useAppointments();
  const [lecturers, setLecturers] = useState([]);
  const [selectedLecturer, setSelectedLecturer] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load lecturers
    const users = getData(STORAGE_KEYS.USERS) || [];
    const lecturerList = users.filter(u => u.role === 'lecturer');
    setLecturers(lecturerList);

    // Load time slots
    const slots = getData(STORAGE_KEYS.TIME_SLOTS) || [];
    setTimeSlots(slots);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedLecturer || !selectedDate || !selectedTime || !purpose) {
      toast.error('Please fill in all fields');
      return;
    }

    const lecturer = lecturers.find(l => l.id === selectedLecturer);
    if (!lecturer) return;

    setLoading(true);
    const result = await bookAppointment(
      lecturer.id,
      lecturer.name,
      selectedDate,
      selectedTime,
      purpose
    );
    setLoading(false);

    if (result.success) {
      setSelectedLecturer('');
      setSelectedDate('');
      setSelectedTime('');
      setPurpose('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg mb-6">
        <h1 className="text-2xl font-bold mb-2">Book an Appointment</h1>
        <p className="text-blue-100">Schedule a meeting with your lecturers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Lecturer
              </label>
              <select
                value={selectedLecturer}
                onChange={(e) => setSelectedLecturer(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Choose a lecturer...</option>
                {lecturers.map(lecturer => (
                  <option key={lecturer.id} value={lecturer.id}>
                    {lecturer.name} - {lecturer.department || 'Computer Science'}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Time
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Choose a time slot...</option>
                {timeSlots.map(slot => (
                  <option key={slot.id} value={slot.display}>
                    {slot.display}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purpose of Meeting
              </label>
              <textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Assignment help, Exam review, Project discussion..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              {loading ? 'Booking...' : 'Request Appointment'}
            </button>
          </form>
        </div>

        {/* Information Box */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Important Information</h2>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>📅 Appointment Duration:</strong> 30 minutes
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>⏰ Available Times:</strong> Monday-Friday, 9:00 AM - 4:00 PM
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>📝 What to Prepare:</strong> Bring your student ID and any relevant materials
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Note:</strong> Appointments are subject to lecturer approval. You will receive a notification once confirmed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsBooking;