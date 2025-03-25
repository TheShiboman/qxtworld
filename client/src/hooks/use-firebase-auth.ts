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
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';

type AuthState = "idle" | "loading" | "success" | "error";

export function useFirebaseAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const [authState, setAuthState] = useState<AuthState>("idle");
  const { toast } = useToast();

  useEffect(() => {
    // Handle the redirect result first
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setUser(result.user);
          setAuthState("success");
        }
      })
      .catch((error) => {
        console.error('Redirect result error:', error);
        setError(error);
        setAuthState("error");
      });

    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthState(user ? "success" : "idle");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setAuthState("loading");
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error('Sign in error:', error);
      setError(error as Error);
      setAuthState("error");
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      setAuthState("loading");

      // Clear all client state first
      localStorage.clear();
      sessionStorage.clear();
      queryClient.clear();

      // Sign out from Firebase
      await signOut(auth);

      // Clear backend session
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      });

      // Reset state
      setUser(null);
      setAuthState("idle");
      setLoading(false);
      setError(null);

      // Force page reload to clear all state
      window.location.reload();
      window.location.href = '/auth';

    } catch (error) {
      console.error('Sign out error:', error);
      setError(error as Error);
      toast({
        title: "Sign out failed",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    user,
    error,
    loading,
    authState,
    signInWithGoogle,
    signOut: signOutUser,
  };
}