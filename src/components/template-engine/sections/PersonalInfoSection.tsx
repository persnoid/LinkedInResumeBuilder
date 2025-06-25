import React, { useState, useRef } from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, User, Camera, Upload, AlertCircle, CheckCircle } from 'lucide-react';

interface PersonalInfoSectionProps {
  data: any;
  styles: any;
  sectionStyles: any;
  config: any;
  editMode?: boolean;
  onDataUpdate?: (field: string, value: any) => void;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  data,
  styles,
  sectionStyles,
  config,
  editMode = false,
  onDataUpdate
}) => {
  const { personalInfo } = data;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  
  if (!personalInfo) return null;

  // Use actual data or provide professional fallbacks
  const displayName = personalInfo.name || 'Jessica Miller';
  const displayTitle = personalInfo.title || 'Senior Software Engineer';
  const displayEmail = personalInfo.email || 'jessica.miller@email.com';
  const displayPhone = personalInfo.phone || '+1 (555) 123-4567';
  const displayLocation = personalInfo.location || 'San Francisco, CA';
  const displayLinkedin = personalInfo.linkedin || 'linkedin.com/in/jessicamiller';
  const displayWebsite = personalInfo.website || 'jessicamiller.dev';

  const contactItems = [
    { icon: Mail, value: displayEmail, label: 'Email', field: 'email' },
    { icon: Phone, value: displayPhone, label: 'Phone', field: 'phone' },
    { icon: MapPin, value: displayLocation, label: 'Location', field: 'location' },
    { icon: Linkedin, value: displayLinkedin, label: 'LinkedIn', field: 'linkedin' },
    { icon: Globe, value: displayWebsite, label: 'Website', field: 'website' },
  ].filter(item => item.value);

  const handleTextEdit = (field: string, value: string) => {
    if (onDataUpdate) {
      onDataUpdate(`personalInfo.${field}`, value);
    }
  };

  const validateImageFile = (file: File): { isValid: boolean; message: string } => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        message: 'Please upload a JPG or PNG image file.'
      };
    }

    // Check file size (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        isValid: false,
        message: 'File size must be less than 5MB. Please choose a smaller image.'
      };
    }

    return {
      isValid: true,
      message: 'Image uploaded successfully!'
    };
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadStatus('uploading');
    setUploadMessage('Validating image...');

    // Validate the file
    const validation = validateImageFile(file);
    
    if (!validation.isValid) {
      setUploadStatus('error');
      setUploadMessage(validation.message);
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      // Reset status after 3 seconds
      setTimeout(() => {
        setUploadStatus('idle');
        setUploadMessage('');
      }, 3000);
      return;
    }

    if (onDataUpdate) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoUrl = e.target?.result as string;
        onDataUpdate('personalInfo.photo', photoUrl);
        setUploadStatus('success');
        setUploadMessage(validation.message);
        
        // Reset status after 2 seconds
        setTimeout(() => {
          setUploadStatus('idle');
          setUploadMessage('');
        }, 2000);
      };
      reader.onerror = () => {
        setUploadStatus('error');
        setUploadMessage('Failed to read the image file. Please try again.');
        setTimeout(() => {
          setUploadStatus('idle');
          setUploadMessage('');
        }, 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const EditableText: React.FC<{
    value: string;
    field: string;
    className?: string;
    style?: React.CSSProperties;
    placeholder?: string;
    multiline?: boolean;
  }> = ({ value, field, className = '', style = {}, placeholder = '', multiline = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);

    const handleSave = () => {
      handleTextEdit(field, editValue);
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
          className={`${className} border-2 border-blue-500 rounded px-2 py-1 resize-none`}
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

  const PhotoUpload: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div 
      className={`${className} relative group`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {personalInfo.photo ? (
        <img
          src={personalInfo.photo}
          alt="Profile"
          className="w-full h-full object-cover rounded-full border-2 cursor-pointer"
          style={{ borderColor: styles.colors.primary }}
          onClick={() => editMode && fileInputRef.current?.click()}
        />
      ) : (
        <div 
          className={`w-full h-full rounded-full bg-gray-200 flex items-center justify-center border-2 ${editMode ? 'cursor-pointer hover:bg-gray-300' : ''}`}
          style={{ borderColor: styles.colors.primary }}
          onClick={() => editMode && fileInputRef.current?.click()}
        >
          <User className="w-12 h-12 text-gray-400" />
        </div>
      )}
      
      {editMode && (isHovering || !personalInfo.photo) && (
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-white text-center">
            <Camera className="w-6 h-6 mx-auto mb-1" />
            <span className="text-xs">Upload</span>
          </div>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handlePhotoUpload}
        className="hidden"
      />
      
      {/* Upload Status Indicator */}
      {uploadStatus !== 'idle' && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            uploadStatus === 'uploading' ? 'bg-blue-100 text-blue-800' :
            uploadStatus === 'success' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
            {uploadStatus === 'uploading' && <div className="animate-spin rounded-full h-3 w-3 border border-blue-600 border-t-transparent mr-2"></div>}
            {uploadStatus === 'success' && <CheckCircle className="w-3 h-3 mr-1" />}
            {uploadStatus === 'error' && <AlertCircle className="w-3 h-3 mr-1" />}
            {uploadMessage}
          </div>
        </div>
      )}
    </div>
  );

  const renderSidebar = () => (
    <div className="personal-info-sidebar mb-6">
      {/* Profile Photo */}
      <div className="photo-container mb-6 flex justify-center">
        <PhotoUpload className="w-24 h-24" />
      </div>
      
      {/* Name and Title */}
      <div className="text-center mb-6">
        <EditableText
          value={displayName}
          field="name"
          className="name font-bold mb-2 block"
          style={{ 
            fontSize: styles.typography.fontSize.heading1,
            color: styles.colors.primary,
            lineHeight: styles.typography.lineHeight.tight,
          }}
          placeholder="Your Name"
        />
        <EditableText
          value={displayTitle}
          field="title"
          className="title block"
          style={{ 
            fontSize: styles.typography.fontSize.heading2,
            color: styles.colors.secondary,
          }}
          placeholder="Your Professional Title"
        />
      </div>
      
      {/* Contact Information Section */}
      <div className="contact-section">
        <h4 
          className="contact-header font-bold mb-4 text-center uppercase tracking-wide"
          style={{ 
            fontSize: styles.typography.fontSize.heading3,
            color: styles.colors.primary,
            borderBottom: `2px solid ${styles.colors.primary}`,
            paddingBottom: '4px',
          }}
        >
          Contact Information
        </h4>
        
        <div className="contact-info space-y-3">
          {contactItems.map((item, index) => (
            <div key={index} className="contact-item">
              <div className="flex items-center mb-1">
                <item.icon className="w-4 h-4 mr-2 flex-shrink-0" style={{ color: styles.colors.accent }} />
                <span className="text-sm font-medium" style={{ color: styles.colors.primary }}>
                  {item.label}
                </span>
              </div>
              <div className="ml-6">
                <EditableText
                  value={item.value}
                  field={item.field}
                  className="text-sm break-all"
                  style={{ color: styles.colors.text }}
                  placeholder={`Your ${item.label}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMainContentHeader = () => (
    <div className="personal-info-main-content flex items-start mb-6">
      {/* Profile Photo on the left */}
      <div className="photo-container mr-6 flex-shrink-0">
        <PhotoUpload className="w-24 h-24" />
      </div>
      
      {/* Name, title, and contact info on the right */}
      <div className="info-content flex-1">
        <EditableText
          value={displayName}
          field="name"
          className="name font-bold mb-2 block"
          style={{ 
            fontSize: styles.typography.fontSize.heading1,
            color: styles.colors.primary,
            lineHeight: styles.typography.lineHeight.tight,
          }}
          placeholder="Your Name"
        />
        <EditableText
          value={displayTitle}
          field="title"
          className="title mb-4 block"
          style={{ 
            fontSize: styles.typography.fontSize.heading2,
            color: styles.colors.secondary,
          }}
          placeholder="Your Professional Title"
        />
        
        {/* COMPACT CONTACT INFO - 2 rows maximum */}
        <div className="contact-info grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm">
          {contactItems.map((item, index) => (
            <div key={index} className="contact-item flex items-center">
              <item.icon className="w-4 h-4 mr-2 flex-shrink-0" style={{ color: styles.colors.accent }} />
              <EditableText
                value={item.value}
                field={item.field}
                className="break-all truncate"
                style={{ color: styles.colors.text }}
                placeholder={`Your ${item.label}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHeader = () => (
    <div className="personal-info-header flex items-center justify-between mb-6">
      <div className="info-content">
        <EditableText
          value={displayName}
          field="name"
          className="name font-bold mb-2 block"
          style={{ 
            fontSize: styles.typography.fontSize.heading1,
            color: 'inherit',
            lineHeight: styles.typography.lineHeight.tight,
          }}
          placeholder="Your Name"
        />
        <EditableText
          value={displayTitle}
          field="title"
          className="title mb-4 block"
          style={{ 
            fontSize: styles.typography.fontSize.heading2,
            color: styles.colors.accent,
          }}
          placeholder="Your Professional Title"
        />
        
        {/* COMPACT CONTACT INFO - Single row with flex wrap */}
        <div className="contact-info flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {contactItems.map((item, index) => (
            <div key={index} className="contact-item flex items-center">
              <item.icon className="w-4 h-4 mr-1" />
              <EditableText
                value={item.value}
                field={item.field}
                placeholder={`Your ${item.label}`}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="photo-container ml-8">
        <PhotoUpload className="w-24 h-24" />
      </div>
    </div>
  );

  // CRITICAL: Determine layout based on section configuration
  console.log(`PersonalInfoSection rendering with columns: ${config.columns}, id: ${config.id}`);
  
  if (config.columns === 2) {
    // For sidebar (columns === 2), show full contact info section like in the image
    return renderSidebar();
  } else if (config.columns === 0) {
    // For header (columns === 0), show full header with name/title
    return renderHeader();
  } else {
    // For main content area (columns === 1), show name/title with contact
    return renderMainContentHeader();
  }
};