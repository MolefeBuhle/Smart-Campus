import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';
import toast from 'react-hot-toast';

const MaintenanceContext = createContext();

export const useMaintenance = () => {
  const context = useContext(MaintenanceContext);
  if (!context) {
    throw new Error('useMaintenance must be used within MaintenanceProvider');
  }
  return context;
};

export const MaintenanceProvider = ({ children }) => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = () => {
    const allIssues = JSON.parse(localStorage.getItem('campus_maintenance') || '[]');
    setIssues(allIssues);
    setLoading(false);
  };

  const saveIssues = (newIssues) => {
    localStorage.setItem('campus_maintenance', JSON.stringify(newIssues));
    setIssues(newIssues);
  };

  const getAllIssues = () => {
    const allIssues = JSON.parse(localStorage.getItem('campus_maintenance') || '[]');
    return allIssues;
  };

  const getUserIssues = () => {
    if (!user) return [];
    const allIssues = JSON.parse(localStorage.getItem('campus_maintenance') || '[]');
    return allIssues.filter(issue => issue.reportedBy === user.id);
  };

  const reportIssue = async (title, description, roomId, roomName, priority) => {
    try {
      const newIssue = {
        id: Date.now().toString(),
        title: title,
        description: description,
        roomId: roomId,
        roomName: roomName,
        reportedBy: user.id,
        reporterName: user.name,
        reporterRole: user.role,
        priority: priority,
        status: 'reported',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const currentIssues = getAllIssues();
      const newIssues = [...currentIssues, newIssue];
      localStorage.setItem('campus_maintenance', JSON.stringify(newIssues));
      setIssues(newIssues);
      
      // Find admin user to send notification
      const allUsers = JSON.parse(localStorage.getItem('campus_users') || '[]');
      const adminUser = allUsers.find(u => u.role === 'admin');
      
      if (adminUser) {
        addNotification(
          'New Maintenance Issue Reported',
          `${user.name} (${user.role}) reported: "${title}" in ${roomName}. Priority: ${priority}`,
          'warning',
          adminUser.id
        );
      }
      
      toast.success('Issue reported successfully!');
      return { success: true, issue: newIssue };
    } catch (error) {
      toast.error('Failed to report issue');
      return { success: false };
    }
  };

  const updateIssueStatus = async (issueId, newStatus) => {
    try {
      const issue = getAllIssues().find(i => i.id === issueId);
      const currentIssues = getAllIssues();
      const updatedIssues = currentIssues.map(issue =>
        issue.id === issueId ? { ...issue, status: newStatus, updatedAt: new Date().toISOString() } : issue
      );
      localStorage.setItem('campus_maintenance', JSON.stringify(updatedIssues));
      setIssues(updatedIssues);
      
      // Send notification to the person who reported the issue
      addNotification(
        `Issue Status Updated: ${issue.title}`,
        `Your reported issue has been marked as ${newStatus.toUpperCase()}.`,
        newStatus === 'fixed' ? 'success' : 'info',
        issue.reportedBy
      );
      
      toast.success(`Issue status updated to ${newStatus}`);
      return { success: true };
    } catch (error) {
      toast.error('Failed to update status');
      return { success: false };
    }
  };

  const getIssueStats = () => {
    const currentIssues = getAllIssues();
    return {
      total: currentIssues.length,
      reported: currentIssues.filter(i => i.status === 'reported').length,
      inProgress: currentIssues.filter(i => i.status === 'in-progress').length,
      fixed: currentIssues.filter(i => i.status === 'fixed').length
    };
  };

  const value = {
    issues,
    loading,
    reportIssue,
    updateIssueStatus,
    getAllIssues,
    getUserIssues,
    getIssueStats
  };

  return (
    <MaintenanceContext.Provider value={value}>
      {children}
    </MaintenanceContext.Provider>
  );
};