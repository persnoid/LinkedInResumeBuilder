import React, { useState, useEffect } from 'react';
import { useRequireAuth } from '../contexts/AuthContext';
import { Shield, Lock, Sparkles, Zap, Star, User } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowUnauthenticated?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowUnauthenticated = false
}) => {
  const { user, loading, isAuthenticated } = useRequireAuth();
  
  // Handle potential browser extension issues
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Clean up any potential extension communications before page unload
      try {
        window.dispatchEvent(new Event('cleanup-extensions'));
      } catch (e) { /* ignore */ }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);
  
  // Use actual loading and authentication states
  const effectiveLoading = loading;
  const effectiveIsAuthenticated = isAuthenticated;

  console.log('🔒 ProtectedRoute RENDER - Current state:', {
    effectiveLoading,
    effectiveIsAuthenticated,
    hasUser: !!user,
    userEmail: user?.email,
    allowUnauthenticated,
    timestamp: new Date().toISOString()
  });

  // Let App.tsx handle all authentication logic - ProtectedRoute just passes through
  console.log('🔒 ProtectedRoute - Rendering children');
  return <>{children}</>;
};