import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AllUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const allUsers = JSON.parse(localStorage.getItem('campus_users') || '[]');
    setUsers(allUsers);
  };

  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true;
    return user.role === filter;
  });

  const getRoleBadge = (role) => {
    switch(role) {
      case 'student': return 'bg-blue-100 text-blue-800';
      case 'lecturer': return 'bg-green-100 text-green-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">All Users</h1>
            <p className="text-blue-100">Manage all campus users</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex gap-3 mb-6 border-b border-gray-200 pb-3">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            All ({users.length})
          </button>
          <button 
            onClick={() => setFilter('student')}
            className={`px-4 py-2 rounded-lg ${filter === 'student' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            Students ({users.filter(u => u.role === 'student').length})
          </button>
          <button 
            onClick={() => setFilter('lecturer')}
            className={`px-4 py-2 rounded-lg ${filter === 'lecturer' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            Lecturers ({users.filter(u => u.role === 'lecturer').length})
          </button>
          <button 
            onClick={() => setFilter('admin')}
            className={`px-4 py-2 rounded-lg ${filter === 'admin' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            Admins ({users.filter(u => u.role === 'admin').length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition">
              <div className="flex items-start gap-3">
                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${getRoleBadge(user.role)}`}>
                    {user.role}
                  </span>
                  {user.studentId && <p className="text-xs text-gray-400 mt-2">ID: {user.studentId}</p>}
                  {user.employeeId && <p className="text-xs text-gray-400 mt-2">ID: {user.employeeId}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllUsers;