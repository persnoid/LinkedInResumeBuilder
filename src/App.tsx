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

  const { toast, showToast, hideToast } = useToast();
  const { confirmation, showConfirmation } = useConfirmation();
  const { user } = useAuth();

  // Hide landing page when user is authenticated
  React.useEffect(() => {
    if (user) {
      setShowLandingPage(false);
    }
  }, [user]);

  // Load primary resume data on user change
  useEffect(() => {
    const init = async () => {
      if (user) {
        try {
          const data = await SupabaseDraftManager.getResumeData(user);
          setResumeData(data);
          setCurrentDraftId(null);
        } catch {
          showToast('Failed to load data.', 'error');
        }
      } else {
        setResumeData(null);
        setCurrentDraftId(null);
      }
    };
    init();
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
      setShowLandingPage(false);
      setCurrentStep(0);
    } else {
      setAuthModalMode('signup');
      setShowAuthModal(true);
    }
  };

  const handleSignIn = () => {
    setAuthModalMode('signin');
    setShowAuthModal(true);
  };

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
    // If user just signed up/in, hide landing page
    if (user) {
      setShowLandingPage(false);
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
    // Show landing page for non-authenticated users or when explicitly requested
    if (showLandingPage && !user) {
      return (
        <LandingPage 
          onGetStarted={handleGetStarted}
          onSignIn={handleSignIn}
        />
      );
    }

    if (isTransitioning) {
      return <div className="flex items-center justify-center h-full">Loading...</div>;
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
