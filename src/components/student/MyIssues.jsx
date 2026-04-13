import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useMaintenance } from '../../contexts/MaintenanceContext';
import { useNavigate } from 'react-router-dom';

const MyIssues = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getUserIssues } = useMaintenance();
  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = () => {
    const myIssues = getUserIssues();
    setIssues(myIssues.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  const filteredIssues = issues.filter(issue => {
    if (filter === 'all') return true;
    return issue.status === filter;
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'fixed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'reported': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">My Reported Issues</h1>
          <p className="text-blue-100">Track the status of issues you've reported</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex gap-3 mb-6 border-b border-gray-200 pb-3">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            All ({issues.length})
          </button>
        </div>

        {filteredIssues.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔧</div>
            <p className="text-gray-500 text-lg">No issues reported yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredIssues.map((issue) => (
              <div key={issue.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold text-gray-900">{issue.title}</p>
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityBadge(issue.priority)}`}>
                        {issue.priority}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(issue.status)}`}>
                        {issue.status === 'in-progress' ? 'In Progress' : issue.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{issue.description}</p>
                    <p className="text-sm text-gray-500 mt-2">📍 {issue.roomName}</p>
                    <p className="text-xs text-gray-400 mt-2">Reported on: {new Date(issue.createdAt).toLocaleDateString()}</p>
                    {issue.updatedAt !== issue.createdAt && (
                      <p className="text-xs text-gray-400">Last updated: {new Date(issue.updatedAt).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyIssues;