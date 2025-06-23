import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

interface ExperienceSectionProps {
  data: any;
  styles: any;
  sectionStyles: any;
  config: any;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  data,
  styles,
  sectionStyles,
  config
}) => {
  const { experience } = data;
  
  if (!experience || experience.length === 0) return null;

  return (
    <div className="experience-section">
      <h3 
        className="section-title font-bold mb-4 uppercase tracking-wide"
        style={{ 
          fontSize: styles.typography.fontSize.heading3,
          color: styles.colors.primary,
          borderBottom: `2px solid ${styles.colors.primary}`,
          paddingBottom: '4px',
        }}
      >
        {config.name || 'Experience'}
      </h3>
      <div className="experience-list space-y-6">
        {experience.map((exp: any) => (
          <div key={exp.id} className="experience-item">
            <div className="experience-header mb-2">
              <h4 
                className="position font-bold"
                style={{ 
                  fontSize: styles.typography.fontSize.heading3,
                  color: styles.colors.text,
                }}
              >
                {exp.position}
              </h4>
              <div 
                className="company font-medium"
                style={{ 
                  fontSize: styles.typography.fontSize.base,
                  color: styles.colors.accent,
                }}
              >
                {exp.company}
              </div>
              <div className="experience-meta flex items-center gap-4 text-sm mt-1" style={{ color: styles.colors.secondary }}>
                <div className="date-range flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                {exp.location && (
                  <div className="location flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{exp.location}</span>
                  </div>
                )}
              </div>
            </div>
            {exp.description && exp.description.length > 0 && (
              <ul className="experience-description space-y-1 mt-3">
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
                      style={{ color: styles.colors.accent }}
                    >
                      •
                    </span>
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};