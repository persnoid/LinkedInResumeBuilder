import React from 'react';
import { Calendar, ExternalLink } from 'lucide-react';

interface CertificationsSectionProps {
  data: any;
  styles: any;
  sectionStyles: any;
  config: any;
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({
  data,
  styles,
  sectionStyles,
  config
}) => {
  const { certifications } = data;
  
  if (!certifications || certifications.length === 0) return null;

  return (
    <div className="certifications-section">
      <h3 
        className="section-title font-bold mb-3 uppercase tracking-wide"
        style={{ 
          fontSize: styles.typography.fontSize.heading3,
          color: styles.colors.primary,
          borderBottom: `2px solid ${styles.colors.primary}`,
          paddingBottom: '4px',
        }}
      >
        {config.name || 'Certifications'}
      </h3>
      <div className="certifications-list space-y-3">
        {certifications.map((cert: any) => (
          <div key={cert.id} className="certification-item">
            <div className="certification-header flex items-start justify-between">
              <div className="certification-info">
                <h4 
                  className="certification-name font-bold"
                  style={{ 
                    fontSize: styles.typography.fontSize.base,
                    color: styles.colors.text,
                  }}
                >
                  {cert.name}
                  {cert.url && (
                    <ExternalLink 
                      className="w-3 h-3 ml-1 inline" 
                      style={{ color: styles.colors.accent }}
                    />
                  )}
                </h4>
                <div 
                  className="certification-issuer"
                  style={{ 
                    fontSize: styles.typography.fontSize.small,
                    color: styles.colors.accent,
                  }}
                >
                  {cert.issuer}
                </div>
              </div>
              {cert.date && (
                <div className="certification-date flex items-center text-sm" style={{ color: styles.colors.secondary }}>
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>{cert.date}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};