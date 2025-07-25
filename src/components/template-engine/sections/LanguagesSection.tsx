import React, { useState } from 'react';
import { Plus, Trash2, Globe, Edit3, Save, X } from 'lucide-react';

interface LanguagesSectionProps {
  data: any;
  styles: any;
  sectionStyles: any;
  config: any;
  editMode?: boolean;
  onDataUpdate?: (field: string, value: any) => void;
  showConfirmation?: (options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
  }) => Promise<boolean>;
}

interface LanguageEntry {
  id: string;
  name: string;
  level: string;
}

interface LanguageFormData {
  name: string;
  level: string;
}

export const LanguagesSection: React.FC<LanguagesSectionProps> = ({
  data,
  styles,
  sectionStyles,
  config,
  editMode = false,
  onDataUpdate,
  showConfirmation
}) => {
  const { languages } = data;
  
  // Provide meaningful fallback languages data
  const displayLanguages = languages && languages.length > 0 ? languages : [
    { id: '1', name: 'English', level: 'Native' },
    { id: '2', name: 'Spanish', level: 'Fluent' },
    { id: '3', name: 'French', level: 'Intermediate' }
  ];

  // Form state management
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<LanguageFormData>({
    name: '',
    level: 'Intermediate'
  });

  // Get dynamic icon size from customizations
  const getIconSize = () => {
    const iconSize = styles?.typography?.iconSize || 'sm';
    const sizeMap = {
      'xs': 8,
      'sm': 12, 
      'md': 16,
      'lg': 20,
      'xl': 24
    };
    return sizeMap[iconSize] || sizeMap['sm'];
  };
  
  const iconSizePx = getIconSize();

  // Proficiency levels
  const proficiencyLevels = [
    'Beginner',
    'Elementary',
    'Intermediate',
    'Upper Intermediate',
    'Advanced',
    'Fluent',
    'Native'
  ];

  // Initialize form for new entry
  const initializeNewForm = () => {
    setFormData({
      name: '',
      level: 'Intermediate'
    });
    setEditingId(null);
    setShowForm(true);
  };

  // Initialize form for editing existing entry
  const initializeEditForm = (lang: LanguageEntry) => {
    setFormData({
      name: lang.name,
      level: lang.level
    });
    setEditingId(lang.id);
    setShowForm(true);
  };

  // Handle form field changes
  const handleFormChange = (field: keyof LanguageFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const handleFormSubmit = () => {
    if (!formData.name.trim()) {
      alert('Please enter a language name.');
      return;
    }

    const newEntry: LanguageEntry = {
      id: editingId || Date.now().toString(),
      name: formData.name.trim(),
      level: formData.level
    };

    let updatedLanguages;
    if (editingId) {
      // Update existing entry
      updatedLanguages = displayLanguages.map((lang: LanguageEntry) => 
        lang.id === editingId ? newEntry : lang
      );
    } else {
      // Add new entry
      updatedLanguages = [...displayLanguages, newEntry];
    }

    if (onDataUpdate) {
      onDataUpdate('languages', updatedLanguages);
    }

    // Reset form
    setShowForm(false);
    setEditingId(null);
  };

  // Handle entry deletion with unified confirmation
  const handleDelete = async (id: string) => {
    let confirmed = false;
    
    if (showConfirmation) {
      confirmed = await showConfirmation({
        title: 'Delete Language',
        message: 'Are you sure you want to delete this language? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger'
      });
    } else {
      // Fallback to browser confirm if showConfirmation is not available
      confirmed = confirm('Are you sure you want to delete this language?');
    }

    if (confirmed) {
      const updatedLanguages = displayLanguages.filter((lang: LanguageEntry) => lang.id !== id);
      if (onDataUpdate) {
        onDataUpdate('languages', updatedLanguages);
      }
    }
  };

  // Cancel form
  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const getLevelDots = (level: string) => {
    const normalizedLevel = level.toLowerCase().trim();
    
    // Enhanced mapping to handle more proficiency levels
    const levels = {
      'beginner': 1,
      'basic': 1,
      'elementary': 2,
      'intermediate': 3,
      'upper intermediate': 3,
      'advanced': 4,
      'upper advanced': 4,
      'fluent': 4,
      'full professional': 4,
      'proficient': 4,
      'expert': 5,
      'native': 5,
      'native or bilingual': 5,
      'bilingual': 5,
      'mother tongue': 5
    };
    
    return levels[normalizedLevel] || 3; // Default to 3 dots if level not found
  };

  const EditableText: React.FC<{
    value: string;
    onSave: (value: string) => void;
    className?: string;
    style?: React.CSSProperties;
    placeholder?: string;
  }> = ({ value, onSave, className = '', style = {}, placeholder = '' }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);

    const handleSave = () => {
      onSave(editValue);
      setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSave();
      } else if (e.key === 'Escape') {
        setEditValue(value);
        setIsEditing(false);
      }
    };

    if (editMode && isEditing) {
      return (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className={`${className} border-2 border-blue-500 rounded px-2 py-1`}
          style={style}
          placeholder={placeholder}
          autoFocus
        />
      );
    }

    return (
      <span
        className={`${className} ${editMode ? 'cursor-pointer hover:bg-blue-50 hover:outline hover:outline-2 hover:outline-blue-300 rounded px-1' : ''}`}
        style={style}
        onClick={() => editMode && setIsEditing(true)}
        title={editMode ? 'Click to edit' : ''}
      >
        {value || placeholder}
      </span>
    );
  };

  // Language Form Component
  const LanguageForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        {/* Form Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {editingId ? 'Edit Language' : 'Add New Language'}
          </h3>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Language Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Spanish"
              />
            </div>

            {/* Proficiency Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proficiency Level
              </label>
              <select
                value={formData.level}
                onChange={(e) => handleFormChange('level', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {proficiencyLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Preview */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Proficiency indicator:</span>
              <div className="flex space-x-0.5">
                {[1, 2, 3, 4, 5].map((dot) => (
                  <div
                    key={dot}
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: dot <= getLevelDots(formData.level) 
                        ? styles.colors.primary 
                        : styles.colors.muted || '#E5E7EB'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Form Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
          <button
            onClick={handleCancel}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleFormSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {editingId ? 'Update' : 'Add'} Language
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="languages-section">
      <div className="flex items-center justify-between mb-3">
        <h3 
          className="section-title font-bold uppercase tracking-wide flex items-center"
          style={{ 
            fontSize: styles.typography.fontSize.heading3,
            color: styles.colors.primary,
            borderBottom: sectionStyles?.headerStyle === 'underline' ? `2px solid ${styles.colors.primary}` : 'none',
            backgroundColor: sectionStyles?.headerStyle === 'background' ? `${styles.colors.primary}10` : 'transparent',
            padding: sectionStyles?.headerStyle === 'background' ? '8px 12px' : '0 0 4px 0',
            borderRadius: sectionStyles?.headerStyle === 'background' ? '6px' : '0',
            textTransform: sectionStyles?.textTransform || 'uppercase',
            fontWeight: sectionStyles?.fontWeight ? styles.typography.fontWeight[sectionStyles.fontWeight] : styles.typography.fontWeight.bold
          }}
        >
          <Globe className="w-3 h-3 mr-2" />
          <Globe 
            className="" 
            style={{ 
              width: `${iconSizePx}px`,
              height: `${iconSizePx}px`,
              marginRight: '8px'
            }} 
          />
          {config.name || 'Languages'}
        </h3>
        {editMode && (
          <button
            onClick={initializeNewForm}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center text-sm transition-colors"
            title="Add new language"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Language
          </button>
        )}
      </div>
      
      <div 
        style={{
          padding: sectionStyles?.padding || '0',
          margin: sectionStyles?.margin || '0',
          backgroundColor: sectionStyles?.backgroundColor || 'transparent',
          borderRadius: sectionStyles?.borderRadius ? styles.effects?.borderRadius?.[sectionStyles.borderRadius] || '0' : '0',
          border: sectionStyles?.borderWidth ? `${sectionStyles.borderWidth} ${sectionStyles.borderStyle || 'solid'} ${sectionStyles.borderColor || styles.colors.border}` : 'none',
          boxShadow: sectionStyles?.shadow ? styles.effects?.shadow?.[sectionStyles.shadow] || 'none' : 'none'
        }}
      >
        <div className="languages-list space-y-3">
          {displayLanguages.map((language: any) => (
            <div key={language.id} className="language-item flex justify-between items-center group">
              <EditableText
                value={language.name}
                onSave={(value) => {
                  if (onDataUpdate) {
                    const updatedLanguages = displayLanguages.map((l: any) => 
                      l.id === language.id ? { ...l, name: value } : l
                    );
                    onDataUpdate('languages', updatedLanguages);
                  }
                }}
                className="language-name font-medium"
                style={{ 
                  fontSize: styles.typography.fontSize.base,
                  color: styles.colors.text,
                }}
                placeholder="Language name"
              />
              
              <div className="language-level flex items-center">
                <EditableText
                  value={language.level}
                  onSave={(value) => {
                    if (onDataUpdate) {
                      const updatedLanguages = displayLanguages.map((l: any) => 
                        l.id === language.id ? { ...l, level: value } : l
                      );
                      onDataUpdate('languages', updatedLanguages);
                    }
                  }}
                  className="level-text mr-3"
                  style={{ 
                    fontSize: styles.typography.fontSize.small,
                    color: styles.colors.secondary 
                  }}
                  placeholder="Proficiency level"
                />
                
                <div className="level-dots flex space-x-0.5">
                  {[1, 2, 3, 4, 5].map((dot) => (
                    <div
                      key={dot}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor: dot <= getLevelDots(language.level) 
                          ? styles.colors.primary 
                          : styles.colors.muted || '#E5E7EB'
                      }}
                    />
                  ))}
                </div>
                
                {editMode && (
                  <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                    <button
                      onClick={() => initializeEditForm(language)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit language"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDelete(language.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove language"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Language Form Modal */}
      {showForm && <LanguageForm />}
    </div>
  );
};