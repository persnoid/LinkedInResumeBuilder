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
      <div className="w-full h-80 bg-white border rounded-xl overflow-hidden shadow-sm relative group hover:shadow-lg transition-all duration-300">
        {/* Template Preview Container - COMPLETELY FILL with no gaps */}
        <div className="w-full h-full relative overflow-hidden bg-gray-50">
          {/* Scaled template preview that COMPLETELY fills container */}
          <div 
            className="absolute top-0 left-0 bg-white"
            style={{
              transform: 'scale(0.48)',
              transformOrigin: 'top left',
              width: '794px',
              height: '1123px',
            }}
          >
            <TemplateRenderer
              context={{
                data: resumeData,
                config: template,
                customizations: {}
              }}
              className="template-preview-scaled"
            />
          </div>
        </div>

        {/* Hover overlay with preview button */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPreviewTemplate(template.id);
            }}
            className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg flex items-center text-sm font-medium transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
          >
            <Eye className="w-4 h-4 mr-2" />
            Full Preview
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Choose Your Template</h2>
            <p className="text-gray-600 text-lg">Select from our collection of professionally designed resume layouts. Your data will be automatically applied to the selected template.</p>
          </div>
          
          {/* Save Draft Button */}
          <button
            onClick={onSaveDraft}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl flex items-center transition-colors shadow-sm hover:shadow-md"
          >
            <Save className="w-5 h-5 mr-2" />
            {currentDraftId ? 'Update Draft' : 'Save Draft'}
          </button>
        </div>

        {/* Data Preview Card */}
        <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start space-x-6">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {resumeData.personalInfo.photo ? (
                <img src={resumeData.personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">{resumeData.personalInfo.name}</h3>
              <p className="text-gray-600 text-lg">{resumeData.personalInfo.title}</p>
              <div className="mt-3 flex items-center space-x-6 text-sm text-gray-500">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  {resumeData.personalInfo.email}
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  {resumeData.personalInfo.location}
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  {resumeData.experience.length} experience entries
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  {resumeData.skills.length} skills
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-xl mb-8 w-fit">
          {[
            { key: 'all', label: 'All Templates', count: reactiveTemplates.length },
            { key: 'modern', label: 'Modern', count: reactiveTemplates.filter(t => t.category === 'modern').length },
            { key: 'professional', label: 'Professional', count: reactiveTemplates.filter(t => t.category === 'professional').length },
            { key: 'creative', label: 'Creative', count: reactiveTemplates.filter(t => t.category === 'creative').length },
            { key: 'minimal', label: 'Minimal', count: reactiveTemplates.filter(t => t.category === 'minimal').length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                filter === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:bg-opacity-50'
              }`}
            >
              {tab.label}
              <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {filteredTemplates.map((template) => {
            const LayoutIcon = getLayoutIcon(template.layout.type);
            
            return (
              <div
                key={template.id}
                className={`group relative bg-white rounded-2xl shadow-sm border-2 transition-all duration-300 hover:shadow-xl cursor-pointer ${
                  selectedTemplate === template.id
                    ? 'border-blue-500 ring-4 ring-blue-500 ring-opacity-20 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onTemplateSelect(template.id)}
              >
                {/* Selection Indicator */}
                {selectedTemplate === template.id && (
                  <div className="absolute -top-3 -right-3 z-30">
                    <div className="bg-blue-500 rounded-full p-2 shadow-lg">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}

                {/* Template Preview */}
                <div className="p-4">
                  <TemplatePreview template={template} />
                </div>

                {/* Template Info */}
                <div className="p-6 pt-0">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg text-gray-900">{template.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        template.category === 'modern' ? 'bg-blue-100 text-blue-800' :
                        template.category === 'professional' ? 'bg-gray-100 text-gray-800' :
                        template.category === 'creative' ? 'bg-purple-100 text-purple-800' :
                        template.category === 'minimal' ? 'bg-green-100 text-green-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {template.category}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{template.description}</p>
                  
                  {/* Layout and Color Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500">
                      <LayoutIcon className="w-4 h-4 mr-2" />
                      <span className="font-medium">{template.layout.type.replace('-', ' ')}</span>
                    </div>
                    
                    {/* Color Palette */}
                    <div className="flex items-center space-x-1">
                      <Palette className="w-3 h-3 text-gray-400 mr-1" />
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
        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-8 rounded-xl transition-colors"
          >
            Back
          </button>
          
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">
              {selectedTemplate ? `Selected: ${reactiveTemplates.find(t => t.id === selectedTemplate)?.name}` : 'No template selected'}
            </p>
            <button
              onClick={onNext}
              disabled={!selectedTemplate}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-8 rounded-xl transition-colors shadow-sm hover:shadow-md"
            >
              Customize Resume →
            </button>
          </div>
        </div>

        {/* Full Preview Modal */}
        {previewTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {reactiveTemplates.find(t => t.id === previewTemplate)?.name} Preview
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {reactiveTemplates.find(t => t.id === previewTemplate)?.description}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      onTemplateSelect(previewTemplate);
                      setPreviewTemplate(null);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Select Template
                  </button>
                  <button
                    onClick={() => setPreviewTemplate(null)}
                    className="text-gray-400 hover:text-gray-600 p-2"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(95vh - 120px)' }}>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden mx-auto" style={{ width: '794px', maxWidth: '100%' }}>
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