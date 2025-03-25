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
    // Set Firebase persistence to local for better mobile support
    setPersistence(auth, browserLocalPersistence);

    // Clear any existing tokens on mount
    if (auth.currentUser) {
      auth.currentUser.getIdToken(true).catch(console.error);
    }

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
      });

    // Then set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthState(user ? "success" : "idle");
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
      setAuthState("loading");

      // Force token refresh to invalidate current token
      if (auth.currentUser) {
        await auth.currentUser.getIdToken(true);
      }

      // Sign out from Firebase first
      await auth.signOut();

      // Clear all client state
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

      // Reset all state
      setUser(null);
      setAuthState("idle");
      setLoading(false);
      setError(null);

      // Force full page reload to clear everything
      window.location.reload();
      window.location.href = '/auth';

    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
      setAuthState("error");
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