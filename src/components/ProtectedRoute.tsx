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
  const [loadingProgress, setLoadingProgress] = useState(0);
  
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

  // Animated loading progress
  useEffect(() => {
    if (effectiveLoading) {
      console.log('🔒 ProtectedRoute - Starting loading animation');
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 200);

      return () => clearInterval(interval);
    } else {
      console.log('🔒 ProtectedRoute - Loading complete, setting progress to 100%');
      setLoadingProgress(100);
    }
  }, [effectiveLoading]);

  // Only show loading screen if we're actually loading auth and not allowing unauthenticated access
  if (effectiveLoading && !allowUnauthenticated && !user) {
    console.log('🔒 ProtectedRoute - Rendering loading screen');
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-300/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-300/30 rounded-full blur-xl animate-bounce"></div>
        </div>

        {/* Floating icons */}
        <div className="absolute inset-0 pointer-events-none">
          <Star className="absolute top-20 left-20 w-6 h-6 text-white/30 animate-pulse" />
          <Sparkles className="absolute top-32 right-32 w-8 h-8 text-purple-300/40 animate-bounce delay-500" />
          <Zap className="absolute bottom-32 left-32 w-7 h-7 text-blue-300/50 animate-pulse delay-1000" />
          <Star className="absolute bottom-20 right-20 w-5 h-5 text-white/20 animate-bounce delay-700" />
        </div>

        <div className="text-center z-10 max-w-md mx-auto px-6">
          {/* Logo/Icon */}
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/30 shadow-2xl">
              <Shield className="w-12 h-12 text-white animate-pulse" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            Resume Builder
          </h1>
          <p className="text-lg text-white/80 mb-8 leading-relaxed">
            AI-powered resume creation with professional templates
          </p>

          {/* Loading Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-white/70 mb-2">
              <span>Loading your workspace</span>
              <span>{Math.round(loadingProgress)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 backdrop-blur-sm border border-white/30">
              <div 
                className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out shadow-lg"
                style={{ width: `${loadingProgress}%` }}
              >
                <div className="h-full bg-white/30 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Loading Animation */}
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce delay-150"></div>
            <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce delay-300"></div>
          </div>

          {/* Features */}
          <div className="mt-12 grid grid-cols-1 gap-4 text-left">
            <div className="flex items-center text-white/80 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
              <span>AI-powered content extraction</span>
            </div>
            <div className="flex items-center text-white/80 text-sm">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse delay-300"></div>
              <span>Professional templates</span>
            </div>
            <div className="flex items-center text-white/80 text-sm">
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 animate-pulse delay-600"></div>
              <span>Real-time customization</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated and not allowing unauthenticated access, let App handle it
  if (!effectiveIsAuthenticated && !allowUnauthenticated) {
    console.log('🔒 ProtectedRoute - Not authenticated, letting App component handle routing');
    return null;
  }

  console.log('🔒 ProtectedRoute - User authenticated, rendering children');
  return <>{children}</>;
};