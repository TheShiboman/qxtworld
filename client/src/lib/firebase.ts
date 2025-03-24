import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, browserLocalPersistence, setPersistence } from "firebase/auth";

// Required Firebase configuration values
const requiredEnvVars = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validate all required environment variables are present
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing required Firebase configuration: ${key}`);
  }
});

const firebaseConfig = {
  apiKey: requiredEnvVars.apiKey,
  authDomain: `${requiredEnvVars.projectId}.firebaseapp.com`,
  projectId: requiredEnvVars.projectId,
  storageBucket: `${requiredEnvVars.projectId}.appspot.com`,
  messagingSenderId: "689094503093",
  appId: requiredEnvVars.appId
};

console.log('Initializing Firebase with:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  currentOrigin: window.location.origin // Log current origin for debugging
});

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Set persistence to LOCAL to handle mobile browser sessions better
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log('Firebase persistence set to LOCAL'))
  .catch((error) => {
    console.error('Error setting persistence:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
  });

export const googleProvider = new GoogleAuthProvider();

// Configure Google Auth Provider
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({
  // Force account selection to prevent session issues and handle redirects better
  prompt: 'select_account'
});

export default app;