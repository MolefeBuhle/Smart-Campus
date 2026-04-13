import React, { useState, useEffect } from 'react';
import { useMaintenance } from '../../contexts/MaintenanceContext';
import toast from 'react-hot-toast';

const IssueManagement = () => {
  const { getAllIssues, updateIssueStatus } = useMaintenance();
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({ reported: 0, inProgress: 0, fixed: 0 });

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = () => {
    const allIssues = getAllIssues();
    setIssues(allIssues);
    setStats({
      reported: allIssues.filter(i => i.status === 'reported').length,
      inProgress: allIssues.filter(i => i.status === 'in-progress').length,
      fixed: allIssues.filter(i => i.status === 'fixed').length
    });
  };

  const handleStatusChange = async (issueId, newStatus) => {
    await updateIssueStatus(issueId, newStatus);
    loadIssues();
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const reportedIssues = issues.filter(i => i.status === 'reported');
  const inProgressIssues = issues.filter(i => i.status === 'in-progress');
  const fixedIssues = issues.filter(i => i.status === 'fixed');

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg mb-6">
        <h1 className="text-2xl font-bold mb-2">Issue Management</h1>
        <p className="text-blue-100">Track and manage maintenance requests</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{stats.reported}</p>
          <p className="text-sm text-gray-600">Reported</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
          <p className="text-sm text-gray-600">In Progress</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.fixed}</p>
          <p className="text-sm text-gray-600">Fixed</p>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reported Column */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h2 className="font-semibold text-gray-900 mb-3 flex items-center">
            <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
            Reported ({reportedIssues.length})
          </h2>
          <div className="space-y-3">
            {reportedIssues.map(issue => (
              <div key={issue.id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{issue.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(issue.priority)}`}>
                    {issue.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                <p className="text-xs text-gray-500">📍 {issue.roomName}</p>
                <p className="text-xs text-gray-500">👤 {issue.reporterName} ({issue.reporterRole})</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(issue.createdAt).toLocaleDateString()}
                </p>
                <div className="mt-3">
                  <select
                    onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                    value={issue.status}
                    className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="reported">📋 Reported</option>
                    <option value="in-progress">🔧 In Progress</option>
                    <option value="fixed">✅ Fixed</option>
                  </select>
                </div>
              </div>
            ))}
            {reportedIssues.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No reported issues
              </div>
            )}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h2 className="font-semibold text-gray-900 mb-3 flex items-center">
            <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
            In Progress ({inProgressIssues.length})
          </h2>
          <div className="space-y-3">
            {inProgressIssues.map(issue => (
              <div key={issue.id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{issue.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(issue.priority)}`}>
                    {issue.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                <p className="text-xs text-gray-500">📍 {issue.roomName}</p>
                <p className="text-xs text-gray-500">👤 {issue.reporterName} ({issue.reporterRole})</p>
                <div className="mt-3">
                  <select
                    onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                    value={issue.status}
                    className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="reported">📋 Reported</option>
                    <option value="in-progress">🔧 In Progress</option>
                    <option value="fixed">✅ Fixed</option>
                  </select>
                </div>
              </div>
            ))}
            {inProgressIssues.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No issues in progress
              </div>
            )}
          </div>
        </div>

        {/* Fixed Column */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h2 className="font-semibold text-gray-900 mb-3 flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            Fixed ({fixedIssues.length})
          </h2>
          <div className="space-y-3">
            {fixedIssues.map(issue => (
              <div key={issue.id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{issue.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(issue.priority)}`}>
                    {issue.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                <p className="text-xs text-gray-500">📍 {issue.roomName}</p>
                <p className="text-xs text-gray-500">👤 {issue.reporterName} ({issue.reporterRole})</p>
                <div className="mt-3">
                  <select
                    onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                    value={issue.status}
                    className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="reported">📋 Reported</option>
                    <option value="in-progress">🔧 In Progress</option>
                    <option value="fixed">✅ Fixed</option>
                  </select>
                </div>
              </div>
            ))}
            {fixedIssues.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No fixed issues
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueManagement;