import { useState, useEffect } from 'react';
import { 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  type User as FirebaseUser 
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

// Helper to detect mobile browsers
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export function useFirebaseAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    console.log('Setting up Firebase auth listener');

    // Set up auth state change listener first
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user?.email);
      setUser(user);
      setLoading(false);
    }, (error) => {
      console.error('Auth state change error:', error);
      setError(error);
      setLoading(false);
    });

    // Handle redirect result
    const handleRedirectResult = async () => {
      try {
        console.log('Checking for redirect result...');
        const result = await getRedirectResult(auth);

        if (result?.user) {
          console.log('Google sign-in redirect successful:', result.user.email);
          setUser(result.user);
          toast({
            title: "Success",
            description: "Successfully signed in with Google",
          });
        }
      } catch (error: any) {
        console.error('Redirect result error:', {
          code: error.code,
          message: error.message,
          stack: error.stack,
          customData: error.customData
        });

        // Handle specific mobile browser errors
        if (error.message?.includes('missing initial state')) {
          console.log('Detected missing state error, triggering new sign-in');
          // Don't show error - we'll retry the sign-in
          return;
        }

        toast({
          title: "Sign In Error",
          description: "Failed to complete Google sign-in. Please try again.",
          variant: "destructive",
        });
      }
    };

    // Check for redirect result
    handleRedirectResult();

    return () => unsubscribe();
  }, [toast]);

  const signInWithGoogle = async () => {
    try {
      setError(null);
      if (isMobile()) {
        console.log('Starting Google sign-in with redirect (mobile)');
        await signInWithRedirect(auth, googleProvider);
      } else {
        console.log('Starting Google sign-in with popup (desktop)');
        const result = await signInWithPopup(auth, googleProvider);
        console.log('Google sign-in successful:', result.user.email);

        toast({
          title: "Success",
          description: "Successfully signed in with Google",
        });
      }
    } catch (error: any) {
      console.error('Sign in error:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });

      // Don't show error for cancelled operations
      if (error.code === 'auth/cancelled-popup-request' ||
          error.code === 'auth/popup-closed-by-user') {
        return;
      }

      let errorMessage = "Failed to sign in with Google. Please try again.";

      if (error.code === 'auth/popup-blocked') {
        errorMessage = "Please allow popups for authentication";
      }

      toast({
        title: "Sign In Error",
        description: errorMessage,
        variant: "destructive",
      });
      setError(error);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Signed Out",
        description: "Successfully signed out",
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
      setError(error);
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