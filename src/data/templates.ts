import { ResumeTemplate } from '../types/resume';

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean lines with bold accents and modern typography',
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
    id: 'executive',
    name: 'Executive',
    description: 'Two-column layout with sidebar for senior professionals',
    category: 'classic',
    layout: 'two-column-sidebar',
    colors: {
      primary: '#1F2937',
      secondary: '#4B5563',
      accent: '#059669',
      text: '#111827',
      background: '#FFFFFF',
      sidebar: '#F9FAFB'
    },
    preview: '/templates/executive.jpg'
  },
  {
    id: 'creative',
    name: 'Creative Portfolio',
    description: 'Artistic layout with visual elements for creative professionals',
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
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Ultra-clean design with maximum white space',
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
    id: 'tech',
    name: 'Tech Developer',
    description: 'Code-inspired design with monospace elements',
    category: 'modern',
    layout: 'tech-grid',
    colors: {
      primary: '#0F172A',
      secondary: '#1E293B',
      accent: '#06B6D4',
      text: '#1F2937',
      background: '#FFFFFF',
      code: '#F1F5F9'
    },
    preview: '/templates/tech.jpg'
  },
  {
    id: 'timeline',
    name: 'Timeline Focus',
    description: 'Chronological timeline layout emphasizing career progression',
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
    id: 'academic',
    name: 'Academic Scholar',
    description: 'Traditional academic format with publication focus',
    category: 'classic',
    layout: 'academic',
    colors: {
      primary: '#1E40AF',
      secondary: '#3730A3',
      accent: '#059669',
      text: '#1F2937',
      background: '#FFFFFF'
    },
    preview: '/templates/academic.jpg'
  },
  {
    id: 'infographic',
    name: 'Visual Infographic',
    description: 'Data-driven design with charts and visual elements',
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
    id: 'compact',
    name: 'Compact Dense',
    description: 'Maximum information density for experienced professionals',
    category: 'minimal',
    layout: 'compact',
    colors: {
      primary: '#374151',
      secondary: '#6B7280',
      accent: '#EF4444',
      text: '#1F2937',
      background: '#FFFFFF'
    },
    preview: '/templates/compact.jpg'
  },
  {
    id: 'elegant',
    name: 'Elegant Serif',
    description: 'Sophisticated serif typography with classic elegance',
    category: 'classic',
    layout: 'elegant-serif',
    colors: {
      primary: '#1E293B',
      secondary: '#475569',
      accent: '#0EA5E9',
      text: '#0F172A',
      background: '#FFFFFF'
    },
    preview: '/templates/elegant.jpg'
  }
];