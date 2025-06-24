import React, { useState, useRef } from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, User, Camera, Upload } from 'lucide-react';

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
  
  if (!personalInfo) return null;

  // Use actual data or provide professional fallbacks
  const displayName = personalInfo.name || 'John Doe';
  const displayTitle = personalInfo.title || 'Senior Software Engineer';
  const displayEmail = personalInfo.email || 'john.doe@email.com';
  const displayPhone = personalInfo.phone || '+1 (555) 123-4567';
  const displayLocation = personalInfo.location || 'San Francisco, CA';
  const displayLinkedin = personalInfo.linkedin || 'linkedin.com/in/johndoe';
  const displayWebsite = personalInfo.website || 'johndoe.dev';

  const contactItems = [
    { icon: Phone, value: displayPhone, label: 'Phone', field: 'phone' },
    { icon: Mail, value: displayEmail, label: 'Email', field: 'email' },
    { icon: Linkedin, value: displayLinkedin, label: 'LinkedIn', field: 'linkedin' },
    { icon: Globe, value: displayWebsite, label: 'Website', field: 'website' },
    { icon: MapPin, value: displayLocation, label: 'Location', field: 'location' },
  ].filter(item => item.value);

  const handleTextEdit = (field: string, value: string) => {
    if (onDataUpdate) {
      onDataUpdate(`personalInfo.${field}`, value);
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onDataUpdate) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoUrl = e.target?.result as string;
        onDataUpdate('personalInfo.photo', photoUrl);
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
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />
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
        <div className="contact-info space-y-1">
          {contactItems.map((item, index) => (
            <div key={index} className="contact-item flex items-center text-sm">
              <item.icon className="w-4 h-4 mr-2 flex-shrink-0" style={{ color: styles.colors.accent }} />
              <EditableText
                value={item.value}
                field={item.field}
                className="break-all"
                style={{ color: styles.colors.text }}
                placeholder={`Your ${item.label}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // CRITICAL FIX: For sidebar templates, ONLY render contact info, NOT name/title
  const renderSidebarContactOnly = () => (
    <div className="personal-info-sidebar-contact mb-6">
      <h3 
        className="section-title font-bold mb-3 uppercase tracking-wide"
        style={{ 
          fontSize: styles.typography.fontSize.heading3,
          color: styles.colors.primary,
          borderBottom: `2px solid ${styles.colors.primary}`,
          paddingBottom: '4px',
        }}
      >
        CONTACT
      </h3>
      <div className="contact-info space-y-2">
        {contactItems.map((item, index) => (
          <div key={index} className="contact-item flex items-center text-sm">
            <item.icon className="w-4 h-4 mr-2 flex-shrink-0" style={{ color: styles.colors.accent }} />
            <EditableText
              value={item.value}
              field={item.field}
              className="break-all"
              style={{ color: styles.colors.text }}
              placeholder={`Your ${item.label}`}
            />
          </div>
        ))}
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
        <div className="contact-info flex flex-wrap gap-6 text-sm">
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
  console.log(`PersonalInfoSection rendering with columns: ${config.columns}`);
  
  if (config.columns === 2) {
    // For sidebar (columns === 2), ONLY show contact info, NOT name/title
    return renderSidebarContactOnly();
  } else if (config.columns === 0) {
    // For header (columns === 0), show full header with name/title
    return renderHeader();
  } else {
    // For main content area (columns === 1), show name/title with contact
    return renderMainContentHeader();
  }
};