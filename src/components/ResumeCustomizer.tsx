import React, { useState } from 'react';
import { Palette, Type, Move, Download, FileText, FileType, Save } from 'lucide-react';
import { ResumeData } from '../types/resume';
import { resumeTemplates } from '../data/templates';
import { ResumePreview } from './ResumePreview';

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
  const [activeTab, setActiveTab] = useState<'colors' | 'fonts' | 'layout'>('colors');
  const [isExporting, setIsExporting] = useState(false);

  const fonts = [
    { name: 'Inter', value: 'Inter, sans-serif' },
    { name: 'Roboto', value: 'Roboto, sans-serif' },
    { name: 'Open Sans', value: 'Open Sans, sans-serif' },
    { name: 'Lato', value: 'Lato, sans-serif' },
    { name: 'Playfair Display', value: 'Playfair Display, serif' },
    { name: 'Merriweather', value: 'Merriweather, serif' }
  ];

  const colorPresets = [
    { name: 'Professional Blue', primary: '#3B82F6', secondary: '#1E40AF', accent: '#10B981' },
    { name: 'Corporate Navy', primary: '#1E293B', secondary: '#475569', accent: '#0EA5E9' },
    { name: 'Creative Purple', primary: '#8B5CF6', secondary: '#7C3AED', accent: '#F59E0B' },
    { name: 'Modern Teal', primary: '#14B8A6', secondary: '#0F766E', accent: '#F97316' },
    { name: 'Classic Black', primary: '#1F2937', secondary: '#4B5563', accent: '#EF4444' },
    { name: 'Tech Green', primary: '#059669', secondary: '#047857', accent: '#3B82F6' }
  ];

  const handleExport = async (format: 'pdf' | 'docx') => {
    setIsExporting(true);
    try {
      await onExport(format);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCustomizationChange = (field: string, value: any) => {
    const newCustomizations = { ...customizations };
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      newCustomizations[parent] = { ...newCustomizations[parent], [child]: value };
    } else {
      newCustomizations[field] = value;
    }
    onCustomizationsUpdate(newCustomizations);
  };

  const template = resumeTemplates.find(t => t.id === selectedTemplate);
  const currentColors = { ...template?.colors, ...customizations.colors };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Customize Resume</h2>
            <p className="text-sm text-gray-600">Personalize your resume design</p>
          </div>
          
          {/* Save Draft Button */}
          <button
            onClick={onSaveDraft}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center transition-colors"
          >
            <Save className="w-3 h-3 mr-1" />
            {currentDraftId ? 'Update' : 'Save'}
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            {[
              { key: 'colors', label: 'Colors', icon: Palette },
              { key: 'fonts', label: 'Fonts', icon: Type },
              { key: 'layout', label: 'Layout', icon: Move }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4 mx-auto mb-1" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'colors' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Color Presets</h3>
                <div className="grid grid-cols-2 gap-3">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => handleCustomizationChange('colors', {
                        primary: preset.primary,
                        secondary: preset.secondary,
                        accent: preset.accent
                      })}
                      className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left"
                    >
                      <div className="flex space-x-1 mb-2">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: preset.primary }}
                        />
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: preset.secondary }}
                        />
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: preset.accent }}
                        />
                      </div>
                      <div className="text-xs font-medium text-gray-900">{preset.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Custom Colors</h3>
                <div className="space-y-3">
                  {[
                    { key: 'primary', label: 'Primary Color' },
                    { key: 'secondary', label: 'Secondary Color' },
                    { key: 'accent', label: 'Accent Color' }
                  ].map((color) => (
                    <div key={color.key} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{color.label}</span>
                      <input
                        type="color"
                        value={customizations.colors?.[color.key] || template?.colors[color.key as keyof typeof template.colors] || '#3B82F6'}
                        onChange={(e) => handleCustomizationChange(`colors.${color.key}`, e.target.value)}
                        className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fonts' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">Font Family</h3>
              <div className="space-y-2">
                {fonts.map((font) => (
                  <button
                    key={font.name}
                    onClick={() => handleCustomizationChange('font', font.name)}
                    className={`w-full p-3 text-left border border-gray-200 rounded-lg transition-colors ${
                      customizations.font === font.name
                        ? 'border-blue-500 bg-blue-50'
                        : 'hover:border-gray-300'
                    }`}
                    style={{ fontFamily: font.value }}
                  >
                    <div className="font-medium text-gray-900">{font.name}</div>
                    <div className="text-sm text-gray-500">The quick brown fox jumps</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'layout' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">Section Order</h3>
              <p className="text-sm text-gray-600">Drag to reorder sections</p>
              <div className="space-y-2">
                {customizations.sectionOrder.map((section: string, index: number) => (
                  <div
                    key={section}
                    className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-move"
                  >
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {section.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <Move className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Export Buttons */}
        <div className="border-t border-gray-200 p-6 space-y-3">
          <button
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            {isExporting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
            ) : (
              <FileType className="w-5 h-5 mr-2" />
            )}
            Export as PDF
          </button>
          <button
            onClick={() => handleExport('docx')}
            disabled={isExporting}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            {isExporting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
            ) : (
              <FileText className="w-5 h-5 mr-2" />
            )}
            Export as Word
          </button>
          <button
            onClick={onBack}
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Back to Templates
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Preview</h3>
            <p className="text-gray-600">See how your resume looks with your customizations</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <ResumePreview
              resumeData={resumeData}
              template={selectedTemplate}
              customColors={currentColors}
              font={customizations.font}
              sectionOrder={customizations.sectionOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
};