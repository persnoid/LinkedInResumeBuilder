import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Save, X } from 'lucide-react';

interface EducationSectionProps {
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

interface EducationEntry {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description?: string;
}

interface EducationFormData {
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
  description: string;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  data,
  styles,
  sectionStyles,
  config,
  editMode = false,
  onDataUpdate,
  showConfirmation
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

  // Form state management
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<EducationFormData>({
    degree: '',
    school: '',
    location: '',
    startDate: '',
    endDate: '',
    gpa: '',
    description: ''
  });

  // Initialize form for new entry
  const initializeNewForm = () => {
    setFormData({
      degree: '',
      school: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: ''
    });
    setEditingId(null);
    setShowForm(true);
  };

  // Initialize form for editing existing entry
  const initializeEditForm = (edu: EducationEntry) => {
    setFormData({
      degree: edu.degree,
      school: edu.school,
      location: edu.location,
      startDate: edu.startDate,
      endDate: edu.endDate,
      gpa: edu.gpa || '',
      description: edu.description || ''
    });
    setEditingId(edu.id);
    setShowForm(true);
  };

  // Handle form field changes
  const handleFormChange = (field: keyof EducationFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const handleFormSubmit = () => {
    if (!formData.degree.trim() || !formData.school.trim()) {
      alert('Please fill in at least the degree and school fields.');
      return;
    }

    const newEntry: EducationEntry = {
      id: editingId || Date.now().toString(),
      degree: formData.degree.trim(),
      school: formData.school.trim(),
      location: formData.location.trim(),
      startDate: formData.startDate,
      endDate: formData.endDate,
      gpa: formData.gpa.trim(),
      description: formData.description.trim()
    };

    let updatedEducation;
    if (editingId) {
      // Update existing entry
      updatedEducation = displayEducation.map((edu: EducationEntry) => 
        edu.id === editingId ? newEntry : edu
      );
    } else {
      // Add new entry
      updatedEducation = [...displayEducation, newEntry];
    }

    if (onDataUpdate) {
      onDataUpdate('education', updatedEducation);
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
        title: 'Delete Education Entry',
        message: 'Are you sure you want to delete this education entry? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger'
      });
    } else {
      // Fallback to browser confirm if showConfirmation is not available
      confirmed = confirm('Are you sure you want to delete this education entry?');
    }

    if (confirmed) {
      const updatedEducation = displayEducation.filter((edu: EducationEntry) => edu.id !== id);
      if (onDataUpdate) {
        onDataUpdate('education', updatedEducation);
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

  // Education Form Component
  const EducationForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Form Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {editingId ? 'Edit Education' : 'Add New Education'}
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
            {/* Degree */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Degree *
              </label>
              <input
                type="text"
                value={formData.degree}
                onChange={(e) => handleFormChange('degree', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Bachelor of Science in Computer Science"
              />
            </div>

            {/* School */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                School/University *
              </label>
              <input
                type="text"
                value={formData.school}
                onChange={(e) => handleFormChange('school', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., University of California, Berkeley"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleFormChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Berkeley, CA"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="month"
                  value={formData.startDate}
                  onChange={(e) => handleFormChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="month"
                  value={formData.endDate}
                  onChange={(e) => handleFormChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* GPA */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GPA (Optional)
              </label>
              <input
                type="text"
                value={formData.gpa}
                onChange={(e) => handleFormChange('gpa', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 3.8"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Details (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={3}
                placeholder="e.g., Relevant coursework, honors, activities..."
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
            <Save className={`${iconSizeClass} mr-2`} />
            {editingId ? 'Update' : 'Add'} Education
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="education-section">
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
         
          {config.name || 'Education'}
        </h3>
        {editMode && (
          <button
            onClick={initializeNewForm}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center text-sm transition-colors"
            title="Add new education"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Education
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
        <div className="education-list space-y-4">
          {displayEducation.map((edu: any) => (
            <div key={edu.id} className="education-item relative group">
              {editMode && (
                <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                  <button
                    onClick={() => initializeEditForm(edu)}
                    className="bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600"
                    title="Edit education"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(edu.id)}
                    className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    title="Delete education"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
              
              {/* Date and Title Row */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <EditableText
                    value={edu.degree || 'Degree and Field of Study'}
                    onSave={(value) => {
                      if (onDataUpdate) {
                        const updatedEducation = displayEducation.map((e: any) => 
                          e.id === edu.id ? { ...e, degree: value } : e
                        );
                        onDataUpdate('education', updatedEducation);
                      }
                    }}
                    className="degree font-bold block"
                    style={{ 
                      fontSize: styles.typography.fontSize.heading3,
                      color: styles.colors.text,
                    }}
                    placeholder="Degree and Field of Study"
                  />
                  
                  <EditableText
                    value={edu.school || 'School or University'}
                    onSave={(value) => {
                      if (onDataUpdate) {
                        const updatedEducation = displayEducation.map((e: any) => 
                          e.id === edu.id ? { ...e, school: value } : e
                        );
                        onDataUpdate('education', updatedEducation);
                      }
                    }}
                    className="school font-medium block mt-1"
                    style={{ 
                      fontSize: styles.typography.fontSize.base,
                      color: styles.colors.accent,
                    }}
                    placeholder="School or University"
                  />
                </div>
                
                {/* Right-aligned date without icon */}
                <div className="text-right ml-4">
                  <span 
                    className="date-range"
                    style={{ 
                      fontSize: styles.typography.fontSize.small,
                      color: styles.colors.secondary 
                    }}
                  >
                    {edu.startDate || 'Start'} - {edu.endDate || 'End'}
                  </span>
                </div>
              </div>
              
              {edu.gpa && (
                <div className="gpa mt-1" style={{ color: styles.colors.secondary }}>
                  <span style={{ fontSize: styles.typography.fontSize.small }}>
                    GPA: {edu.gpa}
                  </span>
                </div>
              )}
              
              {edu.description && (
                <p 
                  className="education-description mt-2"
                  style={{ 
                    fontSize: styles.typography.fontSize.small,
                    color: styles.colors.text,
                  }}
                >
                  {edu.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Education Form Modal */}
      {showForm && <EducationForm />}
    </div>
  );
};