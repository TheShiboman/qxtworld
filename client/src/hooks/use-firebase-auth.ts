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

export function useFirebaseAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Handle redirect result when component mounts
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // The signed-in user info is in result.user
          setUser(result.user);
          // Force a token refresh to ensure we have a fresh token
          return result.user.getIdToken(true).then(() => {
            // Invalidate queries to refetch with new token
            queryClient.invalidateQueries();
            toast({
              title: "Success",
              description: "Successfully signed in with Google",
            });
          });
        }
      })
      .catch((error) => {
        setError(error);
        console.error("Redirect sign-in error:", error);
        toast({
          title: "Error",
          description: "Failed to sign in with Google. Please try again.",
          variant: "destructive",
        });
      });

    const unsubscribe = onAuthStateChanged(auth, 
      (user) => {
        console.log("Auth state changed:", user?.email);
        setUser(user);
        setLoading(false);
        if (user) {
          // Refresh token on auth state change
          user.getIdToken(true).then(() => {
            queryClient.invalidateQueries();
          });
        }
      },
      (error) => {
        console.error("Auth state change error:", error);
        setError(error);
        setLoading(false);
        toast({
          title: "Authentication Error",
          description: "There was a problem with authentication. Please try again.",
          variant: "destructive",
        });
      }
    );

    return () => unsubscribe();
  }, [toast]);

  const signInWithGoogle = async () => {
    try {
      setError(null);
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      setError(error as Error);
      console.error("Sign in error:", error);
      toast({
        title: "Sign In Error",
        description: "Failed to start Google sign-in. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
      queryClient.clear(); // Clear all queries on sign out
    } catch (error) {
      setError(error as Error);
      console.error("Sign out error:", error);
      toast({
        title: "Sign Out Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
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