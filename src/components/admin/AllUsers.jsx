import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const AllUsers = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const allUsers = JSON.parse(localStorage.getItem('campus_users') || '[]');
    setUsers(allUsers);
  };

  const handleDeleteUser = () => {
    if (!userToDelete) return;

    // Don't allow deleting yourself
    if (userToDelete.id === currentUser?.id) {
      toast.error("You cannot delete your own account!");
      setShowDeleteModal(false);
      setUserToDelete(null);
      return;
    }

    // Filter out the user to delete
    const updatedUsers = users.filter(u => u.id !== userToDelete.id);
    
    // Save to localStorage
    localStorage.setItem('campus_users', JSON.stringify(updatedUsers));
    
    // Also remove any appointments related to this user
    const allAppointments = JSON.parse(localStorage.getItem('campus_appointments') || '[]');
    const updatedAppointments = allAppointments.filter(
      apt => apt.studentId !== userToDelete.id && apt.lecturerId !== userToDelete.id
    );
    localStorage.setItem('campus_appointments', JSON.stringify(updatedAppointments));
    
    // Remove any maintenance issues reported by this user
    const allIssues = JSON.parse(localStorage.getItem('campus_maintenance') || '[]');
    const updatedIssues = allIssues.filter(issue => issue.reportedBy !== userToDelete.id);
    localStorage.setItem('campus_maintenance', JSON.stringify(updatedIssues));
    
    setUsers(updatedUsers);
    toast.success(`${userToDelete.name} has been deleted successfully!`);
    setShowDeleteModal(false);
    setUserToDelete(null);
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

  const getRoleIcon = (role) => {
    switch(role) {
      case 'student': return '🎓';
      case 'lecturer': return '👨‍🏫';
      case 'admin': return '👨‍💼';
      default: return '👤';
    }
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Manage Users</h1>
            <p className="text-blue-100">View, manage, and delete user accounts</p>
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

        <div className="grid grid-cols-1 gap-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl font-bold text-blue-600">
                  {getRoleIcon(user.role)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  {user.studentId && <p className="text-xs text-gray-500 mt-1">Student ID: {user.studentId}</p>}
                  {user.employeeId && <p className="text-xs text-gray-500 mt-1">Employee ID: {user.employeeId}</p>}
                  {user.course && <p className="text-xs text-gray-500">Course: {user.course}</p>}
                  {user.department && <p className="text-xs text-gray-500">Department: {user.department}</p>}
                  <p className="text-xs text-gray-400 mt-1">
                    Registered: {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setUserToDelete(user);
                  setShowDeleteModal(true);
                }}
                className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition flex items-center gap-1"
              >
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="text-center mb-4">
              <div className="text-6xl mb-3">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
              <p className="text-gray-600 mt-2">
                Are you sure you want to delete <strong>{userToDelete.name}</strong>?
              </p>
              <p className="text-sm text-red-600 mt-2">
                This action cannot be undone. All their appointments and issues will also be deleted.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;