import { TemplateConfig } from '../types/template';

export const reactiveTemplates: TemplateConfig[] = [
  {
    id: 'azurill',
    name: 'Azurill',
    description: 'Professional sidebar template with customizable sections and modern typography. Perfect for showcasing skills and experience in an organized layout.',
    category: 'modern',
    layout: {
      id: 'azurill-layout',
      name: 'Azurill Layout',
      type: 'sidebar',
      sections: [
        {
          id: 'personal-info',
          name: 'Personal Information',
          component: 'PersonalInfo',
          visible: true,
          order: 1,
          columns: 2, // Sidebar
          styles: {
            alignment: 'center',
            spacing: 'normal',
            displayParts: ['photo', 'name', 'title', 'contact'],
            photoSize: '24'
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
            display: 'tags',
            spacing: 'compact',
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
            spacing: 'compact',
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
            spacing: 'compact',
            headerStyle: 'underline'
          }
        },
        {
          id: 'summary',
          name: 'Professional Summary',
          component: 'Summary',
          visible: true,
          order: 1,
          columns: 1, // Main content
          styles: {
            spacing: 'normal',
            headerStyle: 'underline'
          }
        },
        {
          id: 'experience',
          name: 'Work Experience',
          component: 'Experience',
          visible: true,
          order: 2,
          columns: 1, // Main content
          styles: {
            spacing: 'normal',
            display: 'timeline',
            headerStyle: 'underline'
          }
        },
        {
          id: 'education',
          name: 'Education',
          component: 'Education',
          visible: true,
          order: 3,
          columns: 1, // Main content
          styles: {
            spacing: 'normal',
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
            base: '12px',
            heading1: '28px',
            heading2: '18px',
            heading3: '14px',
            small: '10px',
            contactInfo: '11px',
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
          section: '24px',
          item: '12px',
          compact: '8px',
          sidebarColumnPadding: '24px',
          mainColumnPadding: '32px',
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
    },
    preview: '/templates/azurill.jpg',
    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sections: true,
      effects: true
    },
    tags: ['sidebar', 'professional', 'modern'],
    difficulty: 'beginner',
    industry: ['technology', 'business', 'finance'],
    features: ['sidebar layout', 'skill tags', 'timeline experience']
  },
  {
    id: 'bronzor',
    name: 'Bronzor',
    description: 'Corporate header template with professional navy styling and structured content layout. Ideal for executive and senior management positions.',
    category: 'professional',
    layout: {
      id: 'bronzor-layout',
      name: 'Bronzor Layout',
      type: 'header-footer',
      sections: [
        {
          id: 'personal-info',
          name: 'Personal Information',
          component: 'PersonalInfo',
          visible: true,
          order: 1,
          columns: 0, // Header
          styles: {
            alignment: 'left',
            spacing: 'normal',
            displayParts: ['name', 'title', 'contact'],
            photoSize: '20'
          }
        },
        {
          id: 'summary',
          name: 'Professional Summary',
          component: 'Summary',
          visible: true,
          order: 1,
          columns: 1, // Main body
          styles: {
            spacing: 'normal',
            headerStyle: 'underline'
          }
        },
        {
          id: 'experience',
          name: 'Professional Experience',
          component: 'Experience',
          visible: true,
          order: 2,
          columns: 1, // Main body
          styles: {
            spacing: 'normal',
            display: 'list',
            headerStyle: 'underline'
          }
        },
        {
          id: 'education',
          name: 'Education',
          component: 'Education',
          visible: true,
          order: 3,
          columns: 1, // Main body
          styles: {
            spacing: 'normal',
            headerStyle: 'underline'
          }
        },
        {
          id: 'skills',
          name: 'Core Competencies',
          component: 'Skills',
          visible: true,
          order: 4,
          columns: 1, // Main body
          styles: {
            display: 'tags',
            spacing: 'normal',
            headerStyle: 'underline'
          }
        },
        {
          id: 'certifications',
          name: 'Certifications',
          component: 'Certifications',
          visible: true,
          order: 5,
          columns: 1, // Main body
          styles: {
            spacing: 'normal',
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
            base: '12px',
            heading1: '24px',
            heading2: '16px',
            heading3: '14px',
            small: '10px',
            contactInfo: '11px',
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
          border: '#e2e8f0',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#0ea5e9',
          surface: '#f8fafc',
          overlay: 'rgba(0, 0, 0, 0.5)'
        },
        spacing: {
          section: '24px',
          item: '16px',
          compact: '8px',
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
    },
    preview: '/templates/bronzor.jpg',
    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sections: true,
      effects: true
    },
    tags: ['header', 'professional', 'executive'],
    difficulty: 'intermediate',
    industry: ['corporate', 'finance', 'consulting'],
    features: ['header layout', 'executive styling', 'structured content']
  },
  {
    id: 'chikorita',
    name: 'Chikorita',
    description: 'Clean minimalist template with elegant typography and centered layout. Perfect for creative professionals who prefer simplicity.',
    category: 'minimal',
    layout: {
      id: 'chikorita-layout',
      name: 'Chikorita Layout',
      type: 'single-column',
      sections: [
        {
          id: 'personal-info',
          name: 'Personal Information',
          component: 'PersonalInfo',
          visible: true,
          order: 1,
          columns: 1,
          styles: {
            alignment: 'center',
            spacing: 'normal',
            displayParts: ['name', 'contact'], // Remove title and photo for minimalist look
            contactLayout: 'row', // Display contact info in a single row
            photoSize: '20'
          }
        },
        {
          id: 'summary',
          name: 'About',
          component: 'Summary',
          visible: true,
          order: 2,
          columns: 1,
          styles: {
            spacing: 'relaxed',
            headerStyle: 'minimal'
          }
        },
        {
          id: 'experience',
          name: 'Experience',
          component: 'Experience',
          visible: true,
          order: 3,
          columns: 1,
          styles: {
            spacing: 'relaxed',
            display: 'list',
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
            spacing: 'relaxed',
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
            spacing: 'relaxed',
            headerStyle: 'minimal'
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
            spacing: 'relaxed',
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
          fontFamily: 'Inter, sans-serif',
          fontSize: {
            base: '12px',
            heading1: '32px',
            heading2: '20px',
            heading3: '16px',
            small: '11px',
            contactInfo: '11px',
            micro: '10px'
          },
          lineHeight: {
            tight: '1.1',
            normal: '1.5',
            relaxed: '1.7',
            loose: '1.9'
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
          primary: '#111827',
          secondary: '#4b5563',
          accent: '#059669',
          text: '#374151',
          background: '#ffffff',
          muted: '#f9fafb',
          border: '#e5e7eb',
          success: '#059669',
          warning: '#d97706',
          error: '#dc2626',
          info: '#0284c7',
          surface: '#ffffff',
          overlay: 'rgba(0, 0, 0, 0.5)'
        },
        spacing: {
          section: '32px',
          item: '16px',
          compact: '12px',
          contentPadding: '48px',
          xs: '6px',
          sm: '12px',
          md: '20px',
          lg: '32px',
          xl: '48px',
          xxl: '64px'
        },
        effects: {
          borderRadius: {
            none: '0',
            sm: '2px',
            md: '4px',
            lg: '8px',
            xl: '12px',
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
    },
    preview: '/templates/chikorita.jpg',
    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sections: true,
      effects: true
    },
    tags: ['minimal', 'clean', 'centered'],
    difficulty: 'beginner',
    industry: ['creative', 'design', 'marketing'],
    features: ['minimal design', 'centered layout', 'clean typography']
  }
];