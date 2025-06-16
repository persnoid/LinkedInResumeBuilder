import React, { useState } from 'react';
import { ProgressIndicator } from './components/ProgressIndicator';
import { LinkedInInput } from './components/LinkedInInput';
import { DataReview } from './components/DataReview';
import { TemplateSelector } from './components/TemplateSelector';
import { ResumeCustomizer } from './components/ResumeCustomizer';
import { sampleResumeData } from './data/sampleData';
import { exportToPDF, exportToWord } from './utils/exportUtils';
import { ResumeData } from './types/resume';

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
  const [linkedinData, setLinkedinData] = useState(null);

  const handleLinkedInData = (data: ResumeData) => {
    setLinkedinData(data);
    // Use the actual extracted data instead of sample data
    setResumeData(data);
  };

  const handleDataUpdate = (data: ResumeData) => {
    setResumeData(data);
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
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

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <LinkedInInput
            onDataExtracted={handleLinkedInData}
            onNext={nextStep}
          />
        );
      case 1:
        return resumeData ? (
          <DataReview
            resumeData={resumeData}
            onDataUpdate={handleDataUpdate}
            onNext={nextStep}
            onBack={prevStep}
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
          />
        ) : null;
      case 3:
        return resumeData ? (
          <ResumeCustomizer
            resumeData={resumeData}
            selectedTemplate={selectedTemplate}
            onExport={handleExport}
            onBack={prevStep}
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
        />
      )}
      {renderCurrentStep()}
    </div>
  );
}

export default App;