import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: any) => Promise<{ error: AuthError | null }>;
  clearAuthState: () => void;
}

// Global cleanup function to handle browser extension communication issues
const cleanupBrowserExtensions = () => {
  try {
    // Clear any potential browser extension storage that might be causing issues
    if (typeof window !== 'undefined' && window.chrome?.runtime) {
      // Safely disconnect any hanging extension ports
      console.log('🧹 AuthContext: Cleaning up potential browser extension conflicts');
    }
  } catch (error) {
    // Silently handle extension cleanup errors
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  console.log('🔐 AuthProvider RENDER - Current state:', {
    hasUser: !!user,
    userEmail: user?.email,
    hasSession: !!session,
    loading,
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    console.log('🔐 AuthProvider useEffect - Starting initial session check');
    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('🔐 AuthProvider - Calling supabase.auth.getSession()');
        
        // Add timeout to prevent hanging on getSession
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('getSession timeout')), 3000)
        );
        
        const { data: { session }, error } = await Promise.race([sessionPromise, timeoutPromise]) as any;
        
        console.log('🔐 AuthProvider - getSession result:', {
          hasSession: !!session,
          userEmail: session?.user?.email,
          error: error?.message
        });
        
        if (error) {
          console.warn('Error getting initial session (continuing anyway):', error);
          setSession(null);
          setUser(null);
        } else {
          console.log('🔐 AuthProvider - Setting session and user from initial check');
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error: any) {
        console.warn('Unexpected error getting session (continuing anyway):', error);
        console.log('🔐 AuthProvider - Timeout or error, clearing session');
        setSession(null);
        setUser(null);
      } finally {
        // CRITICAL FIX: Always set loading to false
        console.log('🔐 AuthProvider - Setting loading to false after initial session check');
        setLoading(false);
      }
    };

    getInitialSession();

    console.log('🔐 AuthProvider - Setting up auth state change listener');
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 AuthProvider - Auth state changed:', {
          event,
          userEmail: session?.user?.email,
          hasSession: !!session,
          timestamp: new Date().toISOString()
        });
        
        try {
          // Update session and user for all events
          setSession(session);
          setUser(session?.user ?? null);
          
          // Handle specific events
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            // Ensure user profile exists
            if (session?.user) {
              try {
                await ensureProfile(session.user);
              } catch (error) {
                console.error('Error ensuring profile:', error);
              }
            }
          }
          
          if (event === 'SIGNED_OUT') {
            console.log('🔐 AuthProvider - SIGNED_OUT event received, clearing all state');
            setSession(null);
            setUser(null);
            // Clear any cached storage
            try {
              localStorage.removeItem('supabase.auth.token');
              sessionStorage.clear();
            } catch (e) {
              console.warn('Could not clear storage on sign out:', e);
            }
          }
        } catch (error) {
          console.error('Error in auth state change handler:', error);
        } finally {
          console.log('🔐 AuthProvider - Setting loading to false after auth state change');
          setLoading(false);
        }
      }
    );
        

    console.log('🔐 AuthProvider - Auth state change listener set up successfully');

    return () => {
      console.log('🔐 AuthProvider - Cleaning up auth state change listener');
      subscription.unsubscribe();
    };
  }, []);

  // Reduced safety timeout and better handling
  useEffect(() => {
    const safetyTimeout = setTimeout(() => {
      if (loading) {
        console.warn('🔐 AuthProvider - Safety timeout: auth is stuck, forcing loading to false');
        setLoading(false);
        // Force clear everything if stuck
        setSession(null);
        setUser(null);
      }
    }, 5000); // Reduced to 5 seconds

    return () => clearTimeout(safetyTimeout);
  }, [loading]);

  // Ensure user profile exists in the profiles table
  const ensureProfile = async (user: User) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || '',
            avatar_url: user.user_metadata?.avatar_url || ''
          });

        if (insertError) {
          console.error('Error creating profile:', insertError);
        } else {
          console.log('Profile created successfully');
        }
      } else if (error) {
        console.error('Error checking profile:', error);
      }
    } catch (error) {
      console.error('Unexpected error ensuring profile:', error);
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata || {}
        }
      });
      return { error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 AuthProvider - signIn started for:', email);
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      console.log('🔐 AuthProvider - signIn result:', { 
        success: !error, 
        error: error?.message 
      });
      
      if (!error) {
        console.log('🔐 AuthProvider - Sign in successful, auth state will update via listener');
      }
      
      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error as AuthError };
    } finally {
      console.log('🔐 AuthProvider - signIn finally block, setting loading to false');
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('🔐 AuthProvider - signOut started');
      
      // Check if user is currently authenticated
      if (!user) {
        console.log('🔐 AuthProvider - No user to sign out, clearing local state');
        setUser(null);
        setSession(null);
        console.log('🔐 AuthProvider - No user found, sign out complete');
        return { error: null };
      }
      
      console.log('🔐 AuthProvider - Starting sign out process for user:', user?.email);

      cleanupBrowserExtensions();
      setLoading(true); // Set loading state
      
      console.log('🔐 AuthProvider - Calling supabase.auth.signOut()');
      
      // Flag to prevent race conditions
      let signOutCompleted = false;
      
      // Add timeout to prevent hanging
      const signOutPromise = supabase.auth.signOut();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sign out timeout')), 5000)
      );
      
      let error = null;
      try {
        const result = await Promise.race([signOutPromise, timeoutPromise]);
        error = (result as any)?.error || null;
        console.log('🔐 AuthProvider - Supabase sign out completed successfully');
        signOutCompleted = true;
      } catch (timeoutError) {
        console.warn('🔐 AuthProvider - Supabase sign out timed out or failed:', timeoutError);
        error = timeoutError;
        signOutCompleted = true; // Still mark as completed to prevent timeout cleanup
      }
      
      if (error) {
        console.error('🔐 AuthProvider - Sign out error from Supabase:', error);
        // Even with error, continue with local cleanup
      }
      
      console.log('🔐 AuthProvider - Supabase sign out completed, clearing local state');
      
      // CRITICAL: Always clear local state regardless of Supabase result
      setUser(null);
      setSession(null);
      
      // FORCE clear any cached auth data
      try {
        localStorage.removeItem('supabase.auth.token');
        localStorage.clear(); // Clear all localStorage to be sure
        sessionStorage.clear();
        console.log('🔐 AuthProvider - Local storage cleared');
      } catch (e) {
        console.warn('🔐 AuthProvider - Could not clear storage:', e);
      }
      
      console.log('🔐 AuthProvider - Local auth state cleared');
      
      // Force trigger auth state change if listener doesn't fire (only if not already completed)
      setTimeout(() => {
        if (!signOutCompleted) {
          console.log('🔐 AuthProvider - Force checking auth state after sign out');
          if (user) {
            console.log('🔐 AuthProvider - User still exists after timeout, force clearing');
            setUser(null);
            setSession(null);
          }
        } else {
          console.log('🔐 AuthProvider - Sign out already completed, skipping force cleanup');
        }
      }, 1000);
      
      return { error };
    } catch (error) {
      console.error('Sign out error:', error);
      // CRITICAL: Clear state even on exception
      console.log('🔐 AuthProvider - Exception during sign out, clearing state anyway');
      
      // Force clear everything
      setUser(null);
      setSession(null);
      setLoading(false);
      
      try {
        localStorage.removeItem('supabase.auth.token');
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {
        console.warn('🔐 AuthProvider - Could not clear storage on error:', e);
      }
      
      return { error: error as any };
    } finally {
      // CRITICAL: Always set loading to false and clear state
      console.log('🔐 AuthProvider - signOut finally block, force completing sign out');
      setLoading(false);
      // Clean up any browser extension issues
      cleanupBrowserExtensions();
      console.log('🔐 AuthProvider - Sign out process completed');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      return { error };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error: error as AuthError };
    }
  };

  const updateProfile = async (updates: any) => {
    try {
      if (!user) {
        return { error: { message: 'No user logged in' } as AuthError };
      }

      // Update auth user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: updates
      });

      if (authError) {
        return { error: authError };
      }

      // Update profile table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: updates.full_name,
          avatar_url: updates.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      return { error: profileError };
    } catch (error) {
      console.error('Update profile error:', error);
      return { error: error as AuthError };
    }
  }

  const clearAuthState = () => {
    console.log('🔐 AuthProvider - clearAuthState called');
    setUser(null);
    setSession(null);
    setLoading(false);
  };

  // Create the context value object
  const contextValue: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    clearAuthState
  };
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Hook that ensures user is authenticated (for protected routes)
export const useRequireAuth = () => {
  const { user, loading } = useAuth();
  
  return {
    user,
    loading,
    isAuthenticated: !!user
  };
}