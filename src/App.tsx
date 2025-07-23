import React, { useState, useEffect } from 'react';
import { ProgressIndicator } from './components/ProgressIndicator';
import { LinkedInInput } from './components/LinkedInInput';
import { PageLayout } from './components/PageLayout';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './components/LandingPage';
import { AppHeader } from './components/AppHeader';
import { TemplateSelector } from './components/TemplateSelector';
import { ResumeCustomizer } from './components/ResumeCustomizer';
import { UserProfilePage } from './pages/UserProfilePage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthModal } from './components/AuthModal';
import { ToastNotification, useToast } from './components/ToastNotification';
import { ConfirmationDialog } from './components/ConfirmationDialog';
import { useConfirmation } from './hooks/useConfirmation';
import { exportToPDF, exportToWord } from './utils/exportUtils';
import { ResumeData, Customizations } from '../types/resume';
import { useAuth } from './contexts/AuthContext';
import { FileText, ArrowLeft, Brain, Palette, Upload, User } from 'lucide-react';

class ErrorBoundary extends React.Component<{}, { hasError: boolean }> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <p className="mb-4">Please refresh the page and try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg"
            >
              Refresh
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const App: React.FC = () => {
  const STEPS = ['LinkedIn Input', 'Choose Template', 'Customize & Export'];

  const [currentStep, setCurrentStep] = useState(0);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('azurill');
  const [customizations, setCustomizations] = useState<Customizations>({
    colors: { primary: '#1f2937', secondary: '#6b7280', accent: '#3b82f6' },
    typography: { fontFamily: 'Inter, sans-serif' },
    spacing: {},
    sections: {}
  });
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [showLandingPage, setShowLandingPage] = useState(true); // Always start with landing page
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const { toast, showToast, hideToast } = useToast();
  const { confirmation, showConfirmation } = useConfirmation();
  const { user } = useAuth();

  // SINGLE useEffect to handle all authentication and initialization
  useEffect(() => {
    console.log('🏠 App - Auth state changed:', { 
      hasUser: !!user, 
      userEmail: user?.email,
      isInitialized,
      showLandingPage 
    });
    
    if (user) {
      // User is authenticated
      console.log('🏠 App - User authenticated, initializing app');
      console.log('🏠 App - Hiding landing page for authenticated user');
      setShowLandingPage(false);
      setShowAuthModal(false);
      
      // Load user data only once
      if (!isInitialized) {
        console.log('🏠 App - Loading user data...');
        initializeData();
      } else {
        console.log('🏠 App - User data already initialized, skipping reload');
      }
    } else {
      // No user - show landing page
      console.log('🏠 App - No user, showing landing page and resetting state');
      
      // IMMEDIATE state reset to prevent inconsistent states
      setShowLandingPage(true);
      setShowAuthModal(false);
      setIsInitialized(false);
      setResumeData(null);
      setCurrentStep(0);
      setCustomizations({
        colors: { primary: '#1f2937', secondary: '#6b7280', accent: '#3b82f6' },
        typography: { fontFamily: 'Inter, sans-serif' },
        spacing: {},
        sections: {}
      });
      setIsTransitioning(false);
      
      console.log('🏠 App - All state reset immediately, showing landing page');
    }
  }, [user]); // Remove isInitialized dependency to prevent loops

  const initializeData = async () => {
    try {
      console.log('🏠 App - initializeData called with user:', !!user, user?.email);
      if (!user) {
        console.log('🏠 App - No user available for data initialization');
        return;
      }
      
      console.log('🏠 App - Loading user data from Supabase with timeout protection...');
      
      // Add timeout protection to prevent initialization from hanging
      const INIT_TIMEOUT = 10000; // 10 seconds timeout for initialization
      
      const initPromise = (async () => {
        const data = await SupabaseDraftManager.getResumeData(user);
        return { data };
      })();
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Initialization timeout - continuing with default state')), INIT_TIMEOUT)
      );
      
      try {
        const { data } = await Promise.race([initPromise, timeoutPromise]) as any;
        console.log('🏠 App - User data loaded successfully:', { hasData: !!data });
        setResumeData(data);
      } catch (timeoutError) {
        console.warn('🏠 App - Initialization timed out, continuing with default state:', timeoutError);
        setResumeData(null);
        showToast('Welcome! Some features may load slowly due to network conditions.', 'info', 5000);
      }
      
      setCurrentStep(0);
      setIsInitialized(true);
      
    } catch (error: any) {
      console.error('🏠 App - Failed to initialize user data (continuing anyway):', error);
      setResumeData(null);
      setCurrentStep(0);
      setIsInitialized(true);
      showToast('Welcome! Some data could not be loaded, but you can still create resumes.', 'warning', 5000);
    }
  };

  const handleGetStarted = () => {
    if (user) {
      console.log('🏠 App - User already authenticated, going to app');
      setShowLandingPage(false);
      setCurrentStep(0);
    } else {
      console.log('🏠 App - No user, showing signup modal');
      setAuthModalMode('signup');
      setShowAuthModal(true);
    }
  };

  const handleSignIn = () => {
    console.log('🏠 App - Opening signin modal');
    setAuthModalMode('signin');
    setShowAuthModal(true);
  };

  const handleAuthModalClose = () => {
    console.log('🏠 App - Auth modal closing, user:', !!user);
    setShowAuthModal(false);
    
    // CRITICAL FIX: Don't change showLandingPage here - let useEffect handle it based on user state
    // The user state is the single source of truth for whether to show landing page or main app
  };

  const handleLinkedInData = (data: ResumeData) => {
    setResumeData(data);
    setCurrentStep(1);
  };

  const handleGoToHome = async () => {
    const confirmed = await showConfirmation({
      title: 'Start Over',
      message: 'Are you sure you want to start over? Any unsaved changes will be lost.',
      confirmText: 'Start Over',
      cancelText: 'Cancel',
      type: 'warning'
    });

    if (confirmed) {
      setCurrentStep(0);
      setResumeData(null);
      setCustomizations({
        colors: { primary: '#1f2937', secondary: '#6b7280', accent: '#3b82f6' },
        typography: { fontFamily: 'Inter, sans-serif' },
        spacing: {},
        sections: {}
      });
    }
  };

  const handleExport = async (format: 'pdf' | 'docx') => {
    if (!resumeData) return;
    try {
      if (format === 'pdf') {
        await exportToPDF('resume-preview', `${resumeData.personalInfo.name}_Resume.pdf`);
      } else {
        await exportToWord(resumeData, `${resumeData.personalInfo.name}_Resume.docx`);
      }
      showToast('Export successful!', 'success');
    } catch {
      showToast('Export failed.', 'error');
    }
  };

  const handleContinueWithExistingData = () => {
    if (resumeData) {
      console.log('🏠 App - Continue with existing data, moving to template selection');
      setCurrentStep(1);
    }
  };

  const renderStep = () => {
    console.log('🏠 App - renderStep called:', {
      showLandingPage,
      hasUser: !!user,
      currentStep,
      isTransitioning,
      isInitialized
    });

    // Show landing page for non-authenticated users only
    if (!user) {
      return (
        <LandingPage 
          onGetStarted={handleGetStarted}
          onSignIn={handleSignIn}
        />
      );
    }

    // Show loading while initializing user data
    if (!isInitialized) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
            <p className="text-lg">Loading your workspace...</p>
          </div>
        </div>
      );
    }

    // Ensure user is authenticated before showing main app
    if (!user) {
      return null;
    }


    return (
      <>
        {renderMainContent()}
      </>
    );
  };

  const handleEditResume = (resumeData: ResumeData, template: string, customizations: any) => {
    setResumeData(resumeData);
    setSelectedTemplate(template);
    setCustomizations(customizations);
    setCurrentStep(1); // Go to template selector
  };

  const handleCreateNewResume = () => {
    setResumeData(null);
    setSelectedTemplate('azurill');
    setCustomizations({
      colors: { primary: '#1f2937', secondary: '#6b7280', accent: '#3b82f6' },
      typography: { fontFamily: 'Inter, sans-serif' },
      spacing: {},
      sections: {}
    });
    setCurrentStep(0.5); // Go directly to LinkedIn Input
  };

  const renderMainContent = () => {
    if (isTransitioning) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading your draft...</p>
          </div>
        </div>
      );
    }
    
    switch (currentStep) {
      case 0:
        return (
          <Dashboard 
            onCreateNew={() => {
              setResumeData(null);
              setCurrentStep(0.5); // Go directly to LinkedInInput
            }}
            onEditResume={handleEditResume}
            onStartLinkedInInput={() => {
              setResumeData(null);
              setCurrentStep(0.5); // Use 0.5 as a special step for LinkedInInput
            }}
            onOpenProfile={() => setShowUserProfile(true)}
            onGoToHome={handleGoToHome}
            showConfirmation={showConfirmation}
          />
        );
      case 0.5:
        // LinkedIn Input with unified layout
        const linkedInSidebar = (
          <>
            {/* Logo */}
            <div className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">ResumeAI</h1>
                  <p className="text-xs text-gray-500">LinkedIn Resume Generator</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="px-6 mb-8">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">NAVIGATION</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setCurrentStep(0)}
                  className="w-full text-left text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-lg flex items-center transition-colors"
                >
                  <div className="w-4 h-4 bg-blue-100 rounded mr-3 flex items-center justify-center">
                    <span className="text-xs text-blue-600">📊</span>
                  </div>
                  <div>
                    <div className="font-medium text-sm">Dashboard</div>
                    <div className="text-xs text-gray-500">Your resume drafts</div>
                  </div>
                </button>
                
                <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded mr-3 flex items-center justify-center">
                    <span className="text-xs text-white">✨</span>
                  </div>
                  <div>
                    <div className="font-medium text-sm">Create Resume</div>
                    <div className="text-xs text-blue-600">Generate new resume</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="px-6 flex-1">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">FEATURES</h3>
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
                  <Upload className="w-4 h-4 mr-2 text-orange-600" />
                  <span className="text-gray-700">PDF Export Ready</span>
                </div>
              </div>
            </div>

            {/* User Profile */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-900 truncate">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </div>
                </div>
              </div>
            </div>
          </>
        );

        const linkedInMain = (
          <>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentStep(0)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Create New Resume</h1>
                  <p className="text-gray-600">Upload your LinkedIn profile</p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <LinkedInInput 
                onDataExtracted={handleLinkedInData}
                onBack={() => setCurrentStep(0)}
              />
            </div>
          </>
        );

        return (
          <PageLayout 
            sidebarContent={linkedInSidebar}
            mainContent={linkedInMain}
          />
        );
      case 1:
        if (!resumeData) return null;
        
        // Template Selector with unified layout
        const templateSidebar = (
          <>
            {/* Logo */}
            <div className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">ResumeAI</h1>
                  <p className="text-xs text-gray-500">LinkedIn Resume Generator</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="px-6 mb-8">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">NAVIGATION</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setCurrentStep(0)}
                  className="w-full text-left text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-lg flex items-center transition-colors"
                >
                  <div className="w-4 h-4 bg-blue-100 rounded mr-3 flex items-center justify-center">
                    <span className="text-xs text-blue-600">📊</span>
                  </div>
                  <div>
                    <div className="font-medium text-sm">Dashboard</div>
                    <div className="text-xs text-gray-500">Your resume drafts</div>
                  </div>
                </button>
                
                <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded mr-3 flex items-center justify-center">
                    <span className="text-xs text-white">🎨</span>
                  </div>
                  <div>
                    <div className="font-medium text-sm">Choose Template</div>
                    <div className="text-xs text-blue-600">Select your design</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="px-6 flex-1">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">FEATURES</h3>
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
                  <Upload className="w-4 h-4 mr-2 text-orange-600" />
                  <span className="text-gray-700">PDF Export Ready</span>
                </div>
              </div>
            </div>

            {/* User Profile */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {resumeData.personalInfo.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-900 truncate">
                    {resumeData.personalInfo.name || 'User'}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {resumeData.personalInfo.email || 'user@example.com'}
                  </div>
                </div>
              </div>
            </div>
          </>
        );

        const templateMain = (
          <>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentStep(0)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Choose Your Template</h1>
                  <p className="text-gray-600">Select from professionally designed layouts</p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <TemplateSelector
                resumeData={resumeData}
                selectedTemplate={selectedTemplate}
                onTemplateSelect={setSelectedTemplate}
                onNext={() => setCurrentStep(2)}
                onBack={() => setCurrentStep(0)}
              />
            </div>
          </>
        );

        return (
          <PageLayout 
            sidebarContent={templateSidebar}
            mainContent={templateMain}
          />
        );
      case 2:
        return resumeData && (
          <ResumeCustomizer
            resumeData={resumeData}
            selectedTemplate={selectedTemplate}
            customizations={customizations}
            onCustomizationsUpdate={setCustomizations}
            onResumeDataUpdate={setResumeData}
            onExport={handleExport}
            onBack={() => setCurrentStep(1)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <ProtectedRoute allowUnauthenticated={showLandingPage}>
        {renderStep()}

        <AuthModal
          isOpen={showAuthModal}
          onClose={handleAuthModalClose}
          initialMode={authModalMode}
        />

        <UserProfilePage isOpen={showUserProfile} onClose={() => setShowUserProfile(false)} showConfirmation={showConfirmation} />

        <ToastNotification toast={toast} onClose={hideToast} />
        <ConfirmationDialog
          isOpen={confirmation.isOpen}
          title={confirmation.title}
          message={confirmation.message}
          confirmText={confirmation.confirmText}
          cancelText={confirmation.cancelText}
          onConfirm={confirmation.onConfirm}
          onCancel={confirmation.onCancel}
        />
      </ProtectedRoute>
    </ErrorBoundary>
  );
};

export default App;
