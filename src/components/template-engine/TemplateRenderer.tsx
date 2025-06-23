import React from 'react';
import { TemplateContext, TemplateLayout } from '../../types/template';
import { PersonalInfoSection } from './sections/PersonalInfoSection';
import { SummarySection } from './sections/SummarySection';
import { ExperienceSection } from './sections/ExperienceSection';
import { EducationSection } from './sections/EducationSection';
import { SkillsSection } from './sections/SkillsSection';
import { LanguagesSection } from './sections/LanguagesSection';
import { CertificationsSection } from './sections/CertificationsSection';

interface TemplateRendererProps {
  context: TemplateContext;
  className?: string;
}

const sectionComponents = {
  PersonalInfo: PersonalInfoSection,
  Summary: SummarySection,
  Experience: ExperienceSection,
  Education: EducationSection,
  Skills: SkillsSection,
  Languages: LanguagesSection,
  Certifications: CertificationsSection,
};

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  context,
  className = ''
}) => {
  const { config, data, customizations } = context;
  const { layout } = config;

  // Add error boundary and fallback
  if (!data || !config) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>Loading resume preview...</p>
      </div>
    );
  }

  // Merge default styles with customizations
  const styles = {
    ...layout.styles,
    colors: { ...layout.styles.colors, ...customizations.colors },
    typography: { ...layout.styles.typography, ...customizations.typography },
    spacing: { ...layout.styles.spacing, ...customizations.spacing },
  };

  // Sort sections by order
  const sortedSections = layout.sections
    .filter(section => section.visible)
    .sort((a, b) => a.order - b.order);

  const renderSection = (section: any) => {
    const SectionComponent = sectionComponents[section.component as keyof typeof sectionComponents];
    
    if (!SectionComponent) {
      console.warn(`Section component "${section.component}" not found`);
      return null;
    }

    const sectionData = data;
    const sectionStyles = {
      ...section.styles,
      ...customizations.sections?.[section.id]?.styles,
    };

    return (
      <div
        key={section.id}
        className={`template-section template-section-${section.id}`}
        style={{
          marginBottom: styles.spacing.section,
          textAlign: sectionStyles?.alignment || 'left',
        }}
      >
        <SectionComponent
          data={sectionData}
          styles={styles}
          sectionStyles={sectionStyles}
          config={section}
        />
        {sectionStyles?.divider && (
          <div
            className="section-divider"
            style={{
              borderBottom: `1px solid ${styles.colors.border}`,
              marginTop: styles.spacing.item,
            }}
          />
        )}
      </div>
    );
  };

  const renderLayout = () => {
    switch (layout.type) {
      case 'single-column':
        return (
          <div className="template-single-column p-8">
            {sortedSections.map(renderSection)}
          </div>
        );

      case 'two-column':
        const leftSections = sortedSections.filter(s => s.columns === 1 || !s.columns);
        const rightSections = sortedSections.filter(s => s.columns === 2);
        
        return (
          <div className="template-two-column grid grid-cols-3 gap-8 p-8">
            <div className="col-span-2">
              {leftSections.map(renderSection)}
            </div>
            <div className="col-span-1">
              {rightSections.map(renderSection)}
            </div>
          </div>
        );

      case 'sidebar':
        const mainSections = sortedSections.filter(s => s.columns !== 2);
        const sidebarSections = sortedSections.filter(s => s.columns === 2);
        
        return (
          <div className="template-sidebar flex h-full min-h-full">
            <div className="template-sidebar-content flex-1 p-8">
              {mainSections.map(renderSection)}
            </div>
            <div className="template-sidebar-aside w-1/3 p-6" style={{ 
              backgroundColor: styles.colors.muted,
            }}>
              {sidebarSections.map(renderSection)}
            </div>
          </div>
        );

      case 'header-footer':
        const headerSections = sortedSections.filter(s => s.columns === 0);
        const bodySections = sortedSections.filter(s => s.columns === 1 || !s.columns);
        const footerSections = sortedSections.filter(s => s.columns === 3);
        
        return (
          <div className="template-header-footer">
            {headerSections.length > 0 && (
              <div className="template-header p-8" style={{ 
                backgroundColor: styles.colors.primary,
                color: styles.colors.background,
              }}>
                {headerSections.map(renderSection)}
              </div>
            )}
            <div className="template-body p-8">
              {bodySections.map(renderSection)}
            </div>
            {footerSections.length > 0 && (
              <div className="template-footer p-8" style={{ 
                borderTop: `1px solid ${styles.colors.border}`,
              }}>
                {footerSections.map(renderSection)}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="template-default p-8">
            {sortedSections.map(renderSection)}
          </div>
        );
    }
  };

  // Determine if this is a preview (scaled down) or full size
  const isPreview = className.includes('template-preview-scaled');

  return (
    <div
      id={isPreview ? undefined : "resume-preview"}
      className={`template-container ${isPreview ? '' : 'a4-page'} ${className}`}
      style={{
        fontFamily: styles.typography.fontFamily,
        fontSize: styles.typography.fontSize.base,
        lineHeight: styles.typography.lineHeight.normal,
        color: styles.colors.text,
        backgroundColor: styles.colors.background,
        width: isPreview ? '100%' : '794px',
        height: isPreview ? '100%' : 'auto',
        minHeight: isPreview ? '100%' : '297mm',
        maxWidth: isPreview ? '100%' : '794px',
        margin: isPreview ? '0' : '0 auto',
        boxShadow: isPreview ? 'none' : '0 0 10px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        transform: isPreview ? 'scale(1)' : 'scale(1)',
        transformOrigin: 'top left'
      }}
    >
      {renderLayout()}
    </div>
  );
};