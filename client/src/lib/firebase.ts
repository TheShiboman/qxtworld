import { initializeApp, deleteApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  browserNonePersistence,
  setPersistence
} from "firebase/auth";

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

export const firebaseConfig = {
  apiKey: requiredEnvVars.apiKey,
  authDomain: `${requiredEnvVars.projectId}.firebaseapp.com`,
  projectId: requiredEnvVars.projectId,
  storageBucket: `${requiredEnvVars.projectId}.appspot.com`,
  messagingSenderId: "689094503093",
  appId: requiredEnvVars.appId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Force non-persistent authentication
setPersistence(auth, browserNonePersistence)
  .then(() => console.log('Firebase persistence set to NONE'))
  .catch(console.error);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Utility function to clean up Firebase state
export async function cleanupFirebase() {
  try {
    // Close Firebase app first
    await auth.signOut();
    await deleteApp(app);

    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();

    // Clear all IndexedDB databases
    const databases = await window.indexedDB.databases();
    await Promise.all(
      databases.map(db => 
        db.name ? window.indexedDB.deleteDatabase(db.name) : Promise.resolve()
      )
    );

    console.log('Firebase cleanup completed');
  } catch (error) {
    console.error('Firebase cleanup failed:', error);
    throw error;
  }
}

export default app;