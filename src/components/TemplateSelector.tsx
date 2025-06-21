import React, { useState } from 'react';
import { CheckCircle, Eye, Layout, Grid, Save } from 'lucide-react';
import { resumeTemplates } from '../data/templates';
import { ResumeTemplate } from '../types/resume';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
  onNext: () => void;
  onBack: () => void;
  onSaveDraft: () => void;
  currentDraftId?: string | null;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateSelect,
  onNext,
  onBack,
  onSaveDraft,
  currentDraftId
}) => {
  const [filter, setFilter] = useState<'all' | 'modern' | 'classic' | 'creative' | 'minimal'>('all');
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  const filteredTemplates = filter === 'all' 
    ? resumeTemplates 
    : resumeTemplates.filter(template => template.category === filter);

  // Layout icons mapping
  const getLayoutIcon = (layout: string) => {
    switch (layout) {
      case 'double-column': return Grid;
      case 'ivy-league': return Layout;
      default: return Layout;
    }
  };

  const TemplatePreview: React.FC<{ template: ResumeTemplate }> = ({ template }) => {
    const LayoutIcon = getLayoutIcon(template.layout);
    
    return (
      <div className="w-full h-64 bg-white border rounded-lg overflow-hidden shadow-sm relative">
        {/* Layout indicator */}
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-black bg-opacity-70 text-white p-1 rounded flex items-center">
            <LayoutIcon className="w-3 h-3 mr-1" />
            <span className="text-xs">{template.layout.replace('-', ' ')}</span>
          </div>
        </div>

        {/* Template preview based on layout */}
        {template.layout === 'double-column' && (
          <div className="h-full flex">
            {/* Left side - main content */}
            <div className="flex-1 p-3">
              <div className="space-y-3">
                <div>
                  <div className="text-lg font-bold mb-1" style={{ color: template.colors.primary }}>YOUR NAME</div>
                  <div className="text-sm mb-2" style={{ color: template.colors.accent }}>The role you are applying for?</div>
                  <div className="text-xs text-gray-500 mb-3">📞 Phone ✉ Email 🔗 LinkedIn/Portfolio 📍 Location</div>
                </div>
                
                <div>
                  <div className="text-sm font-bold mb-1 pb-1 border-b" style={{ color: template.colors.text, borderColor: template.colors.text }}>SUMMARY</div>
                  <div className="space-y-1">
                    <div className="h-1 bg-gray-200 rounded"></div>
                    <div className="h-1 bg-gray-200 rounded w-4/5"></div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-bold mb-1 pb-1 border-b" style={{ color: template.colors.text, borderColor: template.colors.text }}>EXPERIENCE</div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold">Title</div>
                    <div className="text-xs" style={{ color: template.colors.accent }}>Company Name</div>
                    <div className="h-1 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-bold mb-1 pb-1 border-b" style={{ color: template.colors.text, borderColor: template.colors.text }}>EDUCATION</div>
                  <div className="space-y-1">
                    <div className="h-1 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - sidebar */}
            <div className="w-24 p-2" style={{ backgroundColor: template.colors.sidebar }}>
              <div className="w-8 h-8 rounded-full bg-gray-300 mx-auto mb-2"></div>
              <div className="space-y-2">
                <div>
                  <div className="text-xs font-bold mb-1" style={{ color: template.colors.text }}>KEY ACHIEVEMENTS</div>
                  <div className="h-1 bg-gray-300 rounded w-full"></div>
                </div>
                <div>
                  <div className="text-xs font-bold mb-1" style={{ color: template.colors.text }}>SKILLS</div>
                  <div className="h-1 bg-gray-300 rounded w-full"></div>
                </div>
                <div>
                  <div className="text-xs font-bold mb-1" style={{ color: template.colors.text }}>COURSES</div>
                  <div className="h-1 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {template.layout === 'ivy-league' && (
          <div className="h-full p-4 text-center">
            <div className="w-8 h-8 rounded-full bg-gray-300 mx-auto mb-2"></div>
            <div className="mb-4">
              <div className="text-lg font-bold mb-1" style={{ color: template.colors.primary }}>YOUR NAME</div>
              <div className="text-sm mb-2" style={{ color: template.colors.secondary }}>The role you are applying for?</div>
              <div className="text-xs text-gray-500">Phone • Email • LinkedIn/Portfolio • Location</div>
            </div>
            
            <div className="space-y-3 text-xs">
              <div>
                <div className="font-semibold mb-1 pb-1 border-b" style={{ color: template.colors.primary, borderColor: template.colors.primary }}>Summary</div>
                <div className="space-y-1">
                  <div className="h-1 bg-gray-200 rounded"></div>
                  <div className="h-1 bg-gray-200 rounded w-4/5"></div>
                </div>
              </div>
              
              <div>
                <div className="font-semibold mb-1 pb-1 border-b" style={{ color: template.colors.primary, borderColor: template.colors.primary }}>Experience</div>
                <div className="border rounded p-2 mb-2">
                  <div className="flex justify-between text-xs">
                    <div>
                      <div className="font-bold">Company Name</div>
                      <div>Title</div>
                    </div>
                    <div>
                      <div>Location</div>
                      <div>Date period</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="font-semibold mb-1 pb-1 border-b" style={{ color: template.colors.primary, borderColor: template.colors.primary }}>Education</div>
                <div className="h-1 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Template</h2>
            <p className="text-gray-600">Select from our professionally designed resume layouts, each with unique structure and visual appeal.</p>
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

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg mb-8 w-fit">
          {[
            { key: 'all', label: 'All Templates' },
            { key: 'modern', label: 'Modern' },
            { key: 'classic', label: 'Classic' }
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {filteredTemplates.map((template) => {
            const LayoutIcon = getLayoutIcon(template.layout);
            
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
                      <span>{template.layout.replace('-', ' ')}</span>
                    </div>
                    
                    {/* Color Palette */}
                    <div className="flex space-x-1">
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-200"
                        style={{ backgroundColor: template.colors.primary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-200"
                        style={{ backgroundColor: template.colors.secondary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-200"
                        style={{ backgroundColor: template.colors.accent }}
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
                  {resumeTemplates.find(t => t.id === previewTemplate)?.name} Preview
                </h3>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <CheckCircle className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="aspect-[8.5/11] bg-white border rounded-lg overflow-hidden">
                  {resumeTemplates.find(t => t.id === previewTemplate) && (
                    <TemplatePreview 
                      template={resumeTemplates.find(t => t.id === previewTemplate)!} 
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