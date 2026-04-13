import React, { useState } from 'react';
import toast from 'react-hot-toast';

const LecturerTimetable = () => {
  const [week, setWeek] = useState(1);
  
  const timetable = {
    Monday: [
      { time: '09:00 - 10:30', course: 'Computer Science 101', room: 'Lecture Hall A', students: 45 },
      { time: '14:00 - 15:30', course: 'Web Development', room: 'CS Lab 102', students: 38 }
    ],
    Tuesday: [
      { time: '11:00 - 12:30', course: 'Data Structures', room: 'CS Lab 101', students: 42 }
    ],
    Wednesday: [
      { time: '09:00 - 10:30', course: 'Computer Science 101', room: 'Lecture Hall A', students: 45 },
      { time: '14:00 - 15:30', course: 'Web Development', room: 'CS Lab 102', students: 38 }
    ],
    Thursday: [
      { time: '11:00 - 12:30', course: 'Data Structures', room: 'CS Lab 101', students: 42 }
    ],
    Friday: [
      { time: '09:00 - 10:30', course: 'Computer Science 101', room: 'Lecture Hall A', students: 45 }
    ]
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const handlePrint = () => {
    window.print();
    toast.success('Print dialog opened');
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">My Teaching Schedule</h1>
            <p className="text-blue-100">Week {week} • Academic Calendar</p>
          </div>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
          >
            🖨️ Print
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Time</th>
                {days.map(day => (
                  <th key={day} className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {['09:00 - 10:30', '11:00 - 12:30', '14:00 - 15:30'].map((timeSlot, idx) => (
                <tr key={idx} className="border-b border-gray-200">
                  <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">
                    {timeSlot}
                  </td>
                  {days.map(day => {
                    const classItem = timetable[day]?.find(c => c.time === timeSlot);
                    return (
                      <td key={day} className="px-4 py-3">
                        {classItem ? (
                          <div>
                            <p className="font-medium text-gray-900">{classItem.course}</p>
                            <p className="text-xs text-gray-500">{classItem.room}</p>
                            <p className="text-xs text-gray-400">{classItem.students} students</p>
                          </div>
                        ) : (
                          <p className="text-gray-400 text-sm">Office Hours</p>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LecturerTimetable;