import React from 'react';
import { User, LogOut, Home, FolderOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AppHeaderProps {
  onOpenProfile: () => void;
  onGoToHome: () => void;
  currentStep: number;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onOpenProfile,
  onGoToHome,
  currentStep,
}) => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    console.log('🔓 AppHeader: Sign out button clicked - handleSignOut triggered');
    console.log('🔓 AppHeader: Current state - user:', !!user, 'currentStep:', currentStep);
    
    try {
      await signOut();
      console.log('🔓 AppHeader: Sign out completed successfully');
    } catch (error) {
      console.error('🔓 AppHeader: Sign out error:', error);
      // Force sign out even if there's an error
      console.log('🔓 AppHeader: Forcing sign out due to error');
      window.location.reload(); // Force page reload to clear all state
    }
  };

  if (!user) return null;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Home */}
        <div className="flex items-center space-x-6">
          <button
            onClick={onGoToHome}
            className="flex items-center space-x-3 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-lg font-bold text-gray-900">Resume Builder</span>
          </button>
          
          {/* User Info - Show who's signed in */}
          <div className="text-sm text-gray-600 flex items-center">
            <User className="w-4 h-4 mr-1" />
            {user.email}
          </div>
        </div>

        {/* User Controls */}
        <div className="flex items-center space-x-3">
          {/* Start Over - Secondary action */}
          {currentStep > 0 && (
            <button
              onClick={onGoToHome}
              className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              Start Over
            </button>
          )}

          {/* Profile Settings */}
          <button
            onClick={onOpenProfile}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors"
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </button>
          
          {/* Sign Out - Destructive action, separate */}
          <button
            onClick={handleSignOut}
            className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
};