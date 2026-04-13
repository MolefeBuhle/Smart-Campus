import { STORAGE_KEYS, getData, setData } from './storage';

// 5 South African user accounts - Buhle, Mpho, Tebogo, Kgotso, Sbuda
const DEFAULT_USERS = [
  {
    id: 'user_1',
    name: 'Buhle Ndlovu',
    email: 'buhle@campus.edu',
    password: 'password123',
    role: 'student',
    avatar: 'https://ui-avatars.com/api/?name=Buhle+Ndlovu&background=3b82f6&color=fff&bold=true',
    studentId: '20240001',
    course: 'Computer Science',
    year: 2,
    enrolledCourses: ['CS101', 'CS201', 'MATH101', 'ENG101'],
    registrationDate: '2024-01-15'
  },
  {
    id: 'user_2',
    name: 'Mpho Dlamini',
    email: 'mpho@campus.edu',
    password: 'password123',
    role: 'student',
    avatar: 'https://ui-avatars.com/api/?name=Mpho+Dlamini&background=3b82f6&color=fff&bold=true',
    studentId: '20240002',
    course: 'Information Technology',
    year: 3,
    enrolledCourses: ['IT101', 'IT201', 'NET101', 'DB101'],
    registrationDate: '2024-01-20'
  },
  {
    id: 'user_3',
    name: 'Tebogo Molefe',
    email: 'tebogo@campus.edu',
    password: 'password123',
    role: 'lecturer',
    avatar: 'https://ui-avatars.com/api/?name=Tebogo+Molefe&background=2563eb&color=fff&bold=true',
    employeeId: 'LEC001',
    department: 'Computer Science',
    title: 'Senior Lecturer',
    courses: ['CS101', 'CS201', 'AI301'],
    office: 'Room 301, CS Building',
    consultationHours: 'Monday & Wednesday 2:00 PM - 4:00 PM',
    phone: '011-555-0101'
  },
  {
    id: 'user_4',
    name: 'Kgotso Khumalo',
    email: 'kgotso@campus.edu',
    password: 'password123',
    role: 'lecturer',
    avatar: 'https://ui-avatars.com/api/?name=Kgotso+Khumalo&background=2563eb&color=fff&bold=true',
    employeeId: 'LEC002',
    department: 'Mathematics',
    title: 'Associate Professor',
    courses: ['MATH101', 'MATH201', 'STAT101'],
    office: 'Room 105, Math Building',
    consultationHours: 'Tuesday & Thursday 10:00 AM - 12:00 PM',
    phone: '011-555-0102'
  },
  {
    id: 'user_5',
    name: 'Sbuda Nkosi',
    email: 'sbuda@campus.edu',
    password: 'admin123',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Sbuda+Nkosi&background=1e40af&color=fff&bold=true',
    employeeId: 'ADM001',
    position: 'System Administrator',
    department: 'IT Services',
    permissions: ['all'],
    phone: '011-555-0001'
  },
  {
    id: 'user_6',
    name: 'Itumeleng Molefe',
    email: 'itumeleng@campus.edu',
    password: 'password123',
    role: 'lecturer',
    avatar: 'https://ui-avatars.com/api/?name=Itumeleng+Molefe&background=2563eb&color=fff',
    employeeId: 'LEC003',
    department: 'Physics',
    title: 'Senior Lecturer',
    courses: ['PHY101', 'PHY201', 'PHY301'],
    office: 'Room 201, Science Building',
    consultationHours: 'Monday & Thursday 1:00 PM - 3:00 PM'
  },
  {
    id: 'user_7',
    name: 'Ishmail Mdlhuli',
    email: 'ishmail@campus.edu',
    password: 'password123',
    role: 'lecturer',
    avatar: 'https://ui-avatars.com/api/?name=Ishmail+Mdlhuli&background=2563eb&color=fff',
    employeeId: 'LEC004',
    department: 'English',
    title: 'Associate Professor',
    courses: ['ENG101', 'ENG201', 'ENG301'],
    office: 'Room 15, Humanities Building',
    consultationHours: 'Wednesday & Friday 9:00 AM - 11:00 AM'
  }
];

