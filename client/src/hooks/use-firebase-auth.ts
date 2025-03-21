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

  // Handle token refresh and query invalidation
  const refreshTokenAndInvalidateQueries = async (user: FirebaseUser) => {
    try {
      console.log('Refreshing token for user:', user.email);
      const token = await user.getIdToken(true);
      console.log('Token refreshed successfully, length:', token.length);

      // Update auth header for all future requests
      queryClient.setDefaultOptions({
        queries: {
          queryFn: async ({ signal }) => {
            const headers: HeadersInit = {
              'Authorization': `Bearer ${token}`
            };
            const response = await fetch(signal.url, { headers, signal });
            if (!response.ok) throw new Error(await response.text());
            return response.json();
          }
        }
      });

      // Invalidate all queries to refetch with new token
      await queryClient.invalidateQueries();
      return token;
    } catch (error) {
      console.error('Token refresh error:', error);
      toast({
        title: "Authentication Error",
        description: "Failed to refresh authentication. Please sign in again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    // Handle redirect result when component mounts
    getRedirectResult(auth)
      .then(async (result) => {
        if (result) {
          console.log('Google sign-in successful, user:', result.user.email);
          setUser(result.user);
          await refreshTokenAndInvalidateQueries(result.user);
          toast({
            title: "Success",
            description: "Successfully signed in with Google",
          });
        }
      })
      .catch((error) => {
        setError(error);
        console.error("Redirect sign-in error:", {
          code: error.code,
          message: error.message,
          details: error.customData
        });
        toast({
          title: "Error",
          description: "Failed to sign in with Google. Please try again.",
          variant: "destructive",
        });
      });

    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, 
      async (user) => {
        console.log("Auth state changed:", user?.email);
        setUser(user);
        setLoading(false);

        if (user) {
          try {
            await refreshTokenAndInvalidateQueries(user);
          } catch (error) {
            console.error('Failed to refresh token on auth state change:', error);
            // Force re-login on token refresh failure
            signOutUser();
          }
        } else {
          // Clear all queries when user logs out
          queryClient.clear();
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
      console.log('Initiating Google sign-in...');
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
      console.log('User signed out successfully');
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
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