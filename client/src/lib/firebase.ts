import { getAuth, GoogleAuthProvider } from "firebase/auth";
import app from "./firebase-config";

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider with explicit client ID
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  client_id: "689094503093-1tfd7f8p7ge6v7dd0pl6136lpvk3q5e9.apps.googleusercontent.com",
  prompt: 'select_account'
});

export default app;