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

// Re-export template types
export * from './template';

export interface DraftResume {
  id: string;
  name: string;
  resumeData: ResumeData;
  selectedTemplate: string;
  customizations: {
    colors?: {
      primary?: string;
      secondary?: string;
      accent?: string;
    };
    typography?: {
      fontFamily?: string;
    };
    spacing?: any;
    sections?: any;
  };
  createdAt: string;
  updatedAt: string;
  step: number; // Which step the user was on when they saved
}

export interface AppState {
  currentStep: number;
  resumeData: ResumeData;
  selectedTemplate: string;
  customizations: {
    colors?: {
      primary?: string;
      secondary?: string;
      accent?: string;
    };
    typography?: {
      fontFamily?: string;
    };
    spacing?: any;
    sections?: any;
  };
}