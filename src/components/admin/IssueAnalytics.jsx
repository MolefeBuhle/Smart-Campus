import React, { useState, useEffect } from 'react';
import { useMaintenance } from '../../contexts/MaintenanceContext';
import { useNavigate } from 'react-router-dom';

const IssueAnalytics = () => {
  const navigate = useNavigate();
  const { getAllIssues } = useMaintenance();
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    reported: 0,
    inProgress: 0,
    fixed: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allIssues = getAllIssues();
    setIssues(allIssues);
    setStats({
      total: allIssues.length,
      reported: allIssues.filter(i => i.status === 'reported').length,
      inProgress: allIssues.filter(i => i.status === 'in-progress').length,
      fixed: allIssues.filter(i => i.status === 'fixed').length,
      highPriority: allIssues.filter(i => i.priority === 'high').length,
      mediumPriority: allIssues.filter(i => i.priority === 'medium').length,
      lowPriority: allIssues.filter(i => i.priority === 'low').length
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'fixed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Issue Analytics</h1>
            <p className="text-blue-100">Detailed breakdown of all maintenance issues</p>
          </div>
          <button
            onClick={() => navigate('/issues')}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
          >
            Manage Issues →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Breakdown</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Reported</span>
                <span className="font-medium">{stats.reported}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: `${stats.total ? (stats.reported / stats.total) * 100 : 0}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>In Progress</span>
                <span className="font-medium">{stats.inProgress}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${stats.total ? (stats.inProgress / stats.total) * 100 : 0}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Fixed</span>
                <span className="font-medium">{stats.fixed}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${stats.total ? (stats.fixed / stats.total) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Priority Breakdown</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>High Priority</span>
                <span className="font-medium">{stats.highPriority}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: `${stats.total ? (stats.highPriority / stats.total) * 100 : 0}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Medium Priority</span>
                <span className="font-medium">{stats.mediumPriority}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${stats.total ? (stats.mediumPriority / stats.total) * 100 : 0}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Low Priority</span>
                <span className="font-medium">{stats.lowPriority}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${stats.total ? (stats.lowPriority / stats.total) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">All Issues</h2>
        {issues.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No issues reported yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {issues.map((issue) => (
              <div key={issue.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{issue.title}</p>
                    <p className="text-sm text-gray-600">{issue.description}</p>
                    <p className="text-xs text-gray-500 mt-1">📍 {issue.roomName} | 👤 {issue.reporterName}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(issue.status)}`}>
                    {issue.status}
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

export default IssueAnalytics;