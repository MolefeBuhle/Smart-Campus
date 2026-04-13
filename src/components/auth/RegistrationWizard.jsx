import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const RegistrationWizard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    selectedDepartments: [],
    year: '1',
    selectedCourses: [],
    preferredLecturers: [],
    bio: '',
    interests: [],
    studyHours: 'morning'
  });

  const availableDepartments = [
    { id: 'CS', name: 'Computer Science', courses: ['CS101', 'CS201', 'CS301'] },
    { id: 'IT', name: 'Information Technology', courses: ['IT101', 'IT201', 'IT301'] },
    { id: 'MATH', name: 'Mathematics', courses: ['MATH101', 'MATH201', 'MATH301'] },
    { id: 'PHY', name: 'Physics', courses: ['PHY101', 'PHY201', 'PHY301'] },
    { id: 'ENG', name: 'English', courses: ['ENG101', 'ENG201', 'ENG301'] },
    { id: 'ENGINEERING', name: 'Engineering', courses: ['DESIGN101', 'MECH101', 'ELEC101'] }
  ];

  const availableCourses = [
    { id: 'CS101', name: 'Computer Science 101', code: 'CS101', lecturer: 'Tebogo Molefe', department: 'Computer Science', credits: 4, day: 'Monday', time: '09:00 - 10:30' },
    { id: 'CS201', name: 'Data Structures', code: 'CS201', lecturer: 'Tebogo Molefe', department: 'Computer Science', credits: 4, day: 'Tuesday', time: '11:00 - 12:30' },
    { id: 'CS301', name: 'Algorithms', code: 'CS301', lecturer: 'Tebogo Molefe', department: 'Computer Science', credits: 4, day: 'Wednesday', time: '14:00 - 15:30' },
    { id: 'IT101', name: 'Introduction to IT', code: 'IT101', lecturer: 'Tebogo Molefe', department: 'Information Technology', credits: 4, day: 'Monday', time: '09:00 - 10:30' },
    { id: 'IT201', name: 'Network Security', code: 'IT201', lecturer: 'Tebogo Molefe', department: 'Information Technology', credits: 4, day: 'Tuesday', time: '13:00 - 14:30' },
    { id: 'IT301', name: 'Cloud Computing', code: 'IT301', lecturer: 'Tebogo Molefe', department: 'Information Technology', credits: 4, day: 'Thursday', time: '10:00 - 11:30' },
    { id: 'MATH101', name: 'Calculus I', code: 'MATH101', lecturer: 'Kgotso Khumalo', department: 'Mathematics', credits: 4, day: 'Tuesday', time: '10:00 - 11:30' },
    { id: 'MATH201', name: 'Calculus II', code: 'MATH201', lecturer: 'Kgotso Khumalo', department: 'Mathematics', credits: 3, day: 'Monday', time: '14:00 - 15:30' },
    { id: 'MATH301', name: 'Linear Algebra', code: 'MATH301', lecturer: 'Kgotso Khumalo', department: 'Mathematics', credits: 3, day: 'Thursday', time: '13:00 - 14:30' },
    { id: 'PHY101', name: 'Introduction to Physics', code: 'PHY101', lecturer: 'Itumeleng Molefe', department: 'Physics', credits: 4, day: 'Monday', time: '13:00 - 14:30' },
    { id: 'PHY201', name: 'Physics for Engineers', code: 'PHY201', lecturer: 'Itumeleng Molefe', department: 'Physics', credits: 4, day: 'Wednesday', time: '14:00 - 15:30' },
    { id: 'PHY301', name: 'Quantum Physics', code: 'PHY301', lecturer: 'Itumeleng Molefe', department: 'Physics', credits: 3, day: 'Friday', time: '09:00 - 10:30' },
    { id: 'ENG101', name: 'Academic Writing', code: 'ENG101', lecturer: 'Ishmail Mdlhuli', department: 'English', credits: 3, day: 'Friday', time: '10:00 - 12:00' },
    { id: 'ENG201', name: 'Advanced Composition', code: 'ENG201', lecturer: 'Ishmail Mdlhuli', department: 'English', credits: 3, day: 'Wednesday', time: '15:00 - 17:00' },
    { id: 'ENG301', name: 'Creative Writing', code: 'ENG301', lecturer: 'Ishmail Mdlhuli', department: 'English', credits: 3, day: 'Tuesday', time: '14:00 - 15:30' },
    { id: 'DESIGN101', name: 'Engineering Design', code: 'DESIGN101', lecturer: 'Ishmail Mdlhuli', department: 'Engineering', credits: 3, day: 'Friday', time: '13:00 - 15:00' },
    { id: 'MECH101', name: 'Mechanics', code: 'MECH101', lecturer: 'Itumeleng Molefe', department: 'Engineering', credits: 4, day: 'Monday', time: '11:00 - 12:30' },
    { id: 'ELEC101', name: 'Electronics', code: 'ELEC101', lecturer: 'Itumeleng Molefe', department: 'Engineering', credits: 4, day: 'Wednesday', time: '09:00 - 10:30' }
  ];

  const availableLecturers = [
    { id: 'lecturer_1', name: 'Tebogo Molefe', department: 'Computer Science, IT', courses: ['CS101', 'CS201', 'CS301', 'IT101', 'IT201', 'IT301'] },
    { id: 'lecturer_2', name: 'Kgotso Khumalo', department: 'Mathematics', courses: ['MATH101', 'MATH201', 'MATH301'] },
    { id: 'lecturer_3', name: 'Itumeleng Molefe', department: 'Physics, Engineering', courses: ['PHY101', 'PHY201', 'PHY301', 'MECH101', 'ELEC101'] },
    { id: 'lecturer_4', name: 'Ishmail Mdlhuli', department: 'English, Engineering', courses: ['ENG101', 'ENG201', 'ENG301', 'DESIGN101'] }
  ];

  const interestsList = [
    'Programming', 'Web Development', 'Data Science', 'AI/ML', 
    'Cybersecurity', 'Cloud Computing', 'Mobile Development', 
    'Game Development', 'Robotics', 'IoT', 'Research', 
    'Teaching', 'Sports', 'Music', 'Art', 'Writing'
  ];

  const handleDepartmentToggle = (deptId) => {
    setFormData(prev => {
      const newDepartments = prev.selectedDepartments.includes(deptId)
        ? prev.selectedDepartments.filter(d => d !== deptId)
        : [...prev.selectedDepartments, deptId];
      
      const deptNames = newDepartments.map(d => {
        const dept = availableDepartments.find(dep => dep.id === d);
        return dept ? dept.name : '';
      });
      
      const availableCourseIds = availableCourses
        .filter(c => deptNames.includes(c.department))
        .map(c => c.id);
      
      const updatedCourses = prev.selectedCourses.filter(c => availableCourseIds.includes(c));
      
      return {
        ...prev,
        selectedDepartments: newDepartments,
        selectedCourses: updatedCourses
      };
    });
  };

  const handleCourseToggle = (courseId) => {
    setFormData(prev => ({
      ...prev,
      selectedCourses: prev.selectedCourses.includes(courseId)
        ? prev.selectedCourses.filter(c => c !== courseId)
        : [...prev.selectedCourses, courseId]
    }));
  };

  const handleLecturerToggle = (lecturerId) => {
    setFormData(prev => ({
      ...prev,
      preferredLecturers: prev.preferredLecturers.includes(lecturerId)
        ? prev.preferredLecturers.filter(l => l !== lecturerId)
        : [...prev.preferredLecturers, lecturerId]
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const selectedCourseDetails = availableCourses.filter(c => 
        formData.selectedCourses.includes(c.id)
      );
      
      const selectedLecturerDetails = availableLecturers.filter(l => 
        formData.preferredLecturers.includes(l.id)
      );
      
      const selectedDepartmentDetails = availableDepartments.filter(d => 
        formData.selectedDepartments.includes(d.id)
      );
      
      const updates = {
        studentId: formData.studentId,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth,
        departments: formData.selectedDepartments,
        departmentDetails: selectedDepartmentDetails,
        year: formData.year,
        enrolledCourses: formData.selectedCourses,
        courseDetails: selectedCourseDetails,
        preferredLecturers: formData.preferredLecturers,
        lecturerDetails: selectedLecturerDetails,
        bio: formData.bio,
        interests: formData.interests,
        studyHours: formData.studyHours,
        registrationCompleted: true,
        registeredAt: new Date().toISOString()
      };
      
      // Directly update localStorage
      const allUsers = JSON.parse(localStorage.getItem('campus_users') || '[]');
      const userIndex = allUsers.findIndex(u => u.id === user.id);
      
      if (userIndex !== -1) {
        allUsers[userIndex] = { ...allUsers[userIndex], ...updates };
        localStorage.setItem('campus_users', JSON.stringify(allUsers));
        
        // Update current session
        const updatedCurrentUser = { ...user, ...updates };
        localStorage.setItem('campus_current_user', JSON.stringify(updatedCurrentUser));
        
        toast.success('Registration completed! Redirecting to dashboard...');
        
        // Force redirect
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
        
      } else {
        toast.error('User not found');
        setLoading(false);
      }
    } catch (error) {
      console.error("Error saving registration:", error);
      toast.error('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const getFilteredCourses = () => {
    const selectedDeptNames = formData.selectedDepartments.map(deptId => {
      const dept = availableDepartments.find(d => d.id === deptId);
      return dept ? dept.name : '';
    });
    
    return availableCourses.filter(course => 
      selectedDeptNames.includes(course.department)
    );
  };

  const canProceed = () => {
    if (step === 1) {
      return formData.studentId && formData.phoneNumber && formData.dateOfBirth;
    }
    if (step === 2) {
      return formData.selectedDepartments.length >= 1 && formData.year;
    }
    if (step === 3) {
      return formData.selectedCourses.length >= 3;
    }
    if (step === 4) {
      return formData.preferredLecturers.length >= 1;
    }
    return true;
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student ID *</label>
              <input
                type="text"
                value={formData.studentId}
                onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 20240001"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 071 234 5678"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Residential Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="2"
                placeholder="Your address during the semester"
              />
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Select Your Departments *</h3>
            <p className="text-sm text-gray-600 mb-2">You can select multiple departments (currently selected: {formData.selectedDepartments.length})</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableDepartments.map(dept => (
                <label key={dept.id} className="flex items-start p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-blue-50 transition">
                  <input
                    type="checkbox"
                    checked={formData.selectedDepartments.includes(dept.id)}
                    onChange={() => handleDepartmentToggle(dept.id)}
                    className="mt-1 mr-3"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{dept.name}</p>
                    <p className="text-xs text-gray-500">Courses: {dept.courses.join(', ')}</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Year of Study *</label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="1">Year 1 (Freshman)</option>
                <option value="2">Year 2 (Sophomore)</option>
                <option value="3">Year 3 (Junior)</option>
                <option value="4">Year 4 (Senior)</option>
              </select>
            </div>
          </div>
        );
        
      case 3:
        const filteredCourses = getFilteredCourses();
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Select Your Courses *</h3>
            <p className="text-sm text-gray-600 mb-2">Select at least 3 courses from your chosen departments (currently selected: {formData.selectedCourses.length})</p>
            {formData.selectedDepartments.length === 0 ? (
              <div className="text-center py-8 bg-yellow-50 rounded-lg">
                <p className="text-yellow-800">Please select departments first in the previous step</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {filteredCourses.map(course => (
                  <label key={course.id} className="flex items-start p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-blue-50 transition">
                    <input
                      type="checkbox"
                      checked={formData.selectedCourses.includes(course.id)}
                      onChange={() => handleCourseToggle(course.id)}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{course.name}</p>
                      <p className="text-sm text-gray-600">Code: {course.code} | {course.credits} credits</p>
                      <p className="text-xs text-gray-500">Lecturer: {course.lecturer} | {course.department}</p>
                      <p className="text-xs text-gray-400">📅 {course.day} | 🕐 {course.time}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Select Preferred Lecturers *</h3>
            <p className="text-sm text-gray-600 mb-2">Select your preferred lecturers (at least 1)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableLecturers.map(lecturer => (
                <label key={lecturer.id} className="flex items-start p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-blue-50 transition">
                  <input
                    type="checkbox"
                    checked={formData.preferredLecturers.includes(lecturer.id)}
                    onChange={() => handleLecturerToggle(lecturer.id)}
                    className="mt-1 mr-3"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{lecturer.name}</p>
                    <p className="text-sm text-gray-600">{lecturer.department} Department</p>
                    <p className="text-xs text-gray-500">Teaches: {lecturer.courses.slice(0, 3).join(', ')}...</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">About You / Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Tell us a bit about yourself, your interests, and goals..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Areas of Interest</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                {interestsList.map(interest => (
                  <label key={interest} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.interests.includes(interest)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({...formData, interests: [...formData.interests, interest]});
                        } else {
                          setFormData({...formData, interests: formData.interests.filter(i => i !== interest)});
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">{interest}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Study Hours</label>
              <select
                value={formData.studyHours}
                onChange={(e) => setFormData({...formData, studyHours: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="morning">Morning (6 AM - 12 PM)</option>
                <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                <option value="evening">Evening (5 PM - 10 PM)</option>
                <option value="night">Night Owl (10 PM - 2 AM)</option>
              </select>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  s === step ? 'bg-blue-600 text-white' : 
                  s < step ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}
              >
                {s < step ? '✓' : s}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>Personal</span>
            <span>Departments</span>
            <span>Courses</span>
            <span>Lecturers</span>
            <span>Additional</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Complete Your Registration</h2>
            <p className="text-gray-600 mt-1">Help us personalize your campus experience</p>
          </div>

          {renderStep()}

          <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
            <button
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className={`px-6 py-2 rounded-lg font-medium ${
                step === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>
            
            {step < 5 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className={`px-6 py-2 rounded-lg font-medium ${
                  canProceed()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300"
              >
                {loading ? 'Completing...' : 'Complete Registration'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationWizard;