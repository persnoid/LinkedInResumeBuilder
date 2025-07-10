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
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('🔐 AuthProvider - getSession result:', {
          hasSession: !!session,
          userEmail: session?.user?.email,
          error: error?.message
        });
        if (error) {
          console.error('Error getting initial session:', error);
        } else {
          console.log('🔐 AuthProvider - Setting session and user from initial check');
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Unexpected error getting session:', error);
      } finally {
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
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Ensure user profile exists
          await ensureProfile(session.user);
        }
        
        console.log('🔐 AuthProvider - Setting loading to false after auth state change');
        setLoading(false);
      }
    );

    console.log('🔐 AuthProvider - Auth state change listener set up successfully');

    return () => {
      console.log('🔐 AuthProvider - Cleaning up auth state change listener');
      subscription.unsubscribe();
    };
  }, []);

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
      setLoading(true);
      
      // Check if user is currently authenticated
      if (!user) {
        console.log('🔐 AuthProvider - No user to sign out, clearing local state');
        setUser(null);
        setSession(null);
        setLoading(false);
        return { error: null };
      }
      
      console.log('🔐 AuthProvider - Starting sign out process for user:', user?.email);

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('🔐 AuthProvider - Sign out error from Supabase:', error);
        // Still clear local state even if Supabase signOut fails
        setUser(null);
        setSession(null);
        return { error };
      }
      
      console.log('🔐 AuthProvider - Supabase sign out successful, clearing local state');
      
      // Explicitly clear the auth state immediately
      setUser(null);
      setSession(null);
      
      console.log('🔐 AuthProvider - Local auth state cleared');
      
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      // Ensure local state is cleared even on exception
      setUser(null);
      setSession(null);
      return { error: error as AuthError };
    } finally {
      console.log('🔐 AuthProvider - signOut finally block, setting loading to false');
      setLoading(false);
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
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper hook for checking if user is authenticated
export const useRequireAuth = () => {
  const { user, loading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  // DEBUG: Log auth state changes - Add more detailed logging
  console.log('🔐 useRequireAuth RENDER - Detailed State:', {
    user: user?.email || 'null',
    authLoading: loading,
    isChecking,
    isAuthenticated: !!user,
    userExists: user !== null,
    userUndefined: user === undefined,
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    console.log('🔐 useRequireAuth - useEffect triggered (loading dependency):', {
      authLoading: loading,
      currentIsChecking: isChecking,
      user: user?.email || 'null',
      timestamp: new Date().toISOString()
    });
    
    if (!loading) {
      console.log('🔐 useRequireAuth - Auth loading complete, setting isChecking to false');
      setIsChecking(false);
    } else {
      console.log('🔐 useRequireAuth - Auth still loading, keeping isChecking true');
    }
  }, [loading]);
  
  // Additional useEffect to track user changes
  useEffect(() => {
    console.log('🔐 useRequireAuth - useEffect triggered (user dependency):', {
      user: user?.email || 'null',
      isAuthenticated: !!user,
      authLoading: loading,
      isChecking,
      timestamp: new Date().toISOString()
    });
  }, [user]);

  const result = {
    user,
    loading: isChecking, // This controls the loading state for ProtectedRoute
    isAuthenticated: !!user
  };

  console.log('🔐 useRequireAuth - Returning result:', {
    hasUser: !!result.user,
    loading: result.loading,
    isAuthenticated: result.isAuthenticated,
    timestamp: new Date().toISOString()
  });

  return result;
};