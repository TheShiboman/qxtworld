import { initializeApp } from "firebase/app";

// Retrieve API key from environment variables
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

// Enhanced configuration validation logging
if (!apiKey) {
  console.error('Firebase configuration error: API key is missing');
  throw new Error("Firebase API key is not configured");
}

if (!import.meta.env.VITE_FIREBASE_PROJECT_ID) {
  console.error('Firebase configuration error: Project ID is missing');
  throw new Error("Firebase project ID is not configured");
}

if (!import.meta.env.VITE_FIREBASE_APP_ID) {
  console.error('Firebase configuration error: App ID is missing');
  throw new Error("Firebase app ID is not configured");
}

// Log configuration status (safely - without exposing full key)
console.log('Firebase Configuration Status:', {
  apiKeyPresent: !!apiKey,
  apiKeyPrefix: apiKey?.substring(0, 4),
  apiKeySuffix: apiKey?.substring(apiKey.length - 4),
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  configurationValid: !!(apiKey && import.meta.env.VITE_FIREBASE_PROJECT_ID && import.meta.env.VITE_FIREBASE_APP_ID)
});

const firebaseConfig = {
  apiKey,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: "689094503093",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: "G-PLY2H1V4VT"
};

// Initialize Firebase app with detailed error handling
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized successfully');
} catch (error: any) {
  console.error('Firebase initialization error:', {
    code: error.code,
    message: error.message,
    stack: error.stack
  });
  throw error;
}

export default app;