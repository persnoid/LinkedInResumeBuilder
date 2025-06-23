import React, { useState } from 'react';
import { CheckCircle, Eye, Layout, Grid, Save, Palette, FileText, Zap, Sparkles, User } from 'lucide-react';
import { reactiveTemplates } from '../data/reactive-templates';
import { TemplateConfig, ResumeData } from '../types/resume';
import { TemplateRenderer } from './template-engine/TemplateRenderer';

interface TemplateSelectorProps {
  resumeData: ResumeData;
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
  onNext: () => void;
  onBack: () => void;
  onSaveDraft: () => void;
  currentDraftId?: string | null;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  resumeData,
  selectedTemplate,
  onTemplateSelect,
  onNext,
  onBack,
  onSaveDraft,
  currentDraftId
}) => {
  const [filter, setFilter] = useState<'all' | 'modern' | 'classic' | 'creative' | 'minimal' | 'professional'>('all');
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  const filteredTemplates = filter === 'all' 
    ? reactiveTemplates 
    : reactiveTemplates.filter(template => template.category === filter);

  // Layout icons mapping
  const getLayoutIcon = (layout: string) => {
    switch (layout) {
      case 'two-column': return Grid;
      case 'single-column': return Layout;
      case 'header-footer': return FileText;
      case 'sidebar': return Sparkles;
      default: return Layout;
    }
  };

  const TemplatePreview: React.FC<{ template: TemplateConfig }> = ({ template }) => {
    const LayoutIcon = getLayoutIcon(template.layout.type);
    
    return (
      <div className="w-full h-64 bg-white border rounded-lg overflow-hidden shadow-sm relative">
        {/* Layout indicator */}
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-black bg-opacity-70 text-white p-1 rounded flex items-center">
            <LayoutIcon className="w-3 h-3 mr-1" />
            <span className="text-xs">{template.layout.type.replace('-', ' ')}</span>
          </div>
        </div>

        {/* Template Preview using TemplateRenderer */}
        <div className="h-full transform scale-[0.3] origin-top-left w-[333%] overflow-hidden">
          <TemplateRenderer
            context={{
              data: resumeData,
              config: template,
              customizations: {}
            }}
            className="template-preview"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Template</h2>
            <p className="text-gray-600">Select from our collection of professionally designed resume layouts. Your data will be automatically applied to the selected template.</p>
          </div>
          
          {/* Save Draft Button */}
          <button
            onClick={onSaveDraft}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            {currentDraftId ? 'Update Draft' : 'Save Draft'}
          </button>
        </div>

        {/* Data Preview Card */}
        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start space-x-6">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {resumeData.personalInfo.photo ? (
                <img src={resumeData.personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{resumeData.personalInfo.name}</h3>
              <p className="text-gray-600">{resumeData.personalInfo.title}</p>
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <span>{resumeData.personalInfo.email}</span>
                <span>{resumeData.personalInfo.location}</span>
                <span>{resumeData.experience.length} experience entries</span>
                <span>{resumeData.skills.length} skills</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg mb-8 w-fit">
          {[
            { key: 'all', label: 'All Templates' },
            { key: 'modern', label: 'Modern' },
            { key: 'professional', label: 'Professional' },
            { key: 'creative', label: 'Creative' },
            { key: 'minimal', label: 'Minimal' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredTemplates.map((template) => {
            const LayoutIcon = getLayoutIcon(template.layout.type);
            
            return (
              <div
                key={template.id}
                className={`group relative bg-white rounded-xl shadow-sm border-2 transition-all duration-200 hover:shadow-lg cursor-pointer ${
                  selectedTemplate === template.id
                    ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onTemplateSelect(template.id)}
              >
                {/* Selection Indicator */}
                {selectedTemplate === template.id && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-blue-500 rounded-full p-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}

                {/* Template Preview */}
                <div className="p-4">
                  <TemplatePreview template={template} />
                </div>

                {/* Template Info */}
                <div className="p-4 pt-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewTemplate(template.id);
                      }}
                      className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-3">{template.description}</p>
                  
                  {/* Layout indicator */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-400">
                      <LayoutIcon className="w-3 h-3 mr-1" />
                      <span>{template.layout.type.replace('-', ' ')}</span>
                    </div>
                    
                    {/* Color Palette */}
                    <div className="flex space-x-1">
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-200"
                        style={{ backgroundColor: template.layout.styles.colors.primary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-200"
                        style={{ backgroundColor: template.layout.styles.colors.secondary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-200"
                        style={{ backgroundColor: template.layout.styles.colors.accent }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Back
          </button>
          <button
            onClick={onNext}
            disabled={!selectedTemplate}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Customize Resume
          </button>
        </div>

        {/* Preview Modal */}
        {previewTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {reactiveTemplates.find(t => t.id === previewTemplate)?.name} Preview
                </h3>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <CheckCircle className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  {reactiveTemplates.find(t => t.id === previewTemplate) && (
                    <TemplateRenderer
                      context={{
                        data: resumeData,
                        config: reactiveTemplates.find(t => t.id === previewTemplate)!,
                        customizations: {}
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};