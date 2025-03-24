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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    }, (error) => {
      console.error('Auth state change error:', error);
      setError(error);
      setLoading(false);
      setAuthState("error");
    });

    return () => unsubscribe();
  }, []);

  const signOutUser = async () => {
    try {
      // Immediately clear all local state
      queryClient.clear();
      queryClient.setQueryData(['/api/user'], null);
      setUser(null);
      setAuthState("idle");
      setLoading(false);

      // Force a navigation to /auth
      window.location.assign('/auth');

      // After navigation is triggered, cleanup Firebase and backend
      try {
        // Clear Firebase auth
        await signOut(auth);

        // Clear backend session
        await fetch('/api/logout', {
          method: 'POST',
          credentials: 'include'
        });
      } catch (error) {
        console.error('Cleanup error:', error);
        // We don't need to handle this error since we're already navigating away
      }
    } catch (error: any) {
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