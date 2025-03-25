import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, browserSessionPersistence, setPersistence } from "firebase/auth";

// Required Firebase configuration values
const requiredEnvVars = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate required environment variables
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

export const firebaseConfig = {
  apiKey: requiredEnvVars.apiKey,
  authDomain: `${requiredEnvVars.projectId}.firebaseapp.com`,
  projectId: requiredEnvVars.projectId,
  storageBucket: `${requiredEnvVars.projectId}.appspot.com`,
  messagingSenderId: "unused",
  appId: requiredEnvVars.appId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configure persistence to session only
setPersistence(auth, browserSessionPersistence)
  .then(() => console.log('Firebase persistence set to SESSION'))
  .catch(console.error);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
