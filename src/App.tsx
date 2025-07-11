import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { ProgressIndicator } from './components/ProgressIndicator';
import { LinkedInInput } from './components/LinkedInInput';
import { TemplateSelector } from './components/TemplateSelector';
import { ResumeCustomizer } from './components/ResumeCustomizer';
import { DraftManagerComponent } from './components/DraftManager';
import { DraftSavePrompt } from './components/DraftSavePrompt';
import { UserProfilePage } from './pages/UserProfilePage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ToastNotification, useToast } from './components/ToastNotification';
import { ConfirmationDialog } from './components/ConfirmationDialog';
import { useConfirmation } from './hooks/useConfirmation';
import { exportToPDF, exportToWord } from './utils/exportUtils';
import { SupabaseDraftManager } from './utils/supabaseDraftManager';
import { ResumeData, DraftResume, Customizations } from './types/resume';
import { useRequireAuth } from './contexts/AuthContext';

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
  const [linkedinData, setLinkedinData] = useState<ResumeData | null>(null);
  const [currentDraftId, setCurrentDraftId] = useState<string | null | undefined>(undefined);
  const [showDraftManager, setShowDraftManager] = useState(false);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  console.log('🏠 App RENDER - Current state:', {
    currentStep,
    hasResumeData: !!resumeData,
    selectedTemplate,
    currentDraftId,
    isTransitioning,
    timestamp: new Date().toISOString()
  });

  // Toast notification hook
  const { toast, showToast, hideToast } = useToast();

  // Confirmation dialog hook
  const { confirmation, showConfirmation } = useConfirmation();

  // Authentication state - Use more robust useRequireAuth hook
  const { user, loading: authCheckLoading, isAuthenticated } = useRequireAuth();

  console.log('🏠 App - Authentication state:', {
    hasUser: !!user,
    userEmail: user?.email,
    authCheckLoading,
    isAuthenticated,
    timestamp: new Date().toISOString()
  });

  // Handle browser extension cleanup on component mount
  useEffect(() => {
    const handleAuthCleared = () => {
      console.log('🏠 App: Auth cleared event received, resetting state');
      setCurrentDraftId(null);
      setResumeData(null);
    };

    window.addEventListener('auth-cleared', handleAuthCleared);
    return () => window.removeEventListener('auth-cleared', handleAuthCleared);
  }, []);

  // Load current draft on app start - CLOUD ONLY
  useEffect(() => {
    // Wait for authentication check to complete
    if (authCheckLoading) {
      console.log('🏠 App - Authentication check still in progress, waiting...');
      return;
    }

    // Only proceed if user is authenticated
    if (!isAuthenticated || !user) {
      console.log('🏠 App - User not authenticated, skipping data initialization');
      return;
    }

    console.log('🏠 App - Authentication complete, starting data initialization for user:', user.email);

    const initializeData = async () => {
      try {
        console.log('🏠 App - Starting data initialization...');
        // Try to load user's primary resume data
        try {
          console.log('🏠 App - Loading primary resume data from Supabase...');
          const primaryResumeData = await SupabaseDraftManager.getResumeData();
          console.log('🏠 App - Primary resume data loaded:', {
            hasData: !!primaryResumeData,
            hasPersonalInfo: !!primaryResumeData?.personalInfo,
            personalInfoName: primaryResumeData?.personalInfo?.name
          });
          if (primaryResumeData) {
            console.log('Loading primary resume data from Supabase');
            setResumeData(primaryResumeData);
            console.log('🏠 App - Resume data set in state');
          }
        } catch (error) {
          console.warn('🏠 App - Failed to load primary resume data:', error);
        }
      } catch (error) {
        console.error('🏠 App - Error during data initialization:', error);
      } finally {
        console.log('🏠 App - Data initialization completed');
      }
    };

    initializeData();
  }, [authCheckLoading, isAuthenticated, user]);

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
      
      // Show success toast
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

  const saveDraft = async (name: string) => {
    if (!resumeData) return;

    try {
      showToast('Saving draft...', 'info', 2000);

      let draftId: string;

      if (user) {
        // User is authenticated - save to cloud
        try {
          draftId = await SupabaseDraftManager.saveDraft(
            name,
            resumeData,
            selectedTemplate,
            customizations,
            currentStep,
            currentDraftId
          );
          
          console.log('Draft saved to Supabase with ID:', draftId);
          showToast('Draft saved to cloud successfully!', 'success');
          
          // ALWAYS try to save primary resume data for authenticated users
          try {
            await SupabaseDraftManager.saveResumeData(resumeData);
            console.log('Primary resume data saved to Supabase as backup');
          } catch (resumeDataError) {
            console.warn('Failed to save primary resume data to Supabase:', resumeDataError);
          }
        } catch (supabaseError) {
          console.error('Error saving draft to Supabase:', supabaseError);
          showToast('Failed to save draft. Please try again.', 'error');
          return;
        }
      } else {
        // User not authenticated - cannot save
        console.log('User not authenticated, cannot save draft');
        showToast('You must be signed in to save drafts.', 'error');
        return;
      }

      // Update state with the new draft ID
      setCurrentDraftId(draftId);
    } catch (error) {
      console.error('Critical error saving draft:', error);
      showToast('Failed to save draft. Please try again.', 'error');
    }
  };

  // Quick save function for updating existing drafts
  const quickSaveDraft = async () => {
    if (!resumeData) {
      showToast('No resume data to save', 'error');
      return;
    }

    if (currentDraftId) {
      // Update existing draft without name prompt
      try {
        if (user) {
          // Get existing draft name
          const existingDraft = await SupabaseDraftManager.getDraft(currentDraftId);
          if (existingDraft) {
            showToast('Updating draft...', 'info', 2000);

            await SupabaseDraftManager.saveDraft(
              existingDraft.name,
              resumeData,
              selectedTemplate,
              customizations,
              currentStep,
              currentDraftId
            );

            showToast('Draft updated successfully!', 'success');
          } else {
            showToast('Draft not found. Creating new draft...', 'warning');
            setShowSavePrompt(true);
          }
        } else {
          showToast('You must be signed in to save drafts.', 'error');
        }
      } catch (error) {
        console.error('Error updating draft:', error);
        showToast('Failed to update draft. Please try again.', 'error');
      }
      
      // Close draft manager if it's open
      if (showDraftManager) {
        setTimeout(() => {
          setShowDraftManager(false);
        }, 1500);
      }
    } else {
      // No current draft, show save prompt for new draft
      setShowSavePrompt(true);
    }
  };

  // Save as new draft function (always prompts for name)
  const saveAsNewDraft = () => {
    if (!resumeData) {
      showToast('No resume data to save', 'error');
      return;
    }
    
    // Always show save prompt for new draft, regardless of current draft status
    setShowSavePrompt(true);
  };

  // Auto-save function for step transitions
  const autoSaveDraft = async (step: number) => {
    if (currentDraftId && resumeData && user) {
      try {
        // Try to get draft name from Supabase
        const draft = await SupabaseDraftManager.getDraft(currentDraftId);
        if (draft) {
          await SupabaseDraftManager.saveDraft(
            draft.name,
            resumeData,
            selectedTemplate,
            customizations,
            step,
            currentDraftId
          );
          console.log('Auto-saved draft to Supabase');
        }
      } catch (error) {
        console.warn('Auto-save failed:', error);
      }
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
      autoSaveDraft(newStep);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      
      // Auto-save if we have a current draft
      autoSaveDraft(newStep);
    }
  };

  const handleSavePromptSave = async (name: string) => {
    try {
      // Close the modal immediately to improve UX
      setShowSavePrompt(false);
      
      // For "Save as New", always create a new draft (don't pass currentDraftId)
      const draftIdToUse = undefined; // This ensures a new draft is created
      
      // Wait for the save operation to complete
      if (user) {
        showToast('Creating new draft...', 'info', 2000);
        
        const newDraftId = await SupabaseDraftManager.saveDraft(
          name,
          resumeData!,
          selectedTemplate,
          customizations,
          currentStep,
          draftIdToUse // undefined = create new draft
        );
        
        // Update current draft ID to the new draft
        setCurrentDraftId(newDraftId);
        
        // Also save primary resume data
        await SupabaseDraftManager.saveResumeData(resumeData!);
        
        showToast('New draft created successfully!', 'success');
      } else {
        showToast('You must be signed in to save drafts.', 'error');
        // Reopen modal if user is not authenticated
        setShowSavePrompt(true);
        return;
      }
      
      // Only increment step if we're not already on the final step
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      showToast('Failed to save draft. Please try again.', 'error');
      // Reopen modal if save failed
      setShowSavePrompt(true);
    }
  };

  const handleSavePromptSkip = () => {
    setShowSavePrompt(false);
    // Only increment step if we're not already on the final step
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderCurrentStep = () => {
    console.log('🏠 App - renderCurrentStep called with:', {
      currentStep,
      hasResumeData: !!resumeData,
      isTransitioning,
      selectedTemplate,
      currentDraftId,
      timestamp: new Date().toISOString()
    });
    
    // Show loading state during transition
    if (isTransitioning) {
      console.log('🏠 App - Showing transition loading state');
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
        console.log('🏠 App - Rendering LinkedIn Input (step 0)');
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
        console.log('🏠 App - Rendering Template Selector (step 1), hasData:', !!resumeData);
        return resumeData ? (
          <ErrorBoundary>
            <TemplateSelector
              resumeData={resumeData}
              selectedTemplate={selectedTemplate}
              onTemplateSelect={handleTemplateSelect}
              onNext={nextStep}
              onBack={prevStep}
              onSaveDraft={saveAsNewDraft}
              onQuickSave={quickSaveDraft}
              onSaveAsNew={saveAsNewDraft}
              currentDraftId={currentDraftId}
            />
          </ErrorBoundary>
        ) : (
          (() => {
            console.log('🏠 App - Step 1 but no resumeData, showing loading screen');
            return (
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading your data...</p>
                </div>
              </div>
            );
          })()
        );
      case 2:
        console.log('🏠 App - Rendering Resume Customizer (step 2), hasData:', !!resumeData);
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
              onSaveDraft={saveAsNewDraft}
              onQuickSave={quickSaveDraft}
              onSaveAsNew={saveAsNewDraft}
              currentDraftId={currentDraftId}
            />
          </ErrorBoundary>
        ) : (
          (() => {
            console.log('🏠 App - Step 2 but no resumeData, showing loading screen');
            return (
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading resume data...</p>
                </div>
              </div>
            );
          })()
        );
      default:
        console.log('🏠 App - Unknown step:', currentStep);
        return <div>Step not found</div>;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <ProtectedRoute>
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
          
          {/* User Profile Button - Fixed position - Only for authenticated users */}
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

          {/* User Profile Modal - Only for authenticated users */}
          <UserProfilePage
            isOpen={showUserProfile}
            onClose={() => setShowUserProfile(false)}
            showConfirmation={showConfirmation}
          />
        </ProtectedRoute>

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