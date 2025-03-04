// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBd3xgYA1qBQCK3G0PEmt89cDfeE2LveL0",
    authDomain: "library-management-d890b.firebaseapp.com",
    projectId: "library-management-d890b",
    storageBucket: "library-management-d890b.firebasestorage.app",
    messagingSenderId: "246306613485",
    appId: "1:246306613485:web:ecbd2143b31012117fc4e4",
    measurementId: "G-18XE3V9HC7"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };