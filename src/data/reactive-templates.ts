import { TemplateConfig } from '../types/template';

export const reactiveTemplates: TemplateConfig[] = [
  {
    id: 'azurill',
    name: 'Azurill Sidebar',
    description: 'Professional sidebar template with clean typography and structured sections',
    category: 'modern',
    preview: '/templates/azurill.jpg',
    tags: ['sidebar', 'professional', 'clean'],
    difficulty: 'beginner',
    industry: ['technology', 'business', 'consulting'],
    features: ['ATS-friendly', 'sidebar layout', 'professional'],
    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sections: true,
      effects: true
    },
    layout: {
      id: 'azurill-layout',
      name: 'Azurill Sidebar Layout',
      type: 'sidebar',
      sections: [
        {
          id: 'personalInfo',
          name: 'Personal Information',
          component: 'PersonalInfo',
          visible: true,
          order: 0,
          columns: 2, // Sidebar
          styles: {
            alignment: 'center',
            displayParts: ['photo', 'name', 'title', 'contact'],
            photoSize: '24',
            spacing: 'normal'
          }
        },
        {
          id: 'skills',
          name: 'Core Skills',
          component: 'Skills',
          visible: true,
          order: 1,
          columns: 2, // Sidebar
          styles: {
            display: 'tags',
            spacing: 'compact'
          }
        },
        {
          id: 'languages',
          name: 'Languages',
          component: 'Languages',
          visible: true,
          order: 2,
          columns: 2, // Sidebar
          styles: {
            spacing: 'compact'
          }
        },
        {
          id: 'certifications',
          name: 'Certifications',
          component: 'Certifications',
          visible: true,
          order: 3,
          columns: 2, // Sidebar
          styles: {
            spacing: 'compact'
          }
        },
        {
          id: 'summary',
          name: 'Professional Summary',
          component: 'Summary',
          visible: true,
          order: 4,
          columns: 1, // Main content
          styles: {
            spacing: 'normal'
          }
        },
        {
          id: 'experience',
          name: 'Professional Experience',
          component: 'Experience',
          visible: true,
          order: 5,
          columns: 1, // Main content
          styles: {
            spacing: 'normal'
          }
        },
        {
          id: 'education',
          name: 'Education',
          component: 'Education',
          visible: true,
          order: 6,
          columns: 1, // Main content
          styles: {
            spacing: 'compact'
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
            heading2: '20px',
            heading3: '16px',
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
    id: 'bronzor',
    name: 'Bronzor Header',
    description: 'Professional header template with dark navy header and clean white content area',
    category: 'professional',
    preview: '/templates/bronzor.jpg',
    tags: ['header-footer', 'executive', 'professional'],
    difficulty: 'intermediate',
    industry: ['executive', 'finance', 'consulting'],
    features: ['executive style', 'header layout', 'professional'],
    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sections: true,
      effects: true
    },
    layout: {
      id: 'bronzor-layout',
      name: 'Bronzor Header Layout',
      type: 'header-footer',
      sections: [
        {
          id: 'personalInfo',
          name: 'Personal Information',
          component: 'PersonalInfo',
          visible: true,
          order: 0,
          columns: 0, // Header
          styles: {
            alignment: 'left',
            displayParts: ['photo', 'name', 'title', 'contact'],
            photoSize: '20',
            contactLayout: 'row',
            spacing: 'compact'
          }
        },
        {
          id: 'summary',
          name: 'Executive Summary',
          component: 'Summary',
          visible: true,
          order: 1,
          columns: 1, // Main content
          styles: {
            spacing: 'normal'
          }
        },
        {
          id: 'experience',
          name: 'Professional Experience',
          component: 'Experience',
          visible: true,
          order: 2,
          columns: 1, // Main content
          styles: {
            spacing: 'normal'
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
            spacing: 'compact'
          }
        },
        {
          id: 'skills',
          name: 'Key Competencies',
          component: 'Skills',
          visible: true,
          order: 4,
          columns: 1, // Main content
          styles: {
            display: 'grid',
            columns: 3,
            spacing: 'compact'
          }
        },
        {
          id: 'certifications',
          name: 'Certifications',
          component: 'Certifications',
          visible: true,
          order: 5,
          columns: 1, // Main content
          styles: {
            spacing: 'compact'
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
            heading2: '22px',
            heading3: '16px',
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
          item: '12px',
          compact: '8px',
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
    name: 'Chikorita Minimal',
    description: 'Clean minimalist single-column template with elegant typography and centered layout',
    category: 'minimal',
    preview: '/templates/chikorita.jpg',
    tags: ['minimal', 'clean', 'elegant'],
    difficulty: 'beginner',
    industry: ['design', 'creative', 'startups'],
    features: ['minimal design', 'single column', 'elegant'],
    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sections: true,
      effects: true
    },
    layout: {
      id: 'chikorita-layout',
      name: 'Chikorita Minimal Layout',
      type: 'single-column',
      sections: [
        {
          id: 'personalInfo',
          name: 'Personal Information',
          component: 'PersonalInfo',
          visible: true,
          order: 0,
          columns: 1, // Main content
          styles: {
            alignment: 'center',
            displayParts: ['name', 'title', 'contact'],
            contactLayout: 'row', // CRITICAL: Set contact layout to row for minimal template
            spacing: 'normal'
          }
        },
        {
          id: 'summary',
          name: 'About',
          component: 'Summary',
          visible: true,
          order: 1,
          columns: 1, // Main content
          styles: {
            spacing: 'normal'
          }
        },
        {
          id: 'experience',
          name: 'Experience',
          component: 'Experience',
          visible: true,
          order: 2,
          columns: 1, // Main content
          styles: {
            spacing: 'normal'
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
            spacing: 'normal'
          }
        },
        {
          id: 'skills',
          name: 'Skills',
          component: 'Skills',
          visible: true,
          order: 4,
          columns: 1, // Main content
          styles: {
            display: 'tags',
            spacing: 'normal'
          }
        },
        {
          id: 'languages',
          name: 'Languages',
          component: 'Languages',
          visible: true,
          order: 5,
          columns: 1, // Main content
          styles: {
            spacing: 'compact'
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
            heading1: '36px',
            heading2: '24px',
            heading3: '16px',
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
          primary: '#111827',
          secondary: '#4b5563',
          accent: '#059669',
          text: '#374151',
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
          section: '32px',
          item: '16px',
          compact: '12px',
          contentPadding: '48px',
          sidebarColumnPadding: '24px',
          mainColumnPadding: '48px',
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
    id: 'ditto',
    name: 'Ditto Two-Column',
    description: 'Balanced two-column layout with equal emphasis on all sections',
    category: 'modern',
    preview: '/templates/ditto.jpg',
    tags: ['two-column', 'balanced', 'modern'],
    difficulty: 'beginner',
    industry: ['technology', 'business', 'general'],
    features: ['balanced layout', 'two column', 'versatile'],
    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sections: true,
      effects: true
    },
    layout: {
      id: 'ditto-layout',
      name: 'Ditto Two-Column Layout',
      type: 'two-column',
      sections: [
        {
          id: 'personalInfo',
          name: 'Personal Information',
          component: 'PersonalInfo',
          visible: true,
          order: 0,
          columns: 1, // Main content (left column)
          styles: {
            alignment: 'left',
            displayParts: ['name', 'title'],
            spacing: 'normal'
          }
        },
        {
          id: 'summary',
          name: 'Professional Summary',
          component: 'Summary',
          visible: true,
          order: 1,
          columns: 1, // Main content (left column)
          styles: {
            spacing: 'normal'
          }
        },
        {
          id: 'experience',
          name: 'Work Experience',
          component: 'Experience',
          visible: true,
          order: 2,
          columns: 1, // Main content (left column)
          styles: {
            spacing: 'normal'
          }
        },
        {
          id: 'education',
          name: 'Education',
          component: 'Education',
          visible: true,
          order: 3,
          columns: 1, // Main content (left column)
          styles: {
            spacing: 'normal'
          }
        },
        {
          id: 'contactInfo',
          name: 'Contact Information',
          component: 'PersonalInfo',
          visible: true,
          order: 4,
          columns: 2, // Right column
          styles: {
            alignment: 'left',
            displayParts: ['contact'],
            contactLayout: 'column',
            spacing: 'compact'
          }
        },
        {
          id: 'skills',
          name: 'Skills & Expertise',
          component: 'Skills',
          visible: true,
          order: 5,
          columns: 2, // Right column
          styles: {
            display: 'list',
            spacing: 'compact'
          }
        },
        {
          id: 'languages',
          name: 'Languages',
          component: 'Languages',
          visible: true,
          order: 6,
          columns: 2, // Right column
          styles: {
            spacing: 'compact'
          }
        },
        {
          id: 'certifications',
          name: 'Certifications',
          component: 'Certifications',
          visible: true,
          order: 7,
          columns: 2, // Right column
          styles: {
            spacing: 'compact'
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
            heading2: '20px',
            heading3: '16px',
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
          primary: '#2563eb',
          secondary: '#1e40af',
          accent: '#3b82f6',
          text: '#1f2937',
          background: '#ffffff',
          muted: '#f8fafc',
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