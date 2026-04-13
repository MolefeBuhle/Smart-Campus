import { 
  db, 
  usersCollection, 
  appointmentsCollection, 
  maintenanceCollection, 
  notificationsCollection, 
  timeSlotsCollection, 
  roomsCollection,
  addDocument,
  getDocuments
} from './firebase';

const initialUsers = [
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
    createdAt: new Date().toISOString()
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
    createdAt: new Date().toISOString()
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
    office: 'Room 301, CS Building',
    createdAt: new Date().toISOString()
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
    office: 'Room 105, Math Building',
    createdAt: new Date().toISOString()
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
    createdAt: new Date().toISOString()
  }
];

const initialTimeSlots = [
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

const initialRooms = [
  { id: 'room_1', name: 'Lecture Hall A', building: 'Main Building', floor: 1, type: 'lecture' },
  { id: 'room_2', name: 'Lecture Hall B', building: 'Main Building', floor: 1, type: 'lecture' },
  { id: 'room_3', name: 'CS Lab 101', building: 'CS Building', floor: 1, type: 'lab' },
  { id: 'room_4', name: 'CS Lab 102', building: 'CS Building', floor: 1, type: 'lab' },
  { id: 'room_5', name: 'Math Tutorial Room', building: 'Math Building', floor: 2, type: 'tutorial' }
];

export const initializeFirebaseData = async () => {
  try {
    // Check if users already exist
    const existingUsers = await getDocuments(usersCollection);
    
    if (existingUsers.length === 0) {
      // Add initial users
      for (const user of initialUsers) {
        await addDocument(usersCollection, user);
      }
      console.log('✅ Initial users added to Firebase');
    }
    
    // Check if time slots already exist
    const existingSlots = await getDocuments(timeSlotsCollection);
    if (existingSlots.length === 0) {
      for (const slot of initialTimeSlots) {
        await addDocument(timeSlotsCollection, slot);
      }
      console.log('✅ Initial time slots added to Firebase');
    }
    
    // Check if rooms already exist
    const existingRooms = await getDocuments(roomsCollection);
    if (existingRooms.length === 0) {
      for (const room of initialRooms) {
        await addDocument(roomsCollection, room);
      }
      console.log('✅ Initial rooms added to Firebase');
    }
    
    // Add sample notification if none exist
    const existingNotifications = await getDocuments(notificationsCollection);
    if (existingNotifications.length === 0) {
      await addDocument(notificationsCollection, {
        title: 'Welcome to Smart Campus Portal!',
        message: 'Welcome to the Smart Campus Portal. You can now book appointments and report issues.',
        type: 'success',
        targetRole: 'all',
        readBy: []
      });
      console.log('✅ Sample notification added');
    }
    
    console.log('🎉 Firebase initialization complete!');
  } catch (error) {
    console.error('❌ Error initializing Firebase data:', error);
  }
};