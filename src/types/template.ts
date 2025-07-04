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
    display?: 'list' | 'tags' | 'grid' | 'timeline' | 'cards';
    // Enhanced granular styling options
    padding?: string;
    margin?: string;
    backgroundColor?: string;
    borderRadius?: string;
    borderWidth?: string;
    borderColor?: string;
    borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
    shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    // Section-specific styling
    iconSize?: 'sm' | 'md' | 'lg' | 'xl';
    bulletStyle?: 'dot' | 'dash' | 'arrow' | 'square' | 'circle';
    headerStyle?: 'underline' | 'background' | 'border' | 'minimal';
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
    // Photo size control for PersonalInfo sections
    photoSize?: string;
    // Display parts control for PersonalInfo sections
    displayParts?: string[];
    // Contact layout control for PersonalInfo sections
    contactLayout?: 'column' | 'row' | 'grid';
    // Layout-specific options
    columns?: number;
    gap?: string;
    itemSpacing?: string;
  };
}

export interface TemplateLayout {
  id: string;
  name: string;
  type: 'single-column' | 'two-column' | 'three-column' | 'sidebar' | 'header-footer' | 'masonry' | 'timeline';
  sections: TemplateSection[];
  styles: {
    page: {
      margin: string;
      padding: string;
      background: string;
      borderRadius?: string;
      shadow?: string;
    };
    typography: {
      fontFamily: string;
      fontSize: {
        base: string;
        heading1: string;
        heading2: string;
        heading3: string;
        small: string;
        contactInfo: string;
        micro: string; // For very small text
      };
      lineHeight: {
        tight: string;
        normal: string;
        relaxed: string;
        loose: string; // For extra spacing
      };
      fontWeight: {
        light: string;
        normal: string;
        medium: string;
        semibold: string;
        bold: string;
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
      // Enhanced color palette
      success: string;
      warning: string;
      error: string;
      info: string;
      surface: string; // For cards/sections
      overlay: string; // For overlays/modals
    };
    spacing: {
      section: string;
      item: string;
      compact: string;
      contentPadding?: string;
      sidebarColumnPadding?: string;
      mainColumnPadding?: string;
      // Enhanced spacing options
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    // New styling categories
    effects: {
      borderRadius: {
        none: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        full: string;
      };
      shadow: {
        none: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
      };
    };
  };
}

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'classic' | 'creative' | 'minimal' | 'professional' | 'executive' | 'academic' | 'tech';
  layout: TemplateLayout;
  preview: string;
  customizable: {
    colors: boolean;
    fonts: boolean;
    spacing: boolean;
    sections: boolean;
    effects: boolean; // New customization category
  };
  // Enhanced template metadata
  tags: string[]; // For better filtering/search
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  industry: string[]; // Target industries
  features: string[]; // Special features this template offers
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
  | 'Portfolio'
  | 'Publications'
  | 'Volunteer'
  | 'Custom';

// Template rendering context
export interface TemplateContext {
  data: any;
  config: TemplateConfig;
  customizations: {
    colors?: Partial<TemplateLayout['styles']['colors']>;
    typography?: Partial<TemplateLayout['styles']['typography']>;
    spacing?: Partial<TemplateLayout['styles']['spacing']>;
    effects?: Partial<TemplateLayout['styles']['effects']>;
    sections?: Partial<Record<string, TemplateSection>>;
    sectionOrder?: string[]; // For reordering sections
    visibleSections?: string[]; // For toggling section visibility
  };
}

// New interfaces for advanced customization
export interface SectionCustomization {
  id: string;
  visible: boolean;
  order: number;
  styles: Partial<TemplateSection['styles']>;
}

export interface TemplateCustomizations {
  colors: Partial<TemplateLayout['styles']['colors']>;
  typography: Partial<TemplateLayout['styles']['typography']>;
  spacing: Partial<TemplateLayout['styles']['spacing']>;
  effects: Partial<TemplateLayout['styles']['effects']>;
  sections: Record<string, SectionCustomization>;
  layout: {
    type?: TemplateLayout['type'];
    columnWidths?: string[];
    gaps?: string[];
  };
}