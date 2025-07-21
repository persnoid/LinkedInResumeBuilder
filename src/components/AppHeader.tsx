import React from 'react';
import { User, LogOut, Home, FolderOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AppHeaderProps {
  onOpenProfile: () => void;
  onOpenDraftManager: () => void;
  onGoToHome: () => void;
  currentStep: number;
  showConfirmation: (options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
  }) => Promise<boolean>;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onOpenProfile,
  onOpenDraftManager,
  onGoToHome,
  currentStep,
  showConfirmation
}) => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    console.log('🔓 AppHeader: Sign out button clicked');
    
    const confirmed = await showConfirmation({
      title: 'Sign Out',
      message: 'Are you sure you want to sign out? Any unsaved changes will be lost.',
      confirmText: 'Sign Out',
      cancelText: 'Cancel',
      type: 'warning'
    });

    console.log('🔓 AppHeader: Confirmation result:', confirmed);

    if (confirmed) {
      console.log('🔓 AppHeader: User confirmed sign out, proceeding...');
      try {
        await signOut();
        console.log('🔓 AppHeader: Sign out completed successfully');
      } catch (error) {
        console.error('🔓 AppHeader: Sign out error:', error);
        // Force sign out even if there's an error
        console.log('🔓 AppHeader: Forcing sign out due to error');
        window.location.reload(); // Force page reload to clear all state
      }
    } else {
      console.log('🔓 AppHeader: User cancelled sign out');
    }
  };

  if (!user) return null;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Home */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onGoToHome}
            className="flex items-center space-x-3 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-lg font-bold text-gray-900">Resume Builder</span>
          </button>
          
          {currentStep > 0 && (
            <button
              onClick={onGoToHome}
              className="text-gray-500 hover:text-gray-700 text-sm flex items-center transition-colors"
            >
              <Home className="w-4 h-4 mr-1" />
              Start Over
            </button>
          )}
        </div>

        {/* User Controls */}
        <div className="flex items-center space-x-3">
          {/* Draft Manager */}
          <button
            onClick={onOpenDraftManager}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors"
          >
            <FolderOpen className="w-4 h-4 mr-2" />
            Drafts
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenProfile}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </button>
            
            <button
              onClick={handleSignOut}
              className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>

          {/* User Info */}
          <div className="text-sm text-gray-600 ml-2">
            {user.email}
          </div>
        </div>
      </div>
    </header>
  );
};