import React, { useState } from 'react';
import { CheckCircle, Eye, Layout, Grid, Save, Palette, FileText, Zap, Sparkles, User, X, ZoomIn, Plus, ArrowLeft, Upload, Settings, Brain } from 'lucide-react';
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
  currentDraftId?: string | undefined;
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

  const calculateProgress = () => {
    return 66; // Step 2 of 3
  };
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
    console.log('TemplatePreview - Using resumeData:', resumeData); // Debug log
    
    return (
      <div className="w-full h-80 bg-white border rounded-xl overflow-hidden shadow-sm relative group hover:shadow-lg transition-all duration-300">
        {/* Template Preview Container - Exact fit with no extra space */}
        <div 
          className="w-full h-full bg-gray-50 overflow-hidden relative"
          style={{
            width: '226px', // Exact scaled width: 794 * 0.285
            height: '320px', // Exact scaled height: 1123 * 0.285
            margin: '0 auto'
          }}
        >
          {/* Scaled template preview that fits exactly */}
          <div 
            className="bg-white"
            style={{
              transform: 'scale(0.285)',
              transformOrigin: 'top left',
              width: '794px',
              height: '1123px',
            }}
          >
            <TemplateRenderer
              context={{
                data: resumeData, // CRITICAL: Pass the actual parsed resumeData
                config: template,
                customizations: {}
              }}
              className="template-preview-scaled"
            />
          </div>

          {/* Full Preview Button - Always visible */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPreviewTemplate(template.id);
              }}
              className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg flex items-center text-sm font-medium transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hover:bg-gray-50"
            >
              <ZoomIn className="w-4 h-4 mr-2" />
              Full Preview
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">ResumeAI</h1>
              <p className="text-xs text-gray-500">LinkedIn Resume Generator</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-6 mb-8">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">NAVIGATION</h3>
          <div className="space-y-2">
            <button
              onClick={onBack}
              className="w-full text-left text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-lg flex items-center transition-colors"
            >
              <div className="w-4 h-4 bg-blue-100 rounded mr-3 flex items-center justify-center">
                <span className="text-xs text-blue-600">📊</span>
              </div>
              <div>
                <div className="font-medium text-sm">Dashboard</div>
                <div className="text-xs text-gray-500">Your resume drafts</div>
              </div>
            </button>
            
            <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded mr-3 flex items-center justify-center">
                <span className="text-xs text-white">🎨</span>
              </div>
              <div>
                <div className="font-medium text-sm">Choose Template</div>
                <div className="text-xs text-blue-600">Select your design</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="px-6 flex-1">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">FEATURES</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <Brain className="w-4 h-4 mr-2 text-green-600" />
              <span className="text-gray-700">AI-Powered Parsing</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <FileText className="w-4 h-4 mr-2 text-blue-600" />
              <span className="text-gray-700">6 Professional Templates</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <Palette className="w-4 h-4 mr-2 text-purple-600" />
              <span className="text-gray-700">Live Customization</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
              <Upload className="w-4 h-4 mr-2 text-orange-600" />
              <span className="text-gray-700">PDF Export Ready</span>
            </div>
          </div>
        </div>

        {/* User Profile at Bottom */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {resumeData.personalInfo.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-gray-900 truncate">
                {resumeData.personalInfo.name || 'User'}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {resumeData.personalInfo.email || 'user@example.com'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Choose Your Template</h1>
              <p className="text-gray-600">Select from professionally designed layouts</p>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">Step 2 of 3</span>
            <span className="text-sm text-gray-500">{calculateProgress()}% Complete</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div 
              className="bg-gray-900 h-2 rounded-full transition-all duration-300"
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                ✓
              </div>
              <span className="text-sm font-medium text-gray-900">Upload & Parse</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="text-sm font-medium text-gray-900">Choose Template</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <span className="text-sm text-gray-500">Customize & Export</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Save Draft Button */}
            <div className="mb-8 flex justify-end">
              <button
                onClick={onSaveDraft}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center transition-colors shadow-sm hover:shadow-md"
              >
                <Save className="w-5 h-5 mr-2" />
                {currentDraftId ? 'Update Draft' : 'Save Draft'}
              </button>
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
        </div>
      )}
    </div>
  );
};
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

                  {/* Full Preview Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewTemplate(template.id);
                    }}
                    className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Full Preview
                  </button>
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
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {reactiveTemplates.find(t => t.id === previewTemplate)?.name} - Full Preview
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
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Select This Template
                  </button>
                  <button
                    onClick={() => setPreviewTemplate(null)}
                    className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content - Full Size Preview */}
              <div className="p-6 overflow-y-auto bg-gray-100" style={{ maxHeight: 'calc(95vh - 120px)' }}>
                <div className="flex justify-center">
                  <div className="bg-white rounded-lg shadow-xl overflow-hidden" style={{ width: '794px', maxWidth: '100%' }}>
                    {reactiveTemplates.find(t => t.id === previewTemplate) && (
                      <TemplateRenderer
                        context={{
                          data: resumeData, // CRITICAL: Use actual parsed data in modal too
                          config: reactiveTemplates.find(t => t.id === previewTemplate)!,
                          customizations: {}
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Layout:</span> {reactiveTemplates.find(t => t.id === previewTemplate)?.layout.type.replace('-', ' ')} • 
                  <span className="font-medium ml-2">Category:</span> {reactiveTemplates.find(t => t.id === previewTemplate)?.category}
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setPreviewTemplate(null)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Close Preview
                  </button>
                  <button
                    onClick={() => {
                      onTemplateSelect(previewTemplate);
                      setPreviewTemplate(null);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Select & Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};