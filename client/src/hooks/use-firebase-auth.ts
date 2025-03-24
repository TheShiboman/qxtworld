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

  // Handle Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user?.email);
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
      console.log('Starting sign out process...');
      setAuthState("loading");

      // Clear Firebase auth first
      await signOut(auth);
      console.log('Firebase sign out completed');

      // Clear backend session
      const logoutResponse = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (!logoutResponse.ok) {
        throw new Error('Failed to clear backend session');
      }

      // Clear all client-side state
      queryClient.clear();
      await queryClient.invalidateQueries({ queryKey: ['/api/user'] });

      // Force a complete page reload to clear all state
      window.location.assign('/auth');
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