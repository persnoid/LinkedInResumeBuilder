import React, { useState } from 'react';
import { Plus, Trash2, Grid, List, Tag, Edit3, Save, X } from 'lucide-react';

interface SkillsSectionProps {
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

interface SkillEntry {
  id: string;
  name: string;
  level?: string;
}

interface SkillFormData {
  name: string;
  level: string;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  data,
  styles,
  sectionStyles,
  config,
  editMode = false,
  onDataUpdate,
  showConfirmation
}) => {
  const { skills } = data;
  
  console.log('SkillsSection - Props received:', {
    editMode,
    hasOnDataUpdate: !!onDataUpdate,
    hasShowConfirmation: !!showConfirmation,
    skillsCount: skills?.length || 0,
    showConfirmationType: typeof showConfirmation
  });
  
  // Provide meaningful fallback skills data
  const displaySkills = skills && skills.length > 0 ? skills : [
    { id: '1', name: 'JavaScript', level: 'Expert' },
    { id: '2', name: 'React', level: 'Expert' },
    { id: '3', name: 'Node.js', level: 'Advanced' },
    { id: '4', name: 'Python', level: 'Advanced' },
    { id: '5', name: 'TypeScript', level: 'Advanced' },
    { id: '6', name: 'AWS', level: 'Intermediate' },
    { id: '7', name: 'Docker', level: 'Intermediate' },
    { id: '8', name: 'MongoDB', level: 'Intermediate' }
  ];

  // Form state management
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<SkillFormData>({
    name: '',
    level: 'Intermediate'
  });

  // Get dynamic icon size from customizations
  const getIconSize = () => {
    const iconSize = customizations?.typography?.iconSize || 'sm';
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

  // Skill levels
  const skillLevels = [
    'Beginner',
    'Intermediate', 
    'Advanced',
    'Expert'
  ];

  // Initialize form for new entry
  const initializeNewForm = () => {
    console.log('SkillsSection - Initialize new form clicked');
    setFormData({
      name: '',
      level: 'Intermediate'
    });
    setEditingId(null);
    setShowForm(true);
  };

  // Initialize form for editing existing entry
  const initializeEditForm = (skill: SkillEntry) => {
    console.log('SkillsSection - Initialize edit form clicked for skill:', skill.id);
    setFormData({
      name: skill.name,
      level: skill.level || 'Intermediate'
    });
    setEditingId(skill.id);
    setShowForm(true);
  };

  // Handle form field changes
  const handleFormChange = (field: keyof SkillFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const handleFormSubmit = () => {
    console.log('SkillsSection - Form submit clicked');
    if (!formData.name.trim()) {
      alert('Please enter a skill name.');
      return;
    }

    const newEntry: SkillEntry = {
      id: editingId || Date.now().toString(),
      name: formData.name.trim(),
      level: formData.level
    };

    let updatedSkills;
    if (editingId) {
      // Update existing entry
      updatedSkills = displaySkills.map((skill: SkillEntry) => 
        skill.id === editingId ? newEntry : skill
      );
    } else {
      // Add new entry
      updatedSkills = [...displaySkills, newEntry];
    }

    if (onDataUpdate) {
      console.log('SkillsSection - Calling onDataUpdate with:', updatedSkills);
      onDataUpdate('skills', updatedSkills);
    }

    // Reset form
    setShowForm(false);
    setEditingId(null);
  };

  // Handle entry deletion with unified confirmation - FIXED ASYNC HANDLING
  const handleDelete = async (id: string) => {
    console.log('SkillsSection - Delete button clicked for skill ID:', id);
    console.log('SkillsSection - showConfirmation available:', !!showConfirmation);
    console.log('SkillsSection - showConfirmation function:', showConfirmation);
    console.log('SkillsSection - showConfirmation type:', typeof showConfirmation);
    
    let confirmed = false;
    
    if (showConfirmation && typeof showConfirmation === 'function') {
      console.log('SkillsSection - Calling showConfirmation...');
      try {
        // CRITICAL FIX: Properly await the confirmation dialog
        confirmed = await showConfirmation({
          title: 'Delete Skill',
          message: 'Are you sure you want to delete this skill? This action cannot be undone.',
          confirmText: 'Delete',
          cancelText: 'Cancel',
          type: 'danger'
        });
        console.log('SkillsSection - Confirmation dialog result:', confirmed);
      } catch (error) {
        console.error('SkillsSection - Error with confirmation dialog:', error);
        // Fallback to browser confirm if there's an error
        confirmed = window.confirm('Are you sure you want to delete this skill?');
      }
    } else {
      console.log('SkillsSection - Using browser confirm fallback');
      confirmed = window.confirm('Are you sure you want to delete this skill?');
    }

    console.log('SkillsSection - Final confirmation result:', confirmed);

    if (confirmed) {
      console.log('SkillsSection - User confirmed deletion, proceeding...');
      const updatedSkills = displaySkills.filter((skill: SkillEntry) => skill.id !== id);
      if (onDataUpdate) {
        console.log('SkillsSection - Calling onDataUpdate for deletion with:', updatedSkills);
        onDataUpdate('skills', updatedSkills);
      } else {
        console.error('SkillsSection - onDataUpdate not available for deletion');
      }
    } else {
      console.log('SkillsSection - User cancelled deletion');
    }
  };

  // Cancel form
  const handleCancel = () => {
    console.log('SkillsSection - Form cancel clicked');
    setShowForm(false);
    setEditingId(null);
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

  // Skill Form Component
  const SkillForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        {/* Form Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {editingId ? 'Edit Skill' : 'Add New Skill'}
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
            {/* Skill Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skill Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., JavaScript"
              />
            </div>

            {/* Skill Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proficiency Level
              </label>
              <select
                value={formData.level}
                onChange={(e) => handleFormChange('level', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {skillLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
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
            {editingId ? 'Update' : 'Add'} Skill
          </button>
        </div>
      </div>
    </div>
  );

  const renderSkillsList = () => (
    <div className="skills-list space-y-2">
      {displaySkills.map((skill: any) => (
        <div key={skill.id} className="skill-item flex items-center justify-between group">
          <div className="skill-content flex-1">
            <EditableText
              value={skill.name}
              onSave={(value) => {
                if (onDataUpdate) {
                  const updatedSkills = displaySkills.map((s: any) => 
                    s.id === skill.id ? { ...s, name: value } : s
                  );
                  onDataUpdate('skills', updatedSkills);
                }
              }}
              style={{ 
                fontSize: styles.typography.fontSize.base,
                color: styles.colors.text,
              }}
              placeholder="Skill name"
            />
            {skill.level && (
              <span 
                className="skill-level ml-2"
                style={{ 
                  fontSize: styles.typography.fontSize.small,
                  color: styles.colors.secondary,
                }}
              >
                (
                <EditableText
                  value={skill.level}
                  onSave={(value) => {
                    if (onDataUpdate) {
                      const updatedSkills = displaySkills.map((s: any) => 
                        s.id === skill.id ? { ...s, level: value } : s
                      );
                      onDataUpdate('skills', updatedSkills);
                    }
                  }}
                  placeholder="Level"
                />
                )
              </span>
            )}
          </div>
          {editMode && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 ml-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('SkillsSection - Edit button clicked for skill:', skill.id);
                  initializeEditForm(skill);
                }}
                className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50"
                title="Edit skill"
              >
                <Edit3 className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('SkillsSection - Delete button clicked for skill:', skill.id);
                  // CRITICAL: Call handleDelete directly without wrapping in another function
                  handleDelete(skill.id);
                }}
                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                title="Remove skill"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderSkillsTags = () => (
    <div className="skills-tags flex flex-wrap gap-2">
      {displaySkills.map((skill: any) => (
        <div key={skill.id} className="skill-tag-container relative group">
          <span
            className="skill-tag px-3 py-1 rounded-full font-medium inline-block transition-all duration-200 hover:shadow-md"
            style={{
              backgroundColor: `${styles.colors.accent}20`,
              color: styles.colors.accent,
              border: `1px solid ${styles.colors.accent}40`,
              fontSize: styles.typography.fontSize.small,
              borderRadius: sectionStyles?.borderRadius ? styles.effects?.borderRadius?.[sectionStyles.borderRadius] || '6px' : '6px'
            }}
          >
            <EditableText
              value={skill.name}
              onSave={(value) => {
                if (onDataUpdate) {
                  const updatedSkills = displaySkills.map((s: any) => 
                    s.id === skill.id ? { ...s, name: value } : s
                  );
                  onDataUpdate('skills', updatedSkills);
                }
              }}
              placeholder="Skill"
            />
          </span>
          {editMode && (
            <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('SkillsSection - Edit button clicked for skill:', skill.id);
                  initializeEditForm(skill);
                }}
                className="bg-blue-500 text-white rounded-full p-0.5 hover:bg-blue-600"
                title="Edit skill"
              >
                <Edit3 className="w-2 h-2" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('SkillsSection - Delete button clicked for skill:', skill.id);
                  handleDelete(skill.id);
                }}
                className="bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                title="Remove skill"
              >
                <Trash2 className="w-2 h-2" />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderSkillsGrid = () => (
    <div 
      className="skills-grid grid gap-2"
      style={{ 
        gridTemplateColumns: `repeat(${sectionStyles?.columns || 2}, 1fr)`,
        gap: sectionStyles?.gap || styles.spacing.sm
      }}
    >
      {displaySkills.map((skill: any) => (
        <div key={skill.id} className="skill-item flex items-center justify-between group p-2 rounded transition-colors hover:bg-gray-50">
          <EditableText
            value={skill.name}
            onSave={(value) => {
              if (onDataUpdate) {
                const updatedSkills = displaySkills.map((s: any) => 
                  s.id === skill.id ? { ...s, name: value } : s
                );
                onDataUpdate('skills', updatedSkills);
              }
            }}
            style={{ 
              fontSize: styles.typography.fontSize.small,
              color: styles.colors.text 
            }}
            placeholder="Skill name"
          />
          {editMode && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 ml-1">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('SkillsSection - Edit button clicked for skill:', skill.id);
                  initializeEditForm(skill);
                }}
                className="text-blue-500 hover:text-blue-700"
                title="Edit skill"
              >
                <Edit3 className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('SkillsSection - Delete button clicked for skill:', skill.id);
                  handleDelete(skill.id);
                }}
                className="text-red-500 hover:text-red-700"
                title="Remove skill"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderSkillsCards = () => (
    <div className="skills-cards grid grid-cols-1 md:grid-cols-2 gap-3">
      {displaySkills.map((skill: any) => (
        <div 
          key={skill.id} 
          className="skill-card p-3 border rounded-lg group hover:shadow-md transition-all duration-200"
          style={{
            borderColor: styles.colors.border,
            backgroundColor: styles.colors.surface,
            borderRadius: sectionStyles?.borderRadius ? styles.effects?.borderRadius?.[sectionStyles.borderRadius] || '8px' : '8px'
          }}
        >
          <div className="flex items-center justify-between">
            <EditableText
              value={skill.name}
              onSave={(value) => {
                if (onDataUpdate) {
                  const updatedSkills = displaySkills.map((s: any) => 
                    s.id === skill.id ? { ...s, name: value } : s
                  );
                  onDataUpdate('skills', updatedSkills);
                }
              }}
              className="font-medium"
              style={{ 
                fontSize: styles.typography.fontSize.base,
                color: styles.colors.text 
              }}
              placeholder="Skill name"
            />
            {editMode && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('SkillsSection - Edit button clicked for skill:', skill.id);
                    initializeEditForm(skill);
                  }}
                  className="text-blue-500 hover:text-blue-700"
                  title="Edit skill"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('SkillsSection - Delete button clicked for skill:', skill.id);
                    handleDelete(skill.id);
                  }}
                  className="text-red-500 hover:text-red-700"
                  title="Remove skill"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
          {skill.level && (
            <EditableText
              value={skill.level}
              onSave={(value) => {
                if (onDataUpdate) {
                  const updatedSkills = displaySkills.map((s: any) => 
                    s.id === skill.id ? { ...s, level: value } : s
                  );
                  onDataUpdate('skills', updatedSkills);
                }
              }}
              className="block mt-1"
              style={{ 
                fontSize: styles.typography.fontSize.small,
                color: styles.colors.secondary 
              }}
              placeholder="Proficiency level"
            />
          )}
        </div>
      ))}
    </div>
  );

  const getDisplayIcon = () => {
    switch (sectionStyles?.display) {
      case 'tags': return <Tag style={{ width: `${iconSizePx}px`, height: `${iconSizePx}px` }} />;
      case 'grid': return <Grid style={{ width: `${iconSizePx}px`, height: `${iconSizePx}px` }} />;
      case 'cards': return <Grid style={{ width: `${iconSizePx}px`, height: `${iconSizePx}px` }} />;
      default: return <List style={{ width: `${iconSizePx}px`, height: `${iconSizePx}px` }} />;
    }
  };

  console.log('SkillsSection - Rendering with editMode:', editMode);

  return (
    <div className="skills-section">
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
          {getDisplayIcon()}
          <span className="ml-2">{config.name || 'Skills'}</span>
        </h3>
        {editMode && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('SkillsSection - Add new skill button clicked');
              initializeNewForm();
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center text-sm transition-colors"
            title="Add new skill"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Skill
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
        {sectionStyles?.display === 'tags' ? renderSkillsTags() :
         sectionStyles?.display === 'grid' ? renderSkillsGrid() :
         sectionStyles?.display === 'cards' ? renderSkillsCards() :
         renderSkillsList()}
      </div>

      {/* Skill Form Modal */}
      {showForm && <SkillForm />}
    </div>
  );
};