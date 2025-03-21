import { useState, useEffect } from 'react';
import { 
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  type User as FirebaseUser 
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

export function useFirebaseAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Handle redirect result when component mounts
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // The signed-in user info is in result.user
          setUser(result.user);
        }
      })
      .catch((error) => {
        setError(error);
        console.error("Redirect sign-in error:", error);
      });

    const unsubscribe = onAuthStateChanged(auth, 
      (user) => {
        setUser(user);
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setError(null);
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  };

  return {
    user,
    loading,
    error,
    signInWithGoogle,
    signOut: signOutUser
  };
}