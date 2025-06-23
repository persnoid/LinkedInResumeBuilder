import { TemplateConfig } from '../types/template';

export const reactiveTemplates: TemplateConfig[] = [
  {
    id: 'azurill',
    name: 'Azurill',
    description: 'A clean, modern template with a professional sidebar layout',
    category: 'modern',
    preview: '/templates/azurill.jpg',
    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sections: true,
    },
    layout: {
      id: 'azurill-layout',
      name: 'Azurill Layout',
      type: 'sidebar',
      sections: [
        {
          id: 'personalInfo',
          name: 'Personal Information',
          component: 'PersonalInfo',
          visible: true,
          order: 1,
          columns: 2,
          styles: { alignment: 'left' }
        },
        {
          id: 'summary',
          name: 'Summary',
          component: 'Summary',
          visible: true,
          order: 2,
          columns: 1,
          styles: { alignment: 'left', divider: true }
        },
        {
          id: 'experience',
          name: 'Experience',
          component: 'Experience',
          visible: true,
          order: 3,
          columns: 1,
          styles: { alignment: 'left', divider: true }
        },
        {
          id: 'education',
          name: 'Education',
          component: 'Education',
          visible: true,
          order: 4,
          columns: 1,
          styles: { alignment: 'left', divider: true }
        },
        {
          id: 'skills',
          name: 'Skills',
          component: 'Skills',
          visible: true,
          order: 5,
          columns: 2,
          styles: { alignment: 'left', display: 'list' }
        },
        {
          id: 'languages',
          name: 'Languages',
          component: 'Languages',
          visible: true,
          order: 6,
          columns: 2,
          styles: { alignment: 'left' }
        },
        {
          id: 'certifications',
          name: 'Certifications',
          component: 'Certifications',
          visible: true,
          order: 7,
          columns: 2,
          styles: { alignment: 'left' }
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
            base: '10px',
            heading1: '24px',
            heading2: '18px',
            heading3: '14px',
            small: '9px'
          },
          lineHeight: {
            tight: '1.2',
            normal: '1.4',
            relaxed: '1.6'
          }
        },
        colors: {
          primary: '#1f2937',
          secondary: '#6b7280',
          accent: '#3b82f6',
          text: '#374151',
          background: '#ffffff',
          muted: '#f3f4f6',
          border: '#e5e7eb'
        },
        spacing: {
          section: '24px',
          item: '12px',
          compact: '8px'
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
    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sections: true,
    },
    layout: {
      id: 'bronzor-layout',
      name: 'Bronzor Layout',
      type: 'header-footer',
      sections: [
        {
          id: 'personalInfo',
          name: 'Personal Information',
          component: 'PersonalInfo',
          visible: true,
          order: 1,
          columns: 0,
          styles: { alignment: 'left' }
        },
        {
          id: 'summary',
          name: 'Professional Summary',
          component: 'Summary',
          visible: true,
          order: 2,
          columns: 1,
          styles: { alignment: 'left', divider: true }
        },
        {
          id: 'experience',
          name: 'Work Experience',
          component: 'Experience',
          visible: true,
          order: 3,
          columns: 1,
          styles: { alignment: 'left', divider: true }
        },
        {
          id: 'education',
          name: 'Education',
          component: 'Education',
          visible: true,
          order: 4,
          columns: 1,
          styles: { alignment: 'left', divider: true }
        },
        {
          id: 'skills',
          name: 'Core Skills',
          component: 'Skills',
          visible: true,
          order: 5,
          columns: 1,
          styles: { alignment: 'left', display: 'tags' }
        },
        {
          id: 'languages',
          name: 'Languages',
          component: 'Languages',
          visible: true,
          order: 6,
          columns: 1,
          styles: { alignment: 'left' }
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
            base: '10px',
            heading1: '28px',
            heading2: '20px',
            heading3: '14px',
            small: '9px'
          },
          lineHeight: {
            tight: '1.2',
            normal: '1.4',
            relaxed: '1.6'
          }
        },
        colors: {
          primary: '#1e293b',
          secondary: '#475569',
          accent: '#0ea5e9',
          text: '#334155',
          background: '#ffffff',
          muted: '#f1f5f9',
          border: '#cbd5e1'
        },
        spacing: {
          section: '28px',
          item: '14px',
          compact: '10px'
        }
      }
    }
  },
  {
    id: 'chikorita',
    name: 'Chikorita',
    description: 'Clean minimal template with elegant typography and spacing',
    category: 'minimal',
    preview: '/templates/chikorita.jpg',
    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sections: true,
    },
    layout: {
      id: 'chikorita-layout',
      name: 'Chikorita Layout',
      type: 'single-column',
      sections: [
        {
          id: 'personalInfo',
          name: 'Personal Information',
          component: 'PersonalInfo',
          visible: true,
          order: 1,
          styles: { alignment: 'center' }
        },
        {
          id: 'summary',
          name: 'About',
          component: 'Summary',
          visible: true,
          order: 2,
          styles: { alignment: 'center', divider: true }
        },
        {
          id: 'experience',
          name: 'Experience',
          component: 'Experience',
          visible: true,
          order: 3,
          styles: { alignment: 'left', divider: true }
        },
        {
          id: 'education',
          name: 'Education',
          component: 'Education',
          visible: true,
          order: 4,
          styles: { alignment: 'left', divider: true }
        },
        {
          id: 'skills',
          name: 'Skills',
          component: 'Skills',
          visible: true,
          order: 5,
          styles: { alignment: 'center', display: 'tags' }
        },
        {
          id: 'languages',
          name: 'Languages',
          component: 'Languages',
          visible: true,
          order: 6,
          styles: { alignment: 'center' }
        }
      ],
      styles: {
        page: {
          margin: '0 auto',
          padding: '40px',
          background: '#ffffff'
        },
        typography: {
          fontFamily: 'Inter, sans-serif',
          fontSize: {
            base: '10px',
            heading1: '32px',
            heading2: '22px',
            heading3: '16px',
            small: '9px'
          },
          lineHeight: {
            tight: '1.2',
            normal: '1.5',
            relaxed: '1.7'
          }
        },
        colors: {
          primary: '#111827',
          secondary: '#4b5563',
          accent: '#059669',
          text: '#374151',
          background: '#ffffff',
          muted: '#f9fafb',
          border: '#d1d5db'
        },
        spacing: {
          section: '32px',
          item: '16px',
          compact: '12px'
        }
      }
    }
  }
];