import React, { useState } from 'react';
import { Calendar, MapPin, Plus, Trash2 } from 'lucide-react';

interface EducationSectionProps {
  data: any;
  styles: any;
  sectionStyles: any;
  config: any;
  editMode?: boolean;
  onDataUpdate?: (field: string, value: any) => void;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  data,
  styles,
  sectionStyles,
  config,
  editMode = false,
  onDataUpdate
}) => {
  const { education } = data;
  
  // Provide meaningful fallback education data
  const displayEducation = education && education.length > 0 ? education : [
    {
      id: '1',
      degree: 'Bachelor of Science in Computer Science',
      school: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      startDate: '2014-09',
      endDate: '2018-05',
      gpa: '3.8',
      description: 'Relevant Coursework: Data Structures, Algorithms, Software Engineering'
    }
  ];

  const handleEducationEdit = (eduId: string, field: string, value: any) => {
    if (onDataUpdate) {
      const updatedEducation = displayEducation.map((edu: any) => 
        edu.id === eduId ? { ...edu, [field]: value } : edu
      );
      onDataUpdate('education', updatedEducation);
    }
  };

  const addEducation = () => {
    if (onDataUpdate) {
      const newEdu = {
        id: Date.now().toString(),
        degree: 'New Degree',
        school: 'School Name',
        location: 'Location',
        startDate: '2020-09',
        endDate: '2024-05',
        gpa: '',
        description: ''
      };
      onDataUpdate('education', [...displayEducation, newEdu]);
    }
  };

  const removeEducation = (eduId: string) => {
    if (onDataUpdate) {
      const updatedEducation = displayEducation.filter((edu: any) => edu.id !== eduId);
      onDataUpdate('education', updatedEducation);
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
    <div className="education-section">
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
          {config.name || 'Education'}
        </h3>
        {editMode && (
          <button
            onClick={addEducation}
            className="text-green-600 hover:text-green-700 flex items-center"
            style={{ fontSize: styles.typography.fontSize.small }}
            title="Add new education"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </button>
        )}
      </div>
      
      <div className="education-list space-y-4">
        {displayEducation.map((edu: any) => (
          <div key={edu.id} className="education-item relative group">
            {editMode && (
              <button
                onClick={() => removeEducation(edu.id)}
                className="absolute -right-2 -top-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove education"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
            
            <EditableText
              value={edu.degree || 'Degree and Field of Study'}
              onSave={(value) => handleEducationEdit(edu.id, 'degree', value)}
              className="degree font-bold block"
              style={{ 
                fontSize: styles.typography.fontSize.heading3,
                color: styles.colors.text,
              }}
              placeholder="Degree and Field of Study"
            />
            
            <EditableText
              value={edu.school || 'School or University'}
              onSave={(value) => handleEducationEdit(edu.id, 'school', value)}
              className="school font-medium block"
              style={{ 
                fontSize: styles.typography.fontSize.base,
                color: styles.colors.accent,
              }}
              placeholder="School or University"
            />
            
            <div className="education-meta flex items-center gap-4 mt-1" style={{ color: styles.colors.secondary }}>
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
                  value={`${edu.startDate || 'Start'} - ${edu.endDate || 'End'}`}
                  onSave={(value) => {
                    const [start, end] = value.split(' - ');
                    handleEducationEdit(edu.id, 'startDate', start);
                    handleEducationEdit(edu.id, 'endDate', end);
                  }}
                  style={{ fontSize: styles.typography.fontSize.small }}
                  placeholder="Start Date - End Date"
                />
              </div>
              {edu.location && (
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
                    value={edu.location}
                    onSave={(value) => handleEducationEdit(edu.id, 'location', value)}
                    style={{ fontSize: styles.typography.fontSize.small }}
                    placeholder="Location"
                  />
                </div>
              )}
            </div>
            
            {edu.gpa && (
              <div className="gpa mt-1" style={{ color: styles.colors.secondary }}>
                GPA: <EditableText
                  value={edu.gpa}
                  onSave={(value) => handleEducationEdit(edu.id, 'gpa', value)}
                  style={{ fontSize: styles.typography.fontSize.small }}
                  placeholder="GPA"
                />
              </div>
            )}
            
            {edu.description && (
              <EditableText
                value={edu.description}
                onSave={(value) => handleEducationEdit(edu.id, 'description', value)}
                className="education-description mt-2 block"
                style={{ 
                  fontSize: styles.typography.fontSize.small,
                  color: styles.colors.text,
                }}
                placeholder="Additional details about your education"
                multiline
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};