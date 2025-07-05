import React from 'react';
import { TemplateContext, TemplateLayout } from '../../types/template';
import { PersonalInfoSection } from './sections/PersonalInfoSection';
import { SummarySection } from './sections/SummarySection';
import { ExperienceSection } from './sections/ExperienceSection';
import { EducationSection } from './sections/EducationSection';
import { SkillsSection } from './sections/SkillsSection';
import { LanguagesSection } from './sections/LanguagesSection';
import { CertificationsSection } from './sections/CertificationsSection';
import { CustomTextSection } from './sections/CustomTextSection';

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
  CustomText: CustomTextSection,
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

  // Extract edit mode, data update handler, and confirmation function from customizations
  const editMode = customizations.editMode || false;
  const onDataUpdate = customizations.onDataUpdate;
  const showConfirmation = customizations.showConfirmation;

  console.log('TemplateRenderer - Edit mode:', editMode);
  console.log('TemplateRenderer - Has onDataUpdate:', !!onDataUpdate);
  console.log('TemplateRenderer - Has showConfirmation:', !!showConfirmation);
  console.log('TemplateRenderer - showConfirmation type:', typeof showConfirmation);

  // Handle data updates from sections
  const handleSectionDataUpdate = (field: string, value: any) => {
    console.log('TemplateRenderer - Section data update:', field, value);
    if (onDataUpdate) {
      // Create updated data object
      const updatedData = { ...data };
      
      // Handle nested field updates (e.g., "personalInfo.name")
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        updatedData[parent] = { ...updatedData[parent], [child]: value };
      } else {
        updatedData[field] = value;
      }
      
      // Ensure we're passing the correctly typed data
      onDataUpdate(updatedData as ResumeData);
    }
  };

  // Combine base sections with custom sections and apply customizations
  const getAllSections = () => {
    const baseSections = layout.sections || [];
    const sectionCustomizations = customizations.sections || {};
    
    // Start with base sections
    const allSections = [...baseSections];
    
    // Add custom sections that don't exist in base
    Object.values(sectionCustomizations).forEach((customSection: any) => {
      const existsInBase = baseSections.some(base => base.id === customSection.id);
      if (!existsInBase && customSection.visible !== false) {
        allSections.push({
          id: customSection.id,
          name: customSection.name,
          component: customSection.component,
          visible: true,
          order: customSection.order,
          columns: customSection.columns,
          styles: customSection.styles || {}
        });
      }
    });
    
    // Apply customizations to all sections and filter
    return allSections
      .map(section => {
        const customization = sectionCustomizations[section.id];
        if (customization) {
          return {
            ...section,
            name: customization.name || section.name,
            component: customization.component || section.component,
            visible: customization.visible !== undefined ? customization.visible : section.visible,
            order: customization.order !== undefined ? customization.order : section.order,
            columns: customization.columns !== undefined ? customization.columns : section.columns,
            styles: { ...section.styles, ...customization.styles }
          };
        }
        return section;
      })
      .filter(section => section.visible !== false)
      .sort((a, b) => a.order - b.order);
  };

  const sortedSections = getAllSections();

  const renderSection = (section: any) => {
    const SectionComponent = sectionComponents[section.component as keyof typeof sectionComponents];
    
    if (!SectionComponent) {
      console.warn(`Section component "${section.component}" not found`);
      return null;
    }

    // CRITICAL FIX: Pass the actual parsed data, not fallback data
    const sectionData = data;
    const sectionStyles = {
      ...section.styles,
      ...customizations.sections?.[section.id]?.styles,
    };

    console.log(`TemplateRenderer - Rendering section ${section.id}:`, {
      editMode,
      hasOnDataUpdate: !!onDataUpdate,
      hasShowConfirmation: !!showConfirmation,
      sectionComponent: section.component,
      showConfirmationFunction: showConfirmation
    });

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
          editMode={editMode}
          onDataUpdate={handleSectionDataUpdate}
          showConfirmation={showConfirmation}
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
          <div 
            className="template-single-column"
            style={{ padding: styles.spacing.contentPadding || '32px' }}
          >
            {sortedSections.map(renderSection)}
          </div>
        );

      case 'two-column':
        // FIXED: Use explicit filtering for two-column layout
        const leftColumnSections = sortedSections.filter(s => s.columns === 1);
        const rightColumnSections = sortedSections.filter(s => s.columns === 2);
        
        console.log('Two-column layout - Left sections:', leftColumnSections.map(s => `${s.id} (columns: ${s.columns})`));
        console.log('Two-column layout - Right sections:', rightColumnSections.map(s => `${s.id} (columns: ${s.columns})`));
        
        return (
          <div 
            className="template-two-column grid grid-cols-3 gap-8"
            style={{ padding: styles.spacing.contentPadding || '32px' }}
          >
            <div className="col-span-2">
              {leftColumnSections.map(renderSection)}
            </div>
            <div className="col-span-1">
              {rightColumnSections.map(renderSection)}
            </div>
          </div>
        );

      case 'sidebar':
        // CRITICAL FIX: SIDEBAR ON LEFT - Swap the order
        const mainContentSections = sortedSections.filter(s => s.columns === 1);
        const sidebarSections = sortedSections.filter(s => s.columns === 2);
        
        console.log('=== SIDEBAR LAYOUT DEBUG ===');
        console.log('All sorted sections:', sortedSections.map(s => `${s.id} (columns: ${s.columns})`));
        console.log('Main content sections (columns === 1):', mainContentSections.map(s => `${s.id} (columns: ${s.columns})`));
        console.log('Sidebar sections (columns === 2):', sidebarSections.map(s => `${s.id} (columns: ${s.columns})`));
        console.log('=== END DEBUG ===');
        
        return (
          <div className="template-sidebar flex h-full min-h-full">
            {/* SIDEBAR ON LEFT - First in flex order */}
            <div 
              className="template-sidebar-aside w-1/3" 
              style={{ 
                backgroundColor: styles.colors.muted,
                padding: styles.spacing.sidebarColumnPadding || '24px'
              }}
            >
              {sidebarSections.map(renderSection)}
            </div>
            
            {/* MAIN CONTENT ON RIGHT - Second in flex order */}
            <div 
              className="template-sidebar-content flex-1"
              style={{ padding: styles.spacing.mainColumnPadding || '32px' }}
            >
              {mainContentSections.map(renderSection)}
            </div>
          </div>
        );

      case 'header-footer':
        // CRITICAL FIX: Use ONLY explicit column values
        const headerSections = sortedSections.filter(s => s.columns === 0);
        const bodySections = sortedSections.filter(s => s.columns === 1);
        const footerSections = sortedSections.filter(s => s.columns === 3);
        
        console.log('=== HEADER-FOOTER LAYOUT DEBUG ===');
        console.log('All sorted sections:', sortedSections.map(s => `${s.id} (columns: ${s.columns})`));
        console.log('Header sections (columns === 0):', headerSections.map(s => `${s.id} (columns: ${s.columns})`));
        console.log('Body sections (columns === 1):', bodySections.map(s => `${s.id} (columns: ${s.columns})`));
        console.log('Footer sections (columns === 3):', footerSections.map(s => `${s.id} (columns: ${s.columns})`));
        console.log('=== END DEBUG ===');
        
        return (
          <div className="template-header-footer">
            {/* Header Section - Navy background */}
            {headerSections.length > 0 && (
              <div 
                className="template-header"
                style={{ 
                  backgroundColor: styles.colors.primary,
                  color: styles.colors.background,
                  padding: styles.spacing.contentPadding || '32px'
                }}
              >
                {headerSections.map(renderSection)}
              </div>
            )}
            
            {/* Main Body Section - White background */}
            <div 
              className="template-body"
              style={{ padding: styles.spacing.contentPadding || '32px' }}
            >
              {bodySections.map(renderSection)}
            </div>
            
            {/* Footer Section */}
            {footerSections.length > 0 && (
              <div 
                className="template-footer"
                style={{ 
                  borderTop: `1px solid ${styles.colors.border}`,
                  padding: styles.spacing.contentPadding || '32px'
                }}
              >
                {footerSections.map(renderSection)}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div 
            className="template-default"
            style={{ padding: styles.spacing.contentPadding || '32px' }}
          >
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