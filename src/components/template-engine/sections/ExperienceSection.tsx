import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Save, X } from 'lucide-react';

interface ExperienceSectionProps {
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

interface ExperienceEntry {
  id: string;
  position: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

interface ExperienceFormData {
  position: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  data,
  styles,
  sectionStyles,
  config,
  editMode = false,
  onDataUpdate,
  showConfirmation
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

  // Form state management
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ExperienceFormData>({
    position: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ['']
  });

  // Initialize form for new entry
  const initializeNewForm = () => {
    setFormData({
      position: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ['']
    });
    setEditingId(null);
    setShowForm(true);
  };

  // Initialize form for editing existing entry
  const initializeEditForm = (exp: ExperienceEntry) => {
    setFormData({
      position: exp.position,
      company: exp.company,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate,
      current: exp.current,
      description: [...exp.description]
    });
    setEditingId(exp.id);
    setShowForm(true);
  };

  // Handle form field changes
  const handleFormChange = (field: keyof ExperienceFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle description changes
  const handleDescriptionChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      description: prev.description.map((desc, i) => i === index ? value : desc)
    }));
  };

  // Add new description bullet point
  const addDescriptionPoint = () => {
    setFormData(prev => ({
      ...prev,
      description: [...prev.description, '']
    }));
  };

  // Remove description bullet point
  const removeDescriptionPoint = (index: number) => {
    if (formData.description.length > 1) {
      setFormData(prev => ({
        ...prev,
        description: prev.description.filter((_, i) => i !== index)
      }));
    }
  };

  // Handle form submission
  const handleFormSubmit = () => {
    if (!formData.position.trim() || !formData.company.trim()) {
      alert('Please fill in at least the position and company fields.');
      return;
    }

    const newEntry: ExperienceEntry = {
      id: editingId || Date.now().toString(),
      position: formData.position.trim(),
      company: formData.company.trim(),
      location: formData.location.trim(),
      startDate: formData.startDate,
      endDate: formData.current ? 'Present' : formData.endDate,
      current: formData.current,
      description: formData.description.filter(desc => desc.trim() !== '')
    };

    let updatedExperience;
    if (editingId) {
      // Update existing entry
      updatedExperience = displayExperience.map((exp: ExperienceEntry) => 
        exp.id === editingId ? newEntry : exp
      );
    } else {
      // Add new entry
      updatedExperience = [...displayExperience, newEntry];
    }

    if (onDataUpdate) {
      onDataUpdate('experience', updatedExperience);
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
        title: 'Delete Experience Entry',
        message: 'Are you sure you want to delete this experience entry? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger'
      });
    } else {
      // Fallback to browser confirm if showConfirmation is not available
      confirmed = confirm('Are you sure you want to delete this experience entry?');
    }

    if (confirmed) {
      const updatedExperience = displayExperience.filter((exp: ExperienceEntry) => exp.id !== id);
      if (onDataUpdate) {
        onDataUpdate('experience', updatedExperience);
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

  // Experience Form Component
  const ExperienceForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Form Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {editingId ? 'Edit Experience' : 'Add New Experience'}
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
            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position Title *
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => handleFormChange('position', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Senior Software Engineer"
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company *
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => handleFormChange('company', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Tech Solutions Inc."
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
                placeholder="e.g., San Francisco, CA"
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
                  disabled={formData.current}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* Current Position Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="current"
                checked={formData.current}
                onChange={(e) => handleFormChange('current', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="current" className="ml-2 block text-sm text-gray-700">
                I currently work here
              </label>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description & Achievements
              </label>
              <div className="space-y-2">
                {formData.description.map((desc, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="text-gray-400 mt-2">•</span>
                    <textarea
                      value={desc}
                      onChange={(e) => handleDescriptionChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      rows={2}
                      placeholder="Describe your achievements and responsibilities..."
                    />
                    {formData.description.length > 1 && (
                      <button
                        onClick={() => removeDescriptionPoint(index)}
                        className="text-red-500 hover:text-red-700 mt-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addDescriptionPoint}
                  className="text-blue-600 hover:text-blue-700 flex items-center text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add bullet point
                </button>
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
            <Save className={`${iconSizeClass} mr-2`} />
            {editingId ? 'Update' : 'Add'} Experience
          </button>
        </div>
      </div>
    </div>
  );

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
              <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                <button
                  onClick={() => initializeEditForm(exp)}
                  className="bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600"
                  title="Edit experience"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  title="Delete experience"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            )}
            
            <div className="experience-header mb-3">
              {/* Date and Title Row */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 
                    className="position font-bold"
                    style={{ 
                      fontSize: styles.typography.fontSize.heading3,
                      color: styles.colors.text,
                    }}
                  >
                    {exp.position}
                  </h4>
                  <span 
                    className="company font-medium block mt-1"
                    style={{ 
                      fontSize: styles.typography.fontSize.base,
                      color: styles.colors.accent,
                    }}
                  >
                    {exp.company}
                  </span>
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
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
              </div>
            </div>
            
            {exp.description && exp.description.length > 0 && (
              <div className="experience-description">
                <ul className="space-y-2">
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
                        style={{ 
                          color: styles.colors.accent,
                          fontSize: styles.typography.fontSize.base
                        }}
                      >
                        •
                      </span>
                      <span>{desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderDefaultExperience = () => (
    <div className="experience-list space-y-6">
      {displayExperience.map((exp: any) => (
        <div key={exp.id} className="experience-item relative group">
          {editMode && (
            <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
              <button
                onClick={() => initializeEditForm(exp)}
                className="bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600"
                title="Edit experience"
              >
                <Edit3 className="w-3 h-3" />
              </button>
              <button
                onClick={() => handleDelete(exp.id)}
                className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                title="Delete experience"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}
          
          {/* Date and Title Row */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h4 
                className="position font-bold"
                style={{ 
                  fontSize: styles.typography.fontSize.heading3,
                  color: styles.colors.text,
                }}
              >
                {exp.position}
              </h4>
              <span 
                className="company font-medium block mt-1"
                style={{ 
                  fontSize: styles.typography.fontSize.base,
                  color: styles.colors.accent,
                }}
              >
                {exp.company}
              </span>
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
                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
              </span>
            </div>
          </div>
          
          {exp.description && exp.description.length > 0 && (
            <div className="experience-description mt-3">
              <ul className="space-y-1">
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
                      style={{ 
                        color: styles.colors.accent,
                        fontSize: styles.typography.fontSize.base
                      }}
                    >
                      •
                    </span>
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>
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
          
          {config.name || 'Experience'}
        </h3>
        {editMode && (
          <button
            onClick={initializeNewForm}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center text-sm transition-colors"
            title="Add new experience"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Experience
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
        {sectionStyles?.display === 'timeline' ? renderTimelineExperience() : renderDefaultExperience()}
      </div>

      {/* Experience Form Modal */}
      {showForm && <ExperienceForm />}
    </div>
  );
};