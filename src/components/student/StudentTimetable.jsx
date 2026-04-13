import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const StudentTimetable = () => {
  const { user } = useAuth();
  const [week, setWeek] = useState(1);
  const [timetable, setTimetable] = useState({});

  useEffect(() => {
    if (user) {
      generateTimetable();
    }
  }, [user]);

  const generateTimetable = () => {
    // Get the student's enrolled courses from their profile
    let studentCourses = [];
    
    // For hardcoded students (Buhle, Mpho, Karabo, Kamogelo)
    if (user?.enrolledCourses && user.enrolledCourses.length > 0) {
      studentCourses = user.enrolledCourses;
    } 
    // For new students who completed the wizard
    else if (user?.courseDetails && user.courseDetails.length > 0) {
      studentCourses = user.courseDetails.map(c => c.id);
    }
    // For new students who selected courses in wizard
    else if (user?.selectedCourses && user.selectedCourses.length > 0) {
      studentCourses = user.selectedCourses;
    }
    
    console.log("Student courses:", studentCourses);
    
    // Define all courses with their schedules
    const allCourses = {
      // Computer Science
      CS101: { name: 'Computer Science 101', code: 'CS101', lecturer: 'Tebogo Molefe', room: 'Lecture Hall A', day: 'Monday', time: '09:00 - 10:30', timeSlot: '09:00' },
      CS201: { name: 'Data Structures', code: 'CS201', lecturer: 'Tebogo Molefe', room: 'CS Lab 101', day: 'Tuesday', time: '11:00 - 12:30', timeSlot: '11:00' },
      CS301: { name: 'Algorithms', code: 'CS301', lecturer: 'Tebogo Molefe', room: 'CS Lab 102', day: 'Wednesday', time: '14:00 - 15:30', timeSlot: '14:00' },
      // Information Technology
      IT101: { name: 'Introduction to IT', code: 'IT101', lecturer: 'Tebogo Molefe', room: 'IT Lab 101', day: 'Monday', time: '09:00 - 10:30', timeSlot: '09:00' },
      IT201: { name: 'Network Security', code: 'IT201', lecturer: 'Tebogo Molefe', room: 'Network Lab', day: 'Tuesday', time: '13:00 - 14:30', timeSlot: '13:00' },
      IT301: { name: 'Cloud Computing', code: 'IT301', lecturer: 'Tebogo Molefe', room: 'Cloud Lab', day: 'Thursday', time: '10:00 - 11:30', timeSlot: '10:00' },
      // Mathematics
      MATH101: { name: 'Calculus I', code: 'MATH101', lecturer: 'Kgotso Khumalo', room: 'Math Building 101', day: 'Tuesday', time: '10:00 - 11:30', timeSlot: '10:00' },
      MATH201: { name: 'Calculus II', code: 'MATH201', lecturer: 'Kgotso Khumalo', room: 'Math Building 105', day: 'Monday', time: '14:00 - 15:30', timeSlot: '14:00' },
      MATH301: { name: 'Linear Algebra', code: 'MATH301', lecturer: 'Kgotso Khumalo', room: 'Math Building 201', day: 'Thursday', time: '13:00 - 14:30', timeSlot: '13:00' },
      // Physics
      PHY101: { name: 'Introduction to Physics', code: 'PHY101', lecturer: 'Itumeleng Molefe', room: 'Science Lab 101', day: 'Monday', time: '13:00 - 14:30', timeSlot: '13:00' },
      PHY201: { name: 'Physics for Engineers', code: 'PHY201', lecturer: 'Itumeleng Molefe', room: 'Science Lab 102', day: 'Wednesday', time: '14:00 - 15:30', timeSlot: '14:00' },
      PHY301: { name: 'Quantum Physics', code: 'PHY301', lecturer: 'Itumeleng Molefe', room: 'Science Lab 103', day: 'Friday', time: '09:00 - 10:30', timeSlot: '09:00' },
      // English
      ENG101: { name: 'Academic Writing', code: 'ENG101', lecturer: 'Ishmail Mdlhuli', room: 'Humanities Hall 202', day: 'Friday', time: '10:00 - 12:00', timeSlot: '10:00' },
      ENG201: { name: 'Advanced Composition', code: 'ENG201', lecturer: 'Ishmail Mdlhuli', room: 'Humanities Hall 205', day: 'Wednesday', time: '15:00 - 17:00', timeSlot: '15:00' },
      ENG301: { name: 'Creative Writing', code: 'ENG301', lecturer: 'Ishmail Mdlhuli', room: 'Humanities Hall 208', day: 'Tuesday', time: '14:00 - 15:30', timeSlot: '14:00' },
      // Engineering
      DESIGN101: { name: 'Engineering Design', code: 'DESIGN101', lecturer: 'Ishmail Mdlhuli', room: 'Design Studio', day: 'Friday', time: '13:00 - 15:00', timeSlot: '13:00' },
      MECH101: { name: 'Mechanics', code: 'MECH101', lecturer: 'Itumeleng Molefe', room: 'Engineering Lab 101', day: 'Monday', time: '11:00 - 12:30', timeSlot: '11:00' },
      ELEC101: { name: 'Electronics', code: 'ELEC101', lecturer: 'Itumeleng Molefe', room: 'Electronics Lab', day: 'Wednesday', time: '09:00 - 10:30', timeSlot: '09:00' }
    };

    // Build timetable structure
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'];
    
    const newTimetable = {};
    days.forEach(day => {
      newTimetable[day] = {};
      timeSlots.forEach(slot => {
        newTimetable[day][slot] = null;
      });
    });

    // Populate timetable with student's enrolled courses
    if (studentCourses && studentCourses.length > 0) {
      studentCourses.forEach(courseId => {
        const course = allCourses[courseId];
        if (course && newTimetable[course.day]) {
          newTimetable[course.day][course.timeSlot] = {
            name: course.name,
            lecturer: course.lecturer,
            room: course.room,
            code: course.code
          };
        }
      });
    }

    console.log("Generated timetable:", newTimetable);
    setTimetable(newTimetable);
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    { time: '09:00', display: '09:00 - 10:30' },
    { time: '10:00', display: '10:00 - 11:30' },
    { time: '11:00', display: '11:00 - 12:30' },
    { time: '13:00', display: '13:00 - 14:30' },
    { time: '14:00', display: '14:00 - 15:30' },
    { time: '15:00', display: '15:00 - 17:00' }
  ];

  const handlePrint = () => {
    window.print();
    toast.success('Print dialog opened');
  };

  // Get student info for display
  const getStudentInfo = () => {
    if (user?.courseDetails?.length > 0) {
      return `${user.name} • ${user.courseDetails.length} Courses`;
    }
    if (user?.enrolledCourses?.length > 0) {
      return `${user.name} • ${user.enrolledCourses.length} Courses`;
    }
    return `${user?.name} • No Courses Enrolled`;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const hasCourses = (user?.enrolledCourses?.length > 0) || (user?.courseDetails?.length > 0) || (user?.selectedCourses?.length > 0);

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">My Timetable</h1>
            <p className="text-blue-100">{getStudentInfo()} • Week {week}</p>
          </div>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
          >
            🖨️ Print
          </button>
        </div>
      </div>

      {!hasCourses ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Courses Enrolled</h3>
          <p className="text-gray-600">You haven't selected any courses yet.</p>
          <p className="text-gray-500 text-sm mt-2">Please complete your registration to see your timetable.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-32">Time</th>
                  {days.map(day => (
                    <th key={day} className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot, idx) => (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">
                      {slot.display}
                    </td>
                    {days.map(day => {
                      const course = timetable[day]?.[slot.time];
                      return (
                        <td key={day} className="px-4 py-3">
                          {course ? (
                            <div className="bg-blue-50 p-2 rounded-lg border border-blue-200">
                              <p className="font-medium text-gray-900 text-sm">{course.name}</p>
                              <p className="text-xs text-gray-600 mt-1">👨‍🏫 {course.lecturer}</p>
                              <p className="text-xs text-gray-500">📍 {course.room}</p>
                              <p className="text-xs text-blue-600 mt-1">{course.code}</p>
                            </div>
                          ) : (
                            <p className="text-gray-400 text-sm">Free Period</p>
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
      )}

      <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>📌 Note:</strong> Timetable shows your enrolled courses for this semester.
          {!hasCourses && " Please complete your course registration."}
        </p>
      </div>
    </div>
  );
};

export default StudentTimetable;