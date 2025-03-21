import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Initialize Firebase app
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: "689094503093",
  measurementId: "G-PLY2H1V4VT"
};

// Initialize Firebase app and handle errors
let app;
try {
  console.log('Initializing Firebase with configuration:', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    apiKeyValid: !!firebaseConfig.apiKey
  });
  app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized successfully');
} catch (error: any) {
  console.error('Firebase initialization error:', {
    code: error.code,
    message: error.message,
    details: error.customData ? JSON.stringify(error.customData) : undefined,
    stack: error.stack
  });
  throw error;
}

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Google Auth Provider with minimal required configuration
export const googleProvider = new GoogleAuthProvider();

// Add essential scopes
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Ensure user selects account every time for better auth flow
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;