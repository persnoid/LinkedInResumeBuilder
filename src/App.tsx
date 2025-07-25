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
import { SupabaseDraftManager } from './utils/supabaseDraftManager';
import { ResumeData, Customizations } from '../types/resume';
import { useAuth } from './contexts/AuthContext';
import { DraftSavePrompt } from './components/DraftSavePrompt';
import { Sidebar } from './components/Sidebar';
import { FileText, ArrowLeft, Brain, Palette, Upload, User } from 'lucide-react';

const RESUME_CREATION_STEPS = ['Upload & Parse', 'Choose Template', 'Customize & Export'];

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
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const [showDraftSavePrompt, setShowDraftSavePrompt] = useState(false);
  const [draftSavePromptDefaultName, setDraftSavePromptDefaultName] = useState('');

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
      
      console.log('🏠 App - Loading user data from Supabase...');
      
      // Load user data - let SupabaseDraftManager handle all error cases
      const data = await SupabaseDraftManager.getResumeData(user);
      console.log('🏠 App - User data loaded successfully:', { hasData: !!data });
      setResumeData(data);
      
      setCurrentStep(0);
      setIsInitialized(true);
      
    } catch (error: any) {
      console.error('🏠 App - Failed to initialize user data (continuing anyway):', error);
      setResumeData(null);
      setCurrentStep(0);
      setIsInitialized(true);
      
      // More specific error messaging
      if (error.message?.includes('Authentication') || error.message?.includes('session')) {
        showToast('Please sign in again to access your saved data.', 'warning');
      } else if (error.message?.includes('Network') || error.message?.includes('fetch')) {
        showToast('Network issue detected. You can still create resumes.', 'info');
      } else {
        showToast('Welcome! Creating a fresh start for you.', 'info');
      }
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

    // Show landing page ONLY for non-authenticated users
    if (!user) {
      console.log('🏠 App - No user, showing landing page');
      return (
        <LandingPage 
          onGetStarted={handleGetStarted}
          onSignIn={handleSignIn}
        />
      );
    }

    // For authenticated users, ALWAYS show the sidebar with PageLayout
    const unifiedSidebar = (
      <Sidebar
        currentStep={currentStep}
        onNavigateToDashboard={() => setCurrentStep(0)}
        onCreateNewResume={handleCreateNewResume}
        onOpenProfile={() => setShowUserProfile(true)}
        onGoToHome={handleGoToHome}
        showConfirmation={showConfirmation}
      />
    );

    // Show loading while initializing user data (but WITH sidebar)
    if (!isInitialized) {
      return (
        <PageLayout 
          sidebarContent={unifiedSidebar}
          mainContent={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-lg text-gray-600">Loading your workspace...</p>
              </div>
            </div>
          }
        />
      );
    }

    // Show transitioning state (but WITH sidebar)
    if (isTransitioning) {
      return (
        <PageLayout 
          sidebarContent={unifiedSidebar}
          mainContent={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-lg text-gray-600">Loading your draft...</p>
              </div>
            </div>
          }
        />
      );
    }

    // Main app content with sidebar
    return (
      <PageLayout 
        sidebarContent={unifiedSidebar}
        mainContent={renderMainContent()}
      />
    );
  };

  const renderMainContent = () => {
    console.log('🏠 App - renderMainContent called for step:', currentStep);
    
    // Resume creation steps
    if (currentStep === 0.5 || currentStep === 1 || currentStep === 2) {
      const progressStep = currentStep === 0.5 ? 0 : currentStep === 1 ? 1 : 2;
      const stepTitles = {
        0.5: { title: 'Create New Resume', subtitle: 'Upload your LinkedIn profile' },
        1: { title: 'Choose Your Template', subtitle: 'Select from professionally designed layouts' },
        2: { title: 'Customize & Export', subtitle: 'Personalize your resume design' }
      };
      
      const currentStepInfo = stepTitles[currentStep as keyof typeof stepTitles];
      
      // Unified main content with progress bar
      return (
        <>
          {/* Header with back button */}
          <div className="bg-white border-b border-gray-200 px-8 py-6">
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={() => setCurrentStep(0)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{currentStepInfo.title}</h1>
                <p className="text-gray-600">{currentStepInfo.subtitle}</p>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <ProgressIndicator
              currentStep={progressStep}
              totalSteps={3}
              steps={RESUME_CREATION_STEPS}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {currentStep === 0.5 && (
              <LinkedInInput 
                onDataExtracted={handleLinkedInData}
                onBack={() => setCurrentStep(0)}
              />
            )}
            {currentStep === 1 && resumeData && (
              <TemplateSelector
                resumeData={resumeData}
                selectedTemplate={selectedTemplate}
                onTemplateSelect={setSelectedTemplate}
                onNext={() => setCurrentStep(2)}
                onBack={() => setCurrentStep(0)}
                onSaveDraft={handleSaveDraft}
                currentDraftId={currentDraftId}
              />
            )}
            {currentStep === 2 && resumeData && (
              <ResumeCustomizer
                resumeData={resumeData}
                selectedTemplate={selectedTemplate}
                customizations={customizations}
                onCustomizationsUpdate={setCustomizations}
                onResumeDataUpdate={setResumeData}
                onExport={handleExport}
                onBack={() => setCurrentStep(1)}
                onSaveDraft={handleSaveDraft}
                currentDraftId={currentDraftId}
              />
            )}
          </div>
        </>
      );
    }
    
    // Default case - Dashboard
    switch (currentStep) {
      case 0:
        return (
          <Dashboard 
            onCreateNew={() => {
              setResumeData(null);
              setCurrentDraftId(null);
              setCurrentStep(0.5); // Go directly to LinkedIn Input
            }}
            onEditResume={handleEditResumeWithId}
            onStartLinkedInInput={() => {
              setResumeData(null);
              setCurrentDraftId(null);
              setCurrentStep(0.5); // Use 0.5 as a special step for LinkedInInput
            }}
            onOpenProfile={() => setShowUserProfile(true)}
            onGoToHome={handleGoToHome}
            showConfirmation={showConfirmation}
          />
        );

      default:
        return (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to ResumeAI</h3>
              <p className="text-gray-500 mb-6">Ready to create your professional resume?</p>
              <button
                onClick={handleCreateNewResume}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center mx-auto font-medium transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Get Started
              </button>
            </div>
          </div>
        );
    }
  };

  const handleEditResume = (resumeData: ResumeData, template: string, customizations: any) => {
    setResumeData(resumeData);
    setSelectedTemplate(template);
    setCustomizations(customizations);
    setCurrentStep(1); // Go to template selector
  };

  const handleEditResumeWithId = (resumeData: ResumeData, template: string, customizations: any, draftId: string) => {
    setResumeData(resumeData);
    setSelectedTemplate(template);
    setCustomizations(customizations);
    setCurrentDraftId(draftId);
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
    setCurrentDraftId(null);
    setCurrentStep(0.5); // Go directly to LinkedIn Input
  };

  const handleSaveDraft = async () => {
    console.log('💾 App - handleSaveDraft called');
    
    if (!user) {
      showToast('You must be signed in to save drafts', 'error');
      return;
    }

    if (!resumeData) {
      showToast('No resume data to save', 'error');
      return;
    }

    // If we have an existing draft ID, update it directly
    if (currentDraftId) {
      try {
        await SupabaseDraftManager.saveDraft(
          'Updated Draft', // We'll use a generic name for updates
          resumeData,
          selectedTemplate,
          customizations,
          currentStep,
          currentDraftId,
          user
        );
        showToast('Draft updated successfully!', 'success');
      } catch (error) {
        console.error('Error updating draft:', error);
        showToast('Failed to update draft. Please try again.', 'error');
      }
    } else {
      // For new drafts, show the save prompt
      const defaultName = `${resumeData.personalInfo.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'} Resume`;
      setDraftSavePromptDefaultName(defaultName);
      setShowDraftSavePrompt(true);
    }
  };

  const handleSaveDraftPromptConfirm = async (draftName: string) => {
    console.log('💾 App - handleSaveDraftPromptConfirm called with name:', draftName);
    
    if (!user || !resumeData) {
      showToast('Unable to save draft', 'error');
      setShowDraftSavePrompt(false);
      return;
    }

    try {
      const savedDraftId = await SupabaseDraftManager.saveDraft(
        draftName,
        resumeData,
        selectedTemplate,
        customizations,
        currentStep,
        currentDraftId || undefined,
        user
      );
      
      setCurrentDraftId(savedDraftId);
      setShowDraftSavePrompt(false);
      showToast('Draft saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving draft:', error);
      showToast('Failed to save draft. Please try again.', 'error');
    }
  };

  const handleSaveDraftPromptCancel = () => {
    console.log('💾 App - handleSaveDraftPromptCancel called');
    setShowDraftSavePrompt(false);
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

        <DraftSavePrompt
          isOpen={showDraftSavePrompt}
          onSave={handleSaveDraftPromptConfirm}
          onSkip={handleSaveDraftPromptCancel}
          onCancel={handleSaveDraftPromptCancel}
          defaultName={draftSavePromptDefaultName}
        />
      </ProtectedRoute>
    </ErrorBoundary>
  );
};

export default App;