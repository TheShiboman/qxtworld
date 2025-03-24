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
import { queryClient } from '@/lib/queryClient';
import type { LoadingState } from '@/components/ui/loading-indicator';

// Helper to detect mobile browsers
const isMobile = () => {
  const userAgent = navigator.userAgent || navigator.vendor;
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  return mobileRegex.test(userAgent.toLowerCase());
};

export function useFirebaseAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [authState, setAuthState] = useState<LoadingState>("idle");
  const { toast } = useToast();

  // Function to sync Firebase auth state with backend
  const syncAuthState = async (firebaseUser: FirebaseUser | null) => {
    try {
      if (firebaseUser) {
        setAuthState("loading");
        // Get fresh token
        const token = await firebaseUser.getIdToken(true);
        console.log('Got fresh token, length:', token.length);

        // Make API request to verify token and create session
        const response = await fetch('/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (!response.ok) {
          setAuthState("error");
          throw new Error('Failed to sync auth state with backend');
        }

        // Update React Query cache with user data
        const userData = await response.json();
        queryClient.setQueryData(['/api/user'], userData);
        setAuthState("success");
        console.log('Successfully synced auth state with backend');
      } else {
        // Clear React Query cache when user signs out
        queryClient.setQueryData(['/api/user'], null);
        setAuthState("idle");
      }
    } catch (error) {
      console.error('Error syncing auth state:', error);
      setAuthState("error");
    }
  };

  useEffect(() => {
    console.log('Setting up Firebase auth listener');

    // Handle redirect result first
    const handleRedirectResult = async () => {
      try {
        console.log('Checking for redirect result...');
        setAuthState("loading");
        const result = await getRedirectResult(auth);

        if (result?.user) {
          console.log('Google sign-in redirect successful:', result.user.email);
          setUser(result.user);
          await syncAuthState(result.user);

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

        // Mobile-specific error handling
        if (error.code === 'auth/missing-initial-state') {
          // Retry the sign-in process
          try {
            await signInWithRedirect(auth, googleProvider);
            return;
          } catch (retryError) {
            console.error('Retry sign-in failed:', retryError);
            setAuthState("error");
          }
        }

        if (error.code === 'auth/popup-closed-by-user' || 
            error.code === 'auth/cancelled-popup-request') {
          setAuthState("idle");
          return;
        }

        setAuthState("error");
        toast({
          title: "Sign In Error",
          description: "Failed to complete Google sign-in. Please try again.",
          variant: "destructive",
        });
      }
    };

    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user?.email);
      setUser(user);
      await syncAuthState(user);
      setLoading(false);
    }, (error) => {
      console.error('Auth state change error:', error);
      setError(error);
      setLoading(false);
      setAuthState("error");
    });

    // Check for redirect result
    handleRedirectResult();

    return () => unsubscribe();
  }, [toast]);

  const signInWithGoogle = async () => {
    try {
      console.log('Attempting Google sign-in...');
      console.log('Firebase Configuration Check:', {
        authInitialized: !!auth,
        providerScopes: googleProvider.getScopes(),
        customParams: googleProvider.getCustomParameters()
      });
      setError(null);
      setAuthState("loading");

      const mobile = isMobile();
      console.log('Device detection:', { isMobile: mobile });

      if (mobile) {
        console.log('Starting Google sign-in with redirect (mobile)');
        await signInWithRedirect(auth, googleProvider);
      } else {
        console.log('Starting Google sign-in with popup (desktop)');
        const result = await signInWithPopup(auth, googleProvider);
        console.log('Google sign-in successful:', result.user.email);
        await syncAuthState(result.user);

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

      let errorMessage = "Failed to sign in with Google. Please try again.";

      if (error.code === 'auth/popup-blocked') {
        errorMessage = "Please allow popups for authentication";
      }

      if (error.code !== 'auth/popup-closed-by-user' && 
          error.code !== 'auth/cancelled-popup-request') {
        setAuthState("error");
        toast({
          title: "Sign In Error",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        setAuthState("idle");
      }

      setError(error);
    }
  };

  const signOutUser = async () => {
    try {
      setAuthState("loading");

      // Clear backend session first
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      });

      // Then sign out from Firebase
      await signOut(auth);

      // Clear React Query cache
      queryClient.setQueryData(['/api/user'], null);

      setAuthState("idle");

      toast({
        title: "Signed Out",
        description: "Successfully signed out",
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      setAuthState("error");
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
    authState,
    signInWithGoogle,
    signOut: signOutUser
  };
}