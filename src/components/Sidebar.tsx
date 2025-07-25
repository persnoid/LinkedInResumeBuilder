import React, { useState } from 'react';
import { FileText, Plus, User, Brain, Palette, Upload, Download, Home, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  currentStep: number;
  onNavigateToDashboard: () => void;
  onCreateNewResume: () => void;
  onOpenProfile: () => void;
  onGoToHome: () => void;
  showConfirmation: (options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
  }) => Promise<boolean>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentStep,
  onNavigateToDashboard,
  onCreateNewResume,
  onOpenProfile,
  onGoToHome,
  showConfirmation
}) => {
  const { user, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    const confirmed = await showConfirmation({
      title: 'Sign Out',
      message: 'Are you sure you want to sign out? Any unsaved changes will be lost.',
      confirmText: 'Sign Out',
      cancelText: 'Cancel',
      type: 'warning'
    });

    if (confirmed) {
      try {
        await signOut();
      } catch (error) {
        console.error('Sign out error:', error);
      }
    }
  };

  // Determine active states based on current step
  const isDashboardActive = currentStep === 0;
  const isCreateResumeActive = currentStep === 0.5 || currentStep === 1 || currentStep === 2;

  // Get step name for Create Resume
  const getCreateResumeStepName = () => {
    switch (currentStep) {
      case 0.5: return 'Upload & Parse';
      case 1: return 'Choose Template';
      case 2: return 'Customize & Export';
      default: return 'Generate new resume';
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">ResumeAI</h1>
            <p className="text-sm text-gray-500">LinkedIn Resume Generator</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-2 mb-8">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Navigation</h3>
          
          {/* Dashboard */}
          <button
            onClick={onNavigateToDashboard}
            className={`w-full text-left px-3 py-2 rounded-lg flex items-center transition-colors ${
              isDashboardActive
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className={`w-4 h-4 rounded mr-3 flex items-center justify-center ${
              isDashboardActive ? 'bg-blue-500' : 'bg-blue-100'
            }`}>
              <FileText className={`w-3 h-3 ${isDashboardActive ? 'text-white' : 'text-blue-600'}`} />
            </div>
            <div>
              <div className="font-medium text-sm">Dashboard</div>
              <div className={`text-xs ${isDashboardActive ? 'text-blue-600' : 'text-gray-500'}`}>
                Your resume drafts
              </div>
            </div>
          </button>

          {/* Create Resume */}
          <button
            onClick={onCreateNewResume}
            className={`w-full text-left px-3 py-2 rounded-lg flex items-center transition-colors ${
              isCreateResumeActive
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className={`w-4 h-4 rounded mr-3 flex items-center justify-center ${
              isCreateResumeActive ? 'bg-blue-500' : 'bg-blue-100'
            }`}>
              <Plus className={`w-3 h-3 ${isCreateResumeActive ? 'text-white' : 'text-blue-600'}`} />
            </div>
            <div>
              <div className="font-medium text-sm">Create Resume</div>
              <div className={`text-xs ${isCreateResumeActive ? 'text-blue-600' : 'text-gray-500'}`}>
                {getCreateResumeStepName()}
              </div>
            </div>
          </button>
        </div>

        {/* Features */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Features</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <Brain className="w-4 h-4 mr-2 text-green-600" />
              <span className="text-gray-700">AI-Powered Parsing</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <FileText className="w-4 h-4 mr-2 text-blue-600" />
              <span className="text-gray-700">6 Professional Templates</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <Palette className="w-4 h-4 mr-2 text-purple-600" />
              <span className="text-gray-700">Live Customization</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
              <Download className="w-4 h-4 mr-2 text-orange-600" />
              <span className="text-gray-700">PDF Export Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile at Bottom */}
      <div className="mt-auto p-6">
        <div className="relative">
          {/* Collapsible User Menu */}
          {showUserMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              <button
                onClick={onOpenProfile}
                className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 flex items-center text-sm font-medium transition-colors border-b border-gray-100"
              >
                <User className="w-4 h-4 mr-3 text-gray-500" />
                Profile Settings
              </button>
              
              <button
                onClick={onGoToHome}
                className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 flex items-center text-sm font-medium transition-colors border-b border-gray-100"
              >
                <Home className="w-4 h-4 mr-3 text-gray-500" />
                Start Over
              </button>
              
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 flex items-center text-sm font-medium transition-colors"
              >
                <LogOut className="w-4 h-4 mr-3 text-red-500" />
                Sign Out
              </button>
            </div>
          )}
          
          {/* User Profile Info - Clickable to toggle menu */}
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="font-medium text-sm text-gray-900 truncate">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {user?.email}
              </div>
            </div>
            <div className={`transform transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};