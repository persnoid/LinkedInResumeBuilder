import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface LanguagesSectionProps {
  data: any;
  styles: any;
  sectionStyles: any;
  config: any;
  editMode?: boolean;
  onDataUpdate?: (field: string, value: any) => void;
}

export const LanguagesSection: React.FC<LanguagesSectionProps> = ({
  data,
  styles,
  sectionStyles,
  config,
  editMode = false,
  onDataUpdate
}) => {
  const { languages } = data;
  
  // Provide meaningful fallback languages data
  const displayLanguages = languages && languages.length > 0 ? languages : [
    { id: '1', name: 'English', level: 'Native' },
    { id: '2', name: 'Spanish', level: 'Fluent' },
    { id: '3', name: 'French', level: 'Intermediate' }
  ];

  const handleLanguageEdit = (langId: string, field: string, value: any) => {
    if (onDataUpdate) {
      const updatedLanguages = displayLanguages.map((lang: any) => 
        lang.id === langId ? { ...lang, [field]: value } : lang
      );
      onDataUpdate('languages', updatedLanguages);
    }
  };

  const addLanguage = () => {
    if (onDataUpdate) {
      const newLanguage = {
        id: Date.now().toString(),
        name: 'New Language',
        level: 'Intermediate'
      };
      onDataUpdate('languages', [...displayLanguages, newLanguage]);
    }
  };

  const removeLanguage = (langId: string) => {
    if (onDataUpdate) {
      const updatedLanguages = displayLanguages.filter((lang: any) => lang.id !== langId);
      onDataUpdate('languages', updatedLanguages);
    }
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
      'full professional': 4,  // Added mapping for "Full Professional"
      'proficient': 4,
      'expert': 5,
      'native': 5,
      'native or bilingual': 5,  // Added mapping for "Native or Bilingual"
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

  return (
    <div className="languages-section">
      <div className="flex items-center justify-between mb-3">
        <h3 
          className="section-title font-bold uppercase tracking-wide"
          style={{ 
            fontSize: styles.typography.fontSize.heading3,
            color: styles.colors.primary,
            borderBottom: `2px solid ${styles.colors.primary}`,
            paddingBottom: '4px',
          }}
        >
          {config.name || 'Languages'}
        </h3>
        {editMode && (
          <button
            onClick={addLanguage}
            className="text-green-600 hover:text-green-700 flex items-center"
            style={{ fontSize: styles.typography.fontSize.small }}
            title="Add new language"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </button>
        )}
      </div>
      
      <div className="languages-list space-y-3">
        {displayLanguages.map((language: any) => (
          <div key={language.id} className="language-item flex justify-between items-center group">
            <EditableText
              value={language.name}
              onSave={(value) => handleLanguageEdit(language.id, 'name', value)}
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
                onSave={(value) => handleLanguageEdit(language.id, 'level', value)}
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
                <button
                  onClick={() => removeLanguage(language.id)}
                  className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                  title="Remove language"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};