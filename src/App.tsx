import React, { useState, useEffect } from 'react';
import { ProgressIndicator } from './components/ProgressIndicator';
import { LinkedInInput } from './components/LinkedInInput';
import { LandingPage } from './components/LandingPage';
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
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const { toast, showToast, hideToast } = useToast();
  const { confirmation, showConfirmation } = useConfirmation();
  const { user } = useAuth();

  // Handle authentication state changes
  React.useEffect(() => {
    if (user) {
      console.log('🏠 App - User authenticated, hiding landing page:', user.email);
      setShowLandingPage(false);
      setIsAuthenticating(false);
      
      // If user just signed in, transition to main app
      if (showAuthModal) {
        setShowAuthModal(false);
        // Small delay to ensure smooth transition
        setTimeout(() => {
          setCurrentStep(0); // Start at LinkedIn Input step
        }, 100);
      }
    } else {
      console.log('🏠 App - No user, showing landing page');
      setShowLandingPage(true);
      setIsAuthenticating(false);
    }
  }, [user]);

  // Load primary resume data on user change
  useEffect(() => {
    const initializeData = async () => {
      console.log('🏠 App - initializeData called with user:', !!user, user?.email);
      if (user) {
        try {
          console.log('🏠 App - Loading user data from Supabase...');
          const data = await SupabaseDraftManager.getResumeData(user);
          console.log('🏠 App - User data loaded successfully:', !!data);
          setResumeData(data);
          setCurrentDraftId(null);
        } catch (error: any) {
          console.error('🏠 App - Failed to load user data:', error);
          // Don't show error toast immediately - user might not be fully authenticated yet
          // Just log the error and continue
        }
      } else {
        console.log('🏠 App - No user, clearing data');
        setResumeData(null);
        setCurrentDraftId(null);
      }
    };
    
    // Add a small delay to ensure auth context is fully initialized
    const timer = setTimeout(initializeData, 500);
    return () => clearTimeout(timer);
  }, [user]);

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
      setIsAuthenticating(true);
      setAuthModalMode('signup');
      setShowAuthModal(true);
    }
  };

  const handleSignIn = () => {
    console.log('🏠 App - Opening signin modal');
    setIsAuthenticating(true);
    setAuthModalMode('signin');
    setShowAuthModal(true);
  };

  const handleAuthModalClose = () => {
    console.log('🏠 App - Auth modal closing, user:', !!user);
    setShowAuthModal(false);
    setIsAuthenticating(false);
    
    // If user is authenticated after modal closes, transition to app
    if (user) {
      console.log('🏠 App - User authenticated after modal close, transitioning to app');
      setShowLandingPage(false);
      setCurrentStep(0);
    } else {
      console.log('🏠 App - No user after modal close, staying on landing page');
      setShowLandingPage(true);
    }
  };

  const handleLinkedInData = (data: ResumeData) => {
    setResumeData(data);
    setCurrentDraftId(null);
    setCurrentStep(1);
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

  const renderStep = () => {
    console.log('🏠 App - renderStep called:', {
      showLandingPage,
      hasUser: !!user,
      currentStep,
      isTransitioning,
      isAuthenticating
    });

    // Show landing page for non-authenticated users
    if (showLandingPage || (!user && !isAuthenticating)) {
      return (
        <LandingPage 
          onGetStarted={handleGetStarted}
          onSignIn={handleSignIn}
        />
      );
    }

    // Show loading during authentication
    if (isAuthenticating && !user) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
            <p className="text-lg">Signing you in...</p>
          </div>
        </div>
      );
    }

    // Ensure user is authenticated before showing main app
    if (!user) {
      console.log('🏠 App - No user but not on landing page, redirecting to landing');
      setShowLandingPage(true);
      return null;
    }

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
        return <LinkedInInput onDataExtracted={handleLinkedInData} onOpenDraftManager={() => setShowDraftManager(true)} />;
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
        {!showLandingPage && (
          currentStep > 0 && !isTransitioning && (
          <ProgressIndicator
            currentStep={currentStep}
            totalSteps={STEPS.length}
            steps={STEPS}
            onOpenDraftManager={() => setShowDraftManager(true)}
            currentDraftId={currentDraftId}
          />
          )
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
