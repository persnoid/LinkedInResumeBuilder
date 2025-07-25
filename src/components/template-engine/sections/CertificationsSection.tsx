import React, { useState } from 'react';
import { Calendar, ExternalLink, Plus, Trash2, Award, Edit3, Save, X } from 'lucide-react';

interface CertificationsSectionProps {
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

interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

interface CertificationFormData {
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({
  data,
  styles,
  sectionStyles,
  config,
  editMode = false,
  onDataUpdate,
  showConfirmation
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

  // Form state management
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CertificationFormData>({
    name: '',
    issuer: '',
    date: '',
    url: ''
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

  // Initialize form for new entry
  const initializeNewForm = () => {
    setFormData({
      name: '',
      issuer: '',
      date: '',
      url: ''
    });
    setEditingId(null);
    setShowForm(true);
  };

  // Initialize form for editing existing entry
  const initializeEditForm = (cert: CertificationEntry) => {
    setFormData({
      name: cert.name,
      issuer: cert.issuer,
      date: cert.date,
      url: cert.url || ''
    });
    setEditingId(cert.id);
    setShowForm(true);
  };

  // Handle form field changes
  const handleFormChange = (field: keyof CertificationFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const handleFormSubmit = () => {
    if (!formData.name.trim() || !formData.issuer.trim()) {
      alert('Please fill in at least the certification name and issuer fields.');
      return;
    }

    const newEntry: CertificationEntry = {
      id: editingId || Date.now().toString(),
      name: formData.name.trim(),
      issuer: formData.issuer.trim(),
      date: formData.date,
      url: formData.url.trim()
    };

    let updatedCertifications;
    if (editingId) {
      // Update existing entry
      updatedCertifications = displayCertifications.map((cert: CertificationEntry) => 
        cert.id === editingId ? newEntry : cert
      );
    } else {
      // Add new entry
      updatedCertifications = [...displayCertifications, newEntry];
    }

    if (onDataUpdate) {
      onDataUpdate('certifications', updatedCertifications);
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
        title: 'Delete Certification',
        message: 'Are you sure you want to delete this certification? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger'
      });
    } else {
      // Fallback to browser confirm if showConfirmation is not available
      confirmed = confirm('Are you sure you want to delete this certification?');
    }

    if (confirmed) {
      const updatedCertifications = displayCertifications.filter((cert: CertificationEntry) => cert.id !== id);
      if (onDataUpdate) {
        onDataUpdate('certifications', updatedCertifications);
      }
    }
  };

  // Cancel form
  const handleCancel = () => {
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

  // Certification Form Component
  const CertificationForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Form Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {editingId ? 'Edit Certification' : 'Add New Certification'}
          </h3>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="space-y-4">
            {/* Certification Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Certification Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., AWS Solutions Architect"
              />
            </div>

            {/* Issuing Organization */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issuing Organization *
              </label>
              <input
                type="text"
                value={formData.issuer}
                onChange={(e) => handleFormChange('issuer', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Amazon Web Services"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Obtained
              </label>
              <input
                type="month"
                value={formData.date}
                onChange={(e) => handleFormChange('date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Certification URL (Optional)
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => handleFormChange('url', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://..."
              />
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
            {editingId ? 'Update' : 'Add'} Certification
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="certifications-section">
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
          <Award className="w-3 h-3 mr-2" />
          <Award 
            className="" 
            style={{ 
              width: `${iconSizePx}px`,
              height: `${iconSizePx}px`,
              marginRight: '8px'
            }} 
          />
          {config.name || 'Certifications'}
        </h3>
        {editMode && (
          <button
            onClick={initializeNewForm}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center text-sm transition-colors"
            title="Add new certification"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Certification
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
        <div className="certifications-list space-y-3">
          {displayCertifications.map((cert: any) => (
            <div key={cert.id} className="certification-item relative group">
              {editMode && (
                <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                  <button
                    onClick={() => initializeEditForm(cert)}
                    className="bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600"
                    title="Edit certification"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(cert.id)}
                    className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    title="Delete certification"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
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
                      onSave={(value) => {
                        if (onDataUpdate) {
                          const updatedCertifications = displayCertifications.map((c: any) => 
                            c.id === cert.id ? { ...c, name: value } : c
                          );
                          onDataUpdate('certifications', updatedCertifications);
                        }
                      }}
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
                    onSave={(value) => {
                      if (onDataUpdate) {
                        const updatedCertifications = displayCertifications.map((c: any) => 
                          c.id === cert.id ? { ...c, issuer: value } : c
                        );
                        onDataUpdate('certifications', updatedCertifications);
                      }
                    }}
                    className="certification-issuer block"
                    style={{ 
                      fontSize: styles.typography.fontSize.small,
                      color: styles.colors.accent,
                    }}
                    placeholder="Issuing organization"
                  />
                </div>
                
                {cert.date && (
                  <div className="certification-date flex items-center" style={{ color: styles.colors.secondary }}>
                    <Calendar 
                      className="mr-1" 
                      style={{ 
                        width: '12px', 
                        height: '12px',
                        width: `${Math.max(8, iconSizePx * 0.75)}px`,
                        height: `${Math.max(8, iconSizePx * 0.75)}px`,
                        fontSize: styles.typography.fontSize.small 
                      }} 
                    />
                    <span style={{ fontSize: styles.typography.fontSize.small }}>
                      {cert.date}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certification Form Modal */}
      {showForm && <CertificationForm />}
    </div>
  );
};