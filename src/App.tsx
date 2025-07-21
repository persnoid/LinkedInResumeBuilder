import React, { useState, useEffect } from 'react';
import { ProgressIndicator } from './components/ProgressIndicator';
import { LinkedInInput } from './components/LinkedInInput';
import { LandingPage } from './components/LandingPage';
import { AppHeader } from './components/AppHeader';
import { TemplateSelector } from './components/TemplateSelector';
import { ResumeCustomizer } from './components/ResumeCustomizer';
import { DraftManagerComponent } from './components/DraftManager';
import { DraftSavePrompt } from './components/DraftSavePrompt';
import { UserProfilePage } from './pages/UserProfilePage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthModal } from './components/AuthModal';
import { ToastNotification, useToast } from './components/ToastNotification';
import { ConfirmationDialog } from './components/ConfirmationDialog';
import { useConfirmation } from './hooks/useConfirmation';
import { exportToPDF, exportToWord } from './utils/exportUtils';
import { SupabaseDraftManager } from './utils/supabaseDraftManager';
import { ResumeData, DraftResume, Customizations } from './types/resume';
import { useAuth } from './contexts/AuthContext';

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
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const [showDraftManager, setShowDraftManager] = useState(false);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
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
    console.log('🏠 App - Auth state changed:', { hasUser: !!user, userEmail: user?.email });
    
    if (user) {
      // User is authenticated
      console.log('🏠 App - User authenticated, initializing app');
      // CRITICAL FIX: Only hide landing page if we're not already initialized
      if (showLandingPage) {
        console.log('🏠 App - Hiding landing page for authenticated user');
        setShowLandingPage(false);
      }
      setShowAuthModal(false);
      
      // Load user data only once
      if (!isInitialized) {
        console.log('🏠 App - Loading user data...');
        initializeData();
      }
    } else {
      // No user - show landing page
      console.log('🏠 App - No user, showing landing page');
      // CRITICAL FIX: Only show landing page if not already showing it
      if (!showLandingPage) {
        console.log('🏠 App - Showing landing page for unauthenticated user');
        setShowLandingPage(true);
      }
      setShowAuthModal(false);
      setIsInitialized(false);
      setResumeData(null);
      setCurrentDraftId(null);
      setCurrentStep(0);
    }
  }, [user, isInitialized]);

  const initializeData = async () => {
    try {
      console.log('🏠 App - initializeData called with user:', !!user, user?.email);
      if (!user) {
        console.log('🏠 App - No user available for data initialization');
        return;
      }
      
      console.log('🏠 App - Loading user data from Supabase...');
      const data = await SupabaseDraftManager.getResumeData(user);
      const recentDrafts = await SupabaseDraftManager.getRecentDrafts(1, user);
      
      console.log('🏠 App - User data loaded successfully:', { hasData: !!data, draftsCount: recentDrafts.length });
      
      setResumeData(data);
      setCurrentDraftId(null);
      
      // Always start at LinkedInInput for authenticated users
      setCurrentStep(0);
      setIsInitialized(true);
      
    } catch (error: any) {
      console.error('🏠 App - Failed to initialize user data:', error);
      setCurrentStep(0);
      setIsInitialized(true);
    }
  };

  const loadDraftData = async (draft: DraftResume) => {
    setIsTransitioning(true);
    setResumeData(draft.resumeData);
    setSelectedTemplate(draft.selectedTemplate);
    setCustomizations(draft.customizations);
    setCurrentDraftId(draft.id);
    setShowDraftManager(false);

    let step = draft.step;
    if (step === 0 && draft.resumeData) step = 1;
    step = Math.min(Math.max(step, 0), 2);

    await new Promise(r => setTimeout(r, 300));
    setCurrentStep(step);
    await new Promise(r => setTimeout(r, 200));

    setIsTransitioning(false);
    showToast('Draft loaded!', 'success');
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
    setCurrentDraftId(null);
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
      setCurrentDraftId(null);
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

    const showHeader = user && !isTransitioning;

    return (
      <>
        {showHeader && (
          <AppHeader
            onOpenProfile={() => setShowUserProfile(true)}
            onOpenDraftManager={() => setShowDraftManager(true)}
            onGoToHome={handleGoToHome}
            currentStep={currentStep}
            showConfirmation={showConfirmation}
          />
        )}
        {renderMainContent()}
      </>
    );
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
          <LinkedInInput 
            onDataExtracted={handleLinkedInData} 
            onOpenDraftManager={() => setShowDraftManager(true)} 
            existingResumeData={resumeData}
            onContinueWithExisting={handleContinueWithExistingData}
            existingResumeData={resumeData}
            onContinueWithExisting={handleContinueWithExistingData}
          />
        );
      case 1:
        return resumeData && (
          <TemplateSelector
            resumeData={resumeData}
            selectedTemplate={selectedTemplate}
            onTemplateSelect={setSelectedTemplate}
            onNext={() => setCurrentStep(2)}
            onBack={() => setCurrentStep(0)}
            onSaveDraft={() => {}}
            currentDraftId={currentDraftId}
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
            onSaveDraft={() => {}}
            currentDraftId={currentDraftId}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <ProtectedRoute allowUnauthenticated={showLandingPage}>
        {!showLandingPage && !isTransitioning && currentStep > 0 && (
          <ProgressIndicator
            currentStep={currentStep}
            totalSteps={STEPS.length}
            steps={STEPS}
            onOpenDraftManager={() => setShowDraftManager(true)}
            currentDraftId={currentDraftId}
          />
        )}
        {renderStep()}

        <AuthModal
          isOpen={showAuthModal}
          onClose={handleAuthModalClose}
          initialMode={authModalMode}
        />

        <UserProfilePage isOpen={showUserProfile} onClose={() => setShowUserProfile(false)} showConfirmation={showConfirmation} />

        <DraftManagerComponent
          isOpen={showDraftManager}
          onClose={() => setShowDraftManager(false)}
          onLoadDraft={loadDraftData}
          currentResumeData={resumeData}
          currentTemplate={selectedTemplate}
          currentCustomizations={customizations}
          currentStep={currentStep}
          currentDraftId={currentDraftId}
          showToast={showToast}
          showConfirmation={showConfirmation}
        />

        <DraftSavePrompt isOpen={showSavePrompt} onSave={() => {}} onCancel={() => setShowSavePrompt(false)} />

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
