import React from 'react';
import { PageTemplate } from '../../types/pageTemplate';

interface StylePanelProps {
  template: PageTemplate;
  onUpdateTemplate: (template: PageTemplate) => void;
  onAddToHistory: () => void;
}

export const StylePanel: React.FC<StylePanelProps> = ({
  template,
  onUpdateTemplate,
  onAddToHistory
}) => {
  const handleStyleChange = (category: string, key: string, value: any) => {
    onAddToHistory();
    
    const updatedTemplate = { ...template };
    
    if (category === 'layout') {
      updatedTemplate.layout = { ...updatedTemplate.layout, [key]: value };
    } else if (category === 'styles') {
      updatedTemplate.styles = { ...updatedTemplate.styles, [key]: value };
    } else if (category === 'responsive') {
      updatedTemplate.layout.responsive = { ...updatedTemplate.layout.responsive, [key]: value };
    }
    
    onUpdateTemplate(updatedTemplate);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Global Styles</h3>
        
        {/* Layout Settings */}
        <div className="space-y-4 mb-6">
          <h4 className="font-medium text-gray-900">Layout</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sidebar Position</label>
            <select
              value={template.layout.sidebarPosition}
              onChange={(e) => handleStyleChange('layout', 'sidebarPosition', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
              <option value="none">No Sidebar</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sidebar Width</label>
            <input
              type="text"
              value={template.layout.sidebarWidth}
              onChange={(e) => handleStyleChange('layout', 'sidebarWidth', e.target.value)}
              placeholder="300px"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Width</label>
            <input
              type="text"
              value={template.layout.maxWidth}
              onChange={(e) => handleStyleChange('layout', 'maxWidth', e.target.value)}
              placeholder="1200px"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Spacing</label>
            <input
              type="text"
              value={template.layout.spacing}
              onChange={(e) => handleStyleChange('layout', 'spacing', e.target.value)}
              placeholder="24px"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Color Settings */}
        <div className="space-y-4 mb-6">
          <h4 className="font-medium text-gray-900">Colors</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
              <input
                type="color"
                value={template.styles.backgroundColor}
                onChange={(e) => handleStyleChange('styles', 'backgroundColor', e.target.value)}
                className="w-full h-10 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
              <input
                type="color"
                value={template.styles.primaryColor}
                onChange={(e) => handleStyleChange('styles', 'primaryColor', e.target.value)}
                className="w-full h-10 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
              <input
                type="color"
                value={template.styles.secondaryColor}
                onChange={(e) => handleStyleChange('styles', 'secondaryColor', e.target.value)}
                className="w-full h-10 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
              <input
                type="color"
                value={template.styles.accentColor}
                onChange={(e) => handleStyleChange('styles', 'accentColor', e.target.value)}
                className="w-full h-10 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Typography Settings */}
        <div className="space-y-4 mb-6">
          <h4 className="font-medium text-gray-900">Typography</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
            <select
              value={template.styles.fontFamily}
              onChange={(e) => handleStyleChange('styles', 'fontFamily', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Inter, sans-serif">Inter</option>
              <option value="Roboto, sans-serif">Roboto</option>
              <option value="Open Sans, sans-serif">Open Sans</option>
              <option value="Lato, sans-serif">Lato</option>
              <option value="Playfair Display, serif">Playfair Display</option>
              <option value="Merriweather, serif">Merriweather</option>
            </select>
          </div>
        </div>

        {/* Responsive Settings */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Responsive</h4>
          
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={template.layout.responsive.hideSidebarOnMobile}
                onChange={(e) => handleStyleChange('responsive', 'hideSidebarOnMobile', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Hide sidebar on mobile</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={template.layout.responsive.stackOnMobile}
                onChange={(e) => handleStyleChange('responsive', 'stackOnMobile', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Stack sections on mobile</span>
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Breakpoint</label>
            <input
              type="text"
              value={template.layout.responsive.mobileBreakpoint}
              onChange={(e) => handleStyleChange('responsive', 'mobileBreakpoint', e.target.value)}
              placeholder="768px"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};