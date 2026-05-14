// src/components/lecturer/LecturerTimetable.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAppointments } from '../../contexts/AppointmentContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LecturerTimetable = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getLecturerAppointments, appointments } = useAppointments();
  const [timetable, setTimetable] = useState({});
  const [week, setWeek] = useState(1);

  useEffect(() => {
    if (user) {
      generateTimetable();
    }
  }, [user, appointments]);

  const generateTimetable = () => {
    const allAppointments = getLecturerAppointments();
    // Only confirmed appointments
    const confirmed = allAppointments.filter(apt => apt.status === 'confirmed');
    
    // Get today's date (without time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Filter future appointments (including today)
    const futureConfirmed = confirmed.filter(apt => {
      const aptDate = new Date(apt.date);
      aptDate.setHours(0, 0, 0, 0);
      return aptDate >= today;
    });
    
    // Days of week
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    // Time slots with keys that match our storage format (e.g., "09:00")
    const timeSlots = [
      { key: '09:00', display: '09:00 - 10:30' },
      { key: '10:00', display: '10:00 - 11:30' },
      { key: '11:00', display: '11:00 - 12:30' },
      { key: '13:00', display: '13:00 - 14:30' },
      { key: '14:00', display: '14:00 - 15:30' },
      { key: '15:00', display: '15:00 - 17:00' }
    ];
    
    // Initialize empty timetable
    const newTimetable = {};
    days.forEach(day => {
      newTimetable[day] = {};
      timeSlots.forEach(slot => {
        newTimetable[day][slot.key] = null;
      });
    });
    
    // Helper to convert display time like "10:00 AM" to key "10:00"
    const timeDisplayToKey = (display) => {
      const match = display.match(/(\d{1,2}):(\d{2})\s?(AM|PM)/i);
      if (!match) return null;
      let hour = parseInt(match[1], 10);
      const minute = match[2];
      const ampm = match[3].toUpperCase();
      if (ampm === 'PM' && hour !== 12) hour += 12;
      if (ampm === 'AM' && hour === 12) hour = 0;
      return `${hour.toString().padStart(2, '0')}:${minute}`;
    };
    
    // Place each confirmed appointment
    futureConfirmed.forEach(apt => {
      const aptDate = new Date(apt.date);
      const dayName = aptDate.toLocaleDateString('en-US', { weekday: 'long' });
      let timeKey = timeDisplayToKey(apt.timeSlot);
      if (!timeKey) {
        // fallback: try to parse directly
        if (apt.timeSlot.includes('09:00')) timeKey = '09:00';
        else if (apt.timeSlot.includes('10:00')) timeKey = '10:00';
        else if (apt.timeSlot.includes('11:00')) timeKey = '11:00';
        else if (apt.timeSlot.includes('13:00')) timeKey = '13:00';
        else if (apt.timeSlot.includes('14:00')) timeKey = '14:00';
        else if (apt.timeSlot.includes('15:00')) timeKey = '15:00';
        else return;
      }
      if (newTimetable[dayName] && newTimetable[dayName][timeKey] === null) {
        newTimetable[dayName][timeKey] = {
          studentName: apt.studentName,
          purpose: apt.purpose,
          timeSlot: apt.timeSlot,
          date: apt.date
        };
      }
    });
    
    setTimetable(newTimetable);
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    { key: '09:00', display: '09:00 - 10:30' },
    { key: '10:00', display: '10:00 - 11:30' },
    { key: '11:00', display: '11:00 - 12:30' },
    { key: '13:00', display: '13:00 - 14:30' },
    { key: '14:00', display: '14:00 - 15:30' },
    { key: '15:00', display: '15:00 - 17:00' }
  ];

  const handlePrint = () => {
    window.print();
    toast.success('Print dialog opened');
  };

  // Count total appointments in timetable
  const appointmentCount = Object.values(timetable).reduce((count, day) => {
    return count + Object.values(day).filter(v => v !== null).length;
  }, 0);

  return (
    <div>
      <div className="bg-gradient-to-r from-primary-500 to-secondary-600 rounded-xl p-6 text-white shadow-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">My Timetable</h1>
            <p className="text-primary-100">
              {user?.name} • {appointmentCount} confirmed appointment{appointmentCount !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-white text-primary-600 rounded-lg hover:bg-primary-50 transition font-medium"
          >
            🖨️ Print
          </button>
        </div>
      </div>

      {appointmentCount === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Confirmed Appointments</h3>
          <p className="text-gray-600">Once you accept student appointment requests, they will appear here.</p>
          <button 
            onClick={() => navigate('/manage-appointments')}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            Manage Appointments
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-32">Time</th>
                  {days.map(day => (
                    <th key={day} className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot, idx) => (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">
                      {slot.display}
                    </td>
                    {days.map(day => {
                      const appointment = timetable[day]?.[slot.key];
                      return (
                        <td key={day} className="px-4 py-3">
                          {appointment ? (
                            <div className="bg-green-50 p-2 rounded-lg border border-green-200">
                              <p className="font-medium text-gray-900 text-sm">👤 {appointment.studentName}</p>
                              <p className="text-xs text-gray-600 mt-1">📝 {appointment.purpose}</p>
                              <p className="text-xs text-gray-500">🕐 {appointment.timeSlot}</p>
                              <p className="text-xs text-gray-400">{appointment.date}</p>
                            </div>
                          ) : (
                            <p className="text-gray-400 text-sm">Free</p>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-6 bg-primary-50 rounded-lg p-4 border border-primary-200">
        <p className="text-sm text-primary-800">
          <strong>📌 Note:</strong> This timetable shows only <strong>confirmed appointments</strong> that are scheduled for today or future dates. Past appointments are automatically removed.
        </p>
      </div>
    </div>
  );
};

export default LecturerTimetable;