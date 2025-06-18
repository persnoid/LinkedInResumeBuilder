import React, { useState } from 'react';
import { CheckCircle, Eye, Layout, Palette, Grid, Clock, BookOpen, BarChart3, Minimize2, Type } from 'lucide-react';
import { resumeTemplates } from '../data/templates';
import { ResumeTemplate } from '../types/resume';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateSelect,
  onNext,
  onBack
}) => {
  const [filter, setFilter] = useState<'all' | 'modern' | 'classic' | 'creative' | 'minimal'>('all');
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  const filteredTemplates = filter === 'all' 
    ? resumeTemplates 
    : resumeTemplates.filter(template => template.category === filter);

  // Layout icons mapping
  const getLayoutIcon = (layout: string) => {
    switch (layout) {
      case 'single-column': return Layout;
      case 'two-column-sidebar': return Grid;
      case 'creative-blocks': return Palette;
      case 'minimal-spaced': return Minimize2;
      case 'tech-grid': return Grid;
      case 'timeline': return Clock;
      case 'academic': return BookOpen;
      case 'infographic': return BarChart3;
      case 'compact': return Layout;
      case 'elegant-serif': return Type;
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
        {template.layout === 'two-column-sidebar' && (
          <div className="h-full flex">
            <div className="w-1/3 p-3" style={{ backgroundColor: template.colors.sidebar || '#F9FAFB' }}>
              <div className="text-xs space-y-2">
                <div className="font-bold" style={{ color: template.colors.primary }}>John Doe</div>
                <div style={{ color: template.colors.secondary }}>Developer</div>
                <div className="space-y-1">
                  <div className="h-1 bg-gray-300 rounded"></div>
                  <div className="h-1 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            </div>
            <div className="flex-1 p-3">
              <div className="space-y-2">
                <div className="h-2 rounded" style={{ backgroundColor: template.colors.primary, width: '60%' }}></div>
                <div className="space-y-1">
                  <div className="h-1 bg-gray-200 rounded"></div>
                  <div className="h-1 bg-gray-200 rounded w-4/5"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {template.layout === 'creative-blocks' && (
          <div className="h-full p-3">
            <div className="grid grid-cols-3 gap-2 h-full">
              <div className="col-span-2 rounded p-2" style={{ backgroundColor: template.colors.highlight || '#FEF3C7' }}>
                <div className="text-xs font-bold" style={{ color: template.colors.primary }}>John Doe</div>
                <div className="text-xs" style={{ color: template.colors.secondary }}>Creative Professional</div>
              </div>
              <div className="bg-gray-100 rounded p-2">
                <div className="space-y-1">
                  <div className="h-1 rounded" style={{ backgroundColor: template.colors.accent }}></div>
                  <div className="h-1 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
              <div className="col-span-3 bg-gray-50 rounded p-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <div className="h-1 rounded" style={{ backgroundColor: template.colors.primary }}></div>
                    <div className="h-1 bg-gray-200 rounded"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1 rounded" style={{ backgroundColor: template.colors.secondary }}></div>
                    <div className="h-1 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {template.layout === 'timeline' && (
          <div className="h-full p-3 relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5" style={{ backgroundColor: template.colors.timeline || '#FEE2E2' }}></div>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-1/2 text-right pr-2">
                  <div className="text-xs font-bold" style={{ color: template.colors.primary }}>Position 1</div>
                  <div className="text-xs" style={{ color: template.colors.secondary }}>Company</div>
                </div>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: template.colors.accent }}></div>
                <div className="w-1/2"></div>
              </div>
              <div className="flex items-center">
                <div className="w-1/2"></div>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: template.colors.accent }}></div>
                <div className="w-1/2 pl-2">
                  <div className="text-xs font-bold" style={{ color: template.colors.primary }}>Position 2</div>
                  <div className="text-xs" style={{ color: template.colors.secondary }}>Company</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {template.layout === 'tech-grid' && (
          <div className="h-full p-3" style={{ backgroundColor: '#1a1a1a', color: '#00ff00', fontFamily: 'monospace' }}>
            <div className="text-xs space-y-1">
              <div>const developer = &#123;</div>
              <div className="ml-2">name: "John Doe",</div>
              <div className="ml-2">role: "Developer"</div>
              <div>&#125;;</div>
              <div className="mt-2 grid grid-cols-2 gap-1">
                <div className="bg-gray-800 p-1 rounded text-xs">React</div>
                <div className="bg-gray-800 p-1 rounded text-xs">Node.js</div>
              </div>
            </div>
          </div>
        )}

        {template.layout === 'minimal-spaced' && (
          <div className="h-full p-6 text-center">
            <div className="space-y-4">
              <div className="text-lg font-light" style={{ color: template.colors.primary }}>John Doe</div>
              <div className="text-sm" style={{ color: template.colors.secondary }}>Minimalist Professional</div>
              <div className="space-y-2">
                <div className="h-0.5 bg-gray-200 w-1/2 mx-auto"></div>
                <div className="text-xs text-gray-500">Clean • Simple • Elegant</div>
              </div>
            </div>
          </div>
        )}

        {template.layout === 'infographic' && (
          <div className="h-full p-3">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-xs font-bold" style={{ color: template.colors.primary }}>John Doe</div>
                <div className="flex space-x-1">
                  <div className="w-6 h-6 bg-blue-100 rounded text-xs flex items-center justify-center">5</div>
                  <div className="w-6 h-6 bg-green-100 rounded text-xs flex items-center justify-center">8</div>
                </div>
              </div>
              <div className="space-y-1">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center space-x-2">
                    <span className="text-xs w-8">Skill</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-1">
                      <div className="h-1 rounded-full" style={{ backgroundColor: template.colors.accent, width: `${i * 30}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {template.layout === 'compact' && (
          <div className="h-full p-2 text-xs">
            <div className="flex justify-between border-b pb-1 mb-2">
              <div>
                <div className="font-bold" style={{ color: template.colors.primary }}>John Doe</div>
                <div style={{ color: template.colors.secondary }}>Professional</div>
              </div>
              <div className="text-right text-xs">
                <div>email@example.com</div>
                <div>+1 234 567 8900</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="col-span-2 space-y-1">
                <div className="font-semibold">Experience</div>
                <div className="border-l-2 pl-2" style={{ borderColor: template.colors.accent }}>
                  <div className="font-medium">Position</div>
                  <div>Company • 2020-Present</div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="font-semibold">Skills</div>
                <div className="space-y-0.5">
                  <div className="bg-gray-200 h-1 rounded"></div>
                  <div className="bg-gray-200 h-1 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {template.layout === 'academic' && (
          <div className="h-full p-3" style={{ fontFamily: 'serif' }}>
            <div className="text-center border-b pb-2 mb-2">
              <div className="text-sm font-bold" style={{ color: template.colors.primary }}>John Doe</div>
              <div className="text-xs">Academic Professional</div>
              <div className="text-xs">email@university.edu</div>
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <div className="font-semibold uppercase">Education</div>
                <div>Ph.D. in Computer Science</div>
                <div className="italic">University Name, 2020</div>
              </div>
              <div>
                <div className="font-semibold uppercase">Research</div>
                <div>Research interests and publications...</div>
              </div>
            </div>
          </div>
        )}

        {template.layout === 'elegant-serif' && (
          <div className="h-full p-4 text-center" style={{ fontFamily: 'serif' }}>
            <div className="border-t-2 border-b-2 py-3" style={{ borderColor: template.colors.primary }}>
              <div className="text-lg font-bold" style={{ color: template.colors.primary }}>John Doe</div>
              <div className="w-8 h-0.5 mx-auto my-1" style={{ backgroundColor: template.colors.accent }}></div>
              <div className="text-sm italic" style={{ color: template.colors.secondary }}>Elegant Professional</div>
            </div>
            <div className="mt-3 text-xs">
              <div className="italic">"Professional summary with elegant typography"</div>
            </div>
          </div>
        )}

        {/* Default single column layout */}
        {!['two-column-sidebar', 'creative-blocks', 'timeline', 'tech-grid', 'minimal-spaced', 'infographic', 'compact', 'academic', 'elegant-serif'].includes(template.layout) && (
          <div className="h-full p-4 text-xs" style={{ color: template.colors.text }}>
            <div className="mb-3">
              <div className="font-bold text-lg mb-1" style={{ color: template.colors.primary }}>
                John Doe
              </div>
              <div className="text-sm" style={{ color: template.colors.secondary }}>
                Professional Title
              </div>
              <div className="text-xs text-gray-500">
                john@email.com • (555) 123-4567
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="font-semibold text-sm border-b pb-1 mb-1" style={{ color: template.colors.primary, borderColor: template.colors.accent }}>
                  EXPERIENCE
                </div>
                <div className="text-xs">
                  <div className="font-medium">Senior Developer</div>
                  <div style={{ color: template.colors.secondary }}>Tech Corp • 2020-Present</div>
                </div>
              </div>
              
              <div>
                <div className="font-semibold text-sm border-b pb-1 mb-1" style={{ color: template.colors.primary, borderColor: template.colors.accent }}>
                  SKILLS
                </div>
                <div className="flex flex-wrap gap-1">
                  {['React', 'Node.js', 'Python'].map((skill) => (
                    <span key={skill} className="px-2 py-1 rounded text-xs" style={{ backgroundColor: template.colors.accent + '20', color: template.colors.text }}>
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
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Template</h2>
          <p className="text-gray-600">Select from our diverse collection of professional resume layouts, each designed for different industries and styles.</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {filteredTemplates.map((template) => {
            const LayoutIcon = getLayoutIcon(template.layout);
            
            return (
              <div
                key={template.id}
                className={`group relative bg-white rounded-xl shadow-sm border-2 transition-all duration-200 hover:shadow-md cursor-pointer ${
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