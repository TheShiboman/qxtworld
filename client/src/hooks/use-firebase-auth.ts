import { useState, useEffect } from 'react';
import { 
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  type User as FirebaseUser 
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import type { LoadingState } from '@/components/ui/loading-indicator';

export function useFirebaseAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [authState, setAuthState] = useState<LoadingState>("idle");
  const { toast } = useToast();

  useEffect(() => {
    // Set Firebase persistence to local
    setPersistence(auth, browserLocalPersistence);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setAuthState("success");
      } else {
        setUser(null);
        setAuthState("idle");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOutUser = async () => {
    try {
      // Clear everything in a single synchronous block
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

      // Force a complete reload to clear all state
      window.location.href = '/auth';

    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    user,
    loading,
    error,
    authState,
    signInWithGoogle: async () => {
      try {
        setAuthState("loading");
        await signInWithRedirect(auth, googleProvider);
      } catch (error: any) {
        console.error('Sign in error:', error);
        setAuthState("error");
        toast({
          title: "Error",
          description: "Failed to sign in with Google",
          variant: "destructive",
        });
      }
    },
    signOut: signOutUser
  };
}