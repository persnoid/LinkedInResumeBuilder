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
        // MAIN CONTENT SECTIONS (RIGHT COLUMN) - columns: 1
        {
          id: 'personalInfoMain',
          name: 'Personal Information',
          component: 'PersonalInfo',
          visible: true,
          order: 0,
          columns: 1, // MAIN CONTENT
          styles: { 
            alignment: 'center',
            displayParts: ['photo', 'name', 'title'],
            photoSize: '20', // Reduced from 32 to 20 for smaller photo
            divider: true,
            padding: '24px',
            spacing: 'relaxed'
          }
        },
        {
          id: 'summary',
          name: 'About me',
          component: 'Summary',
          visible: true,
          order: 1,
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
          order: 2,
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
          order: 3,
          columns: 1, // MAIN CONTENT
          styles: { 
            alignment: 'left', 
            divider: true,
            spacing: 'normal',
            headerStyle: 'underline'
          }
        },
        
        // SIDEBAR SECTIONS (LEFT COLUMN) - columns: 2
        {
          id: 'personalInfoContact',
          name: 'Contact Information',
          component: 'PersonalInfo',
          visible: true,
          order: 4,
          columns: 2, // SIDEBAR
          styles: { 
            alignment: 'left',
            displayParts: ['contact'],
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: 'lg',
            iconSize: 'md',
            headerStyle: 'minimal'
          }
        },
        {
          id: 'skills',
          name: 'Skills',
          component: 'Skills',
          visible: true,
          order: 5,
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
          order: 6,
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
          order: 7,
          columns: 2, // SIDEBAR
          styles: { 
            alignment: 'left',
            spacing: 'compact',
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
            padding: '32px',
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
  },
  // NEW MINIMAL TEMPLATES
  {
    id: 'minimal-elegance',
    name: 'Minimal Elegance',
    description: 'Ultra-clean single-column template with elegant typography and subtle spacing for a sophisticated look',
    category: 'minimal',
    preview: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['minimal', 'elegant', 'clean', 'simple'],
    difficulty: 'beginner',
    industry: ['design', 'consulting', 'freelance', 'creative'],
    features: ['ultra-clean layout', 'elegant typography', 'subtle spacing', 'minimalist design'],
    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sections: true,
      effects: true,
    },
    layout: {
      id: 'minimal-elegance-layout',
      name: 'Minimal Elegance Layout',
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
            headerStyle: 'minimal',
            displayParts: ['name', 'title', 'contact'],
            photoSize: '16'
          }
        },
        {
          id: 'summary',
          name: 'Summary',
          component: 'Summary',
          visible: true,
          order: 2,
          columns: 1,
          styles: { 
            alignment: 'center', 
            spacing: 'relaxed',
            headerStyle: 'minimal',
            divider: false
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
            alignment: 'left', 
            spacing: 'relaxed',
            headerStyle: 'minimal',
            display: 'default'
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
            alignment: 'center', 
            display: 'tags',
            spacing: 'normal',
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
            alignment: 'left',
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
            base: '11px',
            heading1: '24px',
            heading2: '16px',
            heading3: '13px',
            small: '10px',
            contactInfo: '10px',
            micro: '9px'
          },
          lineHeight: {
            tight: '1.3',
            normal: '1.6',
            relaxed: '1.8',
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
          primary: '#2d3748',
          secondary: '#718096',
          accent: '#4a5568',
          text: '#2d3748',
          background: '#ffffff',
          muted: '#f7fafc',
          border: '#e2e8f0',
          success: '#48bb78',
          warning: '#ed8936',
          error: '#f56565',
          info: '#4299e1',
          surface: '#ffffff',
          overlay: 'rgba(45, 55, 72, 0.1)'
        },
        spacing: {
          section: '40px',
          item: '20px',
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
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
            md: '0 2px 4px 0 rgba(0, 0, 0, 0.05)',
            lg: '0 4px 8px 0 rgba(0, 0, 0, 0.08)',
            xl: '0 8px 16px 0 rgba(0, 0, 0, 0.1)'
          }
        }
      }
    }
  },
  {
    id: 'soft-minimal',
    name: 'Soft Minimal',
    description: 'Gentle two-column template with soft colors and rounded elements for a modern, approachable feel',
    category: 'minimal',
    preview: 'https://images.pexels.com/photos/6802049/pexels-photo-6802049.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['minimal', 'soft', 'modern', 'approachable'],
    difficulty: 'beginner',
    industry: ['healthcare', 'education', 'non-profit', 'wellness'],
    features: ['soft color palette', 'rounded elements', 'gentle spacing', 'two-column layout'],
    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sections: true,
      effects: true,
    },
    layout: {
      id: 'soft-minimal-layout',
      name: 'Soft Minimal Layout',
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
            alignment: 'center',
            backgroundColor: '#f8fafc',
            padding: '24px',
            borderRadius: 'lg',
            spacing: 'relaxed'
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
            alignment: 'left', 
            spacing: 'relaxed',
            headerStyle: 'background',
            backgroundColor: '#f1f5f9',
            padding: '20px',
            borderRadius: 'md'
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
            alignment: 'left',
            spacing: 'relaxed',
            headerStyle: 'background',
            display: 'cards',
            borderRadius: 'md'
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
            display: 'tags',
            spacing: 'normal',
            headerStyle: 'background',
            backgroundColor: '#f8fafc',
            padding: '16px',
            borderRadius: 'md'
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
            headerStyle: 'background',
            backgroundColor: '#f1f5f9',
            padding: '16px',
            borderRadius: 'md'
          }
        },
        {
          id: 'languages',
          name: 'Languages',
          component: 'Languages',
          visible: true,
          order: 6,
          columns: 2,
          styles: { 
            alignment: 'left',
            spacing: 'compact',
            headerStyle: 'background',
            backgroundColor: '#f8fafc',
            padding: '16px',
            borderRadius: 'md'
          }
        },
        {
          id: 'certifications',
          name: 'Certifications',
          component: 'Certifications',
          visible: true,
          order: 7,
          columns: 2,
          styles: { 
            alignment: 'left',
            spacing: 'compact',
            headerStyle: 'background',
            backgroundColor: '#f1f5f9',
            padding: '16px',
            borderRadius: 'md'
          }
        }
      ],
      styles: {
        page: {
          margin: '0',
          padding: '0',
          background: '#ffffff',
          borderRadius: '12px',
          shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        },
        typography: {
          fontFamily: 'Inter, sans-serif',
          fontSize: {
            base: '11px',
            heading1: '22px',
            heading2: '15px',
            heading3: '13px',
            small: '10px',
            contactInfo: '10px',
            micro: '9px'
          },
          lineHeight: {
            tight: '1.3',
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
          primary: '#64748b',
          secondary: '#94a3b8',
          accent: '#0ea5e9',
          text: '#475569',
          background: '#ffffff',
          muted: '#f8fafc',
          border: '#e2e8f0',
          success: '#22c55e',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#0ea5e9',
          surface: '#f8fafc',
          overlay: 'rgba(100, 116, 139, 0.1)'
        },
        spacing: {
          section: '32px',
          item: '16px',
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
            md: '8px',
            lg: '12px',
            xl: '16px',
            full: '9999px'
          },
          shadow: {
            none: 'none',
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08)',
            xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }
        }
      }
    }
  },
  // NEW CREATIVE TEMPLATES
  {
    id: 'bold-geometric',
    name: 'Bold Geometric',
    description: 'Creative sidebar template with strong geometric elements and bold accent colors for standout designs',
    category: 'creative',
    preview: 'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['creative', 'bold', 'geometric', 'modern'],
    difficulty: 'intermediate',
    industry: ['design', 'marketing', 'advertising', 'media'],
    features: ['geometric patterns', 'bold colors', 'creative layout', 'visual impact'],
    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sections: true,
      effects: true,
    },
    layout: {
      id: 'bold-geometric-layout',
      name: 'Bold Geometric Layout',
      type: 'sidebar',
      sections: [
        // MAIN CONTENT - columns: 1
        {
          id: 'personalInfoMain',
          name: 'Header Information',
          component: 'PersonalInfo',
          visible: true,
          order: 1,
          columns: 1,
          styles: { 
            alignment: 'left',
            displayParts: ['name', 'title'],
            spacing: 'relaxed',
            backgroundColor: '#1a202c',
            padding: '32px',
            borderRadius: 'none'
          }
        },
        {
          id: 'summary',
          name: 'Creative Vision',
          component: 'Summary',
          visible: true,
          order: 2,
          columns: 1,
          styles: { 
            alignment: 'left', 
            spacing: 'relaxed',
            headerStyle: 'background',
            backgroundColor: '#ed8936',
            padding: '24px',
            borderRadius: 'none'
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
            alignment: 'left',
            spacing: 'relaxed',
            headerStyle: 'background',
            display: 'cards',
            backgroundColor: '#f7fafc',
            borderRadius: 'lg'
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
            backgroundColor: '#edf2f7',
            borderRadius: 'lg'
          }
        },
        
        // SIDEBAR - columns: 2
        {
          id: 'personalInfoSidebar',
          name: 'Contact',
          component: 'PersonalInfo',
          visible: true,
          order: 5,
          columns: 2,
          styles: { 
            alignment: 'center',
            displayParts: ['photo', 'contact'],
            photoSize: '20',
            backgroundColor: '#2d3748',
            padding: '24px'
          }
        },
        {
          id: 'skills',
          name: 'Skills',
          component: 'Skills',
          visible: true,
          order: 6,
          columns: 2,
          styles: { 
            alignment: 'left', 
            display: 'tags',
            spacing: 'normal',
            headerStyle: 'background',
            backgroundColor: '#ed8936',
            padding: '20px'
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
            headerStyle: 'background',
            backgroundColor: '#4a5568',
            padding: '20px'
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
            headerStyle: 'background',
            backgroundColor: '#2d3748',
            padding: '20px'
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
          fontFamily: 'Montserrat, sans-serif',
          fontSize: {
            base: '11px',
            heading1: '26px',
            heading2: '17px',
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
          primary: '#1a202c',
          secondary: '#2d3748',
          accent: '#ed8936',
          text: '#2d3748',
          background: '#ffffff',
          muted: '#2d3748',
          border: '#e2e8f0',
          success: '#48bb78',
          warning: '#ed8936',
          error: '#f56565',
          info: '#4299e1',
          surface: '#f7fafc',
          overlay: 'rgba(26, 32, 44, 0.8)'
        },
        spacing: {
          section: '24px',
          item: '12px',
          compact: '8px',
          contentPadding: '32px',
          sidebarColumnPadding: '0',
          mainColumnPadding: '0',
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
            sm: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }
        }
      }
    }
  },
  {
    id: 'artistic-storyteller',
    name: 'Artistic Storyteller',
    description: 'Creative header-footer template with artistic typography and visual storytelling elements for creative professionals',
    category: 'creative',
    preview: 'https://images.pexels.com/photos/6802042/pexels-photo-6802042.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['creative', 'artistic', 'storytelling', 'typography'],
    difficulty: 'advanced',
    industry: ['arts', 'writing', 'photography', 'film'],
    features: ['artistic typography', 'visual storytelling', 'creative sections', 'expressive design'],
    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sections: true,
      effects: true,
    },
    layout: {
      id: 'artistic-storyteller-layout',
      name: 'Artistic Storyteller Layout',
      type: 'header-footer',
      sections: [
        {
          id: 'personalInfo',
          name: 'Artist Profile',
          component: 'PersonalInfo',
          visible: true,
          order: 1,
          columns: 0, // HEADER
          styles: { 
            alignment: 'center',
            backgroundColor: '#2d3748',
            padding: '40px',
            borderRadius: 'none',
            spacing: 'relaxed'
          }
        },
        {
          id: 'summary',
          name: 'Creative Philosophy',
          component: 'Summary',
          visible: true,
          order: 2,
          columns: 1, // MAIN CONTENT
          styles: { 
            alignment: 'center', 
            spacing: 'relaxed',
            headerStyle: 'background',
            backgroundColor: '#e53e3e',
            padding: '32px',
            borderRadius: 'lg'
          }
        },
        {
          id: 'experience',
          name: 'Creative Journey',
          component: 'Experience',
          visible: true,
          order: 3,
          columns: 1,
          styles: { 
            alignment: 'left',
            spacing: 'relaxed',
            headerStyle: 'background',
            display: 'timeline',
            backgroundColor: '#f7fafc',
            borderRadius: 'lg'
          }
        },
        {
          id: 'education',
          name: 'Learning Path',
          component: 'Education',
          visible: true,
          order: 4,
          columns: 1,
          styles: { 
            alignment: 'left',
            spacing: 'normal',
            headerStyle: 'background',
            backgroundColor: '#edf2f7',
            borderRadius: 'lg'
          }
        },
        {
          id: 'skills',
          name: 'Creative Skills',
          component: 'Skills',
          visible: true,
          order: 5,
          columns: 1,
          styles: { 
            alignment: 'center', 
            display: 'tags',
            spacing: 'normal',
            headerStyle: 'background',
            backgroundColor: '#fed7d7',
            borderRadius: 'lg'
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
            backgroundColor: '#f7fafc',
            borderRadius: 'lg'
          }
        },
        {
          id: 'certifications',
          name: 'Recognition',
          component: 'Certifications',
          visible: true,
          order: 7,
          columns: 1,
          styles: { 
            alignment: 'left',
            spacing: 'normal',
            headerStyle: 'background',
            backgroundColor: '#edf2f7',
            borderRadius: 'lg'
          }
        }
      ],
      styles: {
        page: {
          margin: '0',
          padding: '0',
          background: '#ffffff',
          borderRadius: '16px',
          shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        },
        typography: {
          fontFamily: 'Playfair Display, serif',
          fontSize: {
            base: '12px',
            heading1: '32px',
            heading2: '20px',
            heading3: '16px',
            small: '11px',
            contactInfo: '12px',
            micro: '10px'
          },
          lineHeight: {
            tight: '1.2',
            normal: '1.6',
            relaxed: '1.8',
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
          primary: '#2d3748',
          secondary: '#4a5568',
          accent: '#e53e3e',
          text: '#2d3748',
          background: '#ffffff',
          muted: '#f7fafc',
          border: '#e2e8f0',
          success: '#48bb78',
          warning: '#ed8936',
          error: '#e53e3e',
          info: '#4299e1',
          surface: '#f7fafc',
          overlay: 'rgba(45, 55, 72, 0.8)'
        },
        spacing: {
          section: '40px',
          item: '20px',
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
            sm: '8px',
            md: '12px',
            lg: '16px',
            xl: '20px',
            full: '9999px'
          },
          shadow: {
            none: 'none',
            sm: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
            md: '0 8px 16px 0 rgba(0, 0, 0, 0.1)',
            lg: '0 16px 32px 0 rgba(0, 0, 0, 0.1)',
            xl: '0 24px 48px 0 rgba(0, 0, 0, 0.15)'
          }
        }
      }
    }
  }
];