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

  // Default professional photo from Pexels
  const defaultPhoto = 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2';

  // Get display parts from sectionStyles, defaulting to all parts
  const displayParts = sectionStyles?.displayParts || ['photo', 'name', 'title', 'contact'];
  const photoSize = sectionStyles?.photoSize || '24'; // Default to 96px (24 * 4)
  const contactLayout = sectionStyles?.contactLayout || 'column'; // Default to column layout

  // Convert photoSize to pixels - Tailwind uses 4px per unit (w-24 = 96px)
  const photoSizePx = parseInt(photoSize) * 4;

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

  const PhotoUpload: React.FC<{ className?: string; customStyle?: React.CSSProperties }> = ({ 
    className = '', 
    customStyle = {} 
  }) => (
    <div 
      className={`${className} relative group`}
      style={customStyle}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Always show an image - either uploaded photo or default */}
      <img
        src={personalInfo.photo || defaultPhoto}
        alt="Profile"
        className="w-full h-full object-cover rounded-full border-2 cursor-pointer"
        style={{ borderColor: styles.colors.primary }}
        onClick={() => editMode && fileInputRef.current?.click()}
      />
      
      {editMode && isHovering && (
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

  // Render components based on displayParts
  const renderPhoto = () => displayParts.includes('photo') && (
    <div className="photo-container mb-6 flex justify-center">
      <PhotoUpload 
        customStyle={{
          width: `${photoSizePx}px`,
          height: `${photoSizePx}px`,
          aspectRatio: '1'
        }}
      />
    </div>
  );

  const renderName = () => displayParts.includes('name') && (
    <EditableText
      value={displayName}
      field="name"
      className="name font-bold block"
      style={{ 
        fontSize: styles.typography.fontSize.heading1,
        color: styles.colors.text,
        lineHeight: styles.typography.lineHeight.tight,
      }}
      placeholder="Your Name"
    />
  );

  const renderTitle = () => displayParts.includes('title') && (
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
  );

  const renderContact = () => displayParts.includes('contact') && (
    <div className="contact-section">
      {!sectionStyles?.hideContactHeader && ( <h4 
        className="contact-header font-bold mb-4 uppercase tracking-wide"
        style={{ 
          fontSize: styles.typography.fontSize.heading3,
          color: styles.colors.primary,
          borderBottom: `2px solid ${styles.colors.primary}`,
          paddingBottom: '2px',
          textAlign: sectionStyles?.alignment || 'left'
        }}
      >
        Contact Information
      </h4>)}
      
      <div 
        className={`contact-info ${
          contactLayout === 'row' 
            ? 'flex flex-wrap gap-x-4 gap-y-2 justify-center' 
            : 'space-y-3'
        }`
      }
      >
        {contactItems.map((item, index) => (
          <div key={index} className="contact-item flex items-center">
            <item.icon className="w-3 h-3 mr-2 flex-shrink-0" style={{ color: styles.colors.accent }} />
            <EditableText
              value={item.value}
              field={item.field}
              className="break-all"
              style={{
                fontSize: styles.typography.fontSize.contactInfo || styles.typography.fontSize.small,
                color: styles.colors.text
              }}
              placeholder={`Your ${item.label}`}
            />
          </div>
        ))}
      </div>
    </div>
  );

  // LAYOUT-SPECIFIC RENDERING LOGIC
  
  // For header layout (columns: 0) - COMPACT HORIZONTAL LAYOUT
  if (config.columns === 0) {
    return (
      <div className="personal-info-header flex items-center justify-between py-6 px-8">
        <div className="info-content flex-1">
          <EditableText
            value={displayName}
            field="name"
            className="name font-bold block"
            style={{ 
              fontSize: styles.typography.fontSize.heading1,
              color: styles.colors.background, // White text for dark header
              lineHeight: styles.typography.lineHeight.tight,
            }}
            placeholder="Your Name"
          />
          <div className="mt-1">
            <EditableText
              value={displayTitle}
              field="title"
              className="title block"
              style={{ 
                fontSize: styles.typography.fontSize.heading2,
                color: styles.colors.background, // White text for dark header
                opacity: 0.9
              }}
              placeholder="Your Professional Title"
            />
          </div>
          
          {/* COMPACT CONTACT INFO - Single row with flex wrap */}
          <div className="contact-info flex flex-wrap gap-x-6 gap-y-2 mt-4">
            {contactItems.map((item, index) => (
              <div key={index} className="contact-item flex items-center">
                <item.icon 
                  className="w-3 h-3 mr-1" 
                  style={{ color: styles.colors.background }} 
                />
                <EditableText
                  value={item.value}
                  field={item.field}
                  style={{ 
                    fontSize: styles.typography.fontSize.contactInfo || styles.typography.fontSize.small,
                    color: styles.colors.background // White text for dark header
                  }}
                  placeholder={`Your ${item.label}`}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="photo-container ml-8 flex-shrink-0">
          <PhotoUpload 
            customStyle={{
              width: `${photoSizePx}px`,
              height: `${photoSizePx}px`,
              aspectRatio: '1'
            }}
          />
        </div>
      </div>
    );
  }

  // For sidebar layout (columns: 2) - VERTICAL STACK
  if (config.columns === 2) {
    return (
      <div 
        className={`personal-info-sidebar ${sectionStyles?.alignment === 'center' ? 'text-center' : 'text-left'}`}
        style={{
          padding: sectionStyles?.padding || '0',
          backgroundColor: sectionStyles?.backgroundColor || 'transparent'
        }}
      >
        {renderPhoto()}
        {renderName()}
        {renderTitle() && <div className="mt-2">{renderTitle()}</div>}
        {renderContact() && <div className="mt-6">{renderContact()}</div>}
      </div>
    );
  }

  // For main content (columns: 1) - Use displayParts for flexible rendering
  if (config.columns === 1) {
    return (
      <div className="personal-info-main-content mb-6">
        <div >
          {renderPhoto()}
          {renderName()}
          {renderTitle() && <div className="mt-2">{renderTitle()}</div>}
          {renderContact() && <div className="mt-6">{renderContact()}</div>}
        </div>
      </div>
    );
  }

  // Default fallback - unified approach based on displayParts
  return (
    <div 
      className={`personal-info-section ${sectionStyles?.alignment === 'center' ? 'text-center' : 'text-left'}`}
      style={{
        padding: sectionStyles?.padding || '0',
        backgroundColor: sectionStyles?.backgroundColor || 'transparent'
      }}
    >
      {renderPhoto()}
      {renderName()}
      {renderTitle() && <div className="mt-2">{renderTitle()}</div>}
      {renderContact() && <div className="mt-2">{renderContact()}</div>}
    </div>
  );
};