import React, { useState } from 'react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { PageTemplate } from '../../types/pageTemplate';

interface PreviewModeProps {
  template: PageTemplate;
}

export const PreviewMode: React.FC<PreviewModeProps> = ({ template }) => {
  const [viewportSize, setViewportSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const getViewportStyles = () => {
    switch (viewportSize) {
      case 'tablet':
        return { width: '768px', height: '1024px' };
      case 'mobile':
        return { width: '375px', height: '667px' };
      default:
        return { width: '100%', height: '100%' };
    }
  };

  const shouldHideSidebar = () => {
    return (viewportSize === 'mobile' || viewportSize === 'tablet') && 
           template.layout.responsive.hideSidebarOnMobile;
  };

  const shouldStack = () => {
    return (viewportSize === 'mobile' || viewportSize === 'tablet') && 
           template.layout.responsive.stackOnMobile;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
        
        {/* Viewport Controls */}
        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewportSize('desktop')}
            className={`p-2 rounded-md transition-colors ${
              viewportSize === 'desktop' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Desktop view"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewportSize('tablet')}
            className={`p-2 rounded-md transition-colors ${
              viewportSize === 'tablet' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Tablet view"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewportSize('mobile')}
            className={`p-2 rounded-md transition-colors ${
              viewportSize === 'mobile' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Mobile view"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Container */}
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-100 p-4">
        <div 
          className="mx-auto bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300"
          style={getViewportStyles()}
        >
          <div 
            className={`
              ${shouldStack() ? 'flex flex-col' : 'flex'} 
              ${template.layout.sidebarPosition === 'right' && !shouldStack() ? 'flex-row-reverse' : ''}
              h-full
            `}
            style={{ 
              fontFamily: template.styles.fontFamily,
              backgroundColor: template.styles.backgroundColor 
            }}
          >
            {/* Main Content */}
            <div 
              className={`${shouldStack() ? 'w-full' : 'flex-1'} overflow-y-auto`}
              style={{ padding: template.layout.spacing }}
            >
              {template.mainSections
                .filter(section => section.visible)
                .sort((a, b) => a.order - b.order)
                .map((section) => (
                  <div
                    key={section.id}
                    className="mb-4"
                    style={{
                      backgroundColor: section.styles.background,
                      padding: section.styles.padding,
                      margin: section.styles.margin,
                      borderRadius: section.styles.borderRadius,
                      boxShadow: section.styles.shadow,
                      textAlign: section.styles.textAlign,
                      minHeight: section.styles.minHeight
                    }}
                  >
                    <h3 className="font-semibold mb-2" style={{ color: template.styles.primaryColor }}>
                      {section.title}
                    </h3>
                    <div className="text-sm text-gray-600">
                      {section.type === 'text' && (
                        <div dangerouslySetInnerHTML={{ __html: section.content.html || 'Sample content...' }} />
                      )}
                      {section.type === 'image' && (
                        <div className="bg-gray-200 h-32 flex items-center justify-center rounded">
                          Image Content
                        </div>
                      )}
                      {section.type === 'video' && (
                        <div className="bg-gray-200 h-40 flex items-center justify-center rounded">
                          Video Content
                        </div>
                      )}
                      {section.type === 'form' && (
                        <div className="space-y-2">
                          <div className="h-8 bg-gray-100 rounded"></div>
                          <div className="h-8 bg-gray-100 rounded"></div>
                          <div className="h-16 bg-gray-100 rounded"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>

            {/* Sidebar */}
            {template.layout.sidebarPosition !== 'none' && !shouldHideSidebar() && (
              <div 
                className={`
                  ${shouldStack() ? 'w-full border-t' : 'border-l'} 
                  border-gray-200 bg-gray-50 overflow-y-auto
                `}
                style={{ 
                  width: shouldStack() ? '100%' : template.layout.sidebarWidth,
                  padding: template.layout.spacing 
                }}
              >
                {template.sidebarWidgets
                  .filter(widget => widget.visible)
                  .sort((a, b) => a.order - b.order)
                  .map((widget) => (
                    <div
                      key={widget.id}
                      className="mb-4"
                      style={{
                        backgroundColor: widget.styles.background,
                        padding: widget.styles.padding,
                        margin: widget.styles.margin,
                        borderRadius: widget.styles.borderRadius,
                        boxShadow: widget.styles.shadow
                      }}
                    >
                      <h4 className="font-medium mb-2 text-sm" style={{ color: template.styles.primaryColor }}>
                        {widget.title}
                      </h4>
                      <div className="text-xs text-gray-600">
                        Widget content preview
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Info */}
      <div className="text-xs text-gray-500 space-y-1">
        <div>Viewport: {viewportSize} ({getViewportStyles().width})</div>
        <div>Sections: {template.mainSections.filter(s => s.visible).length} visible</div>
        <div>Widgets: {template.sidebarWidgets.filter(w => w.visible).length} visible</div>
        {shouldHideSidebar() && <div>Sidebar: Hidden on {viewportSize}</div>}
        {shouldStack() && <div>Layout: Stacked on {viewportSize}</div>}
      </div>
    </div>
  );
};