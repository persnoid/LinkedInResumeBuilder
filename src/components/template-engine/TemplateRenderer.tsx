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

  // Sort sections by order and filter visible ones
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
        // CRITICAL FIX: Properly separate main content from sidebar content
        const mainContentSections = sortedSections.filter(s => s.columns === 1 || (!s.columns && s.columns !== 2));
        const sidebarSections = sortedSections.filter(s => s.columns === 2);
        
        console.log('Sidebar layout - Main sections:', mainContentSections.map(s => `${s.id} (columns: ${s.columns})`));
        console.log('Sidebar layout - Sidebar sections:', sidebarSections.map(s => `${s.id} (columns: ${s.columns})`));
        
        return (
          <div className="template-sidebar flex h-full min-h-full">
            <div className="template-sidebar-content flex-1 p-8">
              {mainContentSections.map(renderSection)}
            </div>
            <div className="template-sidebar-aside w-1/3 p-6" style={{ 
              backgroundColor: styles.colors.muted,
            }}>
              {sidebarSections.map(renderSection)}
            </div>
          </div>
        );

      case 'header-footer':
        // CRITICAL FIX: Separate sections by their column values
        const headerSections = sortedSections.filter(s => s.columns === 0); // Header only
        const bodySections = sortedSections.filter(s => s.columns === 1 || (!s.columns && s.columns !== 0)); // Main content only
        const footerSections = sortedSections.filter(s => s.columns === 3); // Footer only
        
        console.log('Header-footer layout - Header sections:', headerSections.map(s => `${s.id} (columns: ${s.columns})`));
        console.log('Header-footer layout - Body sections:', bodySections.map(s => `${s.id} (columns: ${s.columns})`));
        console.log('Header-footer layout - Footer sections:', footerSections.map(s => `${s.id} (columns: ${s.columns})`));
        
        return (
          <div className="template-header-footer">
            {/* Header Section - Navy background */}
            {headerSections.length > 0 && (
              <div className="template-header p-8" style={{ 
                backgroundColor: styles.colors.primary,
                color: styles.colors.background,
              }}>
                {headerSections.map(renderSection)}
              </div>
            )}
            
            {/* Main Body Section - White background */}
            <div className="template-body p-8">
              {bodySections.map(renderSection)}
            </div>
            
            {/* Footer Section */}
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
        width: '794px',
        height: isPreview ? '1123px' : 'auto',
        minHeight: isPreview ? '1123px' : '297mm',
        maxWidth: '794px',
        margin: '0',
        boxShadow: isPreview ? 'none' : '0 0 10px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {renderLayout()}
    </div>
  );
};