// src/contexts/AppointmentContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const AppointmentContext = createContext();

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointments must be used within AppointmentProvider');
  }
  return context;
};

export const AppointmentProvider = ({ children }) => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAppointments();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadAppointments = () => {
    const allAppointments = JSON.parse(localStorage.getItem('campus_appointments') || '[]');
    setAppointments(allAppointments);
    setLoading(false);
  };

  const saveAppointments = (newAppointments) => {
    localStorage.setItem('campus_appointments', JSON.stringify(newAppointments));
    setAppointments(newAppointments);
  };

  const getStudentAppointments = () => {
    return appointments.filter(apt => apt.studentId === user?.id);
  };

  const getLecturerAppointments = () => {
    return appointments.filter(apt => apt.lecturerId === user?.id);
  };

  const getPendingRequests = () => {
    return appointments.filter(apt => apt.lecturerId === user?.id && apt.status === 'pending');
  };

  const bookAppointment = async (lecturerId, lecturerName, date, timeSlot, purpose) => {
    try {
      const existingAppointment = appointments.find(
        apt => apt.lecturerId === lecturerId && apt.date === date && apt.timeSlot === timeSlot && apt.status !== 'cancelled'
      );
      
      if (existingAppointment) {
        toast.error('This time slot is already booked');
        return { success: false };
      }

      const newAppointment = {
        id: Date.now().toString(),
        studentId: user.id,
        studentName: user.name,
        lecturerId: lecturerId,
        lecturerName: lecturerName,
        date: date,
        timeSlot: timeSlot,
        purpose: purpose,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      const newAppointments = [...appointments, newAppointment];
      saveAppointments(newAppointments);
      
      // Send notification to lecturer
      const notifications = JSON.parse(localStorage.getItem('campus_notifications') || '[]');
      notifications.push({
        id: Date.now().toString(),
        title: 'New Appointment Request',
        message: `${user.name} has requested an appointment on ${date} at ${timeSlot}. Purpose: ${purpose}`,
        type: 'info',
        targetUserId: lecturerId,
        targetRole: 'lecturer',
        createdAt: new Date().toISOString(),
        readBy: []
      });
      localStorage.setItem('campus_notifications', JSON.stringify(notifications));
      
      toast.success('Appointment request sent!');
      return { success: true };
    } catch (error) {
      toast.error('Failed to book appointment');
      return { success: false };
    }
  };

  const acceptAppointment = async (appointmentId) => {
    try {
      const appointment = appointments.find(apt => apt.id === appointmentId);
      const updatedAppointments = appointments.map(apt =>
        apt.id === appointmentId ? { ...apt, status: 'confirmed' } : apt
      );
      saveAppointments(updatedAppointments);
      
      // Send notification to student
      const notifications = JSON.parse(localStorage.getItem('campus_notifications') || '[]');
      notifications.push({
        id: Date.now().toString(),
        title: 'Appointment Accepted',
        message: `Your appointment with ${appointment.lecturerName} on ${appointment.date} at ${appointment.timeSlot} has been ACCEPTED.`,
        type: 'success',
        targetUserId: appointment.studentId,
        targetRole: 'student',
        createdAt: new Date().toISOString(),
        readBy: []
      });
      localStorage.setItem('campus_notifications', JSON.stringify(notifications));
      
      toast.success('Appointment confirmed');
      return { success: true };
    } catch (error) {
      toast.error('Failed to accept appointment');
      return { success: false };
    }
  };

  const rescheduleAppointment = async (appointmentId, newDate, newTimeSlot) => {
    try {
      const appointment = appointments.find(apt => apt.id === appointmentId);
      const updatedAppointments = appointments.map(apt =>
        apt.id === appointmentId ? { ...apt, date: newDate, timeSlot: newTimeSlot, status: 'rescheduled' } : apt
      );
      saveAppointments(updatedAppointments);
      
      // Send notification to student
      const notifications = JSON.parse(localStorage.getItem('campus_notifications') || '[]');
      notifications.push({
        id: Date.now().toString(),
        title: 'Appointment Rescheduled',
        message: `Your appointment with ${appointment.lecturerName} has been RESCHEDULED to ${newDate} at ${newTimeSlot}.`,
        type: 'warning',
        targetUserId: appointment.studentId,
        targetRole: 'student',
        createdAt: new Date().toISOString(),
        readBy: []
      });
      localStorage.setItem('campus_notifications', JSON.stringify(notifications));
      
      toast.success('Appointment rescheduled');
      return { success: true };
    } catch (error) {
      toast.error('Failed to reschedule appointment');
      return { success: false };
    }
  };

  // NEW: Cancel/delete appointment (student side)
  const cancelAppointment = async (appointmentId, reason) => {
    try {
      const allAppointments = JSON.parse(localStorage.getItem('campus_appointments') || '[]');
      const appointment = allAppointments.find(apt => apt.id === appointmentId);
      if (!appointment) {
        toast.error('Appointment not found');
        return { success: false };
      }

      // Remove the appointment completely
      const updatedAppointments = allAppointments.filter(apt => apt.id !== appointmentId);
      localStorage.setItem('campus_appointments', JSON.stringify(updatedAppointments));
      setAppointments(updatedAppointments);

      // Send notification to the lecturer
      const notifications = JSON.parse(localStorage.getItem('campus_notifications') || '[]');
      notifications.push({
        id: Date.now().toString(),
        title: 'Appointment Cancelled by Student',
        message: `${appointment.studentName} has cancelled the appointment on ${appointment.date} at ${appointment.timeSlot}. Reason: ${reason}`,
        type: 'warning',
        targetUserId: appointment.lecturerId,
        targetRole: 'lecturer',
        createdAt: new Date().toISOString(),
        readBy: []
      });
      localStorage.setItem('campus_notifications', JSON.stringify(notifications));

      toast.success('Appointment cancelled successfully');
      return { success: true };
    } catch (error) {
      console.error('Cancel appointment error:', error);
      toast.error('Failed to cancel appointment');
      return { success: false };
    }
  };

  const value = {
    appointments,
    loading,
    bookAppointment,
    acceptAppointment,
    rescheduleAppointment,
    cancelAppointment,
    getStudentAppointments,
    getLecturerAppointments,
    getPendingRequests
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};