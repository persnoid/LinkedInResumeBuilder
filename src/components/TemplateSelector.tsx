import React, { useState } from 'react';
import { CheckCircle, Eye, Layout, Palette, Grid, Clock, Minimize2, Save } from 'lucide-react';
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
      case 'creative-blocks': return Palette;
      case 'timeline': return Clock;
      case 'minimal-spaced': return Minimize2;
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
            <div className="w-1/3 p-3" style={{ backgroundColor: template.colors.sidebar || '#1E293B' }}>
              <div className="w-8 h-8 rounded-full bg-gray-300 mx-auto mb-2"></div>
              <div className="text-center text-xs space-y-1 text-white">
                <div className="font-bold">John Doe</div>
                <div className="text-gray-300">Software Engineer</div>
                <div className="space-y-1 mt-3">
                  <div className="text-xs font-bold text-white">CONTACT</div>
                  <div className="text-xs text-gray-300">john@email.com</div>
                  <div className="text-xs text-gray-300">+1 234 567 8900</div>
                  <div className="text-xs font-bold text-white mt-2">SKILLS</div>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="space-y-0.5">
                      <div className="text-xs text-gray-300">React</div>
                      <div className="w-full bg-gray-600 rounded-full h-1">
                        <div className="h-1 rounded-full" style={{ backgroundColor: template.colors.accent, width: `${i * 30}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-1 p-3">
              <div className="space-y-3">
                <div>
                  <div className="h-2 rounded mb-1" style={{ backgroundColor: template.colors.primary, width: '60%' }}></div>
                  <div className="text-xs font-bold" style={{ color: template.colors.primary }}>EXPERIENCE</div>
                  <div className="space-y-1 mt-1">
                    <div className="h-1 bg-gray-200 rounded"></div>
                    <div className="h-1 bg-gray-200 rounded w-4/5"></div>
                    <div className="h-1 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold" style={{ color: template.colors.primary }}>EDUCATION</div>
                  <div className="space-y-1 mt-1">
                    <div className="h-1 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-1 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {template.layout === 'ivy-league' && (
          <div className="h-full p-4 text-center">
            <div className="border-b pb-3 mb-3" style={{ borderColor: template.colors.primary }}>
              <div className="text-lg font-bold" style={{ color: template.colors.primary }}>JOHN DOE</div>
              <div className="text-sm" style={{ color: template.colors.secondary }}>Software Engineer</div>
              <div className="text-xs text-gray-500 mt-1">john@email.com • +1 234 567 8900 • San Francisco, CA</div>
            </div>
            <div className="space-y-3 text-xs text-left">
              <div>
                <div className="font-semibold text-center mb-1" style={{ color: template.colors.primary }}>PROFESSIONAL SUMMARY</div>
                <div className="space-y-1">
                  <div className="h-1 bg-gray-200 rounded"></div>
                  <div className="h-1 bg-gray-200 rounded w-4/5"></div>
                  <div className="h-1 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
              <div>
                <div className="font-semibold text-center mb-1" style={{ color: template.colors.primary }}>EXPERIENCE</div>
                <div className="space-y-1">
                  <div className="h-1 bg-gray-200 rounded"></div>
                  <div className="h-1 bg-gray-200 rounded w-4/5"></div>
                </div>
              </div>
              <div>
                <div className="font-semibold text-center mb-1" style={{ color: template.colors.primary }}>EDUCATION</div>
                <div className="space-y-1">
                  <div className="h-1 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {template.layout === 'creative-blocks' && (
          <div className="h-full p-2">
            <div className="grid grid-cols-3 gap-2 h-full">
              <div className="col-span-2 space-y-2">
                <div className="p-2 rounded" style={{ backgroundColor: template.colors.primary }}>
                  <div className="text-white font-bold text-sm">JOHN DOE</div>
                  <div className="text-white text-xs opacity-90">Creative Professional</div>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <div className="text-xs font-bold mb-1" style={{ color: template.colors.primary }}>EXPERIENCE</div>
                  <div className="space-y-1">
                    <div className="h-1 bg-gray-200 rounded"></div>
                    <div className="h-1 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
                <div className="p-2 rounded" style={{ backgroundColor: template.colors.highlight }}>
                  <div className="text-xs font-bold mb-1" style={{ color: template.colors.secondary }}>PORTFOLIO</div>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="h-3 rounded" style={{ backgroundColor: template.colors.accent }}></div>
                    <div className="h-3 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="p-2 rounded" style={{ backgroundColor: template.colors.accent }}>
                  <div className="text-white text-xs font-bold">SKILLS</div>
                  <div className="space-y-1 mt-1">
                    <div className="h-1 bg-white bg-opacity-60 rounded"></div>
                    <div className="h-1 bg-white bg-opacity-60 rounded w-3/4"></div>
                    <div className="h-1 bg-white bg-opacity-60 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="p-2 bg-gray-100 rounded">
                  <div className="text-xs font-bold mb-1" style={{ color: template.colors.primary }}>CONTACT</div>
                  <div className="space-y-1">
                    <div className="h-1 bg-gray-300 rounded w-full"></div>
                    <div className="h-1 bg-gray-300 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="p-2 rounded" style={{ backgroundColor: template.colors.secondary }}>
                  <div className="text-white text-xs font-bold">AWARDS</div>
                  <div className="h-1 bg-white bg-opacity-60 rounded mt-1"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {template.layout === 'timeline' && (
          <div className="h-full p-3">
            <div className="text-center mb-3">
              <div className="text-sm font-bold" style={{ color: template.colors.primary }}>John Doe</div>
              <div className="text-xs" style={{ color: template.colors.secondary }}>Software Engineer</div>
            </div>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5" style={{ backgroundColor: template.colors.timeline }}></div>
              
              {/* Timeline items */}
              <div className="space-y-3">
                {[2024, 2022, 2020].map((year, i) => (
                  <div key={year} className="relative flex items-start">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white z-10" style={{ backgroundColor: template.colors.primary }}>
                      {year.toString().slice(-2)}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="text-xs font-semibold" style={{ color: template.colors.primary }}>
                        {i === 0 ? 'Senior Developer' : i === 1 ? 'Developer' : 'Junior Developer'}
                      </div>
                      <div className="text-xs text-gray-500">Tech Company</div>
                      <div className="space-y-0.5 mt-1">
                        <div className="h-0.5 bg-gray-200 rounded w-full"></div>
                        <div className="h-0.5 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {template.layout === 'minimal-spaced' && (
          <div className="h-full p-6 text-xs" style={{ color: template.colors.text }}>
            <div className="text-center mb-6">
              <div className="font-light text-2xl mb-1" style={{ color: template.colors.primary }}>
                John Doe
              </div>
              <div className="text-sm font-light" style={{ color: template.colors.secondary }}>
                Software Engineer
              </div>
              <div className="text-xs text-gray-400 mt-2">
                john@email.com
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="font-light text-sm mb-3" style={{ color: template.colors.primary }}>
                  Experience
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="font-medium text-xs">Senior Developer</div>
                    <div className="text-xs" style={{ color: template.colors.secondary }}>Tech Corp</div>
                    <div className="h-0.5 bg-gray-200 rounded w-full mt-2"></div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="font-light text-sm mb-3" style={{ color: template.colors.primary }}>
                  Skills
                </div>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Node.js', 'Python'].map((skill) => (
                    <span key={skill} className="text-xs px-2 py-1 rounded-full border" style={{ borderColor: template.colors.accent, color: template.colors.text }}>
                      {skill}
                    </span>
                  ))}
                </div>
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
            <p className="text-gray-600">Select from our collection of professionally designed resume layouts, each with unique structure and visual appeal.</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
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