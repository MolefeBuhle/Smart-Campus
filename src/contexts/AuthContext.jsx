import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Default users (hardcoded) - ALL have registrationCompleted: true
const DEFAULT_USERS = [
  // STUDENTS
  {
    id: 'student_1',
    name: 'Buhle Ndlovu',
    email: 'buhle@campus.edu',
    password: 'password123',
    role: 'student',
    avatar: 'https://ui-avatars.com/api/?name=Buhle+Ndlovu&background=3b82f6&color=fff',
    studentId: '20240001',
    course: 'Computer Science',
    year: 2,
    enrolledCourses: ['CS101', 'CS201', 'MATH201', 'ENG101'],
    registrationCompleted: true
  },
  {
    id: 'student_2',
    name: 'Mpho Dlamini',
    email: 'mpho@campus.edu',
    password: 'password123',
    role: 'student',
    avatar: 'https://ui-avatars.com/api/?name=Mpho+Dlamini&background=3b82f6&color=fff',
    studentId: '20240002',
    course: 'Information Technology',
    year: 3,
    enrolledCourses: ['IT101', 'IT201', 'NET101', 'DB101'],
    registrationCompleted: true
  },
  {
    id: 'student_3',
    name: 'Karabo Nchabeleng',
    email: 'karabo@campus.edu',
    password: 'password123',
    role: 'student',
    avatar: 'https://ui-avatars.com/api/?name=Karabo+Nchabeleng&background=3b82f6&color=fff',
    studentId: '20240003',
    course: 'Computer Science',
    year: 1,
    enrolledCourses: ['CS101', 'MATH101', 'PHY101', 'ENG101'],
    registrationCompleted: true
  },
  {
    id: 'student_4',
    name: 'Kamogelo Molefe',
    email: 'kamogelo@campus.edu',
    password: 'password123',
    role: 'student',
    avatar: 'https://ui-avatars.com/api/?name=Kamogelo+Molefe&background=3b82f6&color=fff',
    studentId: '20240004',
    course: 'Engineering',
    year: 2,
    enrolledCourses: ['ENG101', 'MATH201', 'PHY201', 'DESIGN101'],
    registrationCompleted: true
  },
  // LECTURERS
  {
    id: 'lecturer_1',
    name: 'Tebogo Molefe',
    email: 'tebogo@campus.edu',
    password: 'password123',
    role: 'lecturer',
    avatar: 'https://ui-avatars.com/api/?name=Tebogo+Molefe&background=2563eb&color=fff',
    employeeId: 'LEC001',
    department: 'Computer Science',
    title: 'Senior Lecturer',
    courses: ['CS101', 'CS201'],
    office: 'Room 301, CS Building',
    consultationHours: 'Monday & Wednesday 2:00 PM - 4:00 PM',
    registrationCompleted: true
  },
  {
    id: 'lecturer_2',
    name: 'Kgotso Khumalo',
    email: 'kgotso@campus.edu',
    password: 'password123',
    role: 'lecturer',
    avatar: 'https://ui-avatars.com/api/?name=Kgotso+Khumalo&background=2563eb&color=fff',
    employeeId: 'LEC002',
    department: 'Mathematics',
    title: 'Associate Professor',
    courses: ['MATH101', 'MATH201'],
    office: 'Room 105, Math Building',
    consultationHours: 'Tuesday & Thursday 10:00 AM - 12:00 PM',
    registrationCompleted: true
  },
  {
    id: 'lecturer_3',
    name: 'Itumeleng Molefe',
    email: 'itumeleng@campus.edu',
    password: 'password123',
    role: 'lecturer',
    avatar: 'https://ui-avatars.com/api/?name=Itumeleng+Molefe&background=2563eb&color=fff',
    employeeId: 'LEC003',
    department: 'Physics',
    title: 'Senior Lecturer',
    courses: ['PHY101', 'PHY201'],
    office: 'Room 201, Science Building',
    consultationHours: 'Monday & Thursday 1:00 PM - 3:00 PM',
    registrationCompleted: true
  },
  {
    id: 'lecturer_4',
    name: 'Ishmail Mdlhuli',
    email: 'ishmail@campus.edu',
    password: 'password123',
    role: 'lecturer',
    avatar: 'https://ui-avatars.com/api/?name=Ishmail+Mdlhuli&background=2563eb&color=fff',
    employeeId: 'LEC004',
    department: 'English',
    title: 'Associate Professor',
    courses: ['ENG101', 'ENG201'],
    office: 'Room 15, Humanities Building',
    consultationHours: 'Wednesday & Friday 9:00 AM - 11:00 AM',
    registrationCompleted: true
  },
  // ADMINS
  {
    id: 'admin_1',
    name: 'Sbuda Nkosi',
    email: 'sbuda@campus.edu',
    password: 'admin123',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Sbuda+Nkosi&background=1e40af&color=fff',
    employeeId: 'ADM001',
    position: 'System Administrator',
    registrationCompleted: true
  },
  {
    id: 'admin_2',
    name: 'Mpho Mathenjwa',
    email: 'mpho.mathenjwa@campus.edu',
    password: 'admin123',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Mpho+Mathenjwa&background=1e40af&color=fff',
    employeeId: 'ADM002',
    position: 'Campus Manager',
    registrationCompleted: true
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    initializeData();
    loadUsers();
    checkCurrentUser();
    setLoading(false);
  }, []);

  const initializeData = () => {
    // Initialize users if empty
    if (!localStorage.getItem('campus_users')) {
      localStorage.setItem('campus_users', JSON.stringify(DEFAULT_USERS));
    }
    
    // Initialize other collections if empty
    if (!localStorage.getItem('campus_appointments')) {
      localStorage.setItem('campus_appointments', JSON.stringify([]));
    }
    if (!localStorage.getItem('campus_maintenance')) {
      localStorage.setItem('campus_maintenance', JSON.stringify([]));
    }
    if (!localStorage.getItem('campus_notifications')) {
      localStorage.setItem('campus_notifications', JSON.stringify([
        {
          id: 'notif_1',
          title: 'Welcome to Campus Portal!',
          message: 'Welcome to the Smart Campus Portal. You can now book appointments and report issues.',
          type: 'success',
          targetRole: 'all',
          createdAt: new Date().toISOString(),
          readBy: []
        }
      ]));
    }
    if (!localStorage.getItem('campus_time_slots')) {
      localStorage.setItem('campus_time_slots', JSON.stringify([
        { id: 'slot_1', time: '09:00', display: '09:00 AM' },
        { id: 'slot_2', time: '09:30', display: '09:30 AM' },
        { id: 'slot_3', time: '10:00', display: '10:00 AM' },
        { id: 'slot_4', time: '10:30', display: '10:30 AM' },
        { id: 'slot_5', time: '11:00', display: '11:00 AM' },
        { id: 'slot_6', time: '11:30', display: '11:30 AM' },
        { id: 'slot_7', time: '13:00', display: '01:00 PM' },
        { id: 'slot_8', time: '13:30', display: '01:30 PM' },
        { id: 'slot_9', time: '14:00', display: '02:00 PM' },
        { id: 'slot_10', time: '14:30', display: '02:30 PM' }
      ]));
    }
    if (!localStorage.getItem('campus_rooms')) {
      localStorage.setItem('campus_rooms', JSON.stringify([
        { id: 'room_1', name: 'Lecture Hall A', building: 'Main Building', floor: 1 },
        { id: 'room_2', name: 'Lecture Hall B', building: 'Main Building', floor: 1 },
        { id: 'room_3', name: 'CS Lab 101', building: 'CS Building', floor: 1 },
        { id: 'room_4', name: 'CS Lab 102', building: 'CS Building', floor: 1 }
      ]));
    }
  };

  const loadUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem('campus_users') || '[]');
    setUsers(storedUsers);
  };

  const checkCurrentUser = () => {
    const currentUser = localStorage.getItem('campus_current_user');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  };

  const login = async (email, password) => {
    try {
      const usersList = JSON.parse(localStorage.getItem('campus_users') || '[]');
      const foundUser = usersList.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('campus_current_user', JSON.stringify(userWithoutPassword));
        toast.success(`Welcome back, ${userWithoutPassword.name}!`);
        return { success: true, user: userWithoutPassword };
      } else {
        toast.error('Invalid email or password');
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed');
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const usersList = JSON.parse(localStorage.getItem('campus_users') || '[]');
      const emailExists = usersList.some(u => u.email === userData.email);
      
      if (emailExists) {
        toast.error('Email already registered');
        return { success: false, error: 'Email already exists' };
      }

      const newUser = {
        id: `user_${Date.now()}`,
        ...userData,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=3b82f6&color=fff`,
        createdAt: new Date().toISOString(),
        registrationCompleted: false
      };

      const updatedUsers = [...usersList, newUser];
      localStorage.setItem('campus_users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('campus_current_user', JSON.stringify(userWithoutPassword));
      
      if (userData.role === 'lecturer') {
        toast.success('Registration successful! Please complete your lecturer profile.');
      } else {
        toast.success('Registration successful! Please complete your student profile.');
      }
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed');
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('campus_current_user');
    toast.success('Logged out successfully');
  };

  const updateUser = async (userId, updates) => {
    try {
      const usersList = JSON.parse(localStorage.getItem('campus_users') || '[]');
      const userIndex = usersList.findIndex(u => u.id === userId);
      
      if (userIndex !== -1) {
        usersList[userIndex] = { ...usersList[userIndex], ...updates };
        localStorage.setItem('campus_users', JSON.stringify(usersList));
        setUsers(usersList);
        
        const currentUser = JSON.parse(localStorage.getItem('campus_current_user') || '{}');
        if (currentUser.id === userId) {
          const updatedCurrentUser = { ...currentUser, ...updates };
          localStorage.setItem('campus_current_user', JSON.stringify(updatedCurrentUser));
          setUser(updatedCurrentUser);
        }
        
        toast.success('Profile updated successfully');
        return { success: true };
      } else {
        toast.error('User not found');
        return { success: false, error: 'User not found' };
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update profile');
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    users,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isStudent: user?.role === 'student',
    isLecturer: user?.role === 'lecturer',
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};