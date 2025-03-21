import { initializeApp } from "firebase/app";

// Retrieve API key from environment variables
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const appId = import.meta.env.VITE_FIREBASE_APP_ID;

// Validate API key format (should start with 'AIza')
if (!apiKey?.startsWith('AIza')) {
  console.error('Firebase API key validation failed:', {
    reason: 'Invalid format',
    expected: 'Should start with AIza',
    received: apiKey ? `Starts with ${apiKey.substring(0, 4)}` : 'No key provided'
  });
  throw new Error("Invalid Firebase API key format");
}

// Validate project configuration
if (!projectId) {
  console.error('Firebase configuration error: Project ID is missing');
  throw new Error("Firebase project ID is not configured");
}

if (!appId) {
  console.error('Firebase configuration error: App ID is missing');
  throw new Error("Firebase app ID is not configured");
}

// Log configuration status (safely - without exposing full key)
console.log('Firebase Configuration Status:', {
  apiKeyFormat: 'AIza' + '*'.repeat(apiKey.length - 8) + apiKey.slice(-4),
  apiKeyLength: apiKey.length,
  projectId,
  configurationValid: true
});

const firebaseConfig = {
  apiKey,
  authDomain: `${projectId}.firebaseapp.com`,
  projectId,
  storageBucket: `${projectId}.appspot.com`,
  messagingSenderId: "689094503093",
  appId,
  measurementId: "G-PLY2H1V4VT"
};

let app;
try {
  console.log('Initializing Firebase with configuration:', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    apiKeyValid: apiKey.startsWith('AIza')
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

export default app;