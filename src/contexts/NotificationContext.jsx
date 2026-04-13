import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const loadNotifications = () => {
    const allNotifications = JSON.parse(localStorage.getItem('campus_notifications') || '[]');
    setNotifications(allNotifications);
    
    // Count unread notifications for current user
    if (user) {
      const unread = allNotifications.filter(n => 
        n.targetUserId === user.id && !n.readBy?.includes(user.id)
      ).length;
      setUnreadCount(unread);
    }
  };

  const saveNotifications = (newNotifications) => {
    localStorage.setItem('campus_notifications', JSON.stringify(newNotifications));
    setNotifications(newNotifications);
  };

  // Add a new notification
  const addNotification = (title, message, type, targetUserId, targetRole = null) => {
    const newNotification = {
      id: Date.now().toString(),
      title: title,
      message: message,
      type: type, // 'success', 'info', 'warning', 'error'
      targetUserId: targetUserId,
      targetRole: targetRole,
      createdAt: new Date().toISOString(),
      readBy: []
    };

    const updatedNotifications = [...notifications, newNotification];
    saveNotifications(updatedNotifications);
    
    // Show toast for real-time notification
    if (targetUserId === user?.id) {
      toast[type || 'info'](message);
    }
    
    return newNotification;
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(notif => {
      if (notif.id === notificationId && user && !notif.readBy?.includes(user.id)) {
        return {
          ...notif,
          readBy: [...(notif.readBy || []), user.id]
        };
      }
      return notif;
    });
    saveNotifications(updatedNotifications);
    
    // Update unread count
    const unread = updatedNotifications.filter(n => 
      n.targetUserId === user?.id && !n.readBy?.includes(user?.id)
    ).length;
    setUnreadCount(unread);
  };

  // Get notifications for current user
  const getUserNotifications = () => {
    if (!user) return [];
    return notifications.filter(n => 
      n.targetUserId === user.id || n.targetRole === user.role || n.targetRole === 'all'
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  // Mark all as read
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notif => {
      if ((notif.targetUserId === user?.id || notif.targetRole === user?.role) && !notif.readBy?.includes(user?.id)) {
        return {
          ...notif,
          readBy: [...(notif.readBy || []), user.id]
        };
      }
      return notif;
    });
    saveNotifications(updatedNotifications);
    setUnreadCount(0);
    toast.success('All notifications marked as read');
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    getUserNotifications,
    loadNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};