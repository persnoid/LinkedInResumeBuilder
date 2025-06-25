import React, { useState } from 'react';
import { Palette, Type, Move, Download, FileText, FileType, Save, Eye, EyeOff, GripVertical, Settings, Layers, Sparkles } from 'lucide-react';
import { ResumeData } from '../types/resume';
import { reactiveTemplates } from '../data/reactive-templates';
import { TemplateRenderer } from './template-engine/TemplateRenderer';
import { ResumePreview } from './ResumePreview';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
  const [activeTab, setActiveTab] = useState<'colors' | 'fonts' | 'layout' | 'sections' | 'effects'>('colors');
  const [isExporting, setIsExporting] = useState(false);
  const [editableResumeData, setEditableResumeData] = useState<ResumeData>(resumeData);
  const [isEditMode, setIsEditMode] = useState(false);

  const fonts = [
    { name: 'Inter', value: 'Inter, sans-serif', category: 'Modern' },
    { name: 'Roboto', value: 'Roboto, sans-serif', category: 'Modern' },
    { name: 'Open Sans', value: 'Open Sans, sans-serif', category: 'Clean' },
    { name: 'Lato', value: 'Lato, sans-serif', category: 'Clean' },
    { name: 'Playfair Display', value: 'Playfair Display, serif', category: 'Elegant' },
    { name: 'Merriweather', value: 'Merriweather, serif', category: 'Traditional' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif', category: 'Modern' },
    { name: 'Source Sans Pro', value: 'Source Sans Pro, sans-serif', category: 'Professional' }
  ];

  const colorPresets = [
    { name: 'Professional Blue', primary: '#3B82F6', secondary: '#1E40AF', accent: '#10B981', surface: '#F8FAFC' },
    { name: 'Corporate Navy', primary: '#1E293B', secondary: '#475569', accent: '#0EA5E9', surface: '#F1F5F9' },
    { name: 'Creative Purple', primary: '#8B5CF6', secondary: '#7C3AED', accent: '#F59E0B', surface: '#FAF5FF' },
    { name: 'Modern Teal', primary: '#14B8A6', secondary: '#0F766E', accent: '#F97316', surface: '#F0FDFA' },
    { name: 'Classic Black', primary: '#1F2937', secondary: '#4B5563', accent: '#EF4444', surface: '#F9FAFB' },
    { name: 'Tech Green', primary: '#059669', secondary: '#047857', accent: '#F59E0B', surface: '#ECFDF5' },
    { name: 'Warm Orange', primary: '#F97316', secondary: '#EA580C', accent: '#3B82F6', surface: '#FFF7ED' },
    { name: 'Elegant Rose', primary: '#E11D48', secondary: '#BE185D', accent: '#8B5CF6', surface: '#FFF1F2' }
  ];

  const effectPresets = [
    { name: 'Minimal', borderRadius: 'sm', shadow: 'none' },
    { name: 'Soft', borderRadius: 'md', shadow: 'sm' },
    { name: 'Modern', borderRadius: 'lg', shadow: 'md' },
    { name: 'Bold', borderRadius: 'xl', shadow: 'lg' },
    { name: 'Dramatic', borderRadius: 'xl', shadow: 'xl' }
  ];

  // Get current template config
  const reactiveTemplate = reactiveTemplates.find(t => t.id === selectedTemplate);
  const currentSections = reactiveTemplate?.layout.sections || [];

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
      const parts = field.split('.');
      let current = newCustomizations;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) current[parts[i]] = {};
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
    } else {
      newCustomizations[field] = value;
    }
    
    onCustomizationsUpdate(newCustomizations);
  };

  const handleSectionVisibilityToggle = (sectionId: string) => {
    const currentSections = customizations.visibleSections || currentSections.map(s => s.id);
    const newVisibleSections = currentSections.includes(sectionId)
      ? currentSections.filter((id: string) => id !== sectionId)
      : [...currentSections, sectionId];
    
    handleCustomizationChange('visibleSections', newVisibleSections);
  };

  const handleSectionReorder = (result: any) => {
    if (!result.destination) return;

    const currentOrder = customizations.sectionOrder || currentSections.map(s => s.id);
    const newOrder = Array.from(currentOrder);
    const [reorderedItem] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, reorderedItem);

    handleCustomizationChange('sectionOrder', newOrder);
  };

  const handleSectionStyleChange = (sectionId: string, styleKey: string, value: any) => {
    const currentSectionStyles = customizations.sections || {};
    const sectionStyles = currentSectionStyles[sectionId] || {};
    
    handleCustomizationChange(`sections.${sectionId}.${styleKey}`, value);
  };

  // Handle resume data updates from editable components
  const handleResumeDataUpdate = (updatedData: ResumeData) => {
    setEditableResumeData(updatedData);
  };

  // Get current colors for display
  const currentColors = customizations.colors || {};
  const currentEffects = customizations.effects || {};
  const visibleSections = customizations.visibleSections || currentSections.map(s => s.id);
  const sectionOrder = customizations.sectionOrder || currentSections.map(s => s.id);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Enhanced Sidebar */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Customize Resume</h2>
            <p className="text-sm text-gray-600">Personalize every aspect of your design</p>
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

        {/* Enhanced Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            {[
              { key: 'colors', label: 'Colors', icon: Palette },
              { key: 'fonts', label: 'Fonts', icon: Type },
              { key: 'layout', label: 'Layout', icon: Move },
              { key: 'sections', label: 'Sections', icon: Layers },
              { key: 'effects', label: 'Effects', icon: Sparkles }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 px-3 py-3 text-xs font-medium border-b-2 transition-colors ${
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

        {/* Enhanced Tab Content */}
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
                          accent: preset.accent,
                          surface: preset.surface
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
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: preset.surface }}
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
                    { key: 'accent', label: 'Accent Color' },
                    { key: 'surface', label: 'Surface Color' }
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
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Font Family</h3>
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
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{font.name}</div>
                          <div className="text-sm text-gray-500">{font.category}</div>
                        </div>
                        <div className="text-sm text-gray-400">Aa</div>
                      </div>
                    </button>
                  ))}
                </div>
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

          {activeTab === 'sections' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Section Visibility</h3>
                <div className="space-y-2">
                  {currentSections.map((section) => (
                    <div key={section.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-900">{section.name}</span>
                      <button
                        onClick={() => handleSectionVisibilityToggle(section.id)}
                        className={`p-1 rounded ${
                          visibleSections.includes(section.id)
                            ? 'text-blue-600 hover:text-blue-700'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        {visibleSections.includes(section.id) ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Section Order</h3>
                <DragDropContext onDragEnd={handleSectionReorder}>
                  <Droppable droppableId="sections">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        {sectionOrder.map((sectionId, index) => {
                          const section = currentSections.find(s => s.id === sectionId);
                          if (!section) return null;
                          
                          return (
                            <Draggable key={section.id} draggableId={section.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                                >
                                  <GripVertical className="w-4 h-4 text-gray-400 mr-3" />
                                  <span className="text-sm font-medium text-gray-900 flex-1">
                                    {section.name}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {index + 1}
                                  </span>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </div>
          )}

          {activeTab === 'effects' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Effect Presets</h3>
                <div className="grid grid-cols-1 gap-3">
                  {effectPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => {
                        handleCustomizationChange('effects', {
                          borderRadius: preset.borderRadius,
                          shadow: preset.shadow
                        });
                      }}
                      className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left"
                    >
                      <div className="text-sm font-medium text-gray-900">{preset.name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Radius: {preset.borderRadius} • Shadow: {preset.shadow}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Custom Effects</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Border Radius</label>
                    <select
                      value={currentEffects.borderRadius || 'md'}
                      onChange={(e) => handleCustomizationChange('effects.borderRadius', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="none">None</option>
                      <option value="sm">Small</option>
                      <option value="md">Medium</option>
                      <option value="lg">Large</option>
                      <option value="xl">Extra Large</option>
                      <option value="full">Full</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Shadow</label>
                    <select
                      value={currentEffects.shadow || 'sm'}
                      onChange={(e) => handleCustomizationChange('effects.shadow', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="none">None</option>
                      <option value="sm">Small</option>
                      <option value="md">Medium</option>
                      <option value="lg">Large</option>
                      <option value="xl">Extra Large</option>
                    </select>
                  </div>
                </div>
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