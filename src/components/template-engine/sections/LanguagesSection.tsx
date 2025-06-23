import React from 'react';

interface LanguagesSectionProps {
  data: any;
  styles: any;
  sectionStyles: any;
  config: any;
}

export const LanguagesSection: React.FC<LanguagesSectionProps> = ({
  data,
  styles,
  sectionStyles,
  config
}) => {
  const { languages } = data;
  
  // Provide meaningful fallback languages data
  const displayLanguages = languages && languages.length > 0 ? languages : [
    { id: '1', name: 'English', level: 'Native' },
    { id: '2', name: 'Spanish', level: 'Fluent' },
    { id: '3', name: 'French', level: 'Intermediate' }
  ];

  const getLevelDots = (level: string) => {
    const levels = {
      'beginner': 1,
      'elementary': 2,
      'intermediate': 3,
      'advanced': 4,
      'fluent': 5,
      'native': 5
    };
    return levels[level.toLowerCase()] || 3;
  };

  return (
    <div className="languages-section">
      <h3 
        className="section-title font-bold mb-3 uppercase tracking-wide"
        style={{ 
          fontSize: styles.typography.fontSize.heading3,
          color: styles.colors.primary,
          borderBottom: `2px solid ${styles.colors.primary}`,
          paddingBottom: '4px',
        }}
      >
        {config.name || 'Languages'}
      </h3>
      <div className="languages-list space-y-3">
        {displayLanguages.map((language: any) => (
          <div key={language.id} className="language-item flex justify-between items-center">
            <span 
              className="language-name font-medium"
              style={{ 
                fontSize: styles.typography.fontSize.base,
                color: styles.colors.text,
              }}
            >
              {language.name}
            </span>
            <div className="language-level flex items-center">
              <span 
                className="level-text mr-3 text-sm"
                style={{ color: styles.colors.secondary }}
              >
                {language.level}
              </span>
              <div className="level-dots flex space-x-1">
                {[1, 2, 3, 4, 5].map((dot) => (
                  <div
                    key={dot}
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: dot <= getLevelDots(language.level) 
                        ? styles.colors.primary 
                        : styles.colors.muted
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};