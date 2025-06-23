import React from 'react';

interface SkillsSectionProps {
  data: any;
  styles: any;
  sectionStyles: any;
  config: any;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  data,
  styles,
  sectionStyles,
  config
}) => {
  const { skills } = data;
  
  if (!skills || skills.length === 0) return null;

  const renderSkillsList = () => (
    <div className="skills-list space-y-2">
      {skills.map((skill: any) => (
        <div key={skill.id} className="skill-item">
          <div className="skill-name" style={{ 
            fontSize: styles.typography.fontSize.base,
            color: styles.colors.text,
          }}>
            {skill.name}
            {skill.level && (
              <span 
                className="skill-level ml-2"
                style={{ 
                  fontSize: styles.typography.fontSize.small,
                  color: styles.colors.secondary,
                }}
              >
                ({skill.level})
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderSkillsTags = () => (
    <div className="skills-tags flex flex-wrap gap-2">
      {skills.map((skill: any) => (
        <span
          key={skill.id}
          className="skill-tag px-3 py-1 rounded-full text-sm font-medium"
          style={{
            backgroundColor: `${styles.colors.accent}20`,
            color: styles.colors.accent,
            border: `1px solid ${styles.colors.accent}40`,
          }}
        >
          {skill.name}
        </span>
      ))}
    </div>
  );

  const renderSkillsGrid = () => (
    <div className="skills-grid grid grid-cols-2 gap-2">
      {skills.map((skill: any) => (
        <div key={skill.id} className="skill-item text-sm" style={{ color: styles.colors.text }}>
          {skill.name}
        </div>
      ))}
    </div>
  );

  return (
    <div className="skills-section">
      <h3 
        className="section-title font-bold mb-3 uppercase tracking-wide"
        style={{ 
          fontSize: styles.typography.fontSize.heading3,
          color: styles.colors.primary,
          borderBottom: `2px solid ${styles.colors.primary}`,
          paddingBottom: '4px',
        }}
      >
        {config.name || 'Skills'}
      </h3>
      {sectionStyles?.display === 'tags' ? renderSkillsTags() :
       sectionStyles?.display === 'grid' ? renderSkillsGrid() :
       renderSkillsList()}
    </div>
  );
};