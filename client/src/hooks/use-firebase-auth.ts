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
    // Set Firebase persistence to session only
    setPersistence(auth, browserSessionPersistence);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setAuthState("success");
          setUser(user);
        } else {
          setUser(null);
          setAuthState("idle");
          // Clear all client state on auth state change to null
          queryClient.clear();
          queryClient.invalidateQueries({ queryKey: ['/api/user'] });
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setError(error as Error);
        setAuthState("error");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signOutUser = async () => {
    try {
      setAuthState("loading");

      // Revoke token if possible
      if (auth.currentUser) {
        try {
          await auth.currentUser.getIdToken(true);
        } catch (e) {
          console.error('Token revocation failed:', e);
        }
      }

      // Clear all client state
      queryClient.clear();
      queryClient.setQueryData(['/api/user'], null);
      localStorage.clear();
      sessionStorage.clear();

      // Clear backend session
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store'
      });

      // Sign out from Firebase
      await auth.signOut();

      // Reset state
      setUser(null);
      setAuthState("idle");
      setLoading(false);

      // Hard redirect to auth page
      window.location.replace('/auth');

    } catch (error: any) {
      console.error('Sign out error:', error);
      throw error;
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