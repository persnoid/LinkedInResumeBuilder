import React, { useState } from 'react';
import { Calendar, MapPin, Plus, Trash2 } from 'lucide-react';

interface ExperienceSectionProps {
  data: any;
  styles: any;
  sectionStyles: any;
  config: any;
  editMode?: boolean;
  onDataUpdate?: (field: string, value: any) => void;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  data,
  styles,
  sectionStyles,
  config,
  editMode = false,
  onDataUpdate
}) => {
  const { experience } = data;
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{[key: string]: any}>({});
  
  // Provide meaningful fallback experience data
  const displayExperience = experience && experience.length > 0 ? experience : [
    {
      id: '1',
      position: 'Senior Software Engineer',
      company: 'Tech Solutions Inc.',
      location: 'San Francisco, CA',
      startDate: '2020-01',
      endDate: 'Present',
      current: true,
      description: [
        'Led development of scalable web applications serving 100K+ users',
        'Mentored junior developers and improved team productivity by 40%',
        'Implemented modern technologies resulting in 50% performance improvement'
      ]
    },
    {
      id: '2',
      position: 'Software Developer',
      company: 'Innovation Labs',
      location: 'New York, NY',
      startDate: '2018-06',
      endDate: '2019-12',
      current: false,
      description: [
        'Developed and maintained multiple client-facing applications',
        'Collaborated with cross-functional teams to deliver projects on time',
        'Optimized database queries reducing response time by 30%'
      ]
    }
  ];

  const handleFieldEdit = (expId: string, field: string, value: any) => {
    if (onDataUpdate) {
      const updatedExperience = displayExperience.map((exp: any) => 
        exp.id === expId ? { ...exp, [field]: value } : exp
      );
      onDataUpdate('experience', updatedExperience);
    }
  };

  const handleDescriptionEdit = (expId: string, descIndex: number, value: string) => {
    if (onDataUpdate) {
      const updatedExperience = displayExperience.map((exp: any) => 
        exp.id === expId ? {
          ...exp,
          description: exp.description.map((desc: string, idx: number) => 
            idx === descIndex ? value : desc
          )
        } : exp
      );
      onDataUpdate('experience', updatedExperience);
    }
  };

  const addExperience = () => {
    if (onDataUpdate) {
      const newExp = {
        id: Date.now().toString(),
        position: 'New Position',
        company: 'Company Name',
        location: 'Location',
        startDate: '2024-01',
        endDate: 'Present',
        current: true,
        description: ['Describe your achievements and responsibilities']
      };
      onDataUpdate('experience', [...displayExperience, newExp]);
    }
  };

  const removeExperience = (expId: string) => {
    if (onDataUpdate) {
      const updatedExperience = displayExperience.filter((exp: any) => exp.id !== expId);
      onDataUpdate('experience', updatedExperience);
    }
  };

  const EditableText: React.FC<{
    value: string;
    onSave: (value: string) => void;
    className?: string;
    style?: React.CSSProperties;
    placeholder?: string;
    multiline?: boolean;
  }> = ({ value, onSave, className = '', style = {}, placeholder = '', multiline = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);

    const handleSave = () => {
      onSave(editValue);
      setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !multiline) {
        e.preventDefault();
        handleSave();
      } else if (e.key === 'Escape') {
        setEditValue(value);
        setIsEditing(false);
      }
    };

    if (editMode && isEditing) {
      return multiline ? (
        <textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className={`${className} border-2 border-blue-500 rounded px-2 py-1 resize-none w-full`}
          style={style}
          placeholder={placeholder}
          autoFocus
          rows={2}
        />
      ) : (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className={`${className} border-2 border-blue-500 rounded px-2 py-1 w-full`}
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
    <div className="experience-section">
      <div className="flex items-center justify-between mb-4">
        <h3 
          className="section-title font-bold uppercase tracking-wide"
          style={{ 
            fontSize: styles.typography.fontSize.heading3,
            color: styles.colors.primary,
            borderBottom: `2px solid ${styles.colors.primary}`,
            paddingBottom: '4px',
          }}
        >
          {config.name || 'Experience'}
        </h3>
        {editMode && (
          <button
            onClick={addExperience}
            className="text-green-600 hover:text-green-700 flex items-center text-sm"
            title="Add new experience"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </button>
        )}
      </div>
      
      <div className="experience-list space-y-6">
        {displayExperience.map((exp: any) => (
          <div key={exp.id} className="experience-item relative group">
            {editMode && (
              <button
                onClick={() => removeExperience(exp.id)}
                className="absolute -right-2 -top-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove experience"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
            
            <div className="experience-header mb-2">
              <EditableText
                value={exp.position || 'Position Title'}
                onSave={(value) => handleFieldEdit(exp.id, 'position', value)}
                className="position font-bold block"
                style={{ 
                  fontSize: styles.typography.fontSize.heading3,
                  color: styles.colors.text,
                }}
                placeholder="Position Title"
              />
              <EditableText
                value={exp.company || 'Company Name'}
                onSave={(value) => handleFieldEdit(exp.id, 'company', value)}
                className="company font-medium block"
                style={{ 
                  fontSize: styles.typography.fontSize.base,
                  color: styles.colors.accent,
                }}
                placeholder="Company Name"
              />
              <div className="experience-meta flex items-center gap-4 text-sm mt-1" style={{ color: styles.colors.secondary }}>
                <div className="date-range flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <EditableText
                    value={`${exp.startDate || 'Start'} - ${exp.current ? 'Present' : exp.endDate || 'End'}`}
                    onSave={(value) => {
                      const [start, end] = value.split(' - ');
                      handleFieldEdit(exp.id, 'startDate', start);
                      handleFieldEdit(exp.id, 'endDate', end);
                      handleFieldEdit(exp.id, 'current', end === 'Present');
                    }}
                    placeholder="Start Date - End Date"
                  />
                </div>
                {exp.location && (
                  <div className="location flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <EditableText
                      value={exp.location}
                      onSave={(value) => handleFieldEdit(exp.id, 'location', value)}
                      placeholder="Location"
                    />
                  </div>
                )}
              </div>
            </div>
            
            {exp.description && exp.description.length > 0 && (
              <ul className="experience-description space-y-1 mt-3">
                {exp.description.map((desc: string, index: number) => (
                  <li 
                    key={index} 
                    className="flex items-start"
                    style={{ 
                      fontSize: styles.typography.fontSize.base,
                      lineHeight: styles.typography.lineHeight.normal,
                      color: styles.colors.text,
                    }}
                  >
                    <span 
                      className="bullet mr-3 mt-1 flex-shrink-0"
                      style={{ color: styles.colors.accent }}
                    >
                      •
                    </span>
                    <EditableText
                      value={desc}
                      onSave={(value) => handleDescriptionEdit(exp.id, index, value)}
                      className="flex-1"
                      placeholder="Describe your achievements and responsibilities"
                      multiline
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};