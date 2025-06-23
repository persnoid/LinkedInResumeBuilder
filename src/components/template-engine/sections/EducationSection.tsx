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
  
  // Provide meaningful fallback education data
  const displayEducation = education && education.length > 0 ? education : [
    {
      id: '1',
      degree: 'Bachelor of Science in Computer Science',
      school: 'University of Technology',
      location: 'Boston, MA',
      startDate: '2014-09',
      endDate: '2018-05',
      gpa: '3.8',
      description: 'Relevant Coursework: Data Structures, Algorithms, Software Engineering'
    }
  ];

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
        {displayEducation.map((edu: any) => (
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