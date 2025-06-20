import React, { useState, useEffect } from 'react';
import { ProgressIndicator } from './components/ProgressIndicator';
import { LinkedInInput } from './components/LinkedInInput';
import { DataReview } from './components/DataReview';
import { TemplateSelector } from './components/TemplateSelector';
import { ResumeCustomizer } from './components/ResumeCustomizer';
import { DraftManagerComponent } from './components/DraftManager';
import { DraftSavePrompt } from './components/DraftSavePrompt';
import { sampleResumeData } from './data/sampleData';
import { exportToPDF, exportToWord } from './utils/exportUtils';
import { DraftManager } from './utils/draftManager';
import { ResumeData, DraftResume } from './types/resume';

const STEPS = [
  'LinkedIn Input',
  'Review Data',
  'Choose Template',
  'Customize & Export'
];

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [customizations, setCustomizations] = useState({
    colors: { primary: '#3B82F6', secondary: '#1E40AF', accent: '#10B981' },
    font: 'Inter',
    sectionOrder: ['summary', 'experience', 'education', 'skills', 'certifications']
  });
  const [linkedinData, setLinkedinData] = useState(null);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const [showDraftManager, setShowDraftManager] = useState(false);
  const [showSavePrompt, setShowSavePrompt] = useState(false);

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

  const loadDraftData = (draft: DraftResume) => {
    setResumeData(draft.resumeData);
    setSelectedTemplate(draft.selectedTemplate);
    setCustomizations(draft.customizations);
    setCurrentStep(draft.step);
    setCurrentDraftId(draft.id);
    setShowDraftManager(false);
  };

  const handleLinkedInData = (data: ResumeData) => {
    setLinkedinData(data);
    setResumeData(data);
    setCurrentDraftId(null); // Clear current draft when new data is loaded
    DraftManager.clearCurrentDraft();
  };

  const handleDataUpdate = (data: ResumeData) => {
    setResumeData(data);
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleCustomizationsUpdate = (newCustomizations: any) => {
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
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      // Show save prompt when moving from data review step
      if (currentStep === 1 && resumeData && !currentDraftId) {
        setShowSavePrompt(true);
        return;
      }
      
      setCurrentStep(currentStep + 1);
      
      // Auto-save if we have a current draft
      if (currentDraftId && resumeData) {
        const draft = DraftManager.getDraft(currentDraftId);
        if (draft) {
          DraftManager.saveDraft(
            draft.name,
            resumeData,
            selectedTemplate,
            customizations,
            currentStep + 1,
            currentDraftId
          );
        }
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      
      // Auto-save if we have a current draft
      if (currentDraftId && resumeData) {
        const draft = DraftManager.getDraft(currentDraftId);
        if (draft) {
          DraftManager.saveDraft(
            draft.name,
            resumeData,
            selectedTemplate,
            customizations,
            currentStep - 1,
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
          <DataReview
            resumeData={resumeData}
            onDataUpdate={handleDataUpdate}
            onNext={nextStep}
            onBack={prevStep}
            onSaveDraft={() => setShowSavePrompt(true)}
            currentDraftId={currentDraftId}
          />
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
          <TemplateSelector
            selectedTemplate={selectedTemplate}
            onTemplateSelect={handleTemplateSelect}
            onNext={nextStep}
            onBack={prevStep}
            onSaveDraft={() => setShowSavePrompt(true)}
            currentDraftId={currentDraftId}
          />
        ) : null;
      case 3:
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
        ) : null;
      default:
        return <div>Step not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentStep > 0 && (
        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={STEPS.length}
          steps={STEPS}
          onOpenDraftManager={() => setShowDraftManager(true)}
          currentDraftId={currentDraftId}
        />
      )}
      
      {renderCurrentStep()}

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