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

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  languages?: Language[];
}

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'classic' | 'creative' | 'minimal';
  layout: 'single-column' | 'two-column-sidebar' | 'creative-blocks' | 'minimal-spaced' | 'tech-grid' | 'timeline' | 'academic' | 'infographic' | 'compact' | 'elegant-serif' | 'skill-focus' | 'profile-plus' | 'compact-connection' | 'pathfinder' | 'essence-of-you' | 'vibrant-view' | 'double-column' | 'ivy-league' | 'elegant-dark';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
    sidebar?: string;
    highlight?: string;
    code?: string;
    timeline?: string;
    chart?: string;
    photoFrame?: string;
    subtle?: string;
    vibrant?: string;
  };
  preview: string;
}

export interface AppState {
  currentStep: number;
  resumeData: ResumeData;
  selectedTemplate: string;
  customizations: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
    };
    font: string;
    sectionOrder: string[];
  };
}