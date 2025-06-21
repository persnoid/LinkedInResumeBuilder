import { ResumeTemplate } from '../types/resume';

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: 'modern-sidebar',
    name: 'Modern Sidebar',
    description: 'Two-column layout with dark sidebar for contact info and skills',
    category: 'modern',
    layout: 'double-column',
    colors: {
      primary: '#2563EB',
      secondary: '#1E40AF',
      accent: '#10B981',
      text: '#1F2937',
      background: '#FFFFFF',
      sidebar: '#1E293B',
      highlight: '#EFF6FF'
    },
    preview: '/templates/modern-sidebar.jpg'
  },
  {
    id: 'classic-centered',
    name: 'Classic Centered',
    description: 'Traditional academic format with centered header and clean typography',
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
    preview: '/templates/classic-centered.jpg'
  },
  {
    id: 'creative-grid',
    name: 'Creative Grid',
    description: 'Artistic grid layout with colorful sections and visual elements',
    category: 'creative',
    layout: 'creative-blocks',
    colors: {
      primary: '#8B5CF6',
      secondary: '#7C3AED',
      accent: '#F59E0B',
      text: '#1F2937',
      background: '#FFFFFF',
      highlight: '#FEF3C7'
    },
    preview: '/templates/creative-grid.jpg'
  },
  {
    id: 'timeline-visual',
    name: 'Timeline Visual',
    description: 'Chronological timeline with visual progression indicators',
    category: 'modern',
    layout: 'timeline',
    colors: {
      primary: '#DC2626',
      secondary: '#B91C1C',
      accent: '#F59E0B',
      text: '#1F2937',
      background: '#FFFFFF',
      timeline: '#FEE2E2'
    },
    preview: '/templates/timeline-visual.jpg'
  },
  {
    id: 'minimal-space',
    name: 'Minimal Space',
    description: 'Ultra-clean design with maximum white space and subtle typography',
    category: 'minimal',
    layout: 'minimal-spaced',
    colors: {
      primary: '#6B7280',
      secondary: '#4B5563',
      accent: '#10B981',
      text: '#1F2937',
      background: '#FFFFFF'
    },
    preview: '/templates/minimal-space.jpg'
  }
];