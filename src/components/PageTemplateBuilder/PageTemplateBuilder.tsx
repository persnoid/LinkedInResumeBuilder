import React, { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Plus, Settings, Eye, Save, Undo, Redo, Layout, Sidebar, Grid } from 'lucide-react';
import { PageTemplate, PageSection, SidebarWidget, HistoryState } from '../../types/pageTemplate';
import { SectionEditor } from './SectionEditor';
import { SidebarEditor } from './SidebarEditor';
import { TemplateLibrary } from './TemplateLibrary';
import { StylePanel } from './StylePanel';
import { PreviewMode } from './PreviewMode';
import { useToast } from '../ToastNotification';

interface PageTemplateBuilderProps {
  template?: PageTemplate;
  onSave: (template: PageTemplate) => void;
  onClose: () => void;
}

export const PageTemplateBuilder: React.FC<PageTemplateBuilderProps> = ({
  template,
  onSave,
  onClose
}) => {
  const { showToast } = useToast();
  const [currentTemplate, setCurrentTemplate] = useState<PageTemplate>(
    template || createDefaultTemplate()
  );
  const [activePanel, setActivePanel] = useState<'sections' | 'sidebar' | 'styles' | 'preview'>('sections');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isDragging, setIsDragging] = useState(false);

  // History management
  const addToHistory = useCallback((action: HistoryState['action'], data: any) => {
    const newState: HistoryState = {
      id: Date.now().toString(),
      action,
      timestamp: Date.now(),
      data: JSON.parse(JSON.stringify(currentTemplate))
    };
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [currentTemplate, history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1];
      setCurrentTemplate(previousState.data);
      setHistoryIndex(historyIndex - 1);
      showToast('Action undone', 'info');
    }
  }, [history, historyIndex, showToast]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setCurrentTemplate(nextState.data);
      setHistoryIndex(historyIndex + 1);
      showToast('Action redone', 'info');
    }
  }, [history, historyIndex, showToast]);

  // Section management
  const addSection = useCallback((sectionTemplate: any) => {
    const newSection: PageSection = {
      id: Date.now().toString(),
      type: sectionTemplate.type,
      title: sectionTemplate.name,
      content: sectionTemplate.defaultContent,
      styles: sectionTemplate.defaultStyles,
      order: currentTemplate.mainSections.length,
      visible: true
    };

    addToHistory('add', currentTemplate);
    setCurrentTemplate(prev => ({
      ...prev,
      mainSections: [...prev.mainSections, newSection]
    }));
    showToast('Section added successfully', 'success');
  }, [currentTemplate, addToHistory, showToast]);

  const removeSection = useCallback((sectionId: string) => {
    addToHistory('remove', currentTemplate);
    setCurrentTemplate(prev => ({
      ...prev,
      mainSections: prev.mainSections.filter(s => s.id !== sectionId)
    }));
    setSelectedSection(null);
    showToast('Section removed', 'info');
  }, [currentTemplate, addToHistory, showToast]);

  const updateSection = useCallback((sectionId: string, updates: Partial<PageSection>) => {
    addToHistory('edit', currentTemplate);
    setCurrentTemplate(prev => ({
      ...prev,
      mainSections: prev.mainSections.map(s => 
        s.id === sectionId ? { ...s, ...updates } : s
      )
    }));
  }, [currentTemplate, addToHistory]);

  // Sidebar widget management
  const addWidget = useCallback((widgetTemplate: any) => {
    const newWidget: SidebarWidget = {
      id: Date.now().toString(),
      type: widgetTemplate.type,
      title: widgetTemplate.name,
      content: widgetTemplate.defaultContent,
      styles: widgetTemplate.defaultStyles,
      order: currentTemplate.sidebarWidgets.length,
      visible: true,
      collapsible: false,
      collapsed: false
    };

    addToHistory('add', currentTemplate);
    setCurrentTemplate(prev => ({
      ...prev,
      sidebarWidgets: [...prev.sidebarWidgets, newWidget]
    }));
    showToast('Widget added successfully', 'success');
  }, [currentTemplate, addToHistory, showToast]);

  const removeWidget = useCallback((widgetId: string) => {
    addToHistory('remove', currentTemplate);
    setCurrentTemplate(prev => ({
      ...prev,
      sidebarWidgets: prev.sidebarWidgets.filter(w => w.id !== widgetId)
    }));
    setSelectedWidget(null);
    showToast('Widget removed', 'info');
  }, [currentTemplate, addToHistory, showToast]);

  const updateWidget = useCallback((widgetId: string, updates: Partial<SidebarWidget>) => {
    addToHistory('edit', currentTemplate);
    setCurrentTemplate(prev => ({
      ...prev,
      sidebarWidgets: prev.sidebarWidgets.map(w => 
        w.id === widgetId ? { ...w, ...updates } : w
      )
    }));
  }, [currentTemplate, addToHistory]);

  // Drag and drop handlers
  const onDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const onDragEnd = useCallback((result: DropResult) => {
    setIsDragging(false);
    
    if (!result.destination) return;

    const { source, destination, type } = result;

    if (type === 'SECTION') {
      addToHistory('move', currentTemplate);
      const newSections = Array.from(currentTemplate.mainSections);
      const [reorderedSection] = newSections.splice(source.index, 1);
      newSections.splice(destination.index, 0, reorderedSection);
      
      // Update order values
      const updatedSections = newSections.map((section, index) => ({
        ...section,
        order: index
      }));

      setCurrentTemplate(prev => ({
        ...prev,
        mainSections: updatedSections
      }));
    } else if (type === 'WIDGET') {
      addToHistory('move', currentTemplate);
      const newWidgets = Array.from(currentTemplate.sidebarWidgets);
      const [reorderedWidget] = newWidgets.splice(source.index, 1);
      newWidgets.splice(destination.index, 0, reorderedWidget);
      
      // Update order values
      const updatedWidgets = newWidgets.map((widget, index) => ({
        ...widget,
        order: index
      }));

      setCurrentTemplate(prev => ({
        ...prev,
        sidebarWidgets: updatedWidgets
      }));
    }
  }, [currentTemplate, addToHistory]);

  const handleSave = useCallback(() => {
    const updatedTemplate = {
      ...currentTemplate,
      updatedAt: new Date().toISOString()
    };
    onSave(updatedTemplate);
    showToast('Template saved successfully', 'success');
  }, [currentTemplate, onSave, showToast]);

  const toggleSidebarPosition = useCallback(() => {
    addToHistory('style', currentTemplate);
    setCurrentTemplate(prev => ({
      ...prev,
      layout: {
        ...prev.layout,
        sidebarPosition: prev.layout.sidebarPosition === 'left' ? 'right' : 'left'
      }
    }));
  }, [currentTemplate, addToHistory]);

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900">Page Template Builder</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowTemplateLibrary(true)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center text-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </button>
          <button
            onClick={toggleSidebarPosition}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center text-sm"
            title="Toggle sidebar position"
          >
            <Sidebar className="w-4 h-4 mr-2" />
            {currentTemplate.layout.sidebarPosition === 'left' ? 'Left' : 'Right'} Sidebar
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center text-sm"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Template
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg text-sm"
          >
            Close
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Panel Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { key: 'sections', label: 'Sections', icon: Layout },
                { key: 'sidebar', label: 'Sidebar', icon: Sidebar },
                { key: 'styles', label: 'Styles', icon: Settings },
                { key: 'preview', label: 'Preview', icon: Eye }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActivePanel(tab.key as any)}
                  className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activePanel === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mx-auto mb-1" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activePanel === 'sections' && (
              <SectionEditor
                sections={currentTemplate.mainSections}
                selectedSection={selectedSection}
                onSelectSection={setSelectedSection}
                onUpdateSection={updateSection}
                onRemoveSection={removeSection}
                onAddSection={() => setShowTemplateLibrary(true)}
              />
            )}
            {activePanel === 'sidebar' && (
              <SidebarEditor
                widgets={currentTemplate.sidebarWidgets}
                selectedWidget={selectedWidget}
                onSelectWidget={setSelectedWidget}
                onUpdateWidget={updateWidget}
                onRemoveWidget={removeWidget}
                onAddWidget={() => setShowTemplateLibrary(true)}
              />
            )}
            {activePanel === 'styles' && (
              <StylePanel
                template={currentTemplate}
                onUpdateTemplate={setCurrentTemplate}
                onAddToHistory={() => addToHistory('style', currentTemplate)}
              />
            )}
            {activePanel === 'preview' && (
              <PreviewMode
                template={currentTemplate}
              />
            )}
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 overflow-auto bg-gray-100 p-6">
          <div 
            className="mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
            style={{ 
              maxWidth: currentTemplate.layout.maxWidth,
              fontFamily: currentTemplate.styles.fontFamily 
            }}
          >
            <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
              <div className={`flex ${currentTemplate.layout.sidebarPosition === 'right' ? 'flex-row-reverse' : ''}`}>
                {/* Main Content Area */}
                <div className="flex-1" style={{ padding: currentTemplate.layout.spacing }}>
                  <Droppable droppableId="main-sections" type="SECTION">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-96 ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}`}
                      >
                        {currentTemplate.mainSections
                          .sort((a, b) => a.order - b.order)
                          .map((section, index) => (
                            <Draggable key={section.id} draggableId={section.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`mb-4 ${snapshot.isDragging ? 'opacity-50' : ''}`}
                                  onClick={() => setSelectedSection(section.id)}
                                >
                                  <SectionRenderer
                                    section={section}
                                    isSelected={selectedSection === section.id}
                                    onUpdate={(updates) => updateSection(section.id, updates)}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                        
                        {currentTemplate.mainSections.length === 0 && (
                          <div className="text-center py-12 text-gray-500">
                            <Grid className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-medium mb-2">No sections yet</p>
                            <p className="text-sm">Click "Add Section" to get started</p>
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>

                {/* Sidebar */}
                {currentTemplate.layout.sidebarPosition !== 'none' && (
                  <div 
                    className="bg-gray-50 border-l border-gray-200"
                    style={{ 
                      width: currentTemplate.layout.sidebarWidth,
                      padding: currentTemplate.layout.spacing 
                    }}
                  >
                    <Droppable droppableId="sidebar-widgets" type="WIDGET">
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`min-h-64 ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}`}
                        >
                          {currentTemplate.sidebarWidgets
                            .sort((a, b) => a.order - b.order)
                            .map((widget, index) => (
                              <Draggable key={widget.id} draggableId={widget.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`mb-4 ${snapshot.isDragging ? 'opacity-50' : ''}`}
                                    onClick={() => setSelectedWidget(widget.id)}
                                  >
                                    <WidgetRenderer
                                      widget={widget}
                                      isSelected={selectedWidget === widget.id}
                                      onUpdate={(updates) => updateWidget(widget.id, updates)}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          {provided.placeholder}
                          
                          {currentTemplate.sidebarWidgets.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                              <Sidebar className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                              <p className="text-sm">No widgets yet</p>
                            </div>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </div>
                )}
              </div>
            </DragDropContext>
          </div>
        </div>
      </div>

      {/* Template Library Modal */}
      {showTemplateLibrary && (
        <TemplateLibrary
          onSelectSection={addSection}
          onSelectWidget={addWidget}
          onClose={() => setShowTemplateLibrary(false)}
        />
      )}
    </div>
  );
};

// Helper function to create default template
function createDefaultTemplate(): PageTemplate {
  return {
    id: Date.now().toString(),
    name: 'New Template',
    description: 'A custom page template',
    mainSections: [],
    sidebarWidgets: [],
    layout: {
      sidebarPosition: 'right',
      sidebarWidth: '300px',
      maxWidth: '1200px',
      spacing: '24px',
      responsive: {
        hideSidebarOnMobile: true,
        stackOnMobile: true,
        mobileBreakpoint: '768px'
      }
    },
    styles: {
      backgroundColor: '#ffffff',
      fontFamily: 'Inter, sans-serif',
      primaryColor: '#3b82f6',
      secondaryColor: '#6b7280',
      accentColor: '#10b981'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

// Section Renderer Component
const SectionRenderer: React.FC<{
  section: PageSection;
  isSelected: boolean;
  onUpdate: (updates: Partial<PageSection>) => void;
}> = ({ section, isSelected, onUpdate }) => {
  const getWidthClass = () => {
    switch (section.styles.width) {
      case 'half': return 'w-1/2';
      case 'third': return 'w-1/3';
      case 'quarter': return 'w-1/4';
      case 'custom': return '';
      default: return 'w-full';
    }
  };

  return (
    <div
      className={`
        ${getWidthClass()} 
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
        transition-all duration-200 cursor-pointer
      `}
      style={{
        backgroundColor: section.styles.background,
        padding: section.styles.padding,
        margin: section.styles.margin,
        borderRadius: section.styles.borderRadius,
        boxShadow: section.styles.shadow,
        textAlign: section.styles.textAlign,
        minHeight: section.styles.minHeight,
        width: section.styles.width === 'custom' ? section.styles.customWidth : undefined
      }}
    >
      <div className="relative">
        {isSelected && (
          <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
            {section.title}
          </div>
        )}
        
        {/* Render content based on section type */}
        {section.type === 'text' && (
          <div>
            <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
            <div dangerouslySetInnerHTML={{ __html: section.content.html || 'Click to edit content...' }} />
          </div>
        )}
        
        {section.type === 'image' && (
          <div>
            <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
            {section.content.src ? (
              <img 
                src={section.content.src} 
                alt={section.content.alt || ''} 
                className="w-full h-auto rounded"
              />
            ) : (
              <div className="bg-gray-200 h-48 flex items-center justify-center rounded">
                <span className="text-gray-500">No image selected</span>
              </div>
            )}
          </div>
        )}
        
        {section.type === 'video' && (
          <div>
            <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
            {section.content.src ? (
              <video controls className="w-full rounded">
                <source src={section.content.src} type="video/mp4" />
              </video>
            ) : (
              <div className="bg-gray-200 h-48 flex items-center justify-center rounded">
                <span className="text-gray-500">No video selected</span>
              </div>
            )}
          </div>
        )}
        
        {section.type === 'form' && (
          <div>
            <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
            <div className="space-y-4">
              {section.content.fields?.map((field: any, index: number) => (
                <div key={index}>
                  <label className="block text-sm font-medium mb-1">{field.label}</label>
                  <input 
                    type={field.type} 
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              )) || (
                <p className="text-gray-500">No form fields configured</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Widget Renderer Component
const WidgetRenderer: React.FC<{
  widget: SidebarWidget;
  isSelected: boolean;
  onUpdate: (updates: Partial<SidebarWidget>) => void;
}> = ({ widget, isSelected, onUpdate }) => {
  return (
    <div
      className={`
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
        transition-all duration-200 cursor-pointer
      `}
      style={{
        backgroundColor: widget.styles.background,
        padding: widget.styles.padding,
        margin: widget.styles.margin,
        borderRadius: widget.styles.borderRadius,
        boxShadow: widget.styles.shadow
      }}
    >
      <div className="relative">
        {isSelected && (
          <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
            {widget.title}
          </div>
        )}
        
        <h4 className="font-semibold mb-2">{widget.title}</h4>
        
        {/* Render content based on widget type */}
        {widget.type === 'text' && (
          <div dangerouslySetInnerHTML={{ __html: widget.content.html || 'Widget content...' }} />
        )}
        
        {widget.type === 'list' && (
          <ul className="space-y-1">
            {widget.content.items?.map((item: string, index: number) => (
              <li key={index} className="text-sm">{item}</li>
            )) || <li className="text-gray-500 text-sm">No items</li>}
          </ul>
        )}
        
        {widget.type === 'contact' && (
          <div className="space-y-2 text-sm">
            <div>{widget.content.email || 'email@example.com'}</div>
            <div>{widget.content.phone || '+1 (555) 123-4567'}</div>
            <div>{widget.content.address || '123 Main St, City, State'}</div>
          </div>
        )}
      </div>
    </div>
  );
};