// Enhanced template system based on Reactive Resume architecture
export interface TemplateSection {
  id: string;
  name: string;
  component: string;
  visible: boolean;
  order: number;
  columns?: number;
  styles?: {
    spacing?: 'compact' | 'normal' | 'relaxed';
    alignment?: 'left' | 'center' | 'right';
    divider?: boolean;
  };
}

export interface TemplateLayout {
  id: string;
  name: string;
  type: 'single-column' | 'two-column' | 'three-column' | 'sidebar' | 'header-footer';
  sections: TemplateSection[];
  styles: {
    page: {
      margin: string;
      padding: string;
      background: string;
    };
    typography: {
      fontFamily: string;
      fontSize: {
        base: string;
        heading1: string;
        heading2: string;
        heading3: string;
        small: string;
      };
      lineHeight: {
        tight: string;
        normal: string;
        relaxed: string;
      };
    };
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      text: string;
      background: string;
      muted: string;
      border: string;
    };
    spacing: {
      section: string;
      item: string;
      compact: string;
    };
  };
}

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'classic' | 'creative' | 'minimal' | 'professional';
  layout: TemplateLayout;
  preview: string;
  customizable: {
    colors: boolean;
    fonts: boolean;
    spacing: boolean;
    sections: boolean;
  };
}

// Section component types
export type SectionComponent = 
  | 'PersonalInfo'
  | 'Summary'
  | 'Experience'
  | 'Education'
  | 'Skills'
  | 'Languages'
  | 'Certifications'
  | 'Projects'
  | 'Awards'
  | 'References'
  | 'Custom';

// Template rendering context
export interface TemplateContext {
  data: any;
  config: TemplateConfig;
  customizations: {
    colors?: Partial<TemplateLayout['styles']['colors']>;
    typography?: Partial<TemplateLayout['styles']['typography']>;
    spacing?: Partial<TemplateLayout['styles']['spacing']>;
    sections?: Partial<Record<string, TemplateSection>>;
  };
}