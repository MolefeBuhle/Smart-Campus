import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  doc, 
  query, 
  where, 
  onSnapshot,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCn426y24elabtDOZ-ke-9aH4iUyXKMXps",
  authDomain: "smart-campus-3d86d.firebaseapp.com",
  projectId: "smart-campus-3d86d",
  storageBucket: "smart-campus-3d86d.firebasestorage.app",
  messagingSenderId: "439128558875",
  appId: "1:439128558875:web:0760080fdc92e1ffa357be",
  measurementId: "G-8Y745NB3EY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Collection references
export const usersCollection = collection(db, 'users');
export const appointmentsCollection = collection(db, 'appointments');
export const maintenanceCollection = collection(db, 'maintenance');
export const notificationsCollection = collection(db, 'notifications');
export const timeSlotsCollection = collection(db, 'timeSlots');
export const roomsCollection = collection(db, 'rooms');

// Helper Functions
export const addDocument = async (collectionRef, data) => {
  return await addDoc(collectionRef, { 
    ...data, 
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
};

export const getDocuments = async (collectionRef) => {
  const snapshot = await getDocs(collectionRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getDocumentById = async (collectionName, id) => {
  const docRef = doc(db, collectionName, id);
  const snapshot = await getDoc(docRef);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

export const updateDocument = async (collectionName, docId, data) => {
  const docRef = doc(db, collectionName, docId);
  return await updateDoc(docRef, { 
    ...data, 
    updatedAt: new Date().toISOString() 
  });
};

export const deleteDocument = async (collectionName, docId) => {
  const docRef = doc(db, collectionName, docId);
  return await deleteDoc(docRef);
};

export const queryDocuments = async (collectionRef, conditions) => {
  let q = collectionRef;
  conditions.forEach(condition => {
    q = query(q, where(condition.field, condition.operator, condition.value));
  });
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Real-time listener
export const listenToCollection = (collectionRef, callback) => {
  return onSnapshot(collectionRef, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });
};

export const listenToQuery = (q, callback) => {
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });
};