import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const MyStudents = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, [user]);

  const loadStudents = () => {
    // HARDCODED DEFAULT STUDENTS (always present)
    const defaultStudents = [
      { 
        id: 'student_1', 
        name: 'Buhle Ndlovu', 
        studentId: '20240001', 
        course: 'Computer Science', 
        year: 2, 
        email: 'buhle@campus.edu',
        isDefault: true,
        registeredDate: '2024-01-15'
      },
      { 
        id: 'student_2', 
        name: 'Mpho Dlamini', 
        studentId: '20240002', 
        course: 'Information Technology', 
        year: 3, 
        email: 'mpho@campus.edu',
        isDefault: true,
        registeredDate: '2024-01-20'
      },
      { 
        id: 'student_3', 
        name: 'Karabo Nchabeleng', 
        studentId: '20240003', 
        course: 'Computer Science', 
        year: 1, 
        email: 'karabo@campus.edu',
        isDefault: true,
        registeredDate: '2024-02-01'
      },
      { 
        id: 'student_4', 
        name: 'Kamogelo Molefe', 
        studentId: '20240004', 
        course: 'Engineering', 
        year: 2, 
        email: 'kamogelo@campus.edu',
        isDefault: true,
        registeredDate: '2024-02-10'
      }
    ];
    
    // Get ALL registered users from localStorage (including new signups)
    const allUsers = JSON.parse(localStorage.getItem('campus_users') || '[]');
    
    // Filter to get only students (role = 'student')
    const registeredStudents = allUsers.filter(u => u.role === 'student');
    
    // Create a map of existing student emails from default students
    const defaultEmails = new Set(defaultStudents.map(s => s.email));
    
    // Add new students that are NOT in default students
    const newStudents = registeredStudents.filter(s => !defaultEmails.has(s.email));
    
    // Combine default students + new registered students
    const allStudents = [...defaultStudents, ...newStudents];
    
    // Each lecturer teaches all students
    setStudents(allStudents);
    setLoading(false);
  };

  const getLecturerName = () => {
    const lecturers = {
      'tebogo@campus.edu': 'Tebogo Molefe',
      'kgotso@campus.edu': 'Kgotso Khumalo',
      'itumeleng@campus.edu': 'Itumeleng Molefe',
      'ishmail@campus.edu': 'Ishmail Mdlhuli'
    };
    return lecturers[user?.email] || user?.name;
  };

  // Count how many new students (not default)
  const newStudentCount = students.filter(s => !s.isDefault).length;
  const defaultCount = students.filter(s => s.isDefault).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">My Students</h1>
            <p className="text-blue-100">{getLecturerName()} • Teaching {students.length} student{students.length !== 1 ? 's' : ''}</p>
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
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-blue-800">📚 Default Students: <strong>{defaultCount}</strong></p>
            <p className="text-xs text-blue-600">Hardcoded students (always present)</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-green-800">🆕 New Registrations: <strong>{newStudentCount}</strong></p>
            <p className="text-xs text-green-600">Students who signed up</p>
          </div>
        </div>

        {/* Total Students */}
        <div className="mb-4 p-3 bg-purple-50 rounded-lg">
          <p className="text-purple-800">📊 Total Students: <strong>{students.length}</strong></p>
          <p className="text-xs text-purple-600">{defaultCount} default + {newStudentCount} new registrations</p>
        </div>

        {students.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-gray-500 text-lg">No students available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {students.map((student) => (
              <div key={student.id} className={`p-4 rounded-lg border transition hover:shadow-md ${
                student.isDefault ? 'bg-gray-50 border-gray-200' : 'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl font-bold text-blue-600">
                    {student.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{student.name}</h3>
                      {!student.isDefault && (
                        <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Student ID: {student.studentId || 'Pending'}</p>
                    <p className="text-sm text-gray-600">Course: {student.course || 'Not assigned'}</p>
                    <p className="text-sm text-gray-600">Year: {student.year || 'N/A'}</p>
                    <p className="text-sm text-gray-600">Email: {student.email}</p>
                    {!student.isDefault && student.createdAt && (
                      <p className="text-xs text-green-600 mt-1">
                        ✅ Registered: {new Date(student.createdAt).toLocaleDateString()}
                      </p>
                    )}
                    {student.isDefault && (
                      <p className="text-xs text-blue-600 mt-1">
                        📌 Default student (pre-registered)
                      </p>
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

export default MyStudents;