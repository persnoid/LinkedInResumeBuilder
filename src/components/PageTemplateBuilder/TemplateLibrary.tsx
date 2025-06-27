import React, { useState } from 'react';
import { X, Search, FileText, Image, Video, List, Mail, Users, Layout, Grid } from 'lucide-react';
import { SectionTemplate } from '../../types/pageTemplate';

interface TemplateLibraryProps {
  onSelectSection: (template: any) => void;
  onSelectWidget: (template: any) => void;
  onClose: () => void;
}

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({
  onSelectSection,
  onSelectWidget,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'sections' | 'widgets'>('sections');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const sectionTemplates = [
    {
      id: 'hero-text',
      name: 'Hero Text',
      description: 'Large heading with subtitle text',
      type: 'text',
      category: 'content',
      icon: FileText,
      defaultContent: {
        html: '<h1 class="text-4xl font-bold mb-4">Welcome to Our Site</h1><p class="text-xl text-gray-600">This is a compelling subtitle that describes what we do.</p>'
      },
      defaultStyles: {
        width: 'full',
        background: '#ffffff',
        padding: '48px 24px',
        margin: '0',
        borderRadius: '0px',
        shadow: 'none',
        textAlign: 'center' as const,
        minHeight: '200px'
      }
    },
    {
      id: 'image-gallery',
      name: 'Image Gallery',
      description: 'Responsive image display',
      type: 'image',
      category: 'media',
      icon: Image,
      defaultContent: {
        src: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
        alt: 'Sample image'
      },
      defaultStyles: {
        width: 'full',
        background: '#ffffff',
        padding: '24px',
        margin: '16px 0',
        borderRadius: '8px',
        shadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center' as const,
        minHeight: '300px'
      }
    },
    {
      id: 'video-embed',
      name: 'Video Player',
      description: 'Embedded video content',
      type: 'video',
      category: 'media',
      icon: Video,
      defaultContent: {
        src: ''
      },
      defaultStyles: {
        width: 'full',
        background: '#ffffff',
        padding: '24px',
        margin: '16px 0',
        borderRadius: '8px',
        shadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center' as const,
        minHeight: '400px'
      }
    },
    {
      id: 'contact-form',
      name: 'Contact Form',
      description: 'Simple contact form',
      type: 'form',
      category: 'interactive',
      icon: Mail,
      defaultContent: {
        fields: [
          { type: 'text', label: 'Name', placeholder: 'Your name' },
          { type: 'email', label: 'Email', placeholder: 'your@email.com' },
          { type: 'textarea', label: 'Message', placeholder: 'Your message' }
        ]
      },
      defaultStyles: {
        width: 'full',
        background: '#f9fafb',
        padding: '32px',
        margin: '16px 0',
        borderRadius: '12px',
        shadow: '0 4px 6px rgba(0,0,0,0.1)',
        textAlign: 'left' as const,
        minHeight: '300px'
      }
    },
    {
      id: 'two-column-text',
      name: 'Two Column Text',
      description: 'Side-by-side text content',
      type: 'text',
      category: 'layout',
      icon: Layout,
      defaultContent: {
        html: '<div class="grid grid-cols-2 gap-8"><div><h3 class="text-xl font-semibold mb-4">Left Column</h3><p>Content for the left side goes here.</p></div><div><h3 class="text-xl font-semibold mb-4">Right Column</h3><p>Content for the right side goes here.</p></div></div>'
      },
      defaultStyles: {
        width: 'full',
        background: '#ffffff',
        padding: '32px',
        margin: '16px 0',
        borderRadius: '8px',
        shadow: 'none',
        textAlign: 'left' as const,
        minHeight: '200px'
      }
    },
    {
      id: 'feature-grid',
      name: 'Feature Grid',
      description: 'Grid layout for features',
      type: 'text',
      category: 'layout',
      icon: Grid,
      defaultContent: {
        html: '<div class="grid grid-cols-3 gap-6"><div class="text-center"><div class="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-4"></div><h4 class="font-semibold mb-2">Feature 1</h4><p class="text-sm text-gray-600">Description of feature 1</p></div><div class="text-center"><div class="w-12 h-12 bg-green-500 rounded-full mx-auto mb-4"></div><h4 class="font-semibold mb-2">Feature 2</h4><p class="text-sm text-gray-600">Description of feature 2</p></div><div class="text-center"><div class="w-12 h-12 bg-purple-500 rounded-full mx-auto mb-4"></div><h4 class="font-semibold mb-2">Feature 3</h4><p class="text-sm text-gray-600">Description of feature 3</p></div></div>'
      },
      defaultStyles: {
        width: 'full',
        background: '#ffffff',
        padding: '48px 24px',
        margin: '16px 0',
        borderRadius: '8px',
        shadow: 'none',
        textAlign: 'center' as const,
        minHeight: '250px'
      }
    }
  ];

  const widgetTemplates = [
    {
      id: 'text-widget',
      name: 'Text Widget',
      description: 'Simple text content',
      type: 'text',
      category: 'content',
      icon: FileText,
      defaultContent: {
        html: '<p>This is a text widget. You can add any content here.</p>'
      },
      defaultStyles: {
        background: '#ffffff',
        padding: '16px',
        margin: '8px 0',
        borderRadius: '8px',
        shadow: '0 2px 4px rgba(0,0,0,0.1)'
      }
    },
    {
      id: 'navigation-list',
      name: 'Navigation List',
      description: 'List of navigation links',
      type: 'list',
      category: 'navigation',
      icon: List,
      defaultContent: {
        items: ['Home', 'About', 'Services', 'Contact']
      },
      defaultStyles: {
        background: '#f9fafb',
        padding: '16px',
        margin: '8px 0',
        borderRadius: '8px',
        shadow: 'none'
      }
    },
    {
      id: 'contact-info',
      name: 'Contact Info',
      description: 'Contact information display',
      type: 'contact',
      category: 'contact',
      icon: Mail,
      defaultContent: {
        email: 'contact@example.com',
        phone: '+1 (555) 123-4567',
        address: '123 Main St, City, State 12345'
      },
      defaultStyles: {
        background: '#ffffff',
        padding: '16px',
        margin: '8px 0',
        borderRadius: '8px',
        shadow: '0 2px 4px rgba(0,0,0,0.1)'
      }
    },
    {
      id: 'social-links',
      name: 'Social Links',
      description: 'Social media links',
      type: 'list',
      category: 'social',
      icon: Users,
      defaultContent: {
        items: ['Facebook', 'Twitter', 'LinkedIn', 'Instagram']
      },
      defaultStyles: {
        background: '#1f2937',
        padding: '16px',
        margin: '8px 0',
        borderRadius: '8px',
        shadow: '0 2px 4px rgba(0,0,0,0.1)'
      }
    },
    {
      id: 'image-widget',
      name: 'Image Widget',
      description: 'Single image display',
      type: 'image',
      category: 'media',
      icon: Image,
      defaultContent: {
        src: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
        alt: 'Widget image'
      },
      defaultStyles: {
        background: '#ffffff',
        padding: '8px',
        margin: '8px 0',
        borderRadius: '8px',
        shadow: '0 2px 4px rgba(0,0,0,0.1)'
      }
    }
  ];

  const currentTemplates = activeTab === 'sections' ? sectionTemplates : widgetTemplates;
  const categories = ['all', ...new Set(currentTemplates.map(t => t.category))];

  const filteredTemplates = currentTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectTemplate = (template: any) => {
    if (activeTab === 'sections') {
      onSelectSection(template);
    } else {
      onSelectWidget(template);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Template Library</h2>
            <p className="text-gray-600">Choose from pre-built sections and widgets</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('sections')}
              className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'sections'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Sections ({sectionTemplates.length})
            </button>
            <button
              onClick={() => setActiveTab('widgets')}
              className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'widgets'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Widgets ({widgetTemplates.length})
            </button>
          </nav>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 280px)' }}>
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No templates found</p>
              <p className="text-sm">Try adjusting your search or category filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleSelectTemplate(template)}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <template.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <p className="text-xs text-gray-500 capitalize">{template.category}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">
                      {template.type}
                    </span>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Add →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};