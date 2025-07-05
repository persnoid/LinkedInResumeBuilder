export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  photo?: string;
}

export interface Experience {
  id: string;
  position: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface Language {
  id: string;
  name: string;
  level: string;
}

// Comprehensive customizations interface
export interface Customizations {
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    surface?: string;
    muted?: string;
    text?: string;
    background?: string;
    border?: string;
    success?: string;
    warning?: string;
    error?: string;
    info?: string;
    overlay?: string;
  };
  typography?: {
    fontFamily?: string;
    fontSize?: {
      base?: string;
      heading1?: string;
      heading2?: string;
      heading3?: string;
      small?: string;
      contactInfo?: string;
      micro?: string;
    };
    lineHeight?: {
      tight?: string;
      normal?: string;
      relaxed?: string;
      loose?: string;
    };
    fontWeight?: {
      light?: string;
      normal?: string;
      medium?: string;
      semibold?: string;
      bold?: string;
    };
  };
  spacing?: {
    section?: string;
    item?: string;
    compact?: string;
    contentPadding?: string;
    sidebarColumnPadding?: string;
    mainColumnPadding?: string;
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    xxl?: string;
  };
  effects?: {
    borderRadius?: {
      none?: string;
      sm?: string;
      md?: string;
      lg?: string;
      xl?: string;
      full?: string;
    };
    shadow?: {
      none?: string;
      sm?: string;
      md?: string;
      lg?: string;
      xl?: string;
    };
  };
  sections?: Record<string, {
    id: string;
    name: string;
    component: string;
    visible: boolean;
    order: number;
    columns?: number;
    styles?: any;
  }>;
  // Additional customization options
  editMode?: boolean;
  onDataUpdate?: (data: any) => void;
  showConfirmation?: (options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
  }) => Promise<boolean>;
  sectionOrder?: string[];
  visibleSections?: string[];
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  languages?: Language[];
  customSections?: Record<string, {
    title: string;
    content: string;
  }>;
  customSections?: Record<string, {
    title: string;
    content: string;
  }>;
}

// Re-export template types
export * from './template';

export interface DraftResume {
  id: string;
  name: string;
  resumeData: ResumeData;
  selectedTemplate: string;
  customizations: Customizations;
  createdAt: string;
  updatedAt: string;
  step: number; // Which step the user was on when they saved
}

export interface AppState {
  currentStep: number;
  resumeData: ResumeData;
  selectedTemplate: string;
  customizations: Customizations;
}