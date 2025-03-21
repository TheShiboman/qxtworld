import { getAuth, GoogleAuthProvider } from "firebase/auth";
import app from "./firebase-config";

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider with minimal required configuration
export const googleProvider = new GoogleAuthProvider();

// Add only essential scopes
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Ensure user selects account every time for better auth flow
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Log provider configuration (without sensitive data)
console.log('Google Auth Provider initialized with scopes:', 
  googleProvider.getScopes(),
  'and custom parameters:', 
  { prompt: googleProvider.getCustomParameters().get('prompt') }
);

export default app;