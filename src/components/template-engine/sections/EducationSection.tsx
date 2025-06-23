import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

interface EducationSectionProps {
  data: any;
  styles: any;
  sectionStyles: any;
  config: any;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  data,
  styles,
  sectionStyles,
  config
}) => {
  const { education } = data;
  
  if (!education || education.length === 0) return null;

  return (
    <div className="education-section">
      <h3 
        className="section-title font-bold mb-4 uppercase tracking-wide"
        style={{ 
          fontSize: styles.typography.fontSize.heading3,
          color: styles.colors.primary,
          borderBottom: `2px solid ${styles.colors.primary}`,
          paddingBottom: '4px',
        }}
      >
        {config.name || 'Education'}
      </h3>
      <div className="education-list space-y-4">
        {education.map((edu: any) => (
          <div key={edu.id} className="education-item">
            <h4 
              className="degree font-bold"
              style={{ 
                fontSize: styles.typography.fontSize.heading3,
                color: styles.colors.text,
              }}
            >
              {edu.degree}
            </h4>
            <div 
              className="school font-medium"
              style={{ 
                fontSize: styles.typography.fontSize.base,
                color: styles.colors.accent,
              }}
            >
              {edu.school}
            </div>
            <div className="education-meta flex items-center gap-4 text-sm mt-1" style={{ color: styles.colors.secondary }}>
              <div className="date-range flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{edu.startDate} - {edu.endDate}</span>
              </div>
              {edu.location && (
                <div className="location flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{edu.location}</span>
                </div>
              )}
            </div>
            {edu.gpa && (
              <div className="gpa text-sm mt-1" style={{ color: styles.colors.secondary }}>
                GPA: {edu.gpa}
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
  );
};