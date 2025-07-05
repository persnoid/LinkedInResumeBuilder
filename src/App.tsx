import React, { useState, useEffect } from 'react';
import { ProgressIndicator } from './components/ProgressIndicator';
import { LinkedInInput } from './components/LinkedInInput';
import { TemplateSelector } from './components/TemplateSelector';
import { ResumeCustomizer } from './components/ResumeCustomizer';
import { DraftManagerComponent } from './components/DraftManager';
import { DraftSavePrompt } from './components/DraftSavePrompt';
import { UserProfilePage } from './pages/UserProfilePage';
import { ToastNotification, useToast } from './components/ToastNotification';
import { ConfirmationDialog } from './components/ConfirmationDialog';
import { useConfirmation } from './hooks/useConfirmation';
import { sampleResumeData } from './data/sampleData';
import { exportToPDF, exportToWord } from './utils/exportUtils';
import { DraftManager } from './utils/draftManager';
import { ResumeData, DraftResume, Customizations } from './types/resume';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">
              We encountered an unexpected error. Please refresh the page to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const STEPS = [
    'LinkedIn Input',
    'Choose Template',
    'Customize & Export'
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('azurill');
  const [customizations, setCustomizations] = useState<Customizations>({
    colors: { primary: '#1f2937', secondary: '#6b7280', accent: '#3b82f6' },
    typography: { fontFamily: 'Inter, sans-serif' },
    spacing: {},
    sections: {}
  });
  const [linkedinData, setLinkedinData] = useState(null);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const [showDraftManager, setShowDraftManager] = useState(false);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Toast notification hook
  const { toast, showToast, hideToast } = useToast();

  // Confirmation dialog hook
  const { confirmation, showConfirmation } = useConfirmation();

  // Load current draft on app start
  useEffect(() => {
    const draftId = DraftManager.getCurrentDraftId();
    if (draftId) {
      const draft = DraftManager.getDraft(draftId);
      if (draft) {
        loadDraftData(draft);
      }
    }
  }, []);

  const loadDraftData = async (draft: DraftResume) => {
    try {
      console.log('Loading draft data in App:', draft);
      setIsTransitioning(true);
      
      // Validate and set resume data
      if (draft.resumeData) {
        setResumeData(draft.resumeData);
        console.log('Resume data set:', draft.resumeData);
      }
      
      // Set template
      if (draft.selectedTemplate) {
        setSelectedTemplate(draft.selectedTemplate);
        console.log('Template set:', draft.selectedTemplate);
      }
      
      // Set customizations
      if (draft.customizations) {
        setCustomizations(draft.customizations);
        console.log('Customizations set:', draft.customizations);
      }
      
      // Set current draft ID
      setCurrentDraftId(draft.id);
      
      // Update current draft in storage
      DraftManager.saveDraft(
        draft.name,
        draft.resumeData,
        draft.selectedTemplate,
        draft.customizations,
        draft.step,
        draft.id
      );
      
      // Close draft manager
      setShowDraftManager(false);
      
      // Determine the next step based on draft progress
      let nextStep = draft.step;
      
      // If we're on step 0 (LinkedIn Input) and have data, move to step 1 (Template Selection)
      if (nextStep === 0 && draft.resumeData) {
        nextStep = 1;
      }
      
      // Ensure step is within valid range
      nextStep = Math.max(0, Math.min(2, nextStep));
      
      console.log('Transitioning to step:', nextStep);
      
      // Add a small delay to ensure all state updates are processed
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Set the step and show transition
      setCurrentStep(nextStep);
      
      // Add another small delay for smooth transition
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setIsTransitioning(false);
      
      console.log('Draft loaded and transitioned successfully:', {
        step: nextStep,
        template: draft.selectedTemplate,
        hasData: !!draft.resumeData,
        draftId: draft.id
      });
      
      // Show success toast instead of alert
      showToast('Draft loaded successfully! Transitioning to your work...', 'success', 3000);
      
    } catch (error) {
      console.error('Error loading draft data:', error);
      setIsTransitioning(false);
      showToast('Failed to load draft. Please try again.', 'error');
    }
  };

  const handleLinkedInData = (data: ResumeData) => {
    setLinkedinData(data);
    setResumeData(data);
    setCurrentDraftId(null); // Clear current draft when new data is loaded
    DraftManager.clearCurrentDraft();
    
    // Automatically move to template selection after data is parsed
    setCurrentStep(1);
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleResumeDataUpdate = (updatedData: ResumeData) => {
    console.log('App - Resume data updated:', updatedData);
    setResumeData(updatedData);
  };

  const handleCustomizationsUpdate = (newCustomizations: Customizations) => {
    console.log('Updating customizations:', newCustomizations);
    setCustomizations(newCustomizations);
  };

  const handleExport = async (format: 'pdf' | 'docx') => {
    if (!resumeData) return;
    
    try {
      if (format === 'pdf') {
        await exportToPDF('resume-preview', `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`);
        showToast('PDF exported successfully!', 'success');
      } else {
        await exportToWord(resumeData, `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.docx`);
        showToast('Word document exported successfully!', 'success');
      }
    } catch (error) {
      console.error('Export failed:', error);
      showToast('Export failed. Please try again.', 'error');
    }
  };

  const saveDraft = (name: string) => {
    if (!resumeData) return;

    try {
      const draftId = DraftManager.saveDraft(
        name,
        resumeData,
        selectedTemplate,
        customizations,
        currentStep,
        currentDraftId
      );

      setCurrentDraftId(draftId);
      setShowSavePrompt(false);
      
      console.log('Draft saved with ID:', draftId);
      showToast('Draft saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving draft:', error);
      showToast('Failed to save draft. Please try again.', 'error');
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      // Show save prompt when moving from template selection step
      if (currentStep === 1 && resumeData && !currentDraftId) {
        setShowSavePrompt(true);
        return;
      }
      
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      
      // Auto-save if we have a current draft
      if (currentDraftId && resumeData) {
        const draft = DraftManager.getDraft(currentDraftId);
        if (draft) {
          DraftManager.saveDraft(
            draft.name,
            resumeData,
            selectedTemplate,
            customizations,
            newStep,
            currentDraftId
          );
        }
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      
      // Auto-save if we have a current draft
      if (currentDraftId && resumeData) {
        const draft = DraftManager.getDraft(currentDraftId);
        if (draft) {
          DraftManager.saveDraft(
            draft.name,
            resumeData,
            selectedTemplate,
            customizations,
            newStep,
            currentDraftId
          );
        }
      }
    }
  };

  const handleSavePromptSave = (name: string) => {
    saveDraft(name);
    setCurrentStep(currentStep + 1);
  };

  const handleSavePromptSkip = () => {
    setShowSavePrompt(false);
    setCurrentStep(currentStep + 1);
  };

  const renderCurrentStep = () => {
    console.log('Rendering step:', currentStep, 'Has data:', !!resumeData, 'Is transitioning:', isTransitioning);
    
    // Show loading state during transition
    if (isTransitioning) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your draft...</p>
          </div>
        </div>
      );
    }
    
    switch (currentStep) {
      case 0:
        return (
          <ErrorBoundary>
            <LinkedInInput
              onDataExtracted={handleLinkedInData}
              onNext={nextStep}
              onOpenDraftManager={() => setShowDraftManager(true)}
            />
          </ErrorBoundary>
        );
      case 1:
        return resumeData ? (
          <ErrorBoundary>
            <TemplateSelector
              resumeData={resumeData}
              selectedTemplate={selectedTemplate}
              onTemplateSelect={handleTemplateSelect}
              onNext={nextStep}
              onBack={prevStep}
              onSaveDraft={() => setShowSavePrompt(true)}
              currentDraftId={currentDraftId}
            />
          </ErrorBoundary>
        ) : (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your data...</p>
            </div>
          </div>
        );
      case 2:
        return resumeData ? (
          <ErrorBoundary>
            <ResumeCustomizer
              resumeData={resumeData}
              selectedTemplate={selectedTemplate}
              customizations={customizations}
              onCustomizationsUpdate={handleCustomizationsUpdate}
              onResumeDataUpdate={handleResumeDataUpdate}
              onExport={handleExport}
              onBack={prevStep}
              onSaveDraft={() => setShowSavePrompt(true)}
              currentDraftId={currentDraftId}
            />
          </ErrorBoundary>
        ) : (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Loading resume data...</p>
            </div>
          </div>
        );
      default:
        return <div>Step not found</div>;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {currentStep > 0 && !isTransitioning && (
          <ProgressIndicator
            currentStep={currentStep}
            totalSteps={STEPS.length}
            steps={STEPS}
            onOpenDraftManager={() => setShowDraftManager(true)}
            currentDraftId={currentDraftId}
          />
        )}
        
        {renderCurrentStep()}

        {/* User Profile Button - Fixed position */}
        {!showUserProfile && (
          <button
            onClick={() => setShowUserProfile(true)}
            className="fixed top-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl z-40"
            title="User Profile"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        )}

        {/* User Profile Modal */}
        <UserProfilePage
          isOpen={showUserProfile}
          onClose={() => setShowUserProfile(false)}
          showConfirmation={showConfirmation}
        />

        {/* Draft Manager Modal */}
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

        {/* Save Draft Prompt */}
        <DraftSavePrompt
          isOpen={showSavePrompt}
          onSave={handleSavePromptSave}
          onSkip={handleSavePromptSkip}
          onCancel={() => setShowSavePrompt(false)}
          defaultName={resumeData?.personalInfo.name ? `${resumeData.personalInfo.name} Resume` : ''}
        />

        {/* Toast Notification */}
        <ToastNotification
          toast={toast}
          onClose={hideToast}
        />

        {/* Unified Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={confirmation.isOpen}
          title={confirmation.title}
          message={confirmation.message}
          confirmText={confirmation.confirmText}
          cancelText={confirmation.cancelText}
          type={confirmation.type}
          onConfirm={confirmation.onConfirm}
          onCancel={confirmation.onCancel}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;