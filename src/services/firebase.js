// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration (exactly as you provided)
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
export const auth = getAuth(app);
export const analytics = getAnalytics(app);