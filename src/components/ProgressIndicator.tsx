import React from 'react';
import { Check, FolderOpen, Save } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
  onOpenDraftManager?: () => void;
  currentDraftId?: string | null;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  steps,
  onOpenDraftManager,
  currentDraftId
}) => {
  return (
    <div className="w-full bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200 ${
                      index < currentStep
                        ? 'bg-green-500 text-white'
                        : index === currentStep
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index < currentStep ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    {step}
                  </span>
                </div>
                {index < totalSteps - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-4 ${
                      index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Draft Manager Button */}
          {onOpenDraftManager && (
            <div className="flex items-center space-x-3 ml-6">
              {currentDraftId && (
                <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  <Save className="w-4 h-4 mr-1" />
                  Draft Saved
                </div>
              )}
              <button
                onClick={onOpenDraftManager}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors"
              >
                <FolderOpen className="w-4 h-4 mr-2" />
                Manage Drafts
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};