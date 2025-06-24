import React, { useState } from 'react';
import { Palette, Type, Move, Download, FileText, FileType, Save } from 'lucide-react';
import { ResumeData } from '../types/resume';
import { reactiveTemplates } from '../data/reactive-templates';
import { TemplateRenderer } from './template-engine/TemplateRenderer';
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
  const [editableResumeData, setEditableResumeData] = useState<ResumeData>(resumeData);
  const [isEditMode, setIsEditMode] = useState(false);

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
    { name: 'Tech Green', primary: '#059669', secondary: '#047857', accent: '#F59E0B' },
    { name: 'Orange Modern', primary: '#F97316', secondary: '#EA580C', accent: '#3B82F6' },
    { name: 'Soft Blue', primary: '#1E40AF', secondary: '#6B7280', accent: '#93C5FD' }
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

  // Handle resume data updates from editable components
  const handleResumeDataUpdate = (updatedData: ResumeData) => {
    setEditableResumeData(updatedData);
  };

  // Check if we have a reactive template
  const reactiveTemplate = reactiveTemplates.find(t => t.id === selectedTemplate);
  
  // Get current colors for display
  const currentColors = customizations.colors || {};

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

        {/* Edit Mode Toggle */}
        <div className="p-4 border-b border-gray-200 bg-blue-50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Edit Mode</span>
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isEditMode ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isEditMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {isEditMode ? 'Click on text to edit directly' : 'Enable to edit text in preview'}
          </p>
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
                <div className="grid grid-cols-1 gap-3">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => {
                        handleCustomizationChange('colors', {
                          primary: preset.primary,
                          secondary: preset.secondary,
                          accent: preset.accent
                        });
                      }}
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
                        value={currentColors[color.key] || '#3B82F6'}
                        onChange={(e) => {
                          handleCustomizationChange(`colors.${color.key}`, e.target.value);
                        }}
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
                    onClick={() => handleCustomizationChange('typography.fontFamily', font.value)}
                    className={`w-full p-3 text-left border border-gray-200 rounded-lg transition-colors ${
                      customizations.typography?.fontFamily === font.value
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

              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900">Font Sizes</h3>
                {[
                  { key: 'base', label: 'Base Text', min: 10, max: 16, default: 12 },
                  { key: 'heading1', label: 'Main Heading', min: 24, max: 40, default: 28 },
                  { key: 'heading2', label: 'Section Heading', min: 16, max: 28, default: 20 },
                  { key: 'heading3', label: 'Sub Heading', min: 12, max: 20, default: 16 },
                  { key: 'small', label: 'Small Text', min: 8, max: 12, default: 11 }
                ].map((fontSize) => (
                  <div key={fontSize.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{fontSize.label}</span>
                      <span className="text-xs text-gray-500">
                        {customizations.typography?.fontSize?.[fontSize.key] || `${fontSize.default}px`}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={fontSize.min}
                      max={fontSize.max}
                      value={parseInt(customizations.typography?.fontSize?.[fontSize.key] || fontSize.default)}
                      onChange={(e) => {
                        const newFontSizes = {
                          ...customizations.typography?.fontSize,
                          [fontSize.key]: `${e.target.value}px`
                        };
                        handleCustomizationChange('typography.fontSize', newFontSizes);
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'layout' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">Template Layout</h3>
              <p className="text-sm text-gray-600">
                {reactiveTemplate 
                  ? `This template uses a ${reactiveTemplate.layout.type.replace('-', ' ')} layout with customizable sections.`
                  : 'Layout options are automatically arranged based on the selected template.'
                }
              </p>
              {reactiveTemplate && (
                <div className="space-y-2">
                  {reactiveTemplate.layout.sections
                    .sort((a, b) => a.order - b.order)
                    .map((section) => (
                      <div
                        key={section.id}
                        className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                      >
                        <span className="text-sm font-medium text-gray-900">
                          {section.name}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {section.columns === 0 ? 'Header' : 
                             section.columns === 1 ? 'Main' : 
                             section.columns === 2 ? 'Sidebar' : 'Footer'}
                          </span>
                          <Move className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    ))}
                </div>
              )}
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
                    onDataUpdate: handleResumeDataUpdate
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
    </div>
  );
};