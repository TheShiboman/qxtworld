import { initializeApp } from "firebase/app";

// Retrieve API key from environment variables
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

// Log configuration loading (without exposing sensitive data)
console.log("Loading Firebase configuration...", {
  apiKeyExists: !!apiKey,
  projectIdExists: !!import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appIdExists: !!import.meta.env.VITE_FIREBASE_APP_ID,
});

// Ensure required environment variables are set
if (!apiKey) {
  throw new Error("Firebase API key is not configured");
}

if (!import.meta.env.VITE_FIREBASE_PROJECT_ID) {
  throw new Error("Firebase project ID is not configured");
}

if (!import.meta.env.VITE_FIREBASE_APP_ID) {
  throw new Error("Firebase app ID is not configured");
}

// Log partial API key for verification (first 4 and last 4 chars)
console.log("API Key verification:", {
  prefix: apiKey.substring(0, 4),
  suffix: apiKey.substring(apiKey.length - 4),
  length: apiKey.length,
});

const firebaseConfig = {
  apiKey: apiKey, // Correct API key reference
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: "689094503093",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: "G-PLY2H1V4VT",
};

console.log("Initializing Firebase with configuration:", {
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
});

const app = initializeApp(firebaseConfig);
console.log("Firebase app initialized successfully");

export default app;
