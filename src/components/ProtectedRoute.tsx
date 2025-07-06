import React, { useState, useEffect } from 'react';
import { useRequireAuth } from '../contexts/AuthContext';
import { AuthModal } from './AuthModal';
import { Shield, Lock, Sparkles, Zap, Star } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback 
}) => {
  const { user, loading, isAuthenticated } = useRequireAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'signin' | 'signup'>('signin');
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Animated loading progress
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 200);

      return () => clearInterval(interval);
    } else {
      setLoadingProgress(100);
    }
  }, [loading]);

  if (loading) {
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

  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-6 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-100/50 to-purple-100/50"></div>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-md w-full z-10">
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 text-center border border-white/20">
              {/* Header Icon */}
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome Back
              </h2>
              
              <p className="text-gray-600 mb-8 leading-relaxed">
                Sign in to access your saved resumes and create stunning professional documents with our AI-powered platform.
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={() => {
                    setAuthModalInitialMode('signin');
                    setShowAuthModal(true);
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Lock className="w-5 h-5 mr-3" />
                  Sign In to Continue
                </button>
                
                <p className="text-sm text-gray-500">
                  New here?{' '}
                  <button
                    onClick={() => {
                      setAuthModalInitialMode('signup');
                      setShowAuthModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium underline decoration-2 underline-offset-4 hover:decoration-blue-700 transition-colors"
                  >
                    Create your free account
                  </button>
                </p>
              </div>
              
              {/* Benefits Grid */}
              <div className="mt-10 grid grid-cols-1 gap-4 text-left">
                <div className="flex items-start space-x-3 p-3 bg-blue-50/50 rounded-xl">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Secure Cloud Storage</h4>
                    <p className="text-gray-600 text-xs">Your resumes are safely stored and accessible anywhere</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-purple-50/50 rounded-xl">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">AI-Powered Creation</h4>
                    <p className="text-gray-600 text-xs">Intelligent content extraction and optimization</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-green-50/50 rounded-xl">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Zap className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Real-time Collaboration</h4>
                    <p className="text-gray-600 text-xs">Sync across devices and share with ease</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode={authModalInitialMode}
        />
      </>
    );
  }

  return <>{children}</>;
};