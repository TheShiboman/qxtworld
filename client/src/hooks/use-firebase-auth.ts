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
    console.log('Setting up Firebase auth listeners');

    // Handle the redirect result immediately
    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          console.log('Google sign-in successful:', result.user.email);
          const token = await result.user.getIdToken();
          console.log('Got ID token, length:', token.length);

          // Update auth header for future requests
          queryClient.setDefaultOptions({
            queries: {
              queryFn: async ({ queryKey }) => {
                const response = await fetch(queryKey[0] as string, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                if (!response.ok) throw new Error(await response.text());
                return response.json();
              }
            }
          });

          setUser(result.user);
          toast({
            title: "Success",
            description: "Successfully signed in with Google",
          });
        }
      } catch (error: any) {
        console.error('Google sign-in error:', {
          code: error.code,
          message: error.message,
          customData: error.customData
        });

        let errorMessage = "Failed to complete Google sign-in. Please try again.";

        // Handle specific Firebase configuration error
        if (error.code === 'auth/configuration-not-found') {
          errorMessage = "Google Sign-in is not properly configured. Please ensure your domain is authorized in Firebase Console.";
        }

        toast({
          title: "Sign In Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };

    // Handle auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user?.email);
      if (user) {
        try {
          const token = await user.getIdToken();
          queryClient.setDefaultOptions({
            queries: {
              queryFn: async ({ queryKey }) => {
                const response = await fetch(queryKey[0] as string, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                if (!response.ok) throw new Error(await response.text());
                return response.json();
              }
            }
          });
        } catch (error) {
          console.error('Token refresh error:', error);
          await signOut(auth);
        }
      }
      setUser(user);
      setLoading(false);
    });

    handleRedirect();
    return () => unsubscribe();
  }, [toast]);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      console.log('Starting Google sign-in process');
      await signInWithRedirect(auth, googleProvider);
    } catch (error: any) {
      console.error('Sign in error:', {
        code: error.code,
        message: error.message
      });
      toast({
        title: "Error",
        description: "Failed to start Google sign-in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      queryClient.clear();
      toast({
        title: "Signed Out",
        description: "Successfully signed out",
      });
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
    signInWithGoogle,
    signOut: signOutUser
  };
}