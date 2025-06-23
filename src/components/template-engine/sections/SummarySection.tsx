import React from 'react';

interface SummarySectionProps {
  data: any;
  styles: any;
  sectionStyles: any;
  config: any;
}

export const SummarySection: React.FC<SummarySectionProps> = ({
  data,
  styles,
  sectionStyles,
  config
}) => {
  const { summary } = data;
  
  // Provide meaningful fallback content
  const displaySummary = summary || 
    'Experienced professional with a proven track record of delivering exceptional results. Skilled in leadership, problem-solving, and driving innovation. Passionate about continuous learning and contributing to organizational success through strategic thinking and collaborative teamwork.';

  return (
    <div className="summary-section">
      <h3 
        className="section-title font-bold mb-3 uppercase tracking-wide"
        style={{ 
          fontSize: styles.typography.fontSize.heading3,
          color: styles.colors.primary,
          borderBottom: `2px solid ${styles.colors.primary}`,
          paddingBottom: '4px',
        }}
      >
        {config.name || 'Summary'}
      </h3>
      <p 
        className="summary-content leading-relaxed"
        style={{ 
          fontSize: styles.typography.fontSize.base,
          lineHeight: styles.typography.lineHeight.relaxed,
          color: styles.colors.text,
        }}
      >
        {displaySummary}
      </p>
    </div>
  );
};