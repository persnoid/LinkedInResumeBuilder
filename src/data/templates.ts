import { ResumeTemplate } from '../types/resume';

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean single-column layout with bold accents and modern typography',
    category: 'modern',
    layout: 'single-column',
    colors: {
      primary: '#3B82F6',
      secondary: '#1E40AF',
      accent: '#10B981',
      text: '#1F2937',
      background: '#FFFFFF'
    },
    preview: '/templates/modern.jpg'
  },
  {
    id: 'double-column',
    name: 'Double Column',
    description: 'Two-column layout with dedicated sidebar for skills and contact information',
    category: 'modern',
    layout: 'double-column',
    colors: {
      primary: '#2563EB',
      secondary: '#1E40AF',
      accent: '#10B981',
      text: '#1F2937',
      background: '#FFFFFF',
      sidebar: '#F8FAFC',
      highlight: '#EFF6FF'
    },
    preview: '/templates/double-column.jpg'
  },
  {
    id: 'timeline',
    name: 'Timeline Focus',
    description: 'Unique chronological timeline layout with visual career progression indicators',
    category: 'creative',
    layout: 'timeline',
    colors: {
      primary: '#DC2626',
      secondary: '#B91C1C',
      accent: '#F59E0B',
      text: '#1F2937',
      background: '#FFFFFF',
      timeline: '#FEE2E2'
    },
    preview: '/templates/timeline.jpg'
  },
  {
    id: 'infographic',
    name: 'Visual Infographic',
    description: 'Data-driven design with charts, visual skill indicators, and infographic elements',
    category: 'creative',
    layout: 'infographic',
    colors: {
      primary: '#F59E0B',
      secondary: '#D97706',
      accent: '#10B981',
      text: '#1F2937',
      background: '#FFFFFF',
      chart: '#FEF3C7'
    },
    preview: '/templates/infographic.jpg'
  },
  {
    id: 'ivy-league',
    name: 'Ivy League',
    description: 'Classic academic format with centered header and traditional typography',
    category: 'classic',
    layout: 'ivy-league',
    colors: {
      primary: '#1F2937',
      secondary: '#374151',
      accent: '#3B82F6',
      text: '#111827',
      background: '#FFFFFF',
      subtle: '#F9FAFB'
    },
    preview: '/templates/ivy-league.jpg'
  },
  {
    id: 'elegant-dark',
    name: 'Elegant Dark',
    description: 'Modern dark theme with light text on dark background and elegant styling',
    category: 'modern',
    layout: 'elegant-dark',
    colors: {
      primary: '#FFFFFF',
      secondary: '#E5E7EB',
      accent: '#60A5FA',
      text: '#FFFFFF',
      background: '#1E293B',
      sidebar: '#334155',
      highlight: '#475569'
    },
    preview: '/templates/elegant-dark.jpg'
  }
];