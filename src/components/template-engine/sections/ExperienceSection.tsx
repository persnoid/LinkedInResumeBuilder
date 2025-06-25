import React, { useState } from 'react';
import { Calendar, MapPin, Plus, Trash2, Briefcase, Building } from 'lucide-react';

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

  const addDescriptionItem = (expId: string) => {
    if (onDataUpdate) {
      const updatedExperience = displayExperience.map((exp: any) => 
        exp.id === expId ? {
          ...exp,
          description: [...exp.description, '']
        } : exp
      );
      onDataUpdate('experience', updatedExperience);
    }
  };

  const removeDescriptionItem = (expId: string, descIndex: number) => {
    if (onDataUpdate) {
      const updatedExperience = displayExperience.map((exp: any) => 
        exp.id === expId ? {
          ...exp,
          description: exp.description.filter((_: string, idx: number) => idx !== descIndex)
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

  const renderTimelineExperience = () => (
    <div className="experience-timeline relative">
      {/* Timeline line */}
      <div 
        className="absolute left-6 top-0 bottom-0 w-0.5"
        style={{ backgroundColor: styles.colors.accent }}
      />
      
      {displayExperience.map((exp: any, index: number) => (
        <div key={exp.id} className="experience-item relative group mb-8 last:mb-0">
          {/* Timeline dot */}
          <div 
            className="absolute left-4 w-4 h-4 rounded-full border-2 bg-white"
            style={{ 
              borderColor: styles.colors.accent,
              top: '8px'
            }}
          />
          
          {/* Content */}
          <div className="ml-12 relative">
            {editMode && (
              <button
                onClick={() => removeExperience(exp.id)}
                className="absolute -right-2 -top-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove experience"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
            
            <div className="experience-header mb-3">
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
              <div className="flex items-center gap-2 mt-1">
                <Building className="w-4 h-4" style={{ color: styles.colors.accent }} />
                <EditableText
                  value={exp.company || 'Company Name'}
                  onSave={(value) => handleFieldEdit(exp.id, 'company', value)}
                  className="company font-medium"
                  style={{ 
                    fontSize: styles.typography.fontSize.base,
                    color: styles.colors.accent,
                  }}
                  placeholder="Company Name"
                />
              </div>
              <div className="experience-meta flex items-center gap-4 mt-2" style={{ color: styles.colors.secondary }}>
                <div className="date-range flex items-center">
                  <Calendar 
                    className="mr-1" 
                    style={{ 
                      width: '16px', 
                      height: '16px',
                      fontSize: styles.typography.fontSize.small 
                    }} 
                  />
                  <EditableText
                    value={`${exp.startDate || 'Start'} - ${exp.current ? 'Present' : exp.endDate || 'End'}`}
                    onSave={(value) => {
                      const [start, end] = value.split(' - ');
                      handleFieldEdit(exp.id, 'startDate', start);
                      handleFieldEdit(exp.id, 'endDate', end);
                      handleFieldEdit(exp.id, 'current', end === 'Present');
                    }}
                    style={{ fontSize: styles.typography.fontSize.small }}
                    placeholder="Start Date - End Date"
                  />
                </div>
                {exp.location && (
                  <div className="location flex items-center">
                    <MapPin 
                      className="mr-1" 
                      style={{ 
                        width: '16px', 
                        height: '16px',
                        fontSize: styles.typography.fontSize.small 
                      }} 
                    />
                    <EditableText
                      value={exp.location}
                      onSave={(value) => handleFieldEdit(exp.id, 'location', value)}
                      style={{ fontSize: styles.typography.fontSize.small }}
                      placeholder="Location"
                    />
                  </div>
                )}
              </div>
            </div>
            
            {exp.description && exp.description.length > 0 && (
              <div className="experience-description">
                <ul className="space-y-2">
                  {exp.description.map((desc: string, index: number) => (
                    <li 
                      key={index} 
                      className="flex items-start group/item"
                      style={{ 
                        fontSize: styles.typography.fontSize.base,
                        lineHeight: styles.typography.lineHeight.normal,
                        color: styles.colors.text,
                      }}
                    >
                      <span 
                        className="bullet mr-3 mt-1 flex-shrink-0"
                        style={{ 
                          color: styles.colors.accent,
                          fontSize: styles.typography.fontSize.base
                        }}
                      >
                        •
                      </span>
                      <div className="flex-1 flex items-start">
                        <EditableText
                          value={desc}
                          onSave={(value) => handleDescriptionEdit(exp.id, index, value)}
                          className="flex-1"
                          style={{ fontSize: styles.typography.fontSize.base }}
                          placeholder="Describe your achievements and responsibilities"
                        />
                        {editMode && (
                          <button
                            onClick={() => removeDescriptionItem(exp.id, index)}
                            className="text-red-500 hover:text-red-700 opacity-0 group-hover/item:opacity-100 transition-opacity ml-2 mt-1"
                            title="Remove bullet point"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                
                {editMode && (
                  <button
                    onClick={() => addDescriptionItem(exp.id)}
                    className="text-blue-600 hover:text-blue-700 flex items-center mt-3 text-sm"
                    title="Add bullet point"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add bullet point
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderCardsExperience = () => (
    <div className="experience-cards space-y-4">
      {displayExperience.map((exp: any) => (
        <div 
          key={exp.id} 
          className="experience-card p-4 border rounded-lg group hover:shadow-md transition-all duration-200 relative"
          style={{
            borderColor: styles.colors.border,
            backgroundColor: styles.colors.surface,
            borderRadius: sectionStyles?.borderRadius ? styles.effects?.borderRadius?.[sectionStyles.borderRadius] || '8px' : '8px'
          }}
        >
          {editMode && (
            <button
              onClick={() => removeExperience(exp.id)}
              className="absolute -right-2 -top-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Remove experience"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
          
          <div className="experience-header mb-3">
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
            <div className="experience-meta flex items-center gap-4 mt-2" style={{ color: styles.colors.secondary }}>
              <div className="date-range flex items-center">
                <Calendar 
                  className="mr-1" 
                  style={{ 
                    width: '16px', 
                    height: '16px',
                    fontSize: styles.typography.fontSize.small 
                  }} 
                />
                <EditableText
                  value={`${exp.startDate || 'Start'} - ${exp.current ? 'Present' : exp.endDate || 'End'}`}
                  onSave={(value) => {
                    const [start, end] = value.split(' - ');
                    handleFieldEdit(exp.id, 'startDate', start);
                    handleFieldEdit(exp.id, 'endDate', end);
                    handleFieldEdit(exp.id, 'current', end === 'Present');
                  }}
                  style={{ fontSize: styles.typography.fontSize.small }}
                  placeholder="Start Date - End Date"
                />
              </div>
              {exp.location && (
                <div className="location flex items-center">
                  <MapPin 
                    className="mr-1" 
                    style={{ 
                      width: '16px', 
                      height: '16px',
                      fontSize: styles.typography.fontSize.small 
                    }} 
                  />
                  <EditableText
                    value={exp.location}
                    onSave={(value) => handleFieldEdit(exp.id, 'location', value)}
                    style={{ fontSize: styles.typography.fontSize.small }}
                    placeholder="Location"
                  />
                </div>
              )}
            </div>
          </div>
          
          {exp.description && exp.description.length > 0 && (
            <div className="experience-description">
              <ul className="space-y-1">
                {exp.description.map((desc: string, index: number) => (
                  <li 
                    key={index} 
                    className="flex items-start group/item"
                    style={{ 
                      fontSize: styles.typography.fontSize.base,
                      lineHeight: styles.typography.lineHeight.normal,
                      color: styles.colors.text,
                    }}
                  >
                    <span 
                      className="bullet mr-3 mt-1 flex-shrink-0"
                      style={{ 
                        color: styles.colors.accent,
                        fontSize: styles.typography.fontSize.base
                      }}
                    >
                      •
                    </span>
                    <div className="flex-1 flex items-start">
                      <EditableText
                        value={desc}
                        onSave={(value) => handleDescriptionEdit(exp.id, index, value)}
                        className="flex-1"
                        style={{ fontSize: styles.typography.fontSize.base }}
                        placeholder="Describe your achievements and responsibilities"
                      />
                      {editMode && (
                        <button
                          onClick={() => removeDescriptionItem(exp.id, index)}
                          className="text-red-500 hover:text-red-700 opacity-0 group-hover/item:opacity-100 transition-opacity ml-2 mt-1"
                          title="Remove bullet point"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              
              {editMode && (
                <button
                  onClick={() => addDescriptionItem(exp.id)}
                  className="text-blue-600 hover:text-blue-700 flex items-center mt-2 text-sm"
                  title="Add bullet point"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add bullet point
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderDefaultExperience = () => (
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
            <div className="experience-meta flex items-center gap-4 mt-1" style={{ color: styles.colors.secondary }}>
              <div className="date-range flex items-center">
                <Calendar 
                  className="mr-1" 
                  style={{ 
                    width: '16px', 
                    height: '16px',
                    fontSize: styles.typography.fontSize.small 
                  }} 
                />
                <EditableText
                  value={`${exp.startDate || 'Start'} - ${exp.current ? 'Present' : exp.endDate || 'End'}`}
                  onSave={(value) => {
                    const [start, end] = value.split(' - ');
                    handleFieldEdit(exp.id, 'startDate', start);
                    handleFieldEdit(exp.id, 'endDate', end);
                    handleFieldEdit(exp.id, 'current', end === 'Present');
                  }}
                  style={{ fontSize: styles.typography.fontSize.small }}
                  placeholder="Start Date - End Date"
                />
              </div>
              {exp.location && (
                <div className="location flex items-center">
                  <MapPin 
                    className="mr-1" 
                    style={{ 
                      width: '16px', 
                      height: '16px',
                      fontSize: styles.typography.fontSize.small 
                    }} 
                  />
                  <EditableText
                    value={exp.location}
                    onSave={(value) => handleFieldEdit(exp.id, 'location', value)}
                    style={{ fontSize: styles.typography.fontSize.small }}
                    placeholder="Location"
                  />
                </div>
              )}
            </div>
          </div>
          
          {exp.description && exp.description.length > 0 && (
            <div className="experience-description mt-3">
              <ul className="space-y-1">
                {exp.description.map((desc: string, index: number) => (
                  <li 
                    key={index} 
                    className="flex items-start group/item"
                    style={{ 
                      fontSize: styles.typography.fontSize.base,
                      lineHeight: styles.typography.lineHeight.normal,
                      color: styles.colors.text,
                    }}
                  >
                    <span 
                      className="bullet mr-3 mt-1 flex-shrink-0"
                      style={{ 
                        color: styles.colors.accent,
                        fontSize: styles.typography.fontSize.base
                      }}
                    >
                      •
                    </span>
                    <div className="flex-1 flex items-start">
                      <EditableText
                        value={desc}
                        onSave={(value) => handleDescriptionEdit(exp.id, index, value)}
                        className="flex-1"
                        style={{ fontSize: styles.typography.fontSize.base }}
                        placeholder="Describe your achievements and responsibilities"
                      />
                      {editMode && (
                        <button
                          onClick={() => removeDescriptionItem(exp.id, index)}
                          className="text-red-500 hover:text-red-700 opacity-0 group-hover/item:opacity-100 transition-opacity ml-2 mt-1"
                          title="Remove bullet point"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              
              {editMode && (
                <button
                  onClick={() => addDescriptionItem(exp.id)}
                  className="text-blue-600 hover:text-blue-700 flex items-center mt-2 text-sm"
                  title="Add bullet point"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add bullet point
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="experience-section">
      <div className="flex items-center justify-between mb-4">
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
          <Briefcase className="w-4 h-4 mr-2" />
          {config.name || 'Experience'}
        </h3>
        {editMode && (
          <button
            onClick={addExperience}
            className="text-green-600 hover:text-green-700 flex items-center"
            style={{ fontSize: styles.typography.fontSize.small }}
            title="Add new experience"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
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
        {sectionStyles?.display === 'timeline' ? renderTimelineExperience() :
         sectionStyles?.display === 'cards' ? renderCardsExperience() :
         renderDefaultExperience()}
      </div>
    </div>
  );
};