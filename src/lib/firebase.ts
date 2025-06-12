// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyD85vl1omvJmrr6k_LinZuWpzbQVh8rvNU",
    authDomain: "college-marketplace-d0a5d.firebaseapp.com",
    projectId: "college-marketplace-d0a5d",
    storageBucket: "college-marketplace-d0a5d.firebasestorage.app",
    messagingSenderId: "332756488563",
    appId: "1:332756488563:web:454a21cc1cde6197523506",
    measurementId: "G-QFQY37YG81"
  };

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export { app };