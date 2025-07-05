import React, { useState } from 'react';
import { Palette, Type, Download, FileText, FileType, Save, Eye, EyeOff, Layout, Plus, Trash2, ToggleLeft, ToggleRight, X } from 'lucide-react';
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, KeyboardSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ResumeData, Customizations } from '../types/resume';
import { reactiveTemplates } from '../data/reactive-templates';
import { TemplateRenderer } from './template-engine/TemplateRenderer';
import { ResumePreview } from './ResumePreview';
import { ConfirmationDialog } from './ConfirmationDialog';
import { useConfirmation } from '../hooks/useConfirmation';

interface ResumeCustomizerProps {
  resumeData: ResumeData;
  selectedTemplate: string;
  customizations: Customizations;
  onCustomizationsUpdate: (customizations: Customizations) => void;
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
  const [activeTab, setActiveTab] = useState<'colors' | 'fonts' | 'sections'>('colors');
  const [isExporting, setIsExporting] = useState(false);
  const [editableResumeData, setEditableResumeData] = useState<ResumeData>(resumeData);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionComponent, setNewSectionComponent] = useState('CustomText');
  const [newSectionColumn, setNewSectionColumn] = useState(1);

  // CRITICAL FIX: Local confirmation dialog hook for this component
  const { confirmation, showConfirmation } = useConfirmation();

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  console.log('ResumeCustomizer - Received resumeData:', resumeData); // Debug log
  console.log('ResumeCustomizer - showConfirmation available:', !!showConfirmation); // Debug log

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
    { name: 'Professional Blue', primary: '#3B82F6', secondary: '#1E40AF', accent: '#10B981', surface: '#F8FAFC', muted: '#F1F5F9' },
    { name: 'Corporate Navy', primary: '#1E293B', secondary: '#475569', accent: '#0EA5E9', surface: '#F1F5F9', muted: '#E2E8F0' },
    { name: 'Creative Purple', primary: '#8B5CF6', secondary: '#7C3AED', accent: '#F59E0B', surface: '#FAF5FF', muted: '#F3E8FF' },
    { name: 'Modern Teal', primary: '#14B8A6', secondary: '#0F766E', accent: '#F97316', surface: '#F0FDFA', muted: '#CCFBF1' },
    { name: 'Classic Black', primary: '#1F2937', secondary: '#4B5563', accent: '#EF4444', surface: '#F9FAFB', muted: '#F3F4F6' },
    { name: 'Tech Green', primary: '#059669', secondary: '#047857', accent: '#F59E0B', surface: '#ECFDF5', muted: '#D1FAE5' },
    { name: 'Warm Orange', primary: '#F97316', secondary: '#EA580C', accent: '#3B82F6', surface: '#FFF7ED', muted: '#FED7AA' },
    { name: 'Elegant Rose', primary: '#E11D48', secondary: '#BE185D', accent: '#8B5CF6', surface: '#FFF1F2', muted: '#FECDD3' }
  ];

  // Available section types for adding new sections
  const availableSectionTypes = [
    { value: 'CustomText', label: 'Custom Text', description: 'Add any custom content with title and text' },
    { value: 'Skills', label: 'Additional Skills', description: 'Create a separate skills section' },
    { value: 'Experience', label: 'Additional Experience', description: 'Add more work experience sections' },
    { value: 'Education', label: 'Additional Education', description: 'Add more education sections' },
    { value: 'Certifications', label: 'Additional Certifications', description: 'Add more certification sections' },
    { value: 'Languages', label: 'Additional Languages', description: 'Add more language sections' }
  ];

  // Get current template config
  const reactiveTemplate = reactiveTemplates.find(t => t.id === selectedTemplate);

  const handleExport = async (format: 'pdf' | 'docx') => {
    setIsExporting(true);
    try {
      await onExport(format);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCustomizationChange = (field: string, value: any) => {
    const newCustomizations: Customizations = { ...customizations };
    if (field.includes('.')) {
      const parts = field.split('.');
      let current: any = newCustomizations;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) current[parts[i]] = {};
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
    } else {
      (newCustomizations as any)[field] = value;
    }
    
    onCustomizationsUpdate(newCustomizations);
  };

  // Handle resume data updates from editable components
  const handleResumeDataUpdate = (updatedData: ResumeData) => {
    console.log('ResumeCustomizer - Data updated:', updatedData); // Debug log
    setEditableResumeData(updatedData);
  };

  // Section management functions
  const getAllSections = () => {
    if (!reactiveTemplate) return [];
    
    const baseSections = reactiveTemplate.layout.sections || [];
    const sectionCustomizations = customizations.sections || {};
    
    // Start with base sections
    const allSections = [...baseSections];
    
    // Add custom sections that don't exist in base
    Object.values(sectionCustomizations).forEach((customSection: any) => {
      const existsInBase = baseSections.some(base => base.id === customSection.id);
      if (!existsInBase && customSection.visible !== false) {
        allSections.push({
          id: customSection.id,
          name: customSection.name,
          component: customSection.component,
          visible: true,
          order: customSection.order,
          columns: customSection.columns,
          styles: customSection.styles || {}
        });
      }
    });
    
    // Apply customizations to all sections
    return allSections
      .map(section => {
        const customization = sectionCustomizations[section.id];
        if (customization) {
          return {
            ...section,
            name: customization.name || section.name,
            component: customization.component || section.component,
            visible: customization.visible !== undefined ? customization.visible : section.visible,
            order: customization.order !== undefined ? customization.order : section.order,
            columns: customization.columns !== undefined ? customization.columns : section.columns,
            styles: { ...section.styles, ...customization.styles }
          };
        }
        return section;
      })
      .sort((a, b) => a.order - b.order);
  };

  const handleSectionToggle = (sectionId: string, visible: boolean) => {
    const newSections = {
      ...customizations.sections,
      [sectionId]: {
        ...customizations.sections?.[sectionId],
        id: sectionId,
        visible
      }
    };
    
    handleCustomizationChange('sections', newSections);
  };

  const handleSectionDelete = async (sectionId: string) => {
    const allSections = getAllSections();
    const section = allSections.find(s => s.id === sectionId);
    const isDefaultSection = reactiveTemplate?.layout.sections.some(s => s.id === sectionId);
    
    if (isDefaultSection) {
      // For default sections, just hide them
      handleSectionToggle(sectionId, false);
      return;
    }

    // For custom sections, confirm deletion
    const confirmed = await showConfirmation({
      title: 'Delete Section',
      message: `Are you sure you want to delete "${section?.name}" section? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    });

    if (confirmed) {
      const newSections = { ...customizations.sections };
      delete newSections[sectionId];
      handleCustomizationChange('sections', newSections);
    }
  };

  const handleAddSection = () => {
    if (!newSectionName.trim()) return;
    
    const sectionId = `custom_${Date.now()}`;
    const maxOrder = Math.max(...getAllSections().map(s => s.order), 0);
    
    const newSection = {
      id: sectionId,
      name: newSectionName.trim(),
      component: newSectionComponent,
      visible: true,
      order: maxOrder + 1,
      columns: newSectionColumn,
      styles: {}
    };

    const newSections = {
      ...customizations.sections,
      [sectionId]: newSection
    };
    
    handleCustomizationChange('sections', newSections);
    
    // Reset form
    setNewSectionName('');
    setNewSectionComponent('CustomText');
    setNewSectionColumn(1);
    setShowAddSectionModal(false);
  };

  const getColumnName = (columns: number) => {
    switch (columns) {
      case 0: return 'Header';
      case 1: return 'Main Content';
      case 2: return 'Sidebar';
      case 3: return 'Footer';
      default: return 'Unknown';
    }
  };

  const isDefaultSection = (sectionId: string) => {
    return reactiveTemplate?.layout.sections.some(s => s.id === sectionId) || false;
  };

  // Handle drag end for section reordering
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      return;
    }

    const allSections = getAllSections();
    const oldIndex = allSections.findIndex(section => section.id === active.id);
    const newIndex = allSections.findIndex(section => section.id === over.id);
    
    if (oldIndex === -1 || newIndex === -1) return;

    // Create new array with reordered sections
    const reorderedSections = [...allSections];
    const [removed] = reorderedSections.splice(oldIndex, 1);
    reorderedSections.splice(newIndex, 0, removed);

    // Update order numbers for all sections
    const updatedSections = { ...customizations.sections };
    
    reorderedSections.forEach((section, index) => {
      const newOrder = index;
      updatedSections[section.id] = {
        ...updatedSections[section.id],
        id: section.id,
        name: section.name,
        component: section.component,
        visible: section.visible,
        order: newOrder,
        columns: section.columns,
        styles: section.styles || {}
      };
    });

    handleCustomizationChange('sections', updatedSections);
  };

  // Get current colors for display
  const currentColors = customizations.colors || {};

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Enhanced Sidebar */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Customize Resume</h2>
            <p className="text-sm text-gray-600">Personalize your design</p>
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

        {/* Enhanced Tabs - Colors, Fonts, and Sections */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            {[
              { key: 'colors', label: 'Colors', icon: Palette },
              { key: 'fonts', label: 'Fonts', icon: Type },
              { key: 'sections', label: 'Sections', icon: Layout }
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
                          accent: preset.accent,
                          surface: preset.surface,
                          muted: preset.muted
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
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: preset.muted }}
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
                    { key: 'surface', label: 'Surface Color' },
                    { key: 'muted', label: 'Sidebar Background' }
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

          {activeTab === 'sections' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Section Management</h3>
                <button
                  onClick={() => setShowAddSectionModal(true)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg flex items-center text-xs transition-colors"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Section
                </button>
              </div>

              <div className="space-y-3">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={getAllSections().map(section => section.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {getAllSections().map((section) => (
                      <SortableSection
                        key={section.id}
                        section={section}
                        isDefaultSection={isDefaultSection(section.id)}
                        onToggle={(visible) => handleSectionToggle(section.id, visible)}
                        onDelete={() => handleSectionDelete(section.id)}
                        getColumnName={getColumnName}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>

              {getAllSections().length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Layout className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No sections available</p>
                  <p className="text-xs">Add a custom section to get started</p>
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
                  data: editableResumeData, // Use the editable data that gets updated
                  config: reactiveTemplate,
                  customizations: {
                    ...customizations,
                    editMode: isEditMode,
                    onDataUpdate: handleResumeDataUpdate,
                    showConfirmation: showConfirmation // CRITICAL: Pass the local showConfirmation
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

      {/* Add Section Modal */}
      {showAddSectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Add New Section</h3>
              <button
                onClick={() => setShowAddSectionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section Name *
                </label>
                <input
                  type="text"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  placeholder="e.g., Projects, Awards, Publications"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section Type
                </label>
                <select
                  value={newSectionComponent}
                  onChange={(e) => setNewSectionComponent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {availableSectionTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {availableSectionTypes.find(t => t.value === newSectionComponent)?.description}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Placement
                </label>
                <select
                  value={newSectionColumn}
                  onChange={(e) => setNewSectionColumn(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={1}>Main Content</option>
                  <option value={2}>Sidebar</option>
                  <option value={0}>Header</option>
                  <option value={3}>Footer</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowAddSectionModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSection}
                disabled={!newSectionName.trim()}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Section
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CRITICAL FIX: Local Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmation.isOpen}
        title={confirmation.title}
        message={confirmation.message}
        confirmText={confirmation.confirmText}
        cancelText={confirmation.cancelText}
        type={confirmation.type}
        onConfirm={confirmation.onConfirm}
        onCancel={confirmation.onCancel}
      />
    </div>
  );
};

// Sortable Section Component
interface SortableSectionProps {
  section: any;
  isDefaultSection: boolean;
  onToggle: (visible: boolean) => void;
  onDelete: () => void;
  getColumnName: (columns: number) => string;
}

const SortableSection: React.FC<SortableSectionProps> = ({
  section,
  isDefaultSection,
  onToggle,
  onDelete,
  getColumnName
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3 border rounded-lg transition-colors cursor-move ${
        section.visible ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
      } ${isDragging ? 'shadow-lg z-10' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {/* Drag Handle */}
          <div className="flex flex-col space-y-0.5 text-gray-400 cursor-grab active:cursor-grabbing">
            <div className="w-1 h-1 bg-current rounded-full"></div>
            <div className="w-1 h-1 bg-current rounded-full"></div>
            <div className="w-1 h-1 bg-current rounded-full"></div>
            <div className="w-1 h-1 bg-current rounded-full"></div>
            <div className="w-1 h-1 bg-current rounded-full"></div>
            <div className="w-1 h-1 bg-current rounded-full"></div>
          </div>
          
          <h4 className={`font-medium text-sm ${section.visible ? 'text-gray-900' : 'text-gray-500'}`}>
            {section.name}
          </h4>
          {!isDefaultSection && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
              Custom
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(!section.visible);
            }}
            className={`p-1 rounded transition-colors ${
              section.visible ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'
            }`}
            title={section.visible ? 'Hide section' : 'Show section'}
          >
            {section.visible ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
            title={isDefaultSection ? 'Hide section' : 'Delete section'}
          >
            {isDefaultSection ? <EyeOff className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <div className="text-xs text-gray-500 flex items-center justify-between">
        <span>Type: {section.component}</span>
        <span>Placement: {getColumnName(section.columns || 1)}</span>
      </div>
    </div>
  );
};