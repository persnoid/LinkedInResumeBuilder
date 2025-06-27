import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Eye, EyeOff, Settings, GripVertical } from 'lucide-react';
import { PageSection } from '../../types/pageTemplate';

interface SectionEditorProps {
  sections: PageSection[];
  selectedSection: string | null;
  onSelectSection: (sectionId: string | null) => void;
  onUpdateSection: (sectionId: string, updates: Partial<PageSection>) => void;
  onRemoveSection: (sectionId: string) => void;
  onAddSection: () => void;
}

export const SectionEditor: React.FC<SectionEditorProps> = ({
  sections,
  selectedSection,
  onSelectSection,
  onUpdateSection,
  onRemoveSection,
  onAddSection
}) => {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [showStylePanel, setShowStylePanel] = useState<string | null>(null);

  const handleToggleVisibility = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      onUpdateSection(sectionId, { visible: !section.visible });
    }
  };

  const handleUpdateContent = (sectionId: string, content: any) => {
    onUpdateSection(sectionId, { content });
  };

  const handleUpdateStyles = (sectionId: string, styles: Partial<PageSection['styles']>) => {
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      onUpdateSection(sectionId, { 
        styles: { ...section.styles, ...styles } 
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Main Sections</h3>
        <button
          onClick={onAddSection}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
          title="Add Section"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {sections.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <p className="font-medium">No sections yet</p>
          <p className="text-sm">Add your first section to get started</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sections
            .sort((a, b) => a.order - b.order)
            .map((section) => (
              <div
                key={section.id}
                className={`
                  border rounded-lg p-3 cursor-pointer transition-all
                  ${selectedSection === section.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                  ${!section.visible ? 'opacity-50' : ''}
                `}
                onClick={() => onSelectSection(section.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <div>
                      <h4 className="font-medium text-gray-900">{section.title}</h4>
                      <p className="text-xs text-gray-500 capitalize">{section.type} section</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleVisibility(section.id);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title={section.visible ? 'Hide section' : 'Show section'}
                    >
                      {section.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowStylePanel(showStylePanel === section.id ? null : section.id);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="Style settings"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingSection(editingSection === section.id ? null : section.id);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="Edit content"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Are you sure you want to remove this section?')) {
                          onRemoveSection(section.id);
                        }
                      }}
                      className="p-1 text-red-400 hover:text-red-600"
                      title="Remove section"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content Editor */}
                {editingSection === section.id && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <SectionContentEditor
                      section={section}
                      onUpdateContent={(content) => handleUpdateContent(section.id, content)}
                    />
                  </div>
                )}

                {/* Style Panel */}
                {showStylePanel === section.id && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <SectionStyleEditor
                      section={section}
                      onUpdateStyles={(styles) => handleUpdateStyles(section.id, styles)}
                    />
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

// Section Content Editor Component
const SectionContentEditor: React.FC<{
  section: PageSection;
  onUpdateContent: (content: any) => void;
}> = ({ section, onUpdateContent }) => {
  const [content, setContent] = useState(section.content);

  const handleSave = () => {
    onUpdateContent(content);
  };

  return (
    <div className="space-y-3">
      <h5 className="font-medium text-gray-900">Edit Content</h5>
      
      {section.type === 'text' && (
        <div>
          <textarea
            value={content.html || ''}
            onChange={(e) => setContent({ ...content, html: e.target.value })}
            placeholder="Enter your text content..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            rows={4}
          />
        </div>
      )}
      
      {section.type === 'image' && (
        <div className="space-y-2">
          <input
            type="url"
            value={content.src || ''}
            onChange={(e) => setContent({ ...content, src: e.target.value })}
            placeholder="Image URL"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <input
            type="text"
            value={content.alt || ''}
            onChange={(e) => setContent({ ...content, alt: e.target.value })}
            placeholder="Alt text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
      )}
      
      {section.type === 'video' && (
        <div>
          <input
            type="url"
            value={content.src || ''}
            onChange={(e) => setContent({ ...content, src: e.target.value })}
            placeholder="Video URL"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
      )}
      
      <button
        onClick={handleSave}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
      >
        Save Changes
      </button>
    </div>
  );
};

// Section Style Editor Component
const SectionStyleEditor: React.FC<{
  section: PageSection;
  onUpdateStyles: (styles: Partial<PageSection['styles']>) => void;
}> = ({ section, onUpdateStyles }) => {
  const [styles, setStyles] = useState(section.styles);

  const handleStyleChange = (key: keyof PageSection['styles'], value: any) => {
    const newStyles = { ...styles, [key]: value };
    setStyles(newStyles);
    onUpdateStyles(newStyles);
  };

  return (
    <div className="space-y-3">
      <h5 className="font-medium text-gray-900">Style Settings</h5>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Width</label>
          <select
            value={styles.width}
            onChange={(e) => handleStyleChange('width', e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
          >
            <option value="full">Full Width</option>
            <option value="half">Half Width</option>
            <option value="third">One Third</option>
            <option value="quarter">One Quarter</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Text Align</label>
          <select
            value={styles.textAlign}
            onChange={(e) => handleStyleChange('textAlign', e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Background</label>
          <input
            type="color"
            value={styles.background}
            onChange={(e) => handleStyleChange('background', e.target.value)}
            className="w-full h-8 border border-gray-300 rounded"
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Padding</label>
          <input
            type="text"
            value={styles.padding}
            onChange={(e) => handleStyleChange('padding', e.target.value)}
            placeholder="16px"
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Margin</label>
          <input
            type="text"
            value={styles.margin}
            onChange={(e) => handleStyleChange('margin', e.target.value)}
            placeholder="8px"
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Border Radius</label>
          <input
            type="text"
            value={styles.borderRadius}
            onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
            placeholder="8px"
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
          />
        </div>
      </div>
      
      {styles.width === 'custom' && (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Custom Width</label>
          <input
            type="text"
            value={styles.customWidth || ''}
            onChange={(e) => handleStyleChange('customWidth', e.target.value)}
            placeholder="300px or 50%"
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
          />
        </div>
      )}
    </div>
  );
};