// Campus rooms for maintenance reporting
const DEFAULT_ROOMS = [
  { id: 'room_1', name: 'Lecture Hall A', building: 'Main Building', floor: 1, capacity: 120, type: 'lecture' },
  { id: 'room_2', name: 'Lecture Hall B', building: 'Main Building', floor: 1, capacity: 100, type: 'lecture' },
  { id: 'room_3', name: 'CS Lab 101', building: 'CS Building', floor: 1, capacity: 40, type: 'lab' },
  { id: 'room_4', name: 'CS Lab 102', building: 'CS Building', floor: 1, capacity: 35, type: 'lab' },
  { id: 'room_5', name: 'Math Tutorial Room', building: 'Math Building', floor: 2, capacity: 30, type: 'tutorial' },
  { id: 'room_6', name: 'Physics Lab', building: 'Science Building', floor: 1, capacity: 25, type: 'lab' },
  { id: 'room_7', name: 'Library Study Room 1', building: 'Library', floor: 2, capacity: 8, type: 'study' },
  { id: 'room_8', name: 'Library Study Room 2', building: 'Library', floor: 2, capacity: 6, type: 'study' }
];

// Time slots for appointments
const DEFAULT_TIME_SLOTS = [
  { id: 'slot_1', time: '09:00', display: '09:00 AM', duration: 30 },
  { id: 'slot_2', time: '09:30', display: '09:30 AM', duration: 30 },
  { id: 'slot_3', time: '10:00', display: '10:00 AM', duration: 30 },
  { id: 'slot_4', time: '10:30', display: '10:30 AM', duration: 30 },
  { id: 'slot_5', time: '11:00', display: '11:00 AM', duration: 30 },
  { id: 'slot_6', time: '11:30', display: '11:30 AM', duration: 30 },
  { id: 'slot_7', time: '13:00', display: '01:00 PM', duration: 30 },
  { id: 'slot_8', time: '13:30', display: '01:30 PM', duration: 30 },
  { id: 'slot_9', time: '14:00', display: '02:00 PM', duration: 30 },
  { id: 'slot_10', time: '14:30', display: '02:30 PM', duration: 30 }
];

// Function to initialize all data in localStorage
export const initializeData = () => {
  // Initialize users if not present
  if (!getData(STORAGE_KEYS.USERS)) {
    setData(STORAGE_KEYS.USERS, DEFAULT_USERS);
  }
  
  // Initialize rooms if not present
  if (!getData(STORAGE_KEYS.ROOMS)) {
    setData(STORAGE_KEYS.ROOMS, DEFAULT_ROOMS);
  }
  
  // Initialize time slots if not present
  if (!getData(STORAGE_KEYS.TIME_SLOTS)) {
    setData(STORAGE_KEYS.TIME_SLOTS, DEFAULT_TIME_SLOTS);
  }
  
  // Initialize appointments if not present
  if (!getData(STORAGE_KEYS.APPOINTMENTS)) {
    setData(STORAGE_KEYS.APPOINTMENTS, []);
  }
  
  // Initialize maintenance issues if not present
  if (!getData(STORAGE_KEYS.MAINTENANCE)) {
    setData(STORAGE_KEYS.MAINTENANCE, []);
  }
  
  // Initialize notifications if not present
  if (!getData(STORAGE_KEYS.NOTIFICATIONS)) {
    setData(STORAGE_KEYS.NOTIFICATIONS, [
      {
        id: 'notif_1',
        title: 'Welcome to Smart Campus Portal!',
        message: 'Welcome to the Smart Campus Portal. You can now book appointments, view timetables, and report maintenance issues.',
        type: 'success',
        targetRole: 'all',
        createdAt: new Date().toISOString(),
        readBy: []
      },
      {
        id: 'notif_2',
        title: 'Library Hours Update',
        message: 'The library will be open extended hours during exam week: 8 AM - 10 PM.',
        type: 'info',
        targetRole: 'all',
        createdAt: new Date().toISOString(),
        readBy: []
      }
    ]);
  }
};

// Export for use in other files
export const mockUsers = DEFAULT_USERS;