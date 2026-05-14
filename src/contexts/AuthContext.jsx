// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../services/firebase';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// ---------- DEFAULT DEMO USERS (unchanged – keep your 10 users) ----------
const DEFAULT_USERS = [ /* ... your existing 10 demo accounts ... */ ];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  // Sync demo users to Firebase Auth only once
  const syncDemoUsersToFirebase = async () => {
    // Avoid repeated sync attempts if already done
    const syncFlag = localStorage.getItem('firebase_demo_synced');
    if (syncFlag === 'true') {
      console.log('Demo users already synced to Firebase.');
      return;
    }

    for (const demoUser of DEFAULT_USERS) {
      try {
        await createUserWithEmailAndPassword(auth, demoUser.email, demoUser.password);
        console.log(`✅ Firebase user created: ${demoUser.email}`);
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          console.log(`⚠️ Firebase user already exists: ${demoUser.email}`);
        } else {
          console.error(`❌ Failed to create ${demoUser.email}:`, error.code, error.message);
        }
      }
    }
    localStorage.setItem('firebase_demo_synced', 'true');
  };

  useEffect(() => {
    initializeData();
    loadUsers();
    checkCurrentUser();
    syncDemoUsersToFirebase();   // now runs only once
    setLoading(false);
  }, []);

  const initializeData = () => {
    if (!localStorage.getItem('campus_users')) {
      localStorage.setItem('campus_users', JSON.stringify(DEFAULT_USERS));
    }
    // ... (other collections remain the same)
  };

  const loadUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem('campus_users') || '[]');
    setUsers(storedUsers);
  };

  const checkCurrentUser = () => {
    const currentUser = localStorage.getItem('campus_current_user');
    if (currentUser) setUser(JSON.parse(currentUser));
  };

  // LOGIN – unchanged
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const usersList = JSON.parse(localStorage.getItem('campus_users') || '[]');
      const localUser = usersList.find(u => u.email === email);
      if (!localUser) {
        toast.error('User account not found in system. Please contact admin.');
        return { success: false };
      }
      const { password: _, ...userWithoutPassword } = localUser;
      setUser(userWithoutPassword);
      localStorage.setItem('campus_current_user', JSON.stringify(userWithoutPassword));
      toast.success(`Welcome back, ${userWithoutPassword.name}!`);
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      console.error('Login error:', error);
      let message = 'Invalid email or password';
      if (error.code === 'auth/user-not-found') message = 'No account found with this email';
      if (error.code === 'auth/wrong-password') message = 'Incorrect password';
      if (error.code === 'auth/too-many-requests') message = 'Too many failed attempts. Please try again later.';
      toast.error(message);
      return { success: false };
    }
  };

  // REGISTER – with better error handling for rate limits
  const register = async (userData) => {
    try {
      const usersList = JSON.parse(localStorage.getItem('campus_users') || '[]');
      if (usersList.some(u => u.email === userData.email)) {
        toast.error('Email already registered');
        return { success: false };
      }

      let firebaseUser;
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
        firebaseUser = userCredential.user;
      } catch (firebaseError) {
        console.error('Firebase error:', firebaseError);
        let message = 'Registration failed. ';
        if (firebaseError.code === 'auth/email-already-in-use') {
          message = 'Email already exists in authentication system.';
        } else if (firebaseError.code === 'auth/weak-password') {
          message = 'Password must be at least 6 characters.';
        } else if (firebaseError.code === 'auth/too-many-requests') {
          message = 'Too many requests. Please wait a moment and try again.';
        } else {
          message += firebaseError.message;
        }
        toast.error(message);
        return { success: false };
      }

      // Build user object with role‑specific ID
      let roleSpecificId = {};
      if (userData.role === 'student') roleSpecificId = { studentId: userData.roleId };
      else if (userData.role === 'lecturer') roleSpecificId = { employeeId: userData.roleId };
      else if (userData.role === 'admin') roleSpecificId = { adminId: userData.roleId };

      const newUser = {
        id: `user_${Date.now()}`,
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        firebaseUid: firebaseUser.uid,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=10B981&color=fff`,
        createdAt: new Date().toISOString(),
        registrationCompleted: true,
        ...roleSpecificId
      };

      usersList.push(newUser);
      localStorage.setItem('campus_users', JSON.stringify(usersList));
      setUsers(usersList);

      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('campus_current_user', JSON.stringify(userWithoutPassword));

      toast.success('Registration successful!');
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again later.');
      return { success: false };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('campus_current_user');
    toast.success('Logged out');
  };

  const updateUser = async (userId, updates) => {
    // ... unchanged
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent! Check your inbox.');
      return { success: true };
    } catch (error) {
      console.error('Reset error:', error);
      let message = 'Failed to send reset email.';
      if (error.code === 'auth/user-not-found') message = 'No account found with this email address.';
      if (error.code === 'auth/too-many-requests') message = 'Too many requests. Please wait.';
      toast.error(message);
      return { success: false };
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
    resetPassword,
    isAuthenticated: !!user,
    isStudent: user?.role === 'student',
    isLecturer: user?.role === 'lecturer',
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};