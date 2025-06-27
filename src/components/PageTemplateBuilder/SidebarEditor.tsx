import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Eye, EyeOff, Settings, GripVertical, ChevronDown, ChevronRight } from 'lucide-react';
import { SidebarWidget } from '../../types/pageTemplate';

interface SidebarEditorProps {
  widgets: SidebarWidget[];
  selectedWidget: string | null;
  onSelectWidget: (widgetId: string | null) => void;
  onUpdateWidget: (widgetId: string, updates: Partial<SidebarWidget>) => void;
  onRemoveWidget: (widgetId: string) => void;
  onAddWidget: () => void;
}

export const SidebarEditor: React.FC<SidebarEditorProps> = ({
  widgets,
  selectedWidget,
  onSelectWidget,
  onUpdateWidget,
  onRemoveWidget,
  onAddWidget
}) => {
  const [editingWidget, setEditingWidget] = useState<string | null>(null);
  const [showStylePanel, setShowStylePanel] = useState<string | null>(null);

  const handleToggleVisibility = (widgetId: string) => {
    const widget = widgets.find(w => w.id === widgetId);
    if (widget) {
      onUpdateWidget(widgetId, { visible: !widget.visible });
    }
  };

  const handleToggleCollapsible = (widgetId: string) => {
    const widget = widgets.find(w => w.id === widgetId);
    if (widget) {
      onUpdateWidget(widgetId, { collapsible: !widget.collapsible });
    }
  };

  const handleUpdateContent = (widgetId: string, content: any) => {
    onUpdateWidget(widgetId, { content });
  };

  const handleUpdateStyles = (widgetId: string, styles: Partial<SidebarWidget['styles']>) => {
    const widget = widgets.find(w => w.id === widgetId);
    if (widget) {
      onUpdateWidget(widgetId, { 
        styles: { ...widget.styles, ...styles } 
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Sidebar Widgets</h3>
        <button
          onClick={onAddWidget}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
          title="Add Widget"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {widgets.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <p className="font-medium">No widgets yet</p>
          <p className="text-sm">Add your first widget to get started</p>
        </div>
      ) : (
        <div className="space-y-2">
          {widgets
            .sort((a, b) => a.order - b.order)
            .map((widget) => (
              <div
                key={widget.id}
                className={`
                  border rounded-lg p-3 cursor-pointer transition-all
                  ${selectedWidget === widget.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                  ${!widget.visible ? 'opacity-50' : ''}
                `}
                onClick={() => onSelectWidget(widget.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <div>
                      <h4 className="font-medium text-gray-900">{widget.title}</h4>
                      <p className="text-xs text-gray-500 capitalize">{widget.type} widget</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleVisibility(widget.id);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title={widget.visible ? 'Hide widget' : 'Show widget'}
                    >
                      {widget.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleCollapsible(widget.id);
                      }}
                      className={`p-1 transition-colors ${
                        widget.collapsible 
                          ? 'text-blue-500 hover:text-blue-600' 
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                      title={widget.collapsible ? 'Disable collapsible' : 'Enable collapsible'}
                    >
                      {widget.collapsible ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowStylePanel(showStylePanel === widget.id ? null : widget.id);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="Style settings"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingWidget(editingWidget === widget.id ? null : widget.id);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="Edit content"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Are you sure you want to remove this widget?')) {
                          onRemoveWidget(widget.id);
                        }
                      }}
                      className="p-1 text-red-400 hover:text-red-600"
                      title="Remove widget"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content Editor */}
                {editingWidget === widget.id && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <WidgetContentEditor
                      widget={widget}
                      onUpdateContent={(content) => handleUpdateContent(widget.id, content)}
                    />
                  </div>
                )}

                {/* Style Panel */}
                {showStylePanel === widget.id && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <WidgetStyleEditor
                      widget={widget}
                      onUpdateStyles={(styles) => handleUpdateStyles(widget.id, styles)}
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

// Widget Content Editor Component
const WidgetContentEditor: React.FC<{
  widget: SidebarWidget;
  onUpdateContent: (content: any) => void;
}> = ({ widget, onUpdateContent }) => {
  const [content, setContent] = useState(widget.content);

  const handleSave = () => {
    onUpdateContent(content);
  };

  const handleAddListItem = () => {
    const newItems = [...(content.items || []), ''];
    setContent({ ...content, items: newItems });
  };

  const handleUpdateListItem = (index: number, value: string) => {
    const newItems = [...(content.items || [])];
    newItems[index] = value;
    setContent({ ...content, items: newItems });
  };

  const handleRemoveListItem = (index: number) => {
    const newItems = (content.items || []).filter((_: any, i: number) => i !== index);
    setContent({ ...content, items: newItems });
  };

  return (
    <div className="space-y-3">
      <h5 className="font-medium text-gray-900">Edit Content</h5>
      
      {widget.type === 'text' && (
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
      
      {widget.type === 'image' && (
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
      
      {widget.type === 'list' && (
        <div className="space-y-2">
          {(content.items || []).map((item: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleUpdateListItem(index, e.target.value)}
                placeholder="List item"
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <button
                onClick={() => handleRemoveListItem(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={handleAddListItem}
            className="text-blue-500 hover:text-blue-700 text-sm flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Item
          </button>
        </div>
      )}
      
      {widget.type === 'contact' && (
        <div className="space-y-2">
          <input
            type="email"
            value={content.email || ''}
            onChange={(e) => setContent({ ...content, email: e.target.value })}
            placeholder="Email address"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <input
            type="tel"
            value={content.phone || ''}
            onChange={(e) => setContent({ ...content, phone: e.target.value })}
            placeholder="Phone number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <textarea
            value={content.address || ''}
            onChange={(e) => setContent({ ...content, address: e.target.value })}
            placeholder="Address"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            rows={2}
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

// Widget Style Editor Component
const WidgetStyleEditor: React.FC<{
  widget: SidebarWidget;
  onUpdateStyles: (styles: Partial<SidebarWidget['styles']>) => void;
}> = ({ widget, onUpdateStyles }) => {
  const [styles, setStyles] = useState(widget.styles);

  const handleStyleChange = (key: keyof SidebarWidget['styles'], value: any) => {
    const newStyles = { ...styles, [key]: value };
    setStyles(newStyles);
    onUpdateStyles(newStyles);
  };

  return (
    <div className="space-y-3">
      <h5 className="font-medium text-gray-900">Style Settings</h5>
      
      <div className="grid grid-cols-2 gap-3">
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
    </div>
  );
};