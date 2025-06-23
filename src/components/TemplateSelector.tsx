import React, { useState } from 'react';
import { CheckCircle, Eye, Layout, Grid, Save, Palette, FileText, Zap, Sparkles } from 'lucide-react';
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
      case 'header-style': return FileText;
      case 'timeline-style': return Zap;
      case 'organic-sidebar': return Sparkles;
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

        {/* Soft Blue Elegant Template Preview - EXACT MATCH to your image */}
        {template.id === 'soft-blue-elegant' && (
          <div className="h-full p-3 relative">
            {/* Decorative elements */}
            <div className="absolute top-2 right-2 w-8 h-8 rounded-full opacity-20" 
                 style={{ backgroundColor: template.colors.accent }}></div>
            
            {/* Header with name and photo */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="text-sm font-bold text-gray-400 uppercase">YOUR NAME</div>
                <div className="text-xs" style={{ color: template.colors.accent }}>Role Title</div>
                <div className="text-xs text-gray-500 mt-1">Phone • Email • LinkedIn • Location</div>
              </div>
              <div className="w-6 h-6 rounded-full bg-gray-300 ml-2"></div>
            </div>
            
            {/* Three column grid */}
            <div className="grid grid-cols-12 gap-1 mt-2">
              {/* Left column - Summary and Experience */}
              <div className="col-span-7 space-y-2">
                <div className="font-bold text-xs pb-1 border-b" style={{ color: template.colors.primary, borderColor: template.colors.primary }}>
                  SUMMARY
                </div>
                <div className="space-y-1">
                  <div className="h-1 bg-gray-200 rounded"></div>
                  <div className="h-1 bg-gray-200 rounded w-3/4"></div>
                </div>
                
                <div className="font-bold text-xs pb-1 border-b mt-2" style={{ color: template.colors.primary, borderColor: template.colors.primary }}>
                  EXPERIENCE
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-medium">Title</div>
                  <div className="text-xs" style={{ color: template.colors.accent }}>Company Name</div>
                  <div className="h-1 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
              
              {/* Right column - Key Achievements, Skills */}
              <div className="col-span-5 space-y-2">
                <div className="font-bold text-xs pb-1 border-b" style={{ color: template.colors.primary, borderColor: template.colors.primary }}>
                  KEY ACHIEVEMENTS
                </div>
                <div className="h-1 bg-gray-200 rounded w-full"></div>
                
                <div className="font-bold text-xs pb-1 border-b mt-2" style={{ color: template.colors.primary, borderColor: template.colors.primary }}>
                  SKILLS
                </div>
                <div className="space-y-1">
                  <div className="h-1 bg-gray-200 rounded w-full"></div>
                  <div className="h-1 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ivy League Classic Template Preview - EXACT MATCH */}
        {template.id === 'ivy-league-classic' && (
          <div className="h-full p-3 text-center">
            <div className="w-8 h-8 rounded-full bg-gray-300 mx-auto mb-2"></div>
            <div className="text-sm font-bold mb-1" style={{ color: template.colors.primary }}>YOUR NAME</div>
            <div className="text-xs mb-2" style={{ color: template.colors.secondary }}>Role Title</div>
            <div className="text-xs mb-3 text-gray-500">Phone • Email • LinkedIn • Location</div>
            
            <div className="space-y-2 text-xs">
              <div className="font-semibold pb-1 border-b border-gray-800" style={{ color: template.colors.primary }}>Summary</div>
              <div className="space-y-1">
                <div className="h-1 bg-gray-200 rounded"></div>
                <div className="h-1 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </div>
              
              <div className="font-semibold pb-1 border-b border-gray-800 mt-3" style={{ color: template.colors.primary }}>Experience</div>
              <div className="space-y-1">
                <div className="text-xs font-medium">Company Name</div>
                <div className="text-xs" style={{ color: template.colors.secondary }}>Title</div>
                <div className="h-1 bg-gray-200 rounded w-2/3 mx-auto"></div>
              </div>
            </div>
          </div>
        )}

        {/* Template preview based on layout and specific template */}
        {template.id === 'green-organic-sidebar' && (
          <div className="h-full flex">
            {/* Left sidebar with organic shapes */}
            <div className="w-1/3 p-3 relative" style={{ backgroundColor: template.colors.sidebar }}>
              <div className="absolute top-2 left-2 w-8 h-8 rounded-full opacity-30" 
                   style={{ backgroundColor: template.colors.accent }}></div>
              <div className="absolute top-4 left-4 w-6 h-6 rounded-full opacity-20" 
                   style={{ backgroundColor: template.colors.primary }}></div>
              <div className="w-8 h-8 rounded-full bg-gray-300 mx-auto mb-2 relative z-10"></div>
              <div className="text-center text-xs space-y-2 relative z-10">
                <div className="font-bold" style={{ color: template.colors.primary }}>CONTACTS</div>
                <div className="space-y-1">
                  <div className="text-xs">Phone</div>
                  <div className="text-xs">Email</div>
                  <div className="text-xs">LinkedIn</div>
                </div>
                <div className="font-bold mt-3" style={{ color: template.colors.primary }}>SKILLS</div>
                <div className="space-y-1">
                  <div className="h-1 bg-gray-300 rounded w-full"></div>
                  <div className="h-1 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            </div>
            <div className="flex-1 p-3">
              <div className="space-y-2">
                <div className="text-lg font-bold" style={{ color: template.colors.text }}>YOUR NAME</div>
                <div className="inline-block px-2 py-1 rounded-full text-xs" 
                     style={{ backgroundColor: template.colors.highlight, color: template.colors.primary }}>
                  Role Title
                </div>
                <div className="space-y-2 mt-3">
                  <div className="font-bold text-xs" style={{ color: template.colors.primary }}>SUMMARY</div>
                  <div className="space-y-1">
                    <div className="h-1 bg-gray-200 rounded"></div>
                    <div className="h-1 bg-gray-200 rounded w-4/5"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {template.id === 'navy-header-professional' && (
          <div className="h-full">
            {/* Navy header */}
            <div className="p-3" style={{ backgroundColor: template.colors.sidebar }}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-bold" style={{ color: template.colors.text }}>YOUR NAME</div>
                  <div className="text-xs" style={{ color: template.colors.accent }}>Role Title</div>
                  <div className="text-xs mt-1" style={{ color: template.colors.text }}>Contact Info</div>
                </div>
                <div className="w-6 h-6 rounded-full bg-gray-300"></div>
              </div>
            </div>
            {/* Content area */}
            <div className="p-3">
              <div className="space-y-2">
                <div className="font-bold text-xs pb-1 border-b" style={{ color: template.colors.primary, borderColor: template.colors.primary }}>
                  SUMMARY
                </div>
                <div className="space-y-1">
                  <div className="h-1 bg-gray-200 rounded"></div>
                  <div className="h-1 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {template.id === 'orange-timeline-modern' && (
          <div className="h-full p-3">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-sm font-bold" style={{ color: template.colors.primary }}>YOUR NAME</div>
                <div className="text-xs" style={{ color: template.colors.accent }}>Role Title</div>
              </div>
              <div className="w-6 h-6 rounded-full bg-gray-300"></div>
            </div>
            <div className="space-y-2">
              <div className="font-bold text-xs pb-1 border-b" style={{ color: template.colors.primary, borderColor: template.colors.primary }}>
                EXPERIENCE
              </div>
              <div className="flex">
                <div className="flex flex-col items-center mr-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: template.colors.accent }}></div>
                  <div className="w-0.5 h-8 mt-1" style={{ backgroundColor: template.colors.accent }}></div>
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium">Position</div>
                  <div className="text-xs" style={{ color: template.colors.accent }}>Company</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {template.id === 'blue-sidebar-clean' && (
          <div className="h-full flex">
            <div className="flex-1 p-3">
              <div className="space-y-2">
                <div className="text-sm font-bold" style={{ color: template.colors.text }}>YOUR NAME</div>
                <div className="text-xs" style={{ color: template.colors.accent }}>Role Title</div>
                <div className="font-bold text-xs pb-1 border-b mt-3" style={{ color: template.colors.text, borderColor: template.colors.text }}>
                  SUMMARY
                </div>
                <div className="space-y-1">
                  <div className="h-1 bg-gray-200 rounded"></div>
                  <div className="h-1 bg-gray-200 rounded w-4/5"></div>
                </div>
              </div>
            </div>
            <div className="w-1/3 p-3" style={{ backgroundColor: template.colors.sidebar }}>
              <div className="space-y-2">
                <div className="font-bold text-xs pb-1 border-b" style={{ color: template.colors.primary, borderColor: template.colors.primary }}>
                  SKILLS
                </div>
                <div className="space-y-1">
                  <div className="h-1 bg-gray-300 rounded w-full"></div>
                  <div className="h-1 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Default preview for existing templates */}
        {!['ivy-league-classic', 'green-organic-sidebar', 'navy-header-professional', 'orange-timeline-modern', 'blue-sidebar-clean', 'soft-blue-elegant'].includes(template.id) && (
          <div className="h-full flex">
            {template.layout === 'double-column' ? (
              <>
                <div className="flex-1 p-3">
                  <div className="space-y-2">
                    <div className="text-lg font-bold" style={{ color: template.colors.primary }}>YOUR NAME</div>
                    <div className="text-sm" style={{ color: template.colors.accent }}>Role Title</div>
                    <div className="space-y-2 mt-3">
                      <div className="font-bold text-xs" style={{ color: template.colors.text }}>SUMMARY</div>
                      <div className="space-y-1">
                        <div className="h-1 bg-gray-200 rounded"></div>
                        <div className="h-1 bg-gray-200 rounded w-4/5"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-1/3 p-3" style={{ backgroundColor: template.colors.sidebar }}>
                  <div className="w-8 h-8 rounded-full bg-gray-300 mx-auto mb-2"></div>
                  <div className="space-y-2">
                    <div className="font-bold text-xs" style={{ color: template.colors.text }}>SKILLS</div>
                    <div className="space-y-1">
                      <div className="h-1 bg-gray-300 rounded w-full"></div>
                      <div className="h-1 bg-gray-300 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full p-3 text-center">
                <div className="w-8 h-8 rounded-full bg-gray-300 mx-auto mb-2"></div>
                <div className="text-sm font-bold mb-1" style={{ color: template.colors.primary }}>YOUR NAME</div>
                <div className="text-xs mb-3" style={{ color: template.colors.secondary }}>Role Title</div>
                <div className="space-y-2 text-xs">
                  <div className="font-semibold" style={{ color: template.colors.primary }}>Summary</div>
                  <div className="space-y-1">
                    <div className="h-1 bg-gray-200 rounded"></div>
                    <div className="h-1 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  </div>
                </div>
              </div>
            )}
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
            <p className="text-gray-600">Select from our collection of professionally designed resume layouts, each crafted for different industries and styles.</p>
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
            { key: 'classic', label: 'Classic' },
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