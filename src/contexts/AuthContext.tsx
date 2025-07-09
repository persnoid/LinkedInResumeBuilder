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

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting initial session:', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Unexpected error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Ensure user profile exists
          await ensureProfile(session.user);
        }
        
        setLoading(false);
      }
    );

    return () => {
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
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      console.log('🔓 AuthContext: Starting sign out process for user:', user?.email);

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('🔓 AuthContext: Sign out error from Supabase:', error);
        return { error };
      }
      
      console.log('🔓 AuthContext: Supabase sign out successful, clearing local state');
      
      // Explicitly clear the auth state immediately
      setUser(null);
      setSession(null);
      
      console.log('🔓 AuthContext: Local auth state cleared');
      
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: error as AuthError };
    } finally {
      // Add a small delay to ensure state updates are processed
      setTimeout(() => {
        setLoading(false);
        console.log('🔓 AuthContext: Sign out process completed');
      }, 100);
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
  console.log('🔐 useRequireAuth - Detailed State:', {
    user: user?.email || 'null',
    authLoading: loading,
    isChecking,
    isAuthenticated: !!user,
    userExists: user !== null,
    userUndefined: user === undefined,
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    console.log('🔐 useRequireAuth - useEffect triggered:', {
      authLoading: loading,
      currentIsChecking: isChecking,
      user: user?.email || 'null'
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
    console.log('🔐 useRequireAuth - User changed:', {
      user: user?.email || 'null',
      isAuthenticated: !!user,
      authLoading: loading,
      isChecking
    });
  }, [user]);

  return {
    user,
    loading: isChecking, // This controls the loading state for ProtectedRoute
    isAuthenticated: !!user
  };
};