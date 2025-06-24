import React, { useState } from 'react';
import { Calendar, ExternalLink, Plus, Trash2 } from 'lucide-react';

interface CertificationsSectionProps {
  data: any;
  styles: any;
  sectionStyles: any;
  config: any;
  editMode?: boolean;
  onDataUpdate?: (field: string, value: any) => void;
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({
  data,
  styles,
  sectionStyles,
  config,
  editMode = false,
  onDataUpdate
}) => {
  const { certifications } = data;
  
  // Provide meaningful fallback certifications data
  const displayCertifications = certifications && certifications.length > 0 ? certifications : [
    {
      id: '1',
      name: 'AWS Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2023-06',
      url: 'https://aws.amazon.com/certification/'
    },
    {
      id: '2',
      name: 'React Developer Certification',
      issuer: 'Meta',
      date: '2023-03',
      url: ''
    }
  ];

  const handleCertificationEdit = (certId: string, field: string, value: any) => {
    if (onDataUpdate) {
      const updatedCertifications = displayCertifications.map((cert: any) => 
        cert.id === certId ? { ...cert, [field]: value } : cert
      );
      onDataUpdate('certifications', updatedCertifications);
    }
  };

  const addCertification = () => {
    if (onDataUpdate) {
      const newCert = {
        id: Date.now().toString(),
        name: 'New Certification',
        issuer: 'Issuing Organization',
        date: '2024-01',
        url: ''
      };
      onDataUpdate('certifications', [...displayCertifications, newCert]);
    }
  };

  const removeCertification = (certId: string) => {
    if (onDataUpdate) {
      const updatedCertifications = displayCertifications.filter((cert: any) => cert.id !== certId);
      onDataUpdate('certifications', updatedCertifications);
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
    <div className="certifications-section">
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
          {config.name || 'Certifications'}
        </h3>
        {editMode && (
          <button
            onClick={addCertification}
            className="text-green-600 hover:text-green-700 flex items-center text-sm"
            title="Add new certification"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </button>
        )}
      </div>
      
      <div className="certifications-list space-y-3">
        {displayCertifications.map((cert: any) => (
          <div key={cert.id} className="certification-item relative group">
            {editMode && (
              <button
                onClick={() => removeCertification(cert.id)}
                className="absolute -right-2 -top-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove certification"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
            
            <div className="certification-header flex items-start justify-between">
              <div className="certification-info flex-1">
                <h4 
                  className="certification-name font-bold flex items-center"
                  style={{ 
                    fontSize: styles.typography.fontSize.base,
                    color: styles.colors.text,
                  }}
                >
                  <EditableText
                    value={cert.name}
                    onSave={(value) => handleCertificationEdit(cert.id, 'name', value)}
                    placeholder="Certification name"
                  />
                  {cert.url && (
                    <ExternalLink 
                      className="w-3 h-3 ml-1" 
                      style={{ color: styles.colors.accent }}
                    />
                  )}
                </h4>
                
                <EditableText
                  value={cert.issuer}
                  onSave={(value) => handleCertificationEdit(cert.id, 'issuer', value)}
                  className="certification-issuer block"
                  style={{ 
                    fontSize: styles.typography.fontSize.small,
                    color: styles.colors.accent,
                  }}
                  placeholder="Issuing organization"
                />
                
                {cert.url && editMode && (
                  <EditableText
                    value={cert.url}
                    onSave={(value) => handleCertificationEdit(cert.id, 'url', value)}
                    className="certification-url block text-xs mt-1"
                    style={{ color: styles.colors.secondary }}
                    placeholder="Certification URL"
                  />
                )}
              </div>
              
              {cert.date && (
                <div className="certification-date flex items-center text-sm" style={{ color: styles.colors.secondary }}>
                  <Calendar className="w-3 h-3 mr-1" />
                  <EditableText
                    value={cert.date}
                    onSave={(value) => handleCertificationEdit(cert.id, 'date', value)}
                    placeholder="Date"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};