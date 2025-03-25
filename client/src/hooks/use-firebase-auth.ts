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
    // Set Firebase persistence to session
    setPersistence(auth, browserSessionPersistence);

    // Handle redirect result first
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          setUser(result.user);
          setAuthState("success");
        }
      })
      .catch((error) => {
        console.error('Redirect result error:', error);
        setError(error);
        setAuthState("error");
      })
      .finally(() => {
        setLoading(false);
      });

    // Then set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthState(user ? "success" : "idle");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOutUser = async () => {
    try {
      // Immediately update UI state
      setLoading(true);
      setAuthState("loading");

      // Clear all client state first
      localStorage.clear();
      sessionStorage.clear();
      queryClient.clear();
      queryClient.setQueryData(['/api/user'], null);

      // Clear backend session
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store'
      });

      // Sign out from Firebase
      await signOut(auth);

      // Reset all state
      setUser(null);
      setAuthState("idle");
      setError(null);

      // Force a complete page reload
      window.location.replace('/auth');

    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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