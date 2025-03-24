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
import type { LoadingState } from '@/components/ui/loading-indicator';

export function useFirebaseAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [authState, setAuthState] = useState<LoadingState>("idle");
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setLoading(true);
        if (user) {
          // Get fresh token on auth state change
          const token = await user.getIdToken(true);

          // Sync with backend
          const response = await fetch('/api/user', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            credentials: 'include'
          });

          if (!response.ok) {
            throw new Error('Failed to sync with backend');
          }

          setUser(user);
          setAuthState("success");
        } else {
          // Clear all client state on auth state change to null
          queryClient.clear();
          localStorage.clear();
          sessionStorage.clear();
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
      setAuthState("loading");

      // Clear backend session first
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store'
      });

      // Clear all storage and state
      localStorage.clear();
      sessionStorage.clear();
      queryClient.clear();

      // Sign out from Firebase last
      await signOut(auth);

      // Redirect to auth page
      window.location.replace('/auth');
    } catch (error: any) {
      console.error('Sign out error:', error);
      setAuthState("error");
      throw error; // Let the component handle the error
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