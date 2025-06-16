import React, { useState } from 'react';
import { CheckCircle, Eye } from 'lucide-react';
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

  const TemplatePreview: React.FC<{ template: ResumeTemplate }> = ({ template }) => (
    <div className="w-full h-64 bg-white border rounded-lg overflow-hidden shadow-sm">
      <div 
        className="h-full p-4 text-xs"
        style={{ 
          backgroundColor: template.colors.background,
          color: template.colors.text 
        }}
      >
        <div className="mb-3">
          <div 
            className="font-bold text-lg mb-1"
            style={{ color: template.colors.primary }}
          >
            John Doe
          </div>
          <div 
            className="text-sm"
            style={{ color: template.colors.secondary }}
          >
            Senior Software Engineer
          </div>
          <div className="text-xs text-gray-500">
            john@email.com • (555) 123-4567
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <div 
              className="font-semibold text-sm border-b pb-1 mb-1"
              style={{ 
                color: template.colors.primary,
                borderColor: template.colors.accent 
              }}
            >
              EXPERIENCE
            </div>
            <div className="text-xs">
              <div className="font-medium">Senior Developer</div>
              <div 
                className="text-xs"
                style={{ color: template.colors.secondary }}
              >
                Tech Corp • 2020-Present
              </div>
            </div>
          </div>
          
          <div>
            <div 
              className="font-semibold text-sm border-b pb-1 mb-1"
              style={{ 
                color: template.colors.primary,
                borderColor: template.colors.accent 
              }}
            >
              SKILLS
            </div>
            <div className="flex flex-wrap gap-1">
              {['React', 'Node.js', 'Python'].map((skill) => (
                <span 
                  key={skill}
                  className="px-2 py-1 rounded text-xs"
                  style={{ 
                    backgroundColor: template.colors.accent + '20',
                    color: template.colors.text 
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Template</h2>
          <p className="text-gray-600">Select a professional template that matches your style and industry.</p>
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
          {filteredTemplates.map((template) => (
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
          ))}
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
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
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
                <div className="aspect-[8.5/11] bg-white border rounded-lg">
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