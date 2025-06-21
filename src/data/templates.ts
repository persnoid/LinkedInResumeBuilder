import { ResumeTemplate } from '../types/resume';

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: 'double-column',
    name: 'Double Column',
    description: 'Two-column layout with sidebar for skills and main content area',
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
    id: 'ivy-league',
    name: 'Ivy League',
    description: 'Classic Harvard-style academic format with centered header and traditional sections',
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
    description: 'Modern dark theme with sophisticated contrast and elegant typography',
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
  },
  {
    id: 'creative-blocks',
    name: 'Creative Portfolio',
    description: 'Artistic layout with visual blocks and creative elements for designers',
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
    preview: '/templates/creative.jpg'
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'Ultra-clean design with maximum white space and minimal visual elements',
    category: 'minimal',
    layout: 'minimal-spaced',
    colors: {
      primary: '#6B7280',
      secondary: '#4B5563',
      accent: '#10B981',
      text: '#1F2937',
      background: '#FFFFFF'
    },
    preview: '/templates/minimal.jpg'
  },
  {
    id: 'timeline-focus',
    name: 'Timeline Focus',
    description: 'Chronological timeline layout emphasizing career progression with visual timeline',
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
    preview: '/templates/timeline.jpg'
  },
  {
    id: 'infographic-visual',
    name: 'Visual Infographic',
    description: 'Data-driven design with charts, graphs, and visual skill representations',
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
    id: 'profile-photo',
    name: 'Profile Plus',
    description: 'Professional layout featuring photo, comprehensive skills section, and modern design',
    category: 'modern',
    layout: 'profile-plus',
    colors: {
      primary: '#1E293B',
      secondary: '#0EA5E9',
      accent: '#0EA5E9',
      text: '#0F172A',
      background: '#FFFFFF',
      photoFrame: '#E2E8F0'
    },
    preview: '/templates/profile-plus.jpg'
  }
];