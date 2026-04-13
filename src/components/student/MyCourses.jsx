import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const MyCourses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (user) {
      loadCourses();
    }
  }, [user]);

  const loadCourses = () => {
    // Get current date for assignment due dates
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const twoWeeks = new Date(today);
    twoWeeks.setDate(today.getDate() + 14);
    const nextMonth = new Date(today);
    nextMonth.setDate(today.getDate() + 30);

    console.log("Current user:", user?.email); // Debug

    // Define all modules/courses with their lecturers
    const allModules = {
      // CS Modules (Taught by Tebogo Molefe - Lecturer 1)
      CS101: {
        code: 'CS101',
        name: 'Introduction to Computer Science',
        lecturerName: 'Tebogo Molefe',
        lecturerId: 'lecturer_1',
        lecturerDepartment: 'Computer Science',
        schedule: 'Monday & Wednesday, 09:00 - 10:30',
        room: 'Lecture Hall A',
        credits: 4,
        assignments: [
          { title: 'Programming Assignment 1', due: nextWeek.toISOString().split('T')[0], status: 'pending' },
          { title: 'Midterm Exam', due: twoWeeks.toISOString().split('T')[0], status: 'upcoming' }
        ]
      },
      CS201: {
        code: 'CS201',
        name: 'Data Structures and Algorithms',
        lecturerName: 'Tebogo Molefe',
        lecturerId: 'lecturer_1',
        lecturerDepartment: 'Computer Science',
        schedule: 'Tuesday & Thursday, 11:00 - 12:30',
        room: 'CS Lab 101',
        credits: 4,
        assignments: [
          { title: 'Binary Trees Assignment', due: nextWeek.toISOString().split('T')[0], status: 'pending' },
          { title: 'Algorithm Analysis Quiz', due: twoWeeks.toISOString().split('T')[0], status: 'upcoming' }
        ]
      },
      // Math Modules (Taught by Kgotso Khumalo - Lecturer 2)
      MATH101: {
        code: 'MATH101',
        name: 'Calculus I',
        lecturerName: 'Kgotso Khumalo',
        lecturerId: 'lecturer_2',
        lecturerDepartment: 'Mathematics',
        schedule: 'Tuesday & Thursday, 10:00 - 11:30',
        room: 'Math Building 101',
        credits: 4,
        assignments: [
          { title: 'Limits Assignment', due: nextWeek.toISOString().split('T')[0], status: 'pending' }
        ]
      },
      MATH201: {
        code: 'MATH201',
        name: 'Calculus II',
        lecturerName: 'Kgotso Khumalo',
        lecturerId: 'lecturer_2',
        lecturerDepartment: 'Mathematics',
        schedule: 'Monday & Wednesday, 14:00 - 15:30',
        room: 'Math Building 105',
        credits: 3,
        assignments: [
          { title: 'Integration Worksheet', due: today.toISOString().split('T')[0], status: 'completed' },
          { title: 'Midterm Review', due: nextMonth.toISOString().split('T')[0], status: 'upcoming' }
        ]
      },
      // Physics Modules (Taught by Itumeleng Molefe - Lecturer 3)
      PHY101: {
        code: 'PHY101',
        name: 'Introduction to Physics',
        lecturerName: 'Itumeleng Molefe',
        lecturerId: 'lecturer_3',
        lecturerDepartment: 'Physics',
        schedule: 'Monday & Wednesday, 13:00 - 14:30',
        room: 'Science Lab 101',
        credits: 4,
        assignments: [
          { title: 'Lab Report', due: twoWeeks.toISOString().split('T')[0], status: 'pending' }
        ]
      },
      PHY201: {
        code: 'PHY201',
        name: 'Physics for Engineers',
        lecturerName: 'Itumeleng Molefe',
        lecturerId: 'lecturer_3',
        lecturerDepartment: 'Physics',
        schedule: 'Monday & Wednesday, 14:00 - 15:30',
        room: 'Science Lab 102',
        credits: 4,
        assignments: [
          { title: 'Lab Experiment Report', due: nextWeek.toISOString().split('T')[0], status: 'pending' }
        ]
      },
      // English Modules (Taught by Ishmail Mdlhuli - Lecturer 4)
      ENG101: {
        code: 'ENG101',
        name: 'Academic Writing',
        lecturerName: 'Ishmail Mdlhuli',
        lecturerId: 'lecturer_4',
        lecturerDepartment: 'English',
        schedule: 'Friday, 10:00 - 12:00',
        room: 'Humanities Hall 202',
        credits: 3,
        assignments: [
          { title: 'Research Paper Draft', due: twoWeeks.toISOString().split('T')[0], status: 'pending' }
        ]
      },
      ENG201: {
        code: 'ENG201',
        name: 'Advanced Composition',
        lecturerName: 'Ishmail Mdlhuli',
        lecturerId: 'lecturer_4',
        lecturerDepartment: 'English',
        schedule: 'Wednesday, 15:00 - 17:00',
        room: 'Humanities Hall 205',
        credits: 3,
        assignments: [
          { title: 'Argumentative Essay', due: nextMonth.toISOString().split('T')[0], status: 'upcoming' }
        ]
      },
      // IT Modules
      IT101: {
        code: 'IT101',
        name: 'Introduction to IT',
        lecturerName: 'Tebogo Molefe',
        lecturerId: 'lecturer_1',
        lecturerDepartment: 'Computer Science',
        schedule: 'Monday & Wednesday, 09:00 - 10:30',
        room: 'IT Lab 101',
        credits: 4,
        assignments: [
          { title: 'IT Project Proposal', due: nextWeek.toISOString().split('T')[0], status: 'pending' }
        ]
      },
      IT201: {
        code: 'IT201',
        name: 'Network Security',
        lecturerName: 'Tebogo Molefe',
        lecturerId: 'lecturer_1',
        lecturerDepartment: 'Computer Science',
        schedule: 'Tuesday & Thursday, 13:00 - 14:30',
        room: 'Network Lab',
        credits: 4,
        assignments: [
          { title: 'Security Audit Report', due: twoWeeks.toISOString().split('T')[0], status: 'pending' }
        ]
      },
      NET101: {
        code: 'NET101',
        name: 'Computer Networks',
        lecturerName: 'Itumeleng Molefe',
        lecturerId: 'lecturer_3',
        lecturerDepartment: 'Physics',
        schedule: 'Monday, 14:00 - 16:00',
        room: 'Network Lab',
        credits: 3,
        assignments: [
          { title: 'Network Design Project', due: nextWeek.toISOString().split('T')[0], status: 'pending' }
        ]
      },
      DB101: {
        code: 'DB101',
        name: 'Database Systems',
        lecturerName: 'Kgotso Khumalo',
        lecturerId: 'lecturer_2',
        lecturerDepartment: 'Mathematics',
        schedule: 'Friday, 09:00 - 11:00',
        room: 'CS Lab 102',
        credits: 3,
        assignments: [
          { title: 'SQL Assignment', due: twoWeeks.toISOString().split('T')[0], status: 'pending' }
        ]
      },
      DESIGN101: {
        code: 'DESIGN101',
        name: 'Engineering Design',
        lecturerName: 'Ishmail Mdlhuli',
        lecturerId: 'lecturer_4',
        lecturerDepartment: 'English',
        schedule: 'Friday, 13:00 - 15:00',
        room: 'Design Studio',
        credits: 3,
        assignments: [
          { title: 'Design Project', due: nextMonth.toISOString().split('T')[0], status: 'upcoming' }
        ]
      }
    };

    // Define which modules each student takes (based on email)
    const studentModules = {
      'buhle@campus.edu': {
        studentName: 'Buhle Ndlovu',
        program: 'Computer Science Year 2',
        modules: ['CS101', 'CS201', 'MATH201', 'ENG101'],
        progress: { CS101: 75, CS201: 60, MATH201: 80, ENG101: 50 }
      },
      'mpho@campus.edu': {
        studentName: 'Mpho Dlamini',
        program: 'Information Technology Year 3',
        modules: ['IT101', 'IT201', 'NET101', 'DB101'],
        progress: { IT101: 85, IT201: 70, NET101: 90, DB101: 65 }
      },
      'karabo@campus.edu': {
        studentName: 'Karabo Nchabeleng',
        program: 'Computer Science Year 1',
        modules: ['CS101', 'MATH101', 'PHY101', 'ENG101'],
        progress: { CS101: 45, MATH101: 55, PHY101: 40, ENG101: 35 }
      },
      'kamogelo@campus.edu': {
        studentName: 'Kamogelo Molefe',
        program: 'Engineering Year 2',
        modules: ['ENG101', 'MATH201', 'PHY201', 'DESIGN101'],
        progress: { ENG101: 70, MATH201: 65, PHY201: 60, DESIGN101: 55 }
      }
    };

    // Get the student's modules based on their email
    const studentData = studentModules[user?.email];
    
    if (studentData) {
      const studentCourses = studentData.modules.map(moduleCode => {
        const moduleData = allModules[moduleCode];
        return {
          ...moduleData,
          progress: studentData.progress[moduleCode] || 50,
          id: moduleCode
        };
      });
      setCourses(studentCourses);
      console.log(`Loaded ${studentCourses.length} courses for ${studentData.studentName}`);
    } else {
      console.log("No modules found for student:", user?.email);
      setCourses([]);
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 70) return 'bg-green-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-600';
    }
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

  // Get student data for display
  const studentData = {
    'buhle@campus.edu': { name: 'Buhle Ndlovu', program: 'Computer Science', year: 'Year 2' },
    'mpho@campus.edu': { name: 'Mpho Dlamini', program: 'Information Technology', year: 'Year 3' },
    'karabo@campus.edu': { name: 'Karabo Nchabeleng', program: 'Computer Science', year: 'Year 1' },
    'kamogelo@campus.edu': { name: 'Kamogelo Molefe', program: 'Engineering', year: 'Year 2' }
  };

  const currentStudent = studentData[user?.email] || { name: user?.name, program: 'Student', year: '' };

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">My Courses</h1>
          <p className="text-blue-100">{currentStudent.name} • {currentStudent.program} • {currentStudent.year}</p>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Courses Enrolled Yet</h3>
          <p className="text-gray-600">You haven't been enrolled in any courses for this semester.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        {course.code}
                      </span>
                      <span className="text-xs text-gray-500">{course.credits} credits</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{course.name}</h2>
                    <p className="text-sm text-gray-600 mt-1">👨‍🏫 {course.lecturerName}</p>
                    <p className="text-xs text-gray-500">{course.lecturerDepartment} Department</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>🕐</span>
                    <span>{course.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>📍</span>
                    <span>{course.room}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Course Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${getProgressColor(course.progress)} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Upcoming Assignments</h3>
                  <div className="space-y-2">
                    {course.assignments.map((assignment, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{assignment.title}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">Due: {assignment.due}</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(assignment.status)}`}>
                            {assignment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;