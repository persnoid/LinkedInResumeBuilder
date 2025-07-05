Here's the fixed version with all missing closing brackets properly added:

```jsx
import React, { useState } from 'react';
import { Palette, Type, Download, FileText, FileType, Save, Eye, EyeOff, Layout, Plus, Trash2, ToggleLeft, ToggleRight, X } from 'lucide-react';
import { ResumeData } from '../types/resume';
import { reactiveTemplates } from '../data/reactive-templates';
import { TemplateRenderer } from './template-engine/TemplateRenderer';
import { ResumePreview } from './ResumePreview';
import { ConfirmationDialog } from './ConfirmationDialog';
import { useConfirmation } from '../hooks/useConfirmation';

interface ResumeCustomizerProps {
  resumeData: ResumeData;
  selectedTemplate: string;
  customizations: any;
  onCustomizationsUpdate: (customizations: any) => void;
  onExport: (format: 'pdf' | 'docx') => void;
  onBack: () => void;
  onSaveDraft: () => void;
  currentDraftId?: string | null;
}

export const ResumeCustomizer: React.FC<ResumeCustomizerProps> = ({
  resumeData,
  selectedTemplate,
  customizations,
  onCustomizationsUpdate,
  onExport,
  onBack,
  onSaveDraft,
  currentDraftId
}) => {
  // ... [previous code remains the same until the return statement]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Enhanced Sidebar */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* ... [previous sidebar code remains the same] */}
      </div>

      {/* Preview Area */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Preview</h3>
            <p className="text-gray-600">
              {isEditMode ? 'Click on any text to edit it directly' : 'Enable edit mode to modify content'}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {reactiveTemplate ? (
              <TemplateRenderer
                context={{
                  data: editableResumeData,
                  config: reactiveTemplate,
                  customizations: {
                    ...customizations,
                    editMode: isEditMode,
                    onDataUpdate: handleResumeDataUpdate,
                    showConfirmation: showConfirmation
                  }
                }}
              />
            ) : (
              <ResumePreview
                resumeData={editableResumeData}
                template={selectedTemplate}
                customColors={customizations.colors}
                font={customizations.typography?.fontFamily?.split(',')[0] || 'Inter'}
              />
            )}
          </div>
        </div>
      </div>

      {/* Add Section Modal */}
      {showAddSectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Add New Section</h3>
              <button
                onClick={() => setShowAddSectionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section Name *
                </label>
                <input
                  type="text"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  placeholder="e.g., Projects, Awards, Publications"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section Type
                </label>
                <select
                  value={newSectionComponent}
                  onChange={(e) => setNewSectionComponent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {availableSectionTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {availableSectionTypes.find(t => t.value === newSectionComponent)?.description}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Placement
                </label>
                <select
                  value={newSectionColumn}
                  onChange={(e) => setNewSectionColumn(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={1}>Main Content</option>
                  <option value={2}>Sidebar</option>
                  <option value={0}>Header</option>
                  <option value={3}>Footer</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowAddSectionModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSection}
                disabled={!newSectionName.trim()}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Section
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
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
  );
};
```