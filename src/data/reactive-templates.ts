import { TemplateConfig } from '../types/template';

export const reactiveTemplates: TemplateConfig[] = [
  {
    id: 'azurill',
    name: 'Azurill Professional',
    description: 'Clean sidebar layout with contact information and skills highlighted in the left column',
    category: 'modern',
    layout: {
      id: 'azurill-layout',
      name: 'Sidebar Layout',
      type: 'sidebar',
      sections: [
        {
          id: 'personalInfo',
          name: 'Personal Information',
          component: 'PersonalInfo',
          visible: true,
          order: 1,
          columns: 2, // Sidebar
          styles: {
            alignment: 'left',
            photoSize: '24', // 96px
            displayParts: ['photo', 'name', 'title', 'contact'],
            hideContactHeader: false,
            contactLayout: 'column'
          }
        },
        {
          id: 'skills',
          name: 'Skills',
          component: 'Skills',
          visible: true,
          order: 2,
          columns: 2, // Sidebar
          styles: {
            display: 'list',
            headerStyle: 'underline'
          }
        },
        {
          id: 'languages',
          name: 'Languages',
          component: 'Languages',
          visible: true,
          order: 3,
          columns: 2, // Sidebar
          styles: {
            headerStyle: 'underline'
          }
        },
        {
          id: 'certifications',
          name: 'Certifications',
          component: 'Certifications',
          visible: true,
          order: 4,
          columns: 2, // Sidebar
          styles: {
            headerStyle: 'underline'
          }
        },
        {
          id: 'summary',
          name: 'Professional Summary',
          component: 'Summary',
          visible: true,
          order: 5,
          columns: 1, // Main content
          styles: {
            headerStyle: 'underline'
          }
        },
        {
          id: 'experience',
          name: 'Work Experience',
          component: 'Experience',
          visible: true,
          order: 6,
          columns: 1, // Main content
          styles: {
            display: 'default',
            headerStyle: 'underline'
          }
        },
        {
          id: 'education',
          name: 'Education',
          component: 'Education',
          visible: true,
          order: 7,
          columns: 1, // Main content
          styles: {
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
            heading1: '24px',
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
          surface: '#f9fafb',
          overlay: 'rgba(0, 0, 0, 0.5)'
        },
        spacing: {
          section: '20px',
          item: '8px',
          compact: '4px',
          contentPadding: '32px',
          sidebarColumnPadding: '24px',
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
            sm: '2px',
            md: '4px',
            lg: '8px',
            xl: '12px',
            full: '50%'
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
    },
    preview: '/templates/azurill.jpg',
    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sections: true,
      effects: true
    },
    tags: ['professional', 'sidebar', 'clean'],
    difficulty: 'beginner',
    industry: ['technology', 'business', 'general'],
    features: ['sidebar-layout', 'skills-highlight', 'clean-typography']
  },
  {
    id: 'ivy-league-classic',
    name: 'Ivy League Classic',
    description: 'Traditional academic CV format with clean typography and minimal design',
    category: 'classic',
    layout: {
      id: 'ivy-league-layout',
      name: 'Single Column Layout',
      type: 'single-column',
      sections: [
        {
          id: 'personalInfo',
          name: 'Personal Information',
          component: 'PersonalInfo',
          visible: true,
          order: 1,
          columns: 1, // Main content
          styles: {
            alignment: 'center',
            photoSize: '20', // 80px
            displayParts: ['photo', 'name', 'title', 'contact'],
            hideContactHeader: true,
            contactLayout: 'row'
          }
        },
        {
          id: 'summary',
          name: 'Professional Summary',
          component: 'Summary',
          visible: true,
          order: 2,
          columns: 1,
          styles: {
            headerStyle: 'minimal'
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
            display: 'default',
            headerStyle: 'minimal'
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
            headerStyle: 'minimal'
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
            display: 'tags',
            headerStyle: 'minimal'
          }
        },
        {
          id: 'certifications',
          name: 'Certifications',
          component: 'Certifications',
          visible: true,
          order: 6,
          columns: 1,
          styles: {
            headerStyle: 'minimal'
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
          fontFamily: 'Times, serif',
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
          text: '#111827',
          background: '#ffffff',
          muted: '#f9fafb',
          border: '#e5e7eb',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
          surface: '#f9fafb',
          overlay: 'rgba(0, 0, 0, 0.5)'
        },
        spacing: {
          section: '24px',
          item: '12px',
          compact: '6px',
          contentPadding: '40px',
          sidebarColumnPadding: '0px',
          mainColumnPadding: '40px',
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
            lg: '8px',
            xl: '12px',
            full: '50%'
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
    },
    preview: '/templates/ivy-league-classic.jpg',
    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sections: true,
      effects: true
    },
    tags: ['academic', 'traditional', 'minimal'],
    difficulty: 'beginner',
    industry: ['academia', 'research', 'consulting'],
    features: ['single-column', 'traditional-styling', 'academic-format']
  },
  {
    id: 'navy-header-professional',
    name: 'Navy Header Professional',
    description: 'Executive template with navy header section and clean content layout',
    category: 'professional',
    layout: {
      id: 'navy-header-layout',
      name: 'Header Footer Layout',
      type: 'header-footer',
      sections: [
        {
          id: 'personalInfo',
          name: 'Personal Information',
          component: 'PersonalInfo',
          visible: true,
          order: 1,
          columns: 0, // Header
          styles: {
            alignment: 'left',
            photoSize: '20', // 80px
            displayParts: ['photo', 'name', 'title', 'contact'],
            hideContactHeader: true,
            contactLayout: 'row'
          }
        },
        {
          id: 'summary',
          name: 'Professional Summary',
          component: 'Summary',
          visible: true,
          order: 2,
          columns: 1, // Main content
          styles: {
            headerStyle: 'background'
          }
        },
        {
          id: 'experience',
          name: 'Work Experience',
          component: 'Experience',
          visible: true,
          order: 3,
          columns: 1, // Main content
          styles: {
            display: 'timeline',
            headerStyle: 'background'
          }
        },
        {
          id: 'education',
          name: 'Education',
          component: 'Education',
          visible: true,
          order: 4,
          columns: 1, // Main content
          styles: {
            headerStyle: 'background'
          }
        },
        {
          id: 'skills',
          name: 'Core Skills',
          component: 'Skills',
          visible: true,
          order: 5,
          columns: 1, // Main content
          styles: {
            display: 'grid',
            columns: 3,
            headerStyle: 'background'
          }
        },
        {
          id: 'certifications',
          name: 'Certifications',
          component: 'Certifications',
          visible: true,
          order: 6,
          columns: 1, // Main content
          styles: {
            headerStyle: 'background'
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
          primary: '#1e293b',
          secondary: '#475569',
          accent: '#60a5fa',
          text: '#ffffff',
          background: '#ffffff',
          muted: '#f1f5f9',
          border: '#e2e8f0',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
          surface: '#f8fafc',
          overlay: 'rgba(0, 0, 0, 0.5)'
        },
        spacing: {
          section: '20px',
          item: '8px',
          compact: '4px',
          contentPadding: '32px',
          sidebarColumnPadding: '0px',
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
            sm: '2px',
            md: '4px',
            lg: '8px',
            xl: '12px',
            full: '50%'
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
    },
    preview: '/templates/navy-header-professional.jpg',
    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sections: true,
      effects: true
    },
    tags: ['executive', 'professional', 'header-style'],
    difficulty: 'intermediate',
    industry: ['business', 'finance', 'executive'],
    features: ['header-design', 'timeline-experience', 'executive-style']
  }
];