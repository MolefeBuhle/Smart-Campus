import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LecturerWizard = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    department: '',
    title: '',
    office: '',
    consultationHours: '',
    qualifications: [],
    expertise: [],
    bio: '',
    coursesTeaching: [],
    researchInterests: []
  });

  const availableDepartments = [
    'Computer Science', 'Information Technology', 'Mathematics', 
    'Physics', 'English', 'Engineering', 'Business', 'Law'
  ];

  const availableTitles = [
    'Professor', 'Associate Professor', 'Senior Lecturer', 
    'Lecturer', 'Junior Lecturer', 'Assistant Professor'
  ];

  const availableQualifications = [
    'PhD in Computer Science', 'MSc in IT', 'PhD in Mathematics',
    'PhD in Physics', 'MA in English', 'PhD in Engineering',
    'MBA', 'LLM', 'PhD in Education'
  ];

  const availableExpertise = [
    'Artificial Intelligence', 'Machine Learning', 'Data Science',
    'Cybersecurity', 'Cloud Computing', 'Software Engineering',
    'Web Development', 'Mobile Development', 'Database Systems',
    'Network Security', 'Algorithms', 'Computer Graphics',
    'Calculus', 'Linear Algebra', 'Statistics', 'Quantum Physics',
    'Thermodynamics', 'Literature', 'Creative Writing', 'Robotics'
  ];

  const allCourses = [
    { id: 'CS101', name: 'Computer Science 101', department: 'Computer Science' },
    { id: 'CS201', name: 'Data Structures', department: 'Computer Science' },
    { id: 'CS301', name: 'Algorithms', department: 'Computer Science' },
    { id: 'IT101', name: 'Introduction to IT', department: 'Information Technology' },
    { id: 'IT201', name: 'Network Security', department: 'Information Technology' },
    { id: 'IT301', name: 'Cloud Computing', department: 'Information Technology' },
    { id: 'MATH101', name: 'Calculus I', department: 'Mathematics' },
    { id: 'MATH201', name: 'Calculus II', department: 'Mathematics' },
    { id: 'MATH301', name: 'Linear Algebra', department: 'Mathematics' },
    { id: 'PHY101', name: 'Introduction to Physics', department: 'Physics' },
    { id: 'PHY201', name: 'Physics for Engineers', department: 'Physics' },
    { id: 'ENG101', name: 'Academic Writing', department: 'English' },
    { id: 'ENG201', name: 'Advanced Composition', department: 'English' },
    { id: 'DESIGN101', name: 'Engineering Design', department: 'Engineering' }
  ];

  const handleCourseToggle = (courseId) => {
    setFormData(prev => ({
      ...prev,
      coursesTeaching: prev.coursesTeaching.includes(courseId)
        ? prev.coursesTeaching.filter(c => c !== courseId)
        : [...prev.coursesTeaching, courseId]
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const selectedCourses = allCourses.filter(c => 
        formData.coursesTeaching.includes(c.id)
      );
      
      const updates = {
        employeeId: formData.employeeId,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth,
        department: formData.department,
        title: formData.title,
        office: formData.office,
        consultationHours: formData.consultationHours,
        qualifications: formData.qualifications,
        expertise: formData.expertise,
        bio: formData.bio,
        coursesTeaching: formData.coursesTeaching,
        courseDetails: selectedCourses,
        researchInterests: formData.researchInterests,
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
        
        toast.success('Registration completed! Welcome to your dashboard!');
        
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

  const canProceed = () => {
    if (step === 1) {
      return formData.employeeId && formData.phoneNumber && formData.dateOfBirth;
    }
    if (step === 2) {
      return formData.department && formData.title && formData.office;
    }
    if (step === 3) {
      return formData.qualifications.length >= 1 && formData.expertise.length >= 1;
    }
    if (step === 4) {
      return formData.coursesTeaching.length >= 1;
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
              <input
                type="text"
                value={formData.employeeId}
                onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., LEC001"
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
                placeholder="Your address"
              />
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select department</option>
                {availableDepartments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Academic Title *</label>
              <select
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select title</option>
                {availableTitles.map(title => (
                  <option key={title} value={title}>{title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Office Location *</label>
              <input
                type="text"
                value={formData.office}
                onChange={(e) => setFormData({...formData, office: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Room 301, CS Building"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Hours</label>
              <input
                type="text"
                value={formData.consultationHours}
                onChange={(e) => setFormData({...formData, consultationHours: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Monday & Wednesday 2:00 PM - 4:00 PM"
              />
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Qualifications & Expertise</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Qualifications *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                {availableQualifications.map(qual => (
                  <label key={qual} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.qualifications.includes(qual)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({...formData, qualifications: [...formData.qualifications, qual]});
                        } else {
                          setFormData({...formData, qualifications: formData.qualifications.filter(q => q !== qual)});
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">{qual}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Areas of Expertise *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                {availableExpertise.map(exp => (
                  <label key={exp} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.expertise.includes(exp)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({...formData, expertise: [...formData.expertise, exp]});
                        } else {
                          setFormData({...formData, expertise: formData.expertise.filter(e => e !== exp)});
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">{exp}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Courses You Teach *</h3>
            <p className="text-sm text-gray-600 mb-2">Select the courses you will be teaching (at least 1)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {allCourses.map(course => (
                <label key={course.id} className="flex items-start p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-blue-50 transition">
                  <input
                    type="checkbox"
                    checked={formData.coursesTeaching.includes(course.id)}
                    onChange={() => handleCourseToggle(course.id)}
                    className="mt-1 mr-3"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{course.name}</p>
                    <p className="text-sm text-gray-600">Code: {course.id}</p>
                    <p className="text-xs text-gray-500">Department: {course.department}</p>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio / Professional Summary</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Tell us about your teaching philosophy, research interests, and professional background..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Research Interests</label>
              <textarea
                value={formData.researchInterests}
                onChange={(e) => setFormData({...formData, researchInterests: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="List your research interests and ongoing projects..."
              />
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
            <span>Professional</span>
            <span>Qualifications</span>
            <span>Courses</span>
            <span>Additional</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Complete Your Registration</h2>
            <p className="text-gray-600 mt-1">Help us set up your lecturer profile</p>
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

export default LecturerWizard;