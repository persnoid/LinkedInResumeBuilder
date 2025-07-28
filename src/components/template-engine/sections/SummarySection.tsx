import React, { useState } from 'react';
import { User } from 'lucide-react';

interface SummarySectionProps {
  data: any;
  styles: any;
  sectionStyles: any;
  config: any;
  editMode?: boolean;
  onDataUpdate?: (field: string, value: any) => void;
  iconSizeClass?: string;
}

export const SummarySection: React.FC<SummarySectionProps> = ({
  data,
  styles,
  sectionStyles,
  config,
  editMode = false,
  onDataUpdate,
  iconSizeClass = 'w-3 h-3'
}) => {
  const { summary } = data;
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(summary || '');
  
  // Provide meaningful fallback content
  const displaySummary = summary || 
    'Experienced software engineer with 8+ years of expertise in full-stack development, cloud architecture, and team leadership. Proven track record of delivering scalable solutions and mentoring junior developers.';

  const handleSave = () => {
    if (onDataUpdate) {
      onDataUpdate('summary', editValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditValue(displaySummary);
      setIsEditing(false);
    }
  };

  return (
    <div className="summary-section">
      <h3 
        className="section-title font-bold mb-3 uppercase tracking-wide flex items-center gap-x-2"
        style={{ 
          fontSize: styles.typography.fontSize.heading3,
          color: styles.colors.primary,
          borderBottom: sectionStyles?.headerStyle === 'underline' ? `2px solid ${styles.colors.primary}` : 'none',
          backgroundColor: sectionStyles?.headerStyle === 'background' ? `${styles.colors.primary}10` : 'transparent',
          padding: sectionStyles?.headerStyle === 'background' ? '8px 12px' : '0 0 4px 0',
          borderRadius: sectionStyles?.headerStyle === 'background' ? '6px' : '0',
          textTransform: sectionStyles?.textTransform || 'uppercase',
          fontWeight: sectionStyles?.fontWeight ? styles.typography.fontWeight?.[sectionStyles.fontWeight] || 'bold' : 'bold'
        }}
      >
        
        <span>{config.name || 'Summary'}</span>
      </h3>
      
      <div 
        style={{
          padding: sectionStyles?.padding || '0',
          margin: sectionStyles?.margin || '0',
          backgroundColor: sectionStyles?.backgroundColor || 'transparent',
          borderRadius: sectionStyles?.borderRadius ? styles.effects?.borderRadius?.[sectionStyles.borderRadius] || '0' : '0',
          border: sectionStyles?.borderWidth ? `${sectionStyles.borderWidth} ${sectionStyles.borderStyle || 'solid'} ${sectionStyles.borderColor || styles.colors.border}` : 'none',
          boxShadow: sectionStyles?.shadow ? styles.effects?.shadow?.[sectionStyles.shadow] || 'none' : 'none'
        }}
      >
        {editMode && isEditing ? (
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="summary-content w-full p-3 border-2 border-blue-500 rounded resize-none leading-relaxed"
            style={{ 
              fontSize: styles.typography.fontSize.base,
              lineHeight: styles.typography.lineHeight.relaxed,
              color: styles.colors.text,
              minHeight: '120px'
            }}
            placeholder="Write a compelling summary of your professional background..."
            autoFocus
          />
        ) : (
          <p 
            className={`summary-content leading-relaxed ${editMode ? 'cursor-pointer hover:bg-blue-50 hover:outline hover:outline-2 hover:outline-blue-300 rounded p-2' : ''}`}
            style={{ 
              fontSize: styles.typography.fontSize.base,
              lineHeight: styles.typography.lineHeight.relaxed,
              color: styles.colors.text,
            }}
            onClick={() => editMode && setIsEditing(true)}
            title={editMode ? 'Click to edit summary' : ''}
          >
            {displaySummary}
          </p>
        )}
      </div>
    </div>
  );
};