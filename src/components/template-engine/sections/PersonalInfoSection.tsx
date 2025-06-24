import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, User } from 'lucide-react';

interface PersonalInfoSectionProps {
  data: any;
  styles: any;
  sectionStyles: any;
  config: any;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  data,
  styles,
  sectionStyles,
  config
}) => {
  const { personalInfo } = data;
  
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
    { icon: Phone, value: displayPhone, label: 'Phone' },
    { icon: Mail, value: displayEmail, label: 'Email' },
    { icon: Linkedin, value: displayLinkedin, label: 'LinkedIn' },
    { icon: Globe, value: displayWebsite, label: 'Website' },
    { icon: MapPin, value: displayLocation, label: 'Location' },
  ].filter(item => item.value);

  const renderMainContentHeader = () => (
    <div className="personal-info-main-content flex items-start mb-6">
      {/* Profile Photo on the left */}
      <div className="photo-container mr-6 flex-shrink-0">
        {personalInfo.photo ? (
          <img
            src={personalInfo.photo}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2"
            style={{ borderColor: styles.colors.primary }}
          />
        ) : (
          <div 
            className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2"
            style={{ borderColor: styles.colors.primary }}
          >
            <User className="w-12 h-12 text-gray-400" />
          </div>
        )}
      </div>
      
      {/* Name, title, and contact info on the right */}
      <div className="info-content flex-1">
        <h1 
          className="name font-bold mb-2"
          style={{ 
            fontSize: styles.typography.fontSize.heading1,
            color: styles.colors.primary,
            lineHeight: styles.typography.lineHeight.tight,
          }}
        >
          {displayName}
        </h1>
        <h2 
          className="title mb-4"
          style={{ 
            fontSize: styles.typography.fontSize.heading2,
            color: styles.colors.secondary,
          }}
        >
          {displayTitle}
        </h2>
        <div className="contact-info space-y-1">
          {contactItems.map((item, index) => (
            <div key={index} className="contact-item flex items-center text-sm">
              <item.icon className="w-4 h-4 mr-2 flex-shrink-0" style={{ color: styles.colors.accent }} />
              <span className="break-all" style={{ color: styles.colors.text }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSidebar = () => (
    <div className="personal-info-sidebar mb-6">
      {personalInfo.photo && (
        <div className="photo-container mb-4 flex justify-center">
          <img
            src={personalInfo.photo}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2"
            style={{ borderColor: styles.colors.primary }}
          />
        </div>
      )}
      <h1 
        className="name font-bold mb-2 text-center"
        style={{ 
          fontSize: styles.typography.fontSize.heading1,
          color: styles.colors.primary,
          lineHeight: styles.typography.lineHeight.tight,
        }}
      >
        {displayName}
      </h1>
      <h2 
        className="title mb-4 text-center"
        style={{ 
          fontSize: styles.typography.fontSize.heading2,
          color: styles.colors.secondary,
        }}
      >
        {displayTitle}
      </h2>
      <div className="contact-info space-y-2">
        {contactItems.map((item, index) => (
          <div key={index} className="contact-item flex items-center text-sm">
            <item.icon className="w-4 h-4 mr-2 flex-shrink-0" style={{ color: styles.colors.accent }} />
            <span className="break-all">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHeader = () => (
    <div className="personal-info-header flex items-center justify-between mb-6">
      <div className="info-content">
        <h1 
          className="name font-bold mb-2"
          style={{ 
            fontSize: styles.typography.fontSize.heading1,
            color: 'inherit',
            lineHeight: styles.typography.lineHeight.tight,
          }}
        >
          {displayName}
        </h1>
        <h2 
          className="title mb-4"
          style={{ 
            fontSize: styles.typography.fontSize.heading2,
            color: styles.colors.accent,
          }}
        >
          {displayTitle}
        </h2>
        <div className="contact-info flex flex-wrap gap-6 text-sm">
          {contactItems.map((item, index) => (
            <div key={index} className="contact-item flex items-center">
              <item.icon className="w-4 h-4 mr-1" />
              <span>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
      {personalInfo.photo && (
        <div className="photo-container ml-8">
          <img
            src={personalInfo.photo}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
          />
        </div>
      )}
    </div>
  );

  // Determine layout based on section configuration
  if (config.columns === 2) {
    return renderSidebar();
  } else if (config.columns === 0) {
    return renderHeader();
  } else {
    // For main content area (columns === 1), use the new layout
    return renderMainContentHeader();
  }
};