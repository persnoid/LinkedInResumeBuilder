import { TemplateConfig } from '../types/template';

export const reactiveTemplates: TemplateConfig[] = [
  {
    id: 'azurill-enhanced',
    name: 'Azurill Enhanced',
    description: 'A clean, modern template with professional sidebar layout and prominent personal information display',
    category: 'modern',
    preview: '/templates/azurill.jpg',
    tags: ['sidebar', 'professional', 'clean', 'enhanced'],
    difficulty: 'beginner',
    industry: ['technology', 'business', 'consulting'],
    features: ['sidebar layout', 'contact section', 'skills visualization', 'prominent personal info'],
    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sections: true,
      effects: true,
    },
    layout: {
      id: 'azurill-enhanced-layout',
      name: 'Azurill Enhanced Layout',
      type: 'sidebar',
      sections: [
        // SIDEBAR SECTIONS (LEFT COLUMN) - columns: 2
        {
          id: 'personalInfoHeader',
          name: 'Personal Information',
          component: 'PersonalInfo',
          visible: true,
          order: 1,
          columns: 2, // SIDEBAR
          styles: { 
            alignment: 'center',
            displayParts: ['photo', 'name', 'title'],
            photoSize: '20', // 80px (20 * 4)
            divider: true,
            padding: '24px 16px',
            spacing: 'relaxed',
            backgroundColor: 'transparent'
          }
        },
        {
          id: 'personalInfoContact',
          name: 'Contact Information',
          component: 'PersonalInfo',
          visible: true,
          order: 2,
          columns: 2, // SIDEBAR
          styles: { 
            alignment: 'left',
            displayParts: ['contact'],
            padding: '16px',
            backgroundColor: 'transparent',
            borderRadius: 'lg',
            iconSize: 'md',
            headerStyle: 'underline',
            divider: true
          }
        },
        {
          id: 'skills',
          name: 'Skills',
          component: 'Skills',
          visible: true,
          order: 3,
          columns: 2, // SIDEBAR
          styles: { 
            alignment: 'left', 
            display: 'list',
            spacing: 'compact',
            headerStyle: 'underline',
            divider: true
          }
        },
        {
          id: 'languages',
          name: 'Languages',
          component: 'Languages',
          visible: true,
          order: 4,
          columns: 2, // SIDEBAR
          styles: { 
            alignment: 'left', 
            display: 'list',
            spacing: 'normal',
            headerStyle: 'underline',
            divider: true
          }
        },
        {
          id: 'certifications',
          name: 'Certifications',
          component: 'Certifications',
          visible: true,
          order: 5,
          columns: 2, // SIDEBAR
          styles: { 
            alignment: 'left',
            spacing: 'compact',
            headerStyle: 'underline'
          }
        },
        
        // MAIN CONTENT SECTIONS (RIGHT COLUMN) - columns: 1
        {
          id: 'summary',
          name: 'About Me',
          component: 'Summary',
          visible: true,
          order: 6,
          columns: 1, // MAIN CONTENT
          styles: { 
            alignment: 'left', 
            divider: true,
            spacing: 'normal',
            headerStyle: 'underline'
          }
        },
        {
          id: 'experience',
          name: 'Work Experience',
          component: 'Experience',
          visible: true,
          order: 7,
          columns: 1, // MAIN CONTENT
          styles: { 
            alignment: 'left', 
            divider: true,
            display: 'timeline',
            spacing: 'relaxed',
            headerStyle: 'underline'
          }
        },
        {
          id: 'education',
          name: 'Education',
          component: 'Education',
          visible: true,
          order: 8,
          columns: 1, // MAIN CONTENT
          styles: { 
            alignment: 'left', 
            divider: true,
            spacing: 'normal',
            headerStyle: 'underline'
          }
        }
      ],
      styles: {
        page: {
          margin: '0',
          padding: '0',
          background: '#ffffff',
          borderRadius: '8px',
          shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        },
        typography: {
          fontFamily: 'Inter, sans-serif',
          fontSize: {
            base: '12px',
            heading1: '24px',
            heading2: '16px',
            heading3: '14px',
            small: '11px',
            contactInfo: '10px',
            micro: '9px'
          },
          lineHeight: {
            tight: '1.2',
            normal: '1.4',
            relaxed: '1.6',
            loose: '1.8'
          },
          fontWeight: {
            light: '300',
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700'
          }
        },
        colors: {
          primary: '#1f2937',
          secondary: '#6b7280',
          accent: '#3b82f6',
          text: '#374151',
          background: '#ffffff',
          muted: '#f3f4f6',
          border: '#e5e7eb',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
          surface: '#f8fafc',
          overlay: 'rgba(0, 0, 0, 0.5)'
        },
        spacing: {
          section: '24px',
          item: '12px',
          compact: '8px',
          contentPadding: '32px',
          sidebarColumnPadding: '32px',
          mainColumnPadding: '32px',
          xs: '4px',
          sm: '8px',
          md: '16px',
          lg: '24px',
          xl: '32px',
          xxl: '48px'
        },
        effects: {
          borderRadius: {
            none: '0',
            sm: '4px',
            md: '8px',
            lg: '12px',
            xl: '16px',
            full: '9999px'
          },
          shadow: {
            none: 'none',
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }
        }
      }
    }
  },
  // 1. Minimalist Modern - Single Column
  {
    id: 'minimalist-modern',
    name: 'Minimalist Modern',
    description: 'Clean single-column layout with elegant typography and minimal design elements',
    category: 'minimal',
    preview: '/templates/minimalist-modern.jpg',
    tags: ['minimal', 'clean', 'single-column', 'modern'],
    difficulty: 'beginner',
    industry: ['design', 'technology', 'consulting', 'creative'],
    features: ['single column layout', 'clean typography', 'minimal design', 'contact footer'],
    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sections: true,
      effects: true,
    },
    layout: {
      id: 'minimalist-modern-layout',
      name: 'Minimalist Modern Layout',
      type: 'single-column',
      sections: [
        {
          id: 'personalInfo',
          name: 'Header',
          component: 'PersonalInfo',
          visible: true,
          order: 1,
          columns: 1,
          styles: { 
            alignment: 'center',
            displayParts: ['name', 'title'],
            spacing: 'relaxed',
            headerStyle: 'minimal',
            divider: true
          }
        },
        {
          id: 'summary',
          name: 'About Me',
          component: 'Summary',
          visible: true,
          order: 2,
          columns: 1,
          styles: { 
            alignment: 'left', 
            spacing: 'relaxed',
            headerStyle: 'minimal',
            divider: true
          }
        },
        {
          id: 'experience',
          name: 'Work Experience',
          component: 'Experience',
          visible: true,
          order: 3,
          columns: 1,
          styles: { 
            alignment: 'left', 
            spacing: 'relaxed',
            headerStyle: 'minimal',
            divider: true
          }
        },
        {
          id: 'education',
          name: 'Education',
          component: 'Education',
          visible: true,
          order: 4,
          columns: 1,
          styles: { 
            alignment: 'left', 
            spacing: 'normal',
            headerStyle: 'minimal',
            divider: true
          }
        },
        {
          id: 'skills',
          name: 'Skills & Tools',
          component: 'Skills',
          visible: true,
          order: 5,
          columns: 1,
          styles: { 
            alignment: 'left', 
            display: 'tags',
            spacing: 'normal',
            headerStyle: 'minimal',
            divider: true
          }
        },
        {
          id: 'contact',
          name: 'Contact Information',
          component: 'PersonalInfo',
          visible: true,
          order: 6,
          columns: 1,
          styles: { 
            alignment: 'center',
            displayParts: ['contact'],
            spacing: 'compact',
            headerStyle: 'minimal'
          }
        }
      ],
      styles: {
        page: {
          margin: '0 auto',
          padding: '48px',
          background: '#ffffff',
          borderRadius: '0',
          shadow: 'none'
        },
        typography: {
          fontFamily: 'Inter, sans-serif',
          fontSize: {
            base: '12px',
            heading1: '32px',
            heading2: '18px',
            heading3: '16px',
            small: '11px',
            contactInfo: '11px',
            micro: '10px'
          },
          lineHeight: {
            tight: '1.2',
            normal: '1.5',
            relaxed: '1.7',
            loose: '2.0'
          },
          fontWeight: {
            light: '300',
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700'
          }
        },
        colors: {
          primary: '#1f2937',
          secondary: '#4b5563',
          accent: '#6366f1',
          text: '#374151',
          background: '#ffffff',
          muted: '#f9fafb',
          border: '#e5e7eb',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#6366f1',
          surface: '#f9fafb',
          overlay: 'rgba(31, 41, 55, 0.8)'
        },
        spacing: {
          section: '40px',
          item: '16px',
          compact: '12px',
          contentPadding: '48px',
          xs: '4px',
          sm: '8px',
          md: '16px',
          lg: '24px',
          xl: '32px',
          xxl: '48px'
        },
        effects: {
          borderRadius: {
            none: '0',
            sm: '2px',
            md: '4px',
            lg: '6px',
            xl: '8px',
            full: '9999px'
          },
          shadow: {
            none: 'none',
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            md: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
            lg: '0 4px 8px 0 rgba(0, 0, 0, 0.1)',
            xl: '0 8px 16px 0 rgba(0, 0, 0, 0.1)'
          }
        }
      }
    }
  },
  // 2. Bold Impact - Two Column
  {
    id: 'bold-impact',
    name: 'Bold Impact',
    description: 'Striking two-column design with bold typography and impactful visual hierarchy',
    category: 'modern',
    preview: '/templates/bold-impact.jpg',
    tags: ['bold', 'impact', 'two-column', 'professional'],
    difficulty: 'intermediate',
    industry: ['business', 'sales', 'marketing', 'consulting'],
    features: ['bold typography', 'two-column layout', 'sidebar skills', 'impact design'],
    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sections: true,
      effects: true,
    },
    layout: {
      id: 'bold-impact-layout',
      name: 'Bold Impact Layout',
      type: 'two-column',
      sections: [
        // MAIN CONTENT (LEFT 2/3) - columns: 1
        {
          id: 'personalInfoMain',
          name: 'Name & Title',
          component: 'PersonalInfo',
          visible: true,
          order: 1,
          columns: 1,
          styles: { 
            alignment: 'left',
            displayParts: ['name', 'title'],
            spacing: 'relaxed',
            headerStyle: 'background',
            backgroundColor: '#1e293b',
            padding: '24px',
            borderRadius: 'lg'
          }
        },
        {
          id: 'summary',
          name: 'Career Summary',
          component: 'Summary',
          visible: true,
          order: 2,
          columns: 1,
          styles: { 
            alignment: 'left', 
            spacing: 'relaxed',
            headerStyle: 'background',
            divider: true
          }
        },
        {
          id: 'experience',
          name: 'Work Experience',
          component: 'Experience',
          visible: true,
          order: 3,
          columns: 1,
          styles: { 
            alignment: 'left', 
            display: 'cards',
            spacing: 'relaxed',
            headerStyle: 'background',
            divider: true
          }
        },
        {
          id: 'education',
          name: 'Education',
          component: 'Education',
          visible: true,
          order: 4,
          columns: 1,
          styles: { 
            alignment: 'left', 
            spacing: 'normal',
            headerStyle: 'background'
          }
        },
        
        // SIDEBAR (RIGHT 1/3) - columns: 2
        {
          id: 'contact',
          name: 'Contact Info',
          component: 'PersonalInfo',
          visible: true,
          order: 5,
          columns: 2,
          styles: { 
            alignment: 'left',
            displayParts: ['contact'],
            spacing: 'compact',
            headerStyle: 'background',
            backgroundColor: '#f1f5f9',
            padding: '20px',
            borderRadius: 'lg',
            divider: true
          }
        },
        {
          id: 'skills',
          name: 'Core Skills',
          component: 'Skills',
          visible: true,
          order: 6,
          columns: 2,
          styles: { 
            alignment: 'left', 
            display: 'list',
            spacing: 'compact',
            headerStyle: 'background',
            divider: true
          }
        },
        {
          id: 'languages',
          name: 'Key Strengths',
          component: 'Languages',
          visible: true,
          order: 7,
          columns: 2,
          styles: { 
            alignment: 'left',
            spacing: 'compact',
            headerStyle: 'background',
            divider: true
          }
        },
        {
          id: 'certifications',
          name: 'Certifications',
          component: 'Certifications',
          visible: true,
          order: 8,
          columns: 2,
          styles: { 
            alignment: 'left',
            spacing: 'compact',
            headerStyle: 'background'
          }
        }
      ],
      styles: {
        page: {
          margin: '0',
          padding: '0',
          background: '#ffffff',
          borderRadius: '8px',
          shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        },
        typography: {
          fontFamily: 'Roboto, sans-serif',
          fontSize: {
            base: '13px',
            heading1: '28px',
            heading2: '18px',
            heading3: '16px',
            small: '11px',
            contactInfo: '11px',
            micro: '10px'
          },
          lineHeight: {
            tight: '1.2',
            normal: '1.4',
            relaxed: '1.6',
            loose: '1.8'
          },
          fontWeight: {
            light: '300',
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700'
          }
        },
        colors: {
          primary: '#1e293b',
          secondary: '#475569',
          accent: '#f59e0b',
          text: '#334155',
          background: '#ffffff',
          muted: '#f1f5f9',
          border: '#cbd5e1',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#0ea5e9',
          surface: '#f8fafc',
          overlay: 'rgba(30, 41, 59, 0.8)'
        },
        spacing: {
          section: '32px',
          item: '16px',
          compact: '12px',
          contentPadding: '32px',
          xs: '4px',
          sm: '8px',
          md: '16px',
          lg: '24px',
          xl: '32px',
          xxl: '48px'
        },
        effects: {
          borderRadius: {
            none: '0',
            sm: '4px',
            md: '8px',
            lg: '12px',
            xl: '16px',
            full: '9999px'
          },
          shadow: {
            none: 'none',
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }
        }
      }
    }
  },
  // 3. Timeline Pro - Single Column with Timeline
  {
    id: 'timeline-pro',
    name: 'Timeline Pro',
    description: 'Professional single-column layout with chronological timeline design for career progression',
    category: 'professional',
    preview: '/templates/timeline-pro.jpg',
    tags: ['timeline', 'chronological', 'professional', 'career'],
    difficulty: 'intermediate',
    industry: ['business', 'consulting', 'management', 'finance'],
    features: ['timeline design', 'chronological layout', 'career progression', 'photo header'],
    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sections: true,
      effects: true,
    },
    layout: {
      id: 'timeline-pro-layout',
      name: 'Timeline Pro Layout',
      type: 'single-column',
      sections: [
        {
          id: 'personalInfo',
          name: 'Header',
          component: 'PersonalInfo',
          visible: true,
          order: 1,
          columns: 1,
          styles: { 
            alignment: 'center',
            displayParts: ['photo', 'name', 'title'],
            photoSize: '24',
            spacing: 'relaxed',
            headerStyle: 'background',
            backgroundColor: '#0f172a',
            padding: '40px',
            borderRadius: 'none',
            divider: true
          }
        },
        {
          id: 'summary',
          name: 'Profile',
          component: 'Summary',
          visible: true,
          order: 2,
          columns: 1,
          styles: { 
            alignment: 'center', 
            spacing: 'relaxed',
            headerStyle: 'underline',
            divider: true
          }
        },
        {
          id: 'experience',
          name: 'Career Timeline',
          component: 'Experience',
          visible: true,
          order: 3,
          columns: 1,
          styles: { 
            alignment: 'left', 
            display: 'timeline',
            spacing: 'relaxed',
            headerStyle: 'underline',
            divider: true
          }
        },
        {
          id: 'education',
          name: 'Education Timeline',
          component: 'Education',
          visible: true,
          order: 4,
          columns: 1,
          styles: { 
            alignment: 'left', 
            display: 'timeline',
            spacing: 'normal',
            headerStyle: 'underline',
            divider: true
          }
        },
        {
          id: 'skills',
          name: 'Skills',
          component: 'Skills',
          visible: true,
          order: 5,
          columns: 1,
          styles: { 
            alignment: 'center', 
            display: 'tags',
            spacing: 'normal',
            headerStyle: 'underline',
            divider: true
          }
        },
        {
          id: 'contact',
          name: 'Contact Information',
          component: 'PersonalInfo',
          visible: true,
          order: 6,
          columns: 1,
          styles: { 
            alignment: 'center',
            displayParts: ['contact'],
            spacing: 'compact',
            headerStyle: 'underline'
          }
        }
      ],
      styles: {
        page: {
          margin: '0 auto',
          padding: '0',
          background: '#ffffff',
          borderRadius: '0',
          shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        },
        typography: {
          fontFamily: 'Open Sans, sans-serif',
          fontSize: {
            base: '12px',
            heading1: '30px',
            heading2: '18px',
            heading3: '16px',
            small: '11px',
            contactInfo: '11px',
            micro: '10px'
          },
          lineHeight: {
            tight: '1.2',
            normal: '1.5',
            relaxed: '1.7',
            loose: '2.0'
          },
          fontWeight: {
            light: '300',
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700'
          }
        },
        colors: {
          primary: '#0f172a',
          secondary: '#475569',
          accent: '#06b6d4',
          text: '#1e293b',
          background: '#ffffff',
          muted: '#f1f5f9',
          border: '#e2e8f0',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#06b6d4',
          surface: '#f8fafc',
          overlay: 'rgba(15, 23, 42, 0.8)'
        },
        spacing: {
          section: '36px',
          item: '18px',
          compact: '12px',
          contentPadding: '40px',
          xs: '4px',
          sm: '8px',
          md: '16px',
          lg: '24px',
          xl: '32px',
          xxl: '48px'
        },
        effects: {
          borderRadius: {
            none: '0',
            sm: '4px',
            md: '8px',
            lg: '12px',
            xl: '16px',
            full: '9999px'
          },
          shadow: {
            none: 'none',
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }
        }
      }
    }
  },
  // 4. Dynamic Creative - Two Column Creative
  {
    id: 'dynamic-creative',
    name: 'Dynamic Creative',
    description: 'Creative two-column layout with dynamic visual elements and portfolio showcase',
    category: 'creative',
    preview: '/templates/dynamic-creative.jpg',
    tags: ['creative', 'dynamic', 'portfolio', 'visual'],
    difficulty: 'advanced',
    industry: ['design', 'creative', 'marketing', 'media'],
    features: ['creative layout', 'portfolio section', 'visual hierarchy', 'dynamic elements'],
    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sections: true,
      effects: true,
    },
    layout: {
      id: 'dynamic-creative-layout',
      name: 'Dynamic Creative Layout',
      type: 'two-column',
      sections: [
        // MAIN CONTENT (RIGHT 3/4) - columns: 1
        {
          id: 'personalInfoMain',
          name: 'Name & Creative Title',
          component: 'PersonalInfo',
          visible: true,
          order: 1,
          columns: 1,
          styles: { 
            alignment: 'left',
            displayParts: ['name', 'title'],
            spacing: 'relaxed',
            headerStyle: 'background',
            backgroundColor: '#7c3aed',
            padding: '32px',
            borderRadius: 'xl'
          }
        },
        {
          id: 'summary',
          name: 'Professional Bio',
          component: 'Summary',
          visible: true,
          order: 2,
          columns: 1,
          styles: { 
            alignment: 'left', 
            spacing: 'relaxed',
            headerStyle: 'background',
            divider: true
          }
        },
        {
          id: 'experience',
          name: 'Work Experience',
          component: 'Experience',
          visible: true,
          order: 3,
          columns: 1,
          styles: { 
            alignment: 'left', 
            display: 'cards',
            spacing: 'relaxed',
            headerStyle: 'background',
            divider: true
          }
        },
        {
          id: 'certifications',
          name: 'Projects/Portfolio',
          component: 'Certifications',
          visible: true,
          order: 4,
          columns: 1,
          styles: { 
            alignment: 'left',
            spacing: 'normal',
            headerStyle: 'background'
          }
        },
        
        // SIDEBAR (LEFT 1/4) - columns: 2
        {
          id: 'personalInfoSidebar',
          name: 'Photo',
          component: 'PersonalInfo',
          visible: true,
          order: 5,
          columns: 2,
          styles: { 
            alignment: 'center',
            displayParts: ['photo'],
            photoSize: '28',
            spacing: 'relaxed',
            backgroundColor: '#faf5ff',
            padding: '24px',
            borderRadius: 'xl',
            divider: true
          }
        },
        {
          id: 'contact',
          name: 'Contact',
          component: 'PersonalInfo',
          visible: true,
          order: 6,
          columns: 2,
          styles: { 
            alignment: 'left',
            displayParts: ['contact'],
            spacing: 'compact',
            headerStyle: 'background',
            divider: true
          }
        },
        {
          id: 'skills',
          name: 'Key Skills',
          component: 'Skills',
          visible: true,
          order: 7,
          columns: 2,
          styles: { 
            alignment: 'left', 
            display: 'tags',
            spacing: 'compact',
            headerStyle: 'background',
            divider: true
          }
        },
        {
          id: 'languages',
          name: 'Languages',
          component: 'Languages',
          visible: true,
          order: 8,
          columns: 2,
          styles: { 
            alignment: 'left',
            spacing: 'compact',
            headerStyle: 'background'
          }
        }
      ],
      styles: {
        page: {
          margin: '0',
          padding: '0',
          background: '#ffffff',
          borderRadius: '12px',
          shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        },
        typography: {
          fontFamily: 'Montserrat, sans-serif',
          fontSize: {
            base: '12px',
            heading1: '26px',
            heading2: '17px',
            heading3: '15px',
            small: '11px',
            contactInfo: '10px',
            micro: '9px'
          },
          lineHeight: {
            tight: '1.2',
            normal: '1.4',
            relaxed: '1.6',
            loose: '1.8'
          },
          fontWeight: {
            light: '300',
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700'
          }
        },
        colors: {
          primary: '#7c3aed',
          secondary: '#a855f7',
          accent: '#f59e0b',
          text: '#1f2937',
          background: '#ffffff',
          muted: '#faf5ff',
          border: '#e5e7eb',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#7c3aed',
          surface: '#f9fafb',
          overlay: 'rgba(124, 58, 237, 0.8)'
        },
        spacing: {
          section: '28px',
          item: '14px',
          compact: '10px',
          contentPadding: '32px',
          xs: '4px',
          sm: '8px',
          md: '16px',
          lg: '24px',
          xl: '32px',
          xxl: '48px'
        },
        effects: {
          borderRadius: {
            none: '0',
            sm: '6px',
            md: '10px',
            lg: '14px',
            xl: '18px',
            full: '9999px'
          },
          shadow: {
            none: 'none',
            sm: '0 2px 4px 0 rgba(0, 0, 0, 0.05)',
            md: '0 6px 10px -1px rgba(0, 0, 0, 0.1)',
            lg: '0 12px 18px -3px rgba(0, 0, 0, 0.1)',
            xl: '0 24px 30px -5px rgba(0, 0, 0, 0.1)'
          }
        }
      }
    }
  },
  // 5. Tech Clean - Single Column Tech Focus
  {
    id: 'tech-clean',
    name: 'Tech Clean',
    description: 'Clean single-column layout optimized for technology professionals with technical skills showcase',
    category: 'tech',
    preview: '/templates/tech-clean.jpg',
    tags: ['tech', 'clean', 'technical', 'skills'],
    difficulty: 'intermediate',
    industry: ['technology', 'software', 'engineering', 'IT'],
    features: ['technical skills', 'clean layout', 'github integration', 'categorized skills'],
    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sections: true,
      effects: true,
    },
    layout: {
      id: 'tech-clean-layout',
      name: 'Tech Clean Layout',
      type: 'single-column',
      sections: [
        {
          id: 'personalInfo',
          name: 'Header',
          component: 'PersonalInfo',
          visible: true,
          order: 1,
          columns: 1,
          styles: { 
            alignment: 'center',
            displayParts: ['photo', 'name', 'title', 'contact'],
            photoSize: '20',
            spacing: 'relaxed',
            headerStyle: 'background',
            backgroundColor: '#0f172a',
            padding: '32px',
            borderRadius: 'lg',
            divider: true
          }
        },
        {
          id: 'skills',
          name: 'Technical Skills',
          component: 'Skills',
          visible: true,
          order: 2,
          columns: 1,
          styles: { 
            alignment: 'left', 
            display: 'grid',
            columns: 3,
            spacing: 'normal',
            headerStyle: 'underline',
            divider: true
          }
        },
        {
          id: 'experience',
          name: 'Work Experience',
          component: 'Experience',
          visible: true,
          order: 3,
          columns: 1,
          styles: { 
            alignment: 'left', 
            spacing: 'relaxed',
            headerStyle: 'underline',
            divider: true
          }
        },
        {
          id: 'education',
          name: 'Education',
          component: 'Education',
          visible: true,
          order: 4,
          columns: 1,
          styles: { 
            alignment: 'left', 
            spacing: 'normal',
            headerStyle: 'underline',
            divider: true
          }
        },
        {
          id: 'certifications',
          name: 'Certifications',
          component: 'Certifications',
          visible: true,
          order: 5,
          columns: 1,
          styles: { 
            alignment: 'left',
            spacing: 'normal',
            headerStyle: 'underline'
          }
        }
      ],
      styles: {
        page: {
          margin: '0 auto',
          padding: '40px',
          background: '#ffffff',
          borderRadius: '8px',
          shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        },
        typography: {
          fontFamily: 'Source Code Pro, monospace',
          fontSize: {
            base: '12px',
            heading1: '26px',
            heading2: '17px',
            heading3: '15px',
            small: '11px',
            contactInfo: '10px',
            micro: '9px'
          },
          lineHeight: {
            tight: '1.2',
            normal: '1.4',
            relaxed: '1.6',
            loose: '1.8'
          },
          fontWeight: {
            light: '300',
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700'
          }
        },
        colors: {
          primary: '#0f172a',
          secondary: '#475569',
          accent: '#06b6d4',
          text: '#1e293b',
          background: '#ffffff',
          muted: '#f1f5f9',
          border: '#e2e8f0',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#06b6d4',
          surface: '#f8fafc',
          overlay: 'rgba(15, 23, 42, 0.8)'
        },
        spacing: {
          section: '32px',
          item: '16px',
          compact: '12px',
          contentPadding: '40px',
          xs: '4px',
          sm: '8px',
          md: '16px',
          lg: '24px',
          xl: '32px',
          xxl: '48px'
        },
        effects: {
          borderRadius: {
            none: '0',
            sm: '4px',
            md: '8px',
            lg: '12px',
            xl: '16px',
            full: '9999px'
          },
          shadow: {
            none: 'none',
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }
        }
      }
    }
  },
  // 6. Executive Elegance - Single Column Executive
  {
    id: 'executive-elegance',
    name: 'Executive Elegance',
    description: 'Sophisticated single-column layout designed for C-level executives and senior leadership',
    category: 'executive',
    preview: '/templates/executive-elegance.jpg',
    tags: ['executive', 'elegant', 'leadership', 'sophisticated'],
    difficulty: 'advanced',
    industry: ['executive', 'finance', 'consulting', 'healthcare'],
    features: ['executive summary', 'leadership focus', 'elegant typography', 'competencies'],
    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sections: true,
      effects: true,
    },
    layout: {
      id: 'executive-elegance-layout',
      name: 'Executive Elegance Layout',
      type: 'single-column',
      sections: [
        {
          id: 'personalInfo',
          name: 'Executive Header',
          component: 'PersonalInfo',
          visible: true,
          order: 1,
          columns: 1,
          styles: { 
            alignment: 'center',
            displayParts: ['name', 'title', 'contact'],
            spacing: 'relaxed',
            headerStyle: 'background',
            backgroundColor: '#1e293b',
            padding: '40px',
            borderRadius: 'none',
            divider: true
          }
        },
        {
          id: 'summary',
          name: 'Executive Summary',
          component: 'Summary',
          visible: true,
          order: 2,
          columns: 1,
          styles: { 
            alignment: 'left', 
            spacing: 'relaxed',
            headerStyle: 'background',
            backgroundColor: '#f1f5f9',
            padding: '32px',
            borderRadius: 'lg',
            divider: true
          }
        },
        {
          id: 'experience',
          name: 'Leadership Experience',
          component: 'Experience',
          visible: true,
          order: 3,
          columns: 1,
          styles: { 
            alignment: 'left', 
            display: 'cards',
            spacing: 'relaxed',
            headerStyle: 'background',
            divider: true
          }
        },
        {
          id: 'education',
          name: 'Education',
          component: 'Education',
          visible: true,
          order: 4,
          columns: 1,
          styles: { 
            alignment: 'left', 
            spacing: 'normal',
            headerStyle: 'background',
            divider: true
          }
        },
        {
          id: 'skills',
          name: 'Key Competencies / Expertise',
          component: 'Skills',
          visible: true,
          order: 5,
          columns: 1,
          styles: { 
            alignment: 'center', 
            display: 'tags',
            spacing: 'normal',
            headerStyle: 'background'
          }
        }
      ],
      styles: {
        page: {
          margin: '0 auto',
          padding: '0',
          background: '#ffffff',
          borderRadius: '0',
          shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        },
        typography: {
          fontFamily: 'Playfair Display, serif',
          fontSize: {
            base: '13px',
            heading1: '32px',
            heading2: '20px',
            heading3: '16px',
            small: '11px',
            contactInfo: '12px',
            micro: '10px'
          },
          lineHeight: {
            tight: '1.2',
            normal: '1.5',
            relaxed: '1.7',
            loose: '2.0'
          },
          fontWeight: {
            light: '300',
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700'
          }
        },
        colors: {
          primary: '#1e293b',
          secondary: '#475569',
          accent: '#0ea5e9',
          text: '#334155',
          background: '#ffffff',
          muted: '#f1f5f9',
          border: '#cbd5e1',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#0ea5e9',
          surface: '#f8fafc',
          overlay: 'rgba(30, 41, 59, 0.8)'
        },
        spacing: {
          section: '40px',
          item: '20px',
          compact: '16px',
          contentPadding: '48px',
          xs: '4px',
          sm: '8px',
          md: '16px',
          lg: '24px',
          xl: '32px',
          xxl: '48px'
        },
        effects: {
          borderRadius: {
            none: '0',
            sm: '4px',
            md: '8px',
            lg: '12px',
            xl: '16px',
            full: '9999px'
          },
          shadow: {
            none: 'none',
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }
        }
      }
    }
  },
  // Keep existing templates
  {
    id: 'executive-modern',
    name: 'Executive Modern',
    description: 'Sophisticated template designed for C-level executives and senior professionals',
    category: 'executive',
    preview: '/templates/executive-modern.jpg',
    tags: ['executive', 'sophisticated', 'leadership'],
    difficulty: 'advanced',
    industry: ['executive', 'finance', 'consulting', 'healthcare'],
    features: ['executive summary', 'achievement highlights', 'board positions'],
    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sections: true,
      effects: true,
    },
    layout: {
      id: 'executive-modern-layout',
      name: 'Executive Modern Layout',
      type: 'header-footer',
      sections: [
        {
          id: 'personalInfo',
          name: 'Contact Information',
          component: 'PersonalInfo',
          visible: true,
          order: 1,
          columns: 0, // HEADER
          styles: { 
            alignment: 'center',
            backgroundColor: '#1e293b',
            padding: '2px',
            borderRadius: 'none'
          }
        },
        {
          id: 'summary',
          name: 'About me',
          component: 'Summary',
          visible: true,
          order: 2,
          columns: 1, // MAIN CONTENT
          styles: { 
            alignment: 'left', 
            divider: true,
            spacing: 'relaxed',
            headerStyle: 'background',
            backgroundColor: '#f1f5f9',
            padding: '24px',
            borderRadius: 'lg'
          }
        },
        {
          id: 'experience',
          name: 'Work Experience',
          component: 'Experience',
          visible: true,
          order: 3,
          columns: 1,
          styles: { 
            alignment: 'left', 
            divider: true,
            display: 'cards',
            spacing: 'relaxed',
            headerStyle: 'background'
          }
        },
        {
          id: 'education',
          name: 'Education',
          component: 'Education',
          visible: true,
          order: 4,
          columns: 1,
          styles: { 
            alignment: 'left', 
            divider: true,
            display: 'cards',
            spacing: 'normal',
            headerStyle: 'background'
          }
        },
        {
          id: 'skills',
          name: 'Skills',
          component: 'Skills',
          visible: true,
          order: 5,
          columns: 1,
          styles: { 
            alignment: 'center', 
            display: 'tags',
            spacing: 'normal',
            headerStyle: 'background',
            divider: true
          }
        },
        {
          id: 'languages',
          name: 'Languages',
          component: 'Languages',
          visible: true,
          order: 6,
          columns: 1,
          styles: { 
            alignment: 'left',
            spacing: 'normal',
            headerStyle: 'background',
            divider: true
          }
        },
        {
          id: 'certifications',
          name: 'Certifications',
          component: 'Certifications',
          visible: true,
          order: 7,
          columns: 1,
          styles: { 
            alignment: 'left',
            spacing: 'normal',
            headerStyle: 'background'
          }
        }
      ],
      styles: {
        page: {
          margin: '0',
          padding: '0',
          background: '#ffffff',
          borderRadius: '0',
          shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        },
        typography: {
          fontFamily: 'Playfair Display, serif',
          fontSize: {
            base: '13px',
            heading1: '32px',
            heading2: '20px',
            heading3: '16px',
            small: '11px',
            contactInfo: '12px',
            micro: '10px'
          },
          lineHeight: {
            tight: '1.2',
            normal: '1.5',
            relaxed: '1.7',
            loose: '2.0'
          },
          fontWeight: {
            light: '300',
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700'
          }
        },
        colors: {
          primary: '#1e293b',
          secondary: '#475569',
          accent: '#0ea5e9',
          text: '#334155',
          background: '#ffffff',
          muted: '#f1f5f9',
          border: '#cbd5e1',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#0ea5e9',
          surface: '#f8fafc',
          overlay: 'rgba(30, 41, 59, 0.8)'
        },
        spacing: {
          section: '32px',
          item: '16px',
          compact: '12px',
          contentPadding: '40px',
          xs: '4px',
          sm: '8px',
          md: '16px',
          lg: '24px',
          xl: '32px',
          xxl: '48px'
        },
        effects: {
          borderRadius: {
            none: '0',
            sm: '4px',
            md: '8px',
            lg: '12px',
            xl: '16px',
            full: '9999px'
          },
          shadow: {
            none: 'none',
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }
        }
      }
    }
  },
  {
    id: 'tech-innovator',
    name: 'Tech Innovator',
    description: 'Modern template optimized for technology professionals and software engineers',
    category: 'tech',
    preview: '/templates/tech-innovator.jpg',
    tags: ['technology', 'software', 'innovation'],
    difficulty: 'intermediate',
    industry: ['technology', 'software', 'startups', 'engineering'],
    features: ['project showcase', 'technical skills', 'github integration'],
    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sections: true,
      effects: true,
    },
    layout: {
      id: 'tech-innovator-layout',
      name: 'Tech Innovator Layout',
      type: 'two-column',
      sections: [
        // LEFT COLUMN - columns: 1
        {
          id: 'personalInfo',
          name: 'Contact Information',
          component: 'PersonalInfo',
          visible: true,
          order: 1,
          columns: 1,
          styles: { 
            alignment: 'left',
            backgroundColor: '#0f172a',
            padding: '24px',
            borderRadius: 'lg'
          }
        },
        {
          id: 'summary',
          name: 'About me',
          component: 'Summary',
          visible: true,
          order: 2,
          columns: 1,
          styles: { 
            alignment: 'left', 
            divider: true,
            spacing: 'normal',
            headerStyle: 'underline'
          }
        },
        {
          id: 'experience',
          name: 'Work Experience',
          component: 'Experience',
          visible: true,
          order: 3,
          columns: 1,
          styles: { 
            alignment: 'left',
            display: 'timeline',
            spacing: 'relaxed',
            headerStyle: 'underline'
          }
        },
        
        // RIGHT COLUMN - columns: 2
        {
          id: 'skills',
          name: 'Skills',
          component: 'Skills',
          visible: true,
          order: 4,
          columns: 2,
          styles: { 
            alignment: 'left', 
            display: 'grid',
            spacing: 'compact',
            headerStyle: 'underline',
            columns: 2,
            divider: true
          }
        },
        {
          id: 'education',
          name: 'Education',
          component: 'Education',
          visible: true,
          order: 5,
          columns: 2,
          styles: { 
            alignment: 'left',
            spacing: 'normal',
            headerStyle: 'underline',
            divider: true
          }
        },
        {
          id: 'certifications',
          name: 'Certifications',
          component: 'Certifications',
          visible: true,
          order: 6,
          columns: 2,
          styles: { 
            alignment: 'left',
            spacing: 'compact',
            headerStyle: 'underline',
            divider: true
          }
        },
        {
          id: 'languages',
          name: 'Languages',
          component: 'Languages',
          visible: true,
          order: 7,
          columns: 2,
          styles: { 
            alignment: 'left',
            spacing: 'normal',
            headerStyle: 'underline'
          }
        }
      ],
      styles: {
        page: {
          margin: '0',
          padding: '0',
          background: '#ffffff',
          borderRadius: '8px',
          shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        },
        typography: {
          fontFamily: 'Source Code Pro, monospace',
          fontSize: {
            base: '12px',
            heading1: '26px',
            heading2: '17px',
            heading3: '15px',
            small: '11px',
            contactInfo: '10px',
            micro: '9px'
          },
          lineHeight: {
            tight: '1.2',
            normal: '1.4',
            relaxed: '1.6',
            loose: '1.8'
          },
          fontWeight: {
            light: '300',
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700'
          }
        },
        colors: {
          primary: '#0f172a',
          secondary: '#475569',
          accent: '#06b6d4',
          text: '#1e293b',
          background: '#ffffff',
          muted: '#f1f5f9',
          border: '#e2e8f0',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#06b6d4',
          surface: '#f8fafc',
          overlay: 'rgba(15, 23, 42, 0.8)'
        },
        spacing: {
          section: '26px',
          item: '13px',
          compact: '9px',
          contentPadding: '32px',
          xs: '4px',
          sm: '8px',
          md: '16px',
          lg: '24px',
          xl: '32px',
          xxl: '48px'
        },
        effects: {
          borderRadius: {
            none: '0',
            sm: '4px',
            md: '8px',
            lg: '12px',
            xl: '16px',
            full: '9999px'
          },
          shadow: {
            none: 'none',
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }
        }
      }
    }
  },
  {
    id: 'academic-scholar',
    name: 'Academic Scholar',
    description: 'Comprehensive template for academic professionals, researchers, and educators',
    category: 'academic',
    preview: '/templates/academic-scholar.jpg',
    tags: ['academic', 'research', 'education'],
    difficulty: 'advanced',
    industry: ['education', 'research', 'academia', 'science'],
    features: ['publications list', 'research experience', 'teaching history'],
    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sections: true,
      effects: true,
    },
    layout: {
      id: 'academic-scholar-layout',
      name: 'Academic Scholar Layout',
      type: 'single-column',
      sections: [
        {
          id: 'personalInfo',
          name: 'Contact Information',
          component: 'PersonalInfo',
          visible: true,
          order: 1,
          columns: 1,
          styles: { 
            alignment: 'center',
            spacing: 'relaxed',
            headerStyle: 'minimal'
          }
        },
        {
          id: 'summary',
          name: 'About me',
          component: 'Summary',
          visible: true,
          order: 2,
          columns: 1,
          styles: { 
            alignment: 'left', 
            divider: true,
            spacing: 'relaxed',
            headerStyle: 'underline'
          }
        },
        {
          id: 'education',
          name: 'Education',
          component: 'Education',
          visible: true,
          order: 3,
          columns: 1,
          styles: { 
            alignment: 'left', 
            divider: true,
            spacing: 'normal',
            headerStyle: 'underline'
          }
        },
        {
          id: 'experience',
          name: 'Work Experience',
          component: 'Experience',
          visible: true,
          order: 4,
          columns: 1,
          styles: { 
            alignment: 'left', 
            divider: true,
            spacing: 'relaxed',
            headerStyle: 'underline'
          }
        },
        {
          id: 'skills',
          name: 'Skills',
          component: 'Skills',
          visible: true,
          order: 5,
          columns: 1,
          styles: { 
            alignment: 'left', 
            display: 'list',
            spacing: 'normal',
            headerStyle: 'underline',
            divider: true
          }
        },
        {
          id: 'languages',
          name: 'Languages',
          component: 'Languages',
          visible: true,
          order: 6,
          columns: 1,
          styles: { 
            alignment: 'left',
            spacing: 'normal',
            headerStyle: 'underline',
            divider: true
          }
        },
        {
          id: 'certifications',
          name: 'Certifications',
          component: 'Certifications',
          visible: true,
          order: 7,
          columns: 1,
          styles: { 
            alignment: 'left',
            spacing: 'normal',
            headerStyle: 'underline'
          }
        }
      ],
      styles: {
        page: {
          margin: '0 auto',
          padding: '40px',
          background: '#ffffff',
          borderRadius: '0',
          shadow: 'none'
        },
        typography: {
          fontFamily: 'Times New Roman, serif',
          fontSize: {
            base: '12px',
            heading1: '28px',
            heading2: '18px',
            heading3: '16px',
            small: '11px',
            contactInfo: '11px',
            micro: '10px'
          },
          lineHeight: {
            tight: '1.2',
            normal: '1.5',
            relaxed: '1.7',
            loose: '2.0'
          },
          fontWeight: {
            light: '300',
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700'
          }
        },
        colors: {
          primary: '#1f2937',
          secondary: '#4b5563',
          accent: '#7c3aed',
          text: '#374151',
          background: '#ffffff',
          muted: '#f9fafb',
          border: '#d1d5db',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#7c3aed',
          surface: '#f9fafb',
          overlay: 'rgba(31, 41, 55, 0.8)'
        },
        spacing: {
          section: '32px',
          item: '16px',
          compact: '12px',
          contentPadding: '40px',
          xs: '4px',
          sm: '8px',
          md: '16px',
          lg: '24px',
          xl: '32px',
          xxl: '48px'
        },
        effects: {
          borderRadius: {
            none: '0',
            sm: '2px',
            md: '4px',
            lg: '6px',
            xl: '8px',
            full: '9999px'
          },
          shadow: {
            none: 'none',
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            md: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
            lg: '0 4px 8px 0 rgba(0, 0, 0, 0.1)',
            xl: '0 8px 16px 0 rgba(0, 0, 0, 0.1)'
          }
        }
      }
    }
  },
  {
    id: 'bronzor',
    name: 'Bronzor',
    description: 'Professional template with header layout and clean typography',
    category: 'professional',
    preview: '/templates/bronzor.jpg',
    tags: ['professional', 'header', 'clean'],
    difficulty: 'beginner',
    industry: ['business', 'finance', 'consulting'],
    features: ['header layout', 'professional styling', 'clean typography'],
    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sections: true,
      effects: true,
    },
    layout: {
      id: 'bronzor-layout',
      name: 'Bronzor Layout',
      type: 'header-footer',
      sections: [
        {
          id: 'personalInfo',
          name: 'Contact Information',
          component: 'PersonalInfo',
          visible: true,
          order: 1,
          columns: 0, // HEADER SECTION ONLY
          styles: { alignment: 'left' }
        },
        {
          id: 'summary',
          name: 'About me',
          component: 'Summary',
          visible: true,
          order: 2,
          columns: 1, // MAIN CONTENT ONLY
          styles: { 
            alignment: 'left', 
            divider: true,
            headerStyle: 'underline'
          }
        },
        {
          id: 'experience',
          name: 'Work Experience',
          component: 'Experience',
          visible: true,
          order: 3,
          columns: 1, // MAIN CONTENT ONLY
          styles: { 
            alignment: 'left', 
            divider: true,
            headerStyle: 'underline'
          }
        },
        {
          id: 'education',
          name: 'Education',
          component: 'Education',
          visible: true,
          order: 4,
          columns: 1, // MAIN CONTENT ONLY
          styles: { 
            alignment: 'left', 
            divider: true,
            headerStyle: 'underline'
          }
        },
        {
          id: 'skills',
          name: 'Skills',
          component: 'Skills',
          visible: true,
          order: 5,
          columns: 1, // MAIN CONTENT ONLY
          styles: { 
            alignment: 'left', 
            display: 'tags',
            headerStyle: 'underline',
            divider: true
          }
        },
        {
          id: 'languages',
          name: 'Languages',
          component: 'Languages',
          visible: true,
          order: 6,
          columns: 1, // MAIN CONTENT ONLY
          styles: { 
            alignment: 'left',
            headerStyle: 'underline',
            divider: true
          }
        },
        {
          id: 'certifications',
          name: 'Certifications',
          component: 'Certifications',
          visible: true,
          order: 7,
          columns: 1, // MAIN CONTENT ONLY
          styles: { 
            alignment: 'left',
            headerStyle: 'underline'
          }
        }
      ],
      styles: {
        page: {
          margin: '0',
          padding: '32px',
          background: '#ffffff'
        },
        typography: {
          fontFamily: 'Inter, sans-serif',
          fontSize: {
            base: '12px',
            heading1: '28px',
            heading2: '18px',
            heading3: '16px',
            small: '11px',
            contactInfo: '10px',
            micro: '9px'
          },
          lineHeight: {
            tight: '1.2',
            normal: '1.4',
            relaxed: '1.6',
            loose: '1.8'
          },
          fontWeight: {
            light: '300',
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700'
          }
        },
        colors: {
          primary: '#1e293b',
          secondary: '#475569',
          accent: '#0ea5e9',
          text: '#334155',
          background: '#ffffff',
          muted: '#f1f5f9',
          border: '#cbd5e1',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#0ea5e9',
          surface: '#f8fafc',
          overlay: 'rgba(30, 41, 59, 0.5)'
        },
        spacing: {
          section: '28px',
          item: '14px',
          compact: '10px',
          contentPadding: '32px',
          xs: '4px',
          sm: '8px',
          md: '16px',
          lg: '24px',
          xl: '32px',
          xxl: '48px'
        },
        effects: {
          borderRadius: {
            none: '0',
            sm: '4px',
            md: '8px',
            lg: '12px',
            xl: '16px',
            full: '9999px'
          },
          shadow: {
            none: 'none',
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }
        }
      }
    }
  },
  {
    id: 'chikorita',
    name: 'Clean Professional',
    description: 'Clean professional template with sidebar layout, perfect for showcasing contact information and skills',
    category: 'professional',
    preview: '/templates/chikorita.jpg',
    tags: ['professional', 'clean', 'sidebar'],
    difficulty: 'beginner',
    industry: ['business', 'consulting', 'finance', 'healthcare'],
    features: ['sidebar contact section', 'clean typography', 'professional layout'],
    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sections: true,
      effects: true,
    },
    layout: {
      id: 'chikorita-layout',
      name: 'Clean Professional Layout',
      type: 'sidebar',
      sections: [
        // MAIN CONTENT - columns: 1
        {
          id: 'personalInfoMain',
          name: 'Header Information',
          component: 'PersonalInfo',
          visible: true,
          order: 1,
          columns: 1, // MAIN CONTENT
          styles: { 
            alignment: 'left',
            displayParts: ['name', 'title']
          }
        },
        {
          id: 'summary',
          name: 'About me',
          component: 'Summary',
          visible: true,
          order: 2,
          columns: 1, // MAIN CONTENT ONLY
          styles: { 
            alignment: 'left', 
            divider: true,
            headerStyle: 'underline'
          }
        },
        {
          id: 'experience',
          name: 'Work Experience',
          component: 'Experience',
          visible: true,
          order: 3,
          columns: 1, // MAIN CONTENT ONLY
          styles: { 
            alignment: 'left', 
            divider: true,
            headerStyle: 'underline'
          }
        },
        {
          id: 'education',
          name: 'Education',
          component: 'Education',
          visible: true,
          order: 4,
          columns: 1, // MAIN CONTENT ONLY
          styles: { 
            alignment: 'left', 
            divider: true,
            headerStyle: 'underline'
          }
        },
        
        // SIDEBAR - columns: 2
        {
          id: 'personalInfoSidebar',
          name: 'Contact Information',
          component: 'PersonalInfo',
          visible: true,
          order: 5,
          columns: 2, // SIDEBAR ONLY
          styles: { 
            alignment: 'left',
            displayParts: ['photo', 'contact'],
            photoSize: '24'
          }
        },
        {
          id: 'languages',
          name: 'Language(s)',
          component: 'Languages',
          visible: true,
          order: 6,
          columns: 2, // SIDEBAR ONLY
          styles: { 
            alignment: 'left',
            headerStyle: 'underline',
            divider: true
          }
        },
        {
          id: 'skills',
          name: 'Skills',
          component: 'Skills',
          visible: true,
          order: 7,
          columns: 2, // SIDEBAR ONLY
          styles: { 
            alignment: 'left', 
            display: 'list',
            headerStyle: 'underline'
          }
        }
      ],
      styles: {
        page: {
          margin: '0',
          padding: '0',
          background: '#ffffff'
        },
        typography: {
          fontFamily: 'Inter, sans-serif',
          fontSize: {
            base: '11px',
            heading1: '22px',
            heading2: '16px',
            heading3: '14px',
            small: '10px',
            contactInfo: '10px',
            micro: '9px'
          },
          lineHeight: {
            tight: '1.2',
            normal: '1.4',
            relaxed: '1.6',
            loose: '1.8'
          },
          fontWeight: {
            light: '300',
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700'
          }
        },
        colors: {
          primary: '#2D3748',
          secondary: '#4A5568',
          accent: '#319795',
          text: '#2D3748',
          background: '#ffffff',
          muted: '#E6FFFA',
          border: '#E2E8F0',
          success: '#38A169',
          warning: '#D69E2E',
          error: '#E53E3E',
          info: '#3182CE',
          surface: '#F7FAFC',
          overlay: 'rgba(45, 55, 72, 0.5)'
        },
        spacing: {
          section: '24px',
          item: '12px',
          compact: '8px',
          contentPadding: '32px',
          sidebarColumnPadding: '32px',
          mainColumnPadding: '32px',
          xs: '4px',
          sm: '8px',
          md: '16px',
          lg: '24px',
          xl: '32px',
          xxl: '48px'
        },
        effects: {
          borderRadius: {
            none: '0',
            sm: '4px',
            md: '8px',
            lg: '12px',
            xl: '16px',
            full: '9999px'
          },
          shadow: {
            none: 'none',
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }
        }
      }
    }
  }
];