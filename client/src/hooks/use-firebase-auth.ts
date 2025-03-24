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

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setUser(user);
          setAuthState("success");
        } else {
          // Clear all client state on auth state change to null
          queryClient.clear();
          queryClient.invalidateQueries({ queryKey: ['/api/user'] });
          setUser(null);
          setAuthState("idle");
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
      // Start logout process
      setAuthState("loading");

      // Revoke Firebase token
      if (auth.currentUser) {
        try {
          // Force token refresh to invalidate existing token
          await auth.currentUser.getIdToken(true);
        } catch (e) {
          console.error('Token revocation failed:', e);
        }
      }

      // Clear all client state
      queryClient.clear();
      localStorage.clear();
      sessionStorage.clear();

      // Clear backend session
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store'
      });

      // Sign out from Firebase
      await signOut(auth);

      // Reset state
      setUser(null);
      setAuthState("idle");
      setLoading(false);

      // Force a complete page reload and redirect
      window.location.replace('/auth');

    } catch (error: any) {
      console.error('Sign out error:', error);
      setAuthState("error");
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