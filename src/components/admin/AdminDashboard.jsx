import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useMaintenance } from '../../contexts/MaintenanceContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getAllIssues, getIssueStats } = useMaintenance();
  const [recentIssues, setRecentIssues] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalLecturers: 0,
    totalIssues: 0,
    pendingIssues: 0,
    resolvedIssues: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const users = JSON.parse(localStorage.getItem('campus_users') || '[]');
    const students = users.filter(u => u.role === 'student');
    const lecturers = users.filter(u => u.role === 'lecturer');
    
    const allIssues = getAllIssues();
    const pendingIssues = allIssues.filter(i => i.status === 'reported' || i.status === 'in-progress');
    const resolvedIssues = allIssues.filter(i => i.status === 'fixed');
    
    const recent = [...allIssues]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
    
    setStats({
      totalUsers: users.length,
      totalStudents: students.length,
      totalLecturers: lecturers.length,
      totalIssues: allIssues.length,
      pendingIssues: pendingIssues.length,
      resolvedIssues: resolvedIssues.length
    });
    
    setRecentIssues(recent);
  };

  const handleNavigate = (type) => {
    if (type === 'users') {
      navigate('/all-users');
    } else if (type === 'issues' || type === 'rate') {
      navigate('/issue-analytics');
    } else if (type === 'manage') {
      navigate('/issues');
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'reported': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'fixed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg mb-6">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-blue-100">Welcome back, {user?.name}. Here's your campus overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div 
          onClick={() => handleNavigate('users')}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer hover:bg-blue-50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            {stats.totalStudents} Students | {stats.totalLecturers} Lecturers
          </div>
          <p className="text-xs text-blue-600 mt-2">Click to view all →</p>
        </div>
        
        <div 
          onClick={() => handleNavigate('issues')}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer hover:bg-yellow-50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Issues</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalIssues}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <span className="text-2xl">🔧</span>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            {stats.pendingIssues} Pending | {stats.resolvedIssues} Resolved
          </div>
          <p className="text-xs text-yellow-600 mt-2">Click for analytics →</p>
        </div>
        
        <div 
          onClick={() => handleNavigate('rate')}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer hover:bg-green-50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Resolution Rate</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalIssues === 0 ? '0%' : Math.round((stats.resolvedIssues / stats.totalIssues) * 100) + '%'}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <span className="text-2xl">✅</span>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            {stats.resolvedIssues} of {stats.totalIssues} issues fixed
          </div>
          <p className="text-xs text-green-600 mt-2">Click for details →</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Issues Reported</h2>
          <button 
            onClick={() => handleNavigate('manage')}
            className="text-blue-600 text-sm hover:text-blue-700"
          >
            View All →
          </button>
        </div>
        
        {recentIssues.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🔧</div>
            <p className="text-gray-500">No issues reported yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentIssues.map((issue) => (
              <div key={issue.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900">{issue.title}</p>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(issue.priority)}`}>
                      {issue.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(issue.status)}`}>
                      {issue.status === 'in-progress' ? 'In Progress' : issue.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{issue.description}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-xs text-gray-500">📍 {issue.roomName}</p>
                    <p className="text-xs text-gray-500">👤 {issue.reporterName} ({issue.reporterRole})</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleNavigate('manage')}
                  className="ml-4 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;