import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration with complete OAuth settings
const firebaseConfig = {
  apiKey: "AIzaSyB03Hf1X3CtE80wcDZuXblrWyoql2QyG0k",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: "689094503093",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: "G-PLY2H1V4VT"
};

console.log('Attempting Firebase initialization with:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  hasApiKey: !!firebaseConfig.apiKey
});

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Google Auth Provider with complete configuration
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');

// Force account selection to ensure proper OAuth flow
googleProvider.setCustomParameters({
  prompt: 'select_account',
  access_type: 'offline'
});

export default app;