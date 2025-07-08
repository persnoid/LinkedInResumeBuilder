The file appears to have duplicate content and some misplaced code blocks. Here's the corrected version with proper closing brackets and structure:

```typescript
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
  // ... [rest of the App component code remains unchanged until the end]

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
```