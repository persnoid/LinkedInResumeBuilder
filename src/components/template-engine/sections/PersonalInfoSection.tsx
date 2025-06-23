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

  const contactItems = [
    { icon: Phone, value: personalInfo.phone, label: 'Phone' },
    { icon: Mail, value: personalInfo.email, label: 'Email' },
    { icon: Linkedin, value: personalInfo.linkedin, label: 'LinkedIn' },
    { icon: Globe, value: personalInfo.website, label: 'Website' },
    { icon: MapPin, value: personalInfo.location, label: 'Location' },
  ].filter(item => item.value);

  const renderCompact = () => (
    <div className="personal-info-compact text-center mb-6">
      {personalInfo.photo && (
        <div className="photo-container mb-4 flex justify-center">
          <img
            src={personalInfo.photo}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-2"
            style={{ borderColor: styles.colors.primary }}
          />
        </div>
      )}
      <h1 
        className="name font-bold mb-2"
        style={{ 
          fontSize: styles.typography.fontSize.heading1,
          color: styles.colors.primary,
          lineHeight: styles.typography.lineHeight.tight,
        }}
      >
        {personalInfo.name || 'John Doe'}
      </h1>
      <h2 
        className="title mb-4"
        style={{ 
          fontSize: styles.typography.fontSize.heading2,
          color: styles.colors.secondary,
        }}
      >
        {personalInfo.title || 'Professional Title'}
      </h2>
      <div className="contact-info flex flex-wrap justify-center gap-4 text-sm">
        {contactItems.map((item, index) => (
          <div key={index} className="contact-item flex items-center">
            <item.icon className="w-4 h-4 mr-1" style={{ color: styles.colors.accent }} />
            <span>{item.value}</span>
          </div>
        ))}
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
        {personalInfo.name || 'John Doe'}
      </h1>
      <h2 
        className="title mb-4 text-center"
        style={{ 
          fontSize: styles.typography.fontSize.heading2,
          color: styles.colors.secondary,
        }}
      >
        {personalInfo.title || 'Professional Title'}
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
          {personalInfo.name || 'John Doe'}
        </h1>
        <h2 
          className="title mb-4"
          style={{ 
            fontSize: styles.typography.fontSize.heading2,
            color: styles.colors.accent,
          }}
        >
          {personalInfo.title || 'Professional Title'}
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
    return renderCompact();
  }
};