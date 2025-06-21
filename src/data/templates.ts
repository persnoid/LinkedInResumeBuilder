import { ResumeTemplate } from '../types/resume';

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: 'modern-two-column',
    name: 'Modern Two-Column',
    description: 'Professional two-column layout with sidebar for contact info and skills, main area for experience and education',
    category: 'modern',
    layout: 'double-column',
    colors: {
      primary: '#2563EB',
      secondary: '#1E40AF',
      accent: '#3B82F6',
      text: '#1F2937',
      background: '#FFFFFF',
      sidebar: '#F8FAFC',
      highlight: '#EFF6FF'
    },
    preview: '/templates/modern-two-column.jpg'
  },
  {
    id: 'classic-centered',
    name: 'Classic Centered',
    description: 'Traditional centered layout with clean typography and professional formatting',
    category: 'classic',
    layout: 'ivy-league',
    colors: {
      primary: '#1F2937',
      secondary: '#6B7280',
      accent: '#3B82F6',
      text: '#111827',
      background: '#FFFFFF',
      subtle: '#F9FAFB'
    },
    preview: '/templates/classic-centered.jpg'
  }
];