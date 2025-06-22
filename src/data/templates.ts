import { ResumeTemplate } from '../types/resume';

export const resumeTemplates: ResumeTemplate[] = [
  // New templates based on provided images
  {
    id: 'green-organic-sidebar',
    name: 'Green Organic Sidebar',
    description: 'Modern design with organic green shapes and clean sidebar layout, perfect for creative and environmental roles',
    category: 'creative',
    layout: 'double-column',
    colors: {
      primary: '#10B981',
      secondary: '#059669',
      accent: '#34D399',
      text: '#1F2937',
      background: '#FFFFFF',
      sidebar: '#F0FDF4',
      highlight: '#ECFDF5'
    },
    preview: '/templates/green-organic-sidebar.jpg'
  },
  {
    id: 'navy-header-professional',
    name: 'Navy Header Professional',
    description: 'Executive template with navy header section and clean two-column content layout for senior professionals',
    category: 'modern',
    layout: 'double-column',
    colors: {
      primary: '#1E293B',
      secondary: '#475569',
      accent: '#60A5FA',
      text: '#1F2937',
      background: '#FFFFFF',
      sidebar: '#1E293B',
      highlight: '#F1F5F9'
    },
    preview: '/templates/navy-header-professional.jpg'
  },
  {
    id: 'orange-timeline-modern',
    name: 'Orange Timeline Modern',
    description: 'Contemporary design with orange accents and timeline-style layout, ideal for dynamic professionals',
    category: 'modern',
    layout: 'ivy-league',
    colors: {
      primary: '#1E293B',
      secondary: '#475569',
      accent: '#F97316',
      text: '#1F2937',
      background: '#FFFFFF',
      subtle: '#FFF7ED'
    },
    preview: '/templates/orange-timeline-modern.jpg'
  },
  {
    id: 'blue-sidebar-clean',
    name: 'Blue Sidebar Clean',
    description: 'Clean and professional with blue accents and organized sidebar for skills and achievements',
    category: 'modern',
    layout: 'double-column',
    colors: {
      primary: '#1E40AF',
      secondary: '#3B82F6',
      accent: '#60A5FA',
      text: '#1F2937',
      background: '#FFFFFF',
      sidebar: '#EFF6FF',
      highlight: '#DBEAFE'
    },
    preview: '/templates/blue-sidebar-clean.jpg'
  },
  {
    id: 'soft-blue-elegant',
    name: 'Soft Blue Elegant',
    description: 'Elegant design with soft blue tones and flowing layout elements, perfect for sophisticated professionals',
    category: 'minimal',
    layout: 'ivy-league',
    colors: {
      primary: '#1E40AF',
      secondary: '#6B7280',
      accent: '#93C5FD',
      text: '#374151',
      background: '#FFFFFF',
      subtle: '#F0F9FF'
    },
    preview: '/templates/soft-blue-elegant.jpg'
  },
  // Existing templates
  {
    id: 'green-modern-sidebar',
    name: 'Green Modern Sidebar',
    description: 'Clean two-column layout with green accents and modern typography, perfect for creative professionals',
    category: 'modern',
    layout: 'double-column',
    colors: {
      primary: '#10B981',
      secondary: '#059669',
      accent: '#34D399',
      text: '#1F2937',
      background: '#FFFFFF',
      sidebar: '#F0FDF4',
      highlight: '#ECFDF5'
    },
    preview: '/templates/green-modern-sidebar.jpg'
  },
  {
    id: 'teal-professional',
    name: 'Teal Professional',
    description: 'Professional design with teal sidebar and clean white main area, ideal for corporate roles',
    category: 'modern',
    layout: 'double-column',
    colors: {
      primary: '#0F766E',
      secondary: '#14B8A6',
      accent: '#5EEAD4',
      text: '#FFFFFF',
      background: '#FFFFFF',
      sidebar: '#0F766E',
      highlight: '#F0FDFA'
    },
    preview: '/templates/teal-professional.jpg'
  },
  {
    id: 'navy-executive',
    name: 'Navy Executive',
    description: 'Executive-level template with navy sidebar and professional white content area',
    category: 'modern',
    layout: 'double-column',
    colors: {
      primary: '#1E293B',
      secondary: '#334155',
      accent: '#60A5FA',
      text: '#FFFFFF',
      background: '#FFFFFF',
      sidebar: '#1E293B',
      highlight: '#F1F5F9'
    },
    preview: '/templates/navy-executive.jpg'
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'Ultra-clean minimal design with subtle borders and maximum readability',
    category: 'minimal',
    layout: 'ivy-league',
    colors: {
      primary: '#374151',
      secondary: '#6B7280',
      accent: '#3B82F6',
      text: '#111827',
      background: '#FFFFFF',
      subtle: '#F9FAFB'
    },
    preview: '/templates/minimal-clean.jpg'
  },
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