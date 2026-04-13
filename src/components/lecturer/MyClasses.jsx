import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const MyClasses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState('weekly');
  const [todayClasses, setTodayClasses] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [weeklySchedule, setWeeklySchedule] = useState({});

  useEffect(() => {
    loadClasses();
  }, [user]);

  const loadClasses = () => {
    // Define classes for each lecturer (matching student timetables)
    const lecturerClasses = {
      'tebogo@campus.edu': {
        today: [
          { name: 'Computer Science 101', code: 'CS101', time: '09:00 - 10:30', room: 'Lecture Hall A', students: 2 },
          { name: 'Introduction to IT', code: 'IT101', time: '09:00 - 10:30', room: 'IT Lab 101', students: 1 }
        ],
        all: [
          { name: 'Computer Science 101', code: 'CS101', day: 'Monday', time: '09:00 - 10:30', room: 'Lecture Hall A', students: 2 },
          { name: 'Introduction to IT', code: 'IT101', day: 'Monday', time: '09:00 - 10:30', room: 'IT Lab 101', students: 1 },
          { name: 'Data Structures', code: 'CS201', day: 'Tuesday', time: '11:00 - 12:30', room: 'CS Lab 101', students: 1 },
          { name: 'Network Security', code: 'IT201', day: 'Tuesday', time: '13:00 - 14:30', room: 'Network Lab', students: 1 }
        ]
      },
      'kgotso@campus.edu': {
        today: [
          { name: 'Calculus II', code: 'MATH201', time: '14:00 - 15:30', room: 'Math Building 105', students: 2 }
        ],
        all: [
          { name: 'Calculus II', code: 'MATH201', day: 'Monday', time: '14:00 - 15:30', room: 'Math Building 105', students: 2 },
          { name: 'Calculus I', code: 'MATH101', day: 'Tuesday', time: '10:00 - 11:30', room: 'Math Building 101', students: 1 },
          { name: 'Database Systems', code: 'DB101', day: 'Friday', time: '09:00 - 11:00', room: 'CS Lab 102', students: 1 }
        ]
      },
      'itumeleng@campus.edu': {
        today: [
          { name: 'Introduction to Physics', code: 'PHY101', time: '13:00 - 14:30', room: 'Science Lab 101', students: 2 },
          { name: 'Computer Networks', code: 'NET101', time: '14:00 - 16:00', room: 'Network Lab', students: 1 }
        ],
        all: [
          { name: 'Introduction to Physics', code: 'PHY101', day: 'Monday', time: '13:00 - 14:30', room: 'Science Lab 101', students: 2 },
          { name: 'Computer Networks', code: 'NET101', day: 'Monday', time: '14:00 - 16:00', room: 'Network Lab', students: 1 },
          { name: 'Physics for Engineers', code: 'PHY201', day: 'Wednesday', time: '14:00 - 15:30', room: 'Science Lab 102', students: 1 }
        ]
      },
      'ishmail@campus.edu': {
        today: [
          { name: 'Academic Writing', code: 'ENG101', time: '10:00 - 12:00', room: 'Humanities Hall 202', students: 3 },
          { name: 'Engineering Design', code: 'DESIGN101', time: '13:00 - 15:00', room: 'Design Studio', students: 1 }
        ],
        all: [
          { name: 'Academic Writing', code: 'ENG101', day: 'Friday', time: '10:00 - 12:00', room: 'Humanities Hall 202', students: 3 },
          { name: 'Engineering Design', code: 'DESIGN101', day: 'Friday', time: '13:00 - 15:00', room: 'Design Studio', students: 1 },
          { name: 'Advanced Composition', code: 'ENG201', day: 'Wednesday', time: '15:00 - 17:00', room: 'Humanities Hall 205', students: 0 }
        ]
      }
    };

    const data = lecturerClasses[user?.email] || { today: [], all: [] };
    setTodayClasses(data.today);
    setAllClasses(data.all);
    
    // Build weekly schedule
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const schedule = {};
    days.forEach(day => { schedule[day] = []; });
    
    data.all.forEach(classItem => {
      if (schedule[classItem.day]) {
        schedule[classItem.day].push(classItem);
      }
    });
    setWeeklySchedule(schedule);
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

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">My Classes</h1>
            <p className="text-blue-100">{getLecturerName()} • Today's Schedule</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Today's Classes Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          📅 Today's Classes ({todayClasses.length})
        </h2>
        {todayClasses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No classes scheduled for today</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todayClasses.map((class_, idx) => (
              <div key={idx} className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        {class_.code}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg">{class_.name}</h3>
                    <p className="text-sm text-gray-600 mt-2">🕐 {class_.time}</p>
                    <p className="text-sm text-gray-600">📍 {class_.room}</p>
                    <p className="text-sm text-gray-600 mt-2">👥 {class_.students} students enrolled</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weekly Schedule Toggle */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex gap-3 mb-6">
          <button 
            onClick={() => setView('weekly')}
            className={`px-4 py-2 rounded-lg ${view === 'weekly' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            Weekly Schedule
          </button>
          <button 
            onClick={() => setView('all')}
            className={`px-4 py-2 rounded-lg ${view === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            All Courses
          </button>
        </div>

        {view === 'weekly' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Day</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Courses</th>
                 </tr>
              </thead>
              <tbody>
                {days.map(day => (
                  <tr key={day} className="border-b border-gray-200">
                    <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">{day}</td>
                    <td className="px-4 py-3">
                      {weeklySchedule[day]?.length > 0 ? (
                        <div className="space-y-2">
                          {weeklySchedule[day].map((course, idx) => (
                            <div key={idx} className="p-2 bg-blue-50 rounded">
                              <p className="font-medium text-gray-900">{course.name} ({course.code})</p>
                              <p className="text-xs text-gray-600">{course.time} • {course.room}</p>
                              <p className="text-xs text-gray-500">{course.students} students</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-sm">No classes</p>
                      )}
                     </td>
                   </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allClasses.map((course, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      {course.code}
                    </span>
                    <h3 className="font-semibold text-gray-900 mt-2">{course.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">📅 {course.day}</p>
                    <p className="text-sm text-gray-600">🕐 {course.time}</p>
                    <p className="text-sm text-gray-600">📍 {course.room}</p>
                    <p className="text-sm text-gray-600 mt-2">👥 {course.students} students enrolled</p>
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

export default MyClasses;