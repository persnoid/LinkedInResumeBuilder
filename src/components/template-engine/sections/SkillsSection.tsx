import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface SkillsSectionProps {
  data: any;
  styles: any;
  sectionStyles: any;
  config: any;
  editMode?: boolean;
  onDataUpdate?: (field: string, value: any) => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  data,
  styles,
  sectionStyles,
  config,
  editMode = false,
  onDataUpdate
}) => {
  const { skills } = data;
  
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

  const handleSkillEdit = (skillId: string, field: string, value: any) => {
    if (onDataUpdate) {
      const updatedSkills = displaySkills.map((skill: any) => 
        skill.id === skillId ? { ...skill, [field]: value } : skill
      );
      onDataUpdate('skills', updatedSkills);
    }
  };

  const addSkill = () => {
    if (onDataUpdate) {
      const newSkill = {
        id: Date.now().toString(),
        name: 'New Skill',
        level: 'Intermediate'
      };
      onDataUpdate('skills', [...displaySkills, newSkill]);
    }
  };

  const removeSkill = (skillId: string) => {
    if (onDataUpdate) {
      const updatedSkills = displaySkills.filter((skill: any) => skill.id !== skillId);
      onDataUpdate('skills', updatedSkills);
    }
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

  const renderSkillsList = () => (
    <div className="skills-list space-y-2">
      {displaySkills.map((skill: any) => (
        <div key={skill.id} className="skill-item flex items-center justify-between group">
          <div className="skill-content flex-1">
            <EditableText
              value={skill.name}
              onSave={(value) => handleSkillEdit(skill.id, 'name', value)}
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
                  onSave={(value) => handleSkillEdit(skill.id, 'level', value)}
                  placeholder="Level"
                />
                )
              </span>
            )}
          </div>
          {editMode && (
            <button
              onClick={() => removeSkill(skill.id)}
              className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
              title="Remove skill"
            >
              <Trash2 className="w-3 h-3" />
            </button>
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
            className="skill-tag px-3 py-1 rounded-full text-sm font-medium inline-block"
            style={{
              backgroundColor: `${styles.colors.accent}20`,
              color: styles.colors.accent,
              border: `1px solid ${styles.colors.accent}40`,
            }}
          >
            <EditableText
              value={skill.name}
              onSave={(value) => handleSkillEdit(skill.id, 'name', value)}
              placeholder="Skill"
            />
          </span>
          {editMode && (
            <button
              onClick={() => removeSkill(skill.id)}
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Remove skill"
            >
              <Trash2 className="w-2 h-2" />
            </button>
          )}
        </div>
      ))}
    </div>
  );

  const renderSkillsGrid = () => (
    <div className="skills-grid grid grid-cols-2 gap-2">
      {displaySkills.map((skill: any) => (
        <div key={skill.id} className="skill-item flex items-center justify-between group">
          <EditableText
            value={skill.name}
            onSave={(value) => handleSkillEdit(skill.id, 'name', value)}
            className="text-sm"
            style={{ color: styles.colors.text }}
            placeholder="Skill name"
          />
          {editMode && (
            <button
              onClick={() => removeSkill(skill.id)}
              className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
              title="Remove skill"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="skills-section">
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
          {config.name || 'Skills'}
        </h3>
        {editMode && (
          <button
            onClick={addSkill}
            className="text-green-600 hover:text-green-700 flex items-center text-sm"
            title="Add new skill"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </button>
        )}
      </div>
      
      {sectionStyles?.display === 'tags' ? renderSkillsTags() :
       sectionStyles?.display === 'grid' ? renderSkillsGrid() :
       renderSkillsList()}
    </div>
  );
};