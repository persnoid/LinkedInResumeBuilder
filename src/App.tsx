import React, { useState, useEffect } from 'react';
import { ProgressIndicator } from './components/ProgressIndicator';
import { LinkedInInput } from './components/LinkedInInput';
import { TemplateSelector } from './components/TemplateSelector';
import { ResumeCustomizer } from './components/ResumeCustomizer';
import { DraftManagerComponent } from './components/DraftManager';
import { DraftSavePrompt } from './components/DraftSavePrompt';
import { UserProfilePage } from './pages/UserProfilePage';
import { sampleResumeData } from './data/sampleData';
import { exportToPDF, exportToWord } from './utils/exportUtils';
import { DraftManager } from './utils/draftManager';
import { ResumeData, DraftResume } from './types/resume';
import { useTranslation } from './hooks/useTranslation';

function App() {
  const { t } = useTranslation();
  
  const STEPS = [
    t('app.steps.linkedinInput'),
    t('app.steps.chooseTemplate'),
    t('app.steps.customizeExport')
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('azurill');
  const [customizations, setCustomizations] = useState({
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
      
    } catch (error) {
      console.error('Error loading draft data:', error);
      setIsTransitioning(false);
      alert('Failed to load draft. Please try again.');
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

  const handleCustomizationsUpdate = (newCustomizations: any) => {
    console.log('Updating customizations:', newCustomizations);
    setCustomizations(newCustomizations);
  };

  const handleExport = async (format: 'pdf' | 'docx') => {
    if (!resumeData) return;
    
    try {
      if (format === 'pdf') {
        await exportToPDF('resume-preview', `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`);
      } else {
        await exportToWord(resumeData, `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.docx`);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
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
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Failed to save draft. Please try again.');
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
            <p className="text-gray-600">{t('app.loading.draft')}</p>
          </div>
        </div>
      );
    }
    
    switch (currentStep) {
      case 0:
        return (
          <LinkedInInput
            onDataExtracted={handleLinkedInData}
            onNext={nextStep}
            onOpenDraftManager={() => setShowDraftManager(true)}
          />
        );
      case 1:
        return resumeData ? (
          <TemplateSelector
            resumeData={resumeData}
            selectedTemplate={selectedTemplate}
            onTemplateSelect={handleTemplateSelect}
            onNext={nextStep}
            onBack={prevStep}
            onSaveDraft={() => setShowSavePrompt(true)}
            currentDraftId={currentDraftId}
          />
        ) : (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">{t('app.loading.data')}</p>
            </div>
          </div>
        );
      case 2:
        return resumeData ? (
          <ResumeCustomizer
            resumeData={resumeData}
            selectedTemplate={selectedTemplate}
            customizations={customizations}
            onCustomizationsUpdate={handleCustomizationsUpdate}
            onExport={handleExport}
            onBack={prevStep}
            onSaveDraft={() => setShowSavePrompt(true)}
            currentDraftId={currentDraftId}
          />
        ) : (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">{t('app.loading.resumeData')}</p>
            </div>
          </div>
        );
      default:
        return <div>Step not found</div>;
    }
  };

  return (
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
          title={t('userProfile.title')}
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
      />

      {/* Save Draft Prompt */}
      <DraftSavePrompt
        isOpen={showSavePrompt}
        onSave={handleSavePromptSave}
        onSkip={handleSavePromptSkip}
        onCancel={() => setShowSavePrompt(false)}
        defaultName={resumeData?.personalInfo.name ? `${resumeData.personalInfo.name} Resume` : ''}
      />
    </div>
  );
}

export default App;