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
        queryClient.clear(); // Clear all queries
        await queryClient.invalidateQueries({ queryKey: ['/api/user'] });
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
          try {
            await signInWithRedirect(auth, googleProvider);
            return;
          } catch (retryError) {
            console.error('Retry sign-in failed:', retryError);
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
      console.log('Starting sign out process...');
      setAuthState("loading");
      setLoading(true);

      // Clear backend session first
      const logoutResponse = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (!logoutResponse.ok) {
        throw new Error('Failed to clear backend session');
      }

      // Then sign out from Firebase
      await signOut(auth);
      console.log('Firebase sign out completed');

      // Clear React Query cache and reset states
      queryClient.clear(); // Clear all queries
      await queryClient.invalidateQueries({ queryKey: ['/api/user'] });

      // Synchronously update local state
      setUser(null);
      setAuthState("idle");
      setLoading(false);

      console.log('Successfully logged out');

      toast({
        title: "Signed Out",
        description: "Successfully signed out",
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      setAuthState("error");
      setLoading(false);
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
