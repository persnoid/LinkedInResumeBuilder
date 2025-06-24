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
          columns: 2, // Sidebar only
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
            base: '12px',
            heading1: '28px',
            heading2: '20px',
            heading3: '16px',
            small: '11px'
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
          columns: 0, // Header section ONLY - no duplicate in main content
          styles: { alignment: 'left' }
        },
        {
          id: 'summary',
          name: 'Professional Summary',
          component: 'Summary',
          visible: true,
          order: 2,
          columns: 1, // Main content only
          styles: { alignment: 'left', divider: true }
        },
        {
          id: 'experience',
          name: 'Work Experience',
          component: 'Experience',
          visible: true,
          order: 3,
          columns: 1, // Main content only
          styles: { alignment: 'left', divider: true }
        },
        {
          id: 'education',
          name: 'Education',
          component: 'Education',
          visible: true,
          order: 4,
          columns: 1, // Main content only
          styles: { alignment: 'left', divider: true }
        },
        {
          id: 'skills',
          name: 'Core Skills',
          component: 'Skills',
          visible: true,
          order: 5,
          columns: 1, // Main content only
          styles: { alignment: 'left', display: 'tags' }
        },
        {
          id: 'languages',
          name: 'Languages',
          component: 'Languages',
          visible: true,
          order: 6,
          columns: 1, // Main content only
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
            base: '12px',
            heading1: '32px',
            heading2: '22px',
            heading3: '16px',
            small: '11px'
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
      type: 'sidebar',
      sections: [
        {
          id: 'personalInfo',
          name: 'Personal Information',
          component: 'PersonalInfo',
          visible: true,
          order: 1,
          columns: 2, // Sidebar only
          styles: { alignment: 'center' }
        },
        {
          id: 'summary',
          name: 'About',
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
            heading3: '18px',
            small: '11px'
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
          muted: '#16a34a',
          border: '#d1d5db'
        },
        spacing: {
          section: '32px',
          item: '16px',
          compact: '12px'
        }
      }
    }
  },
  {
    id: 'ditto',
    name: 'Ditto',
    description: 'Flexible two-column template with customizable sections',
    category: 'modern',
    preview: '/templates/ditto.jpg',
    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sections: true,
    },
    layout: {
      id: 'ditto-layout',
      name: 'Ditto Layout',
      type: 'two-column',
      sections: [
        {
          id: 'personalInfo',
          name: 'Personal Information',
          component: 'PersonalInfo',
          visible: true,
          order: 1,
          columns: 1,
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
          styles: { alignment: 'left', display: 'grid' }
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
          padding: '32px',
          background: '#ffffff'
        },
        typography: {
          fontFamily: 'Inter, sans-serif',
          fontSize: {
            base: '12px',
            heading1: '30px',
            heading2: '21px',
            heading3: '16px',
            small: '11px'
          },
          lineHeight: {
            tight: '1.2',
            normal: '1.4',
            relaxed: '1.6'
          }
        },
        colors: {
          primary: '#2563eb',
          secondary: '#64748b',
          accent: '#0ea5e9',
          text: '#1e293b',
          background: '#ffffff',
          muted: '#0ea5e9',
          border: '#e2e8f0'
        },
        spacing: {
          section: '26px',
          item: '13px',
          compact: '9px'
        }
      }
    }
  },
  {
    id: 'kakuna',
    name: 'Kakuna',
    description: 'Professional template with clean lines and structured layout',
    category: 'professional',
    preview: '/templates/kakuna.jpg',
    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sections: true,
    },
    layout: {
      id: 'kakuna-layout',
      name: 'Kakuna Layout',
      type: 'single-column',
      sections: [
        {
          id: 'personalInfo',
          name: 'Contact Information',
          component: 'PersonalInfo',
          visible: true,
          order: 1,
          styles: { alignment: 'left' }
        },
        {
          id: 'summary',
          name: 'Professional Summary',
          component: 'Summary',
          visible: true,
          order: 2,
          styles: { alignment: 'left', divider: true }
        },
        {
          id: 'experience',
          name: 'Professional Experience',
          component: 'Experience',
          visible: true,
          order: 3,
          styles: { alignment: 'left', divider: true }
        },
        {
          id: 'education',
          name: 'Education & Training',
          component: 'Education',
          visible: true,
          order: 4,
          styles: { alignment: 'left', divider: true }
        },
        {
          id: 'skills',
          name: 'Core Competencies',
          component: 'Skills',
          visible: true,
          order: 5,
          styles: { alignment: 'left', display: 'tags' }
        },
        {
          id: 'certifications',
          name: 'Certifications',
          component: 'Certifications',
          visible: true,
          order: 6,
          styles: { alignment: 'left' }
        }
      ],
      styles: {
        page: {
          margin: '0 auto',
          padding: '36px',
          background: '#ffffff'
        },
        typography: {
          fontFamily: 'Inter, sans-serif',
          fontSize: {
            base: '12px',
            heading1: '34px',
            heading2: '23px',
            heading3: '17px',
            small: '11px'
          },
          lineHeight: {
            tight: '1.2',
            normal: '1.5',
            relaxed: '1.7'
          }
        },
        colors: {
          primary: '#0f172a',
          secondary: '#475569',
          accent: '#dc2626',
          text: '#334155',
          background: '#ffffff',
          muted: '#f1f5f9',
          border: '#cbd5e1'
        },
        spacing: {
          section: '30px',
          item: '15px',
          compact: '11px'
        }
      }
    }
  },
  {
    id: 'nosepass',
    name: 'Nosepass',
    description: 'Elegant template with sophisticated typography and layout',
    category: 'minimal',
    preview: '/templates/nosepass.jpg',
    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sections: true,
    },
    layout: {
      id: 'nosepass-layout',
      name: 'Nosepass Layout',
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
          name: 'Summary',
          component: 'Summary',
          visible: true,
          order: 2,
          styles: { alignment: 'left', divider: true }
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
            base: '12px',
            heading1: '36px',
            heading2: '24px',
            heading3: '18px',
            small: '11px'
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
          accent: '#f59e0b',
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
  },
  {
    id: 'onyx',
    name: 'Onyx',
    description: 'Bold template with strong typography and modern design',
    category: 'creative',
    preview: '/templates/onyx.jpg',
    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sections: true,
    },
    layout: {
      id: 'onyx-layout',
      name: 'Onyx Layout',
      type: 'single-column',
      sections: [
        {
          id: 'personalInfo',
          name: 'Personal Information',
          component: 'PersonalInfo',
          visible: true,
          order: 1,
          styles: { alignment: 'left' }
        },
        {
          id: 'summary',
          name: 'Summary',
          component: 'Summary',
          visible: true,
          order: 2,
          styles: { alignment: 'left', divider: true }
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
          styles: { alignment: 'left', display: 'list' }
        },
        {
          id: 'languages',
          name: 'Languages',
          component: 'Languages',
          visible: true,
          order: 6,
          styles: { alignment: 'left' }
        }
      ],
      styles: {
        page: {
          margin: '0',
          padding: '36px',
          background: '#ffffff'
        },
        typography: {
          fontFamily: 'Inter, sans-serif',
          fontSize: {
            base: '12px',
            heading1: '32px',
            heading2: '22px',
            heading3: '17px',
            small: '11px'
          },
          lineHeight: {
            tight: '1.2',
            normal: '1.4',
            relaxed: '1.6'
          }
        },
        colors: {
          primary: '#000000',
          secondary: '#4b5563',
          accent: '#dc2626',
          text: '#1f2937',
          background: '#ffffff',
          muted: '#f3f4f6',
          border: '#e5e7eb'
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
    id: 'pikachu',
    name: 'Pikachu',
    description: 'Vibrant template with energetic design and modern layout',
    category: 'creative',
    preview: '/templates/pikachu.jpg',
    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sections: true,
    },
    layout: {
      id: 'pikachu-layout',
      name: 'Pikachu Layout',
      type: 'header-footer',
      sections: [
        {
          id: 'personalInfo',
          name: 'Personal Information',
          component: 'PersonalInfo',
          visible: true,
          order: 1,
          columns: 0, // Header section ONLY - no duplicate in main content
          styles: { alignment: 'left' }
        },
        {
          id: 'summary',
          name: 'Summary',
          component: 'Summary',
          visible: true,
          order: 2,
          columns: 1, // Main content only
          styles: { alignment: 'left', divider: true }
        },
        {
          id: 'experience',
          name: 'Experience',
          component: 'Experience',
          visible: true,
          order: 3,
          columns: 1, // Main content only
          styles: { alignment: 'left', divider: true }
        },
        {
          id: 'education',
          name: 'Education',
          component: 'Education',
          visible: true,
          order: 4,
          columns: 1, // Main content only
          styles: { alignment: 'left', divider: true }
        },
        {
          id: 'skills',
          name: 'Skills',
          component: 'Skills',
          visible: true,
          order: 5,
          columns: 1, // Main content only
          styles: { alignment: 'left', display: 'tags' }
        },
        {
          id: 'languages',
          name: 'Languages',
          component: 'Languages',
          visible: true,
          order: 6,
          columns: 1, // Main content only
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
            base: '12px',
            heading1: '32px',
            heading2: '22px',
            heading3: '16px',
            small: '11px'
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
          accent: '#f59e0b',
          text: '#334155',
          background: '#ffffff',
          muted: '#fef3c7',
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
    id: 'rhyhorn',
    name: 'Rhyhorn',
    description: 'Robust template with strong structure and professional appeal',
    category: 'professional',
    preview: '/templates/rhyhorn.jpg',
    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sections: true,
    },
    layout: {
      id: 'rhyhorn-layout',
      name: 'Rhyhorn Layout',
      type: 'single-column',
      sections: [
        {
          id: 'personalInfo',
          name: 'Personal Information',
          component: 'PersonalInfo',
          visible: true,
          order: 1,
          styles: { alignment: 'left' }
        },
        {
          id: 'summary',
          name: 'Summary',
          component: 'Summary',
          visible: true,
          order: 2,
          styles: { alignment: 'left', divider: true }
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
          styles: { alignment: 'left', display: 'list' }
        },
        {
          id: 'certifications',
          name: 'Certifications',
          component: 'Certifications',
          visible: true,
          order: 6,
          styles: { alignment: 'left' }
        }
      ],
      styles: {
        page: {
          margin: '0 auto',
          padding: '36px',
          background: '#ffffff'
        },
        typography: {
          fontFamily: 'Inter, sans-serif',
          fontSize: {
            base: '12px',
            heading1: '34px',
            heading2: '23px',
            heading3: '17px',
            small: '11px'
          },
          lineHeight: {
            tight: '1.2',
            normal: '1.5',
            relaxed: '1.7'
          }
        },
        colors: {
          primary: '#0f172a',
          secondary: '#475569',
          accent: '#3b82f6',
          text: '#334155',
          background: '#ffffff',
          muted: '#f1f5f9',
          border: '#cbd5e1'
        },
        spacing: {
          section: '30px',
          item: '15px',
          compact: '11px'
        }
      }
    }
  }
];