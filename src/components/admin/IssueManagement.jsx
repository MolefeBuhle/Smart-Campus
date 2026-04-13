import React, { useState, useEffect } from 'react';
import { useMaintenance } from '../../contexts/MaintenanceContext';
import toast from 'react-hot-toast';

const IssueManagement = () => {
  const { getAllIssues, updateIssueStatus } = useMaintenance();
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({ reported: 0, inProgress: 0, fixed: 0 });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [issueToDelete, setIssueToDelete] = useState(null);

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

  const handleDeleteIssue = () => {
    if (!issueToDelete) return;

    const updatedIssues = issues.filter(issue => issue.id !== issueToDelete.id);
    localStorage.setItem('campus_maintenance', JSON.stringify(updatedIssues));
    setIssues(updatedIssues);
    toast.success('Issue deleted successfully!');
    setShowDeleteModal(false);
    setIssueToDelete(null);
    loadIssues();
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
        <p className="text-blue-100">Track, manage, and delete maintenance requests</p>
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
                <p className="text-xs text-gray-500">👤 Reported by: {issue.reporterName} ({issue.reporterRole})</p>
                <div className="flex gap-2 mt-3">
                  <select
                    onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                    value={issue.status}
                    className="flex-1 text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="reported">📋 Reported</option>
                    <option value="in-progress">🔧 In Progress</option>
                    <option value="fixed">✅ Fixed</option>
                  </select>
                  <button
                    onClick={() => {
                      setIssueToDelete(issue);
                      setShowDeleteModal(true);
                    }}
                    className="px-2 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
            {reportedIssues.length === 0 && (
              <div className="text-center py-8 text-gray-500">No reported issues</div>
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
                <p className="text-xs text-gray-500">👤 Reported by: {issue.reporterName}</p>
                <div className="flex gap-2 mt-3">
                  <select
                    onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                    value={issue.status}
                    className="flex-1 text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="reported">📋 Reported</option>
                    <option value="in-progress">🔧 In Progress</option>
                    <option value="fixed">✅ Fixed</option>
                  </select>
                  <button
                    onClick={() => {
                      setIssueToDelete(issue);
                      setShowDeleteModal(true);
                    }}
                    className="px-2 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
            {inProgressIssues.length === 0 && (
              <div className="text-center py-8 text-gray-500">No issues in progress</div>
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
                <p className="text-xs text-gray-500">👤 Reported by: {issue.reporterName}</p>
                <div className="flex gap-2 mt-3">
                  <select
                    onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                    value={issue.status}
                    className="flex-1 text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="reported">📋 Reported</option>
                    <option value="in-progress">🔧 In Progress</option>
                    <option value="fixed">✅ Fixed</option>
                  </select>
                  <button
                    onClick={() => {
                      setIssueToDelete(issue);
                      setShowDeleteModal(true);
                    }}
                    className="px-2 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
            {fixedIssues.length === 0 && (
              <div className="text-center py-8 text-gray-500">No fixed issues</div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && issueToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="text-center mb-4">
              <div className="text-6xl mb-3">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
              <p className="text-gray-600 mt-2">
                Are you sure you want to delete this issue?
              </p>
              <p className="text-sm text-red-600 mt-2">
                <strong>{issueToDelete.title}</strong><br/>
                Reported by: {issueToDelete.reporterName}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setIssueToDelete(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteIssue}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete Issue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueManagement;