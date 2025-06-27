import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Copy, Download, Upload, Search } from 'lucide-react';
import { PageTemplateBuilder } from '../components/PageTemplateBuilder/PageTemplateBuilder';
import { PageTemplate } from '../types/pageTemplate';
import { useToast } from '../components/ToastNotification';

const TEMPLATES_STORAGE_KEY = 'page_templates';

export const PageTemplateBuilderPage: React.FC = () => {
  const { showToast } = useToast();
  const [templates, setTemplates] = useState<PageTemplate[]>([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<PageTemplate | undefined>();
  const [searchTerm, setSearchTerm] = useState('');

  // Load templates from localStorage on mount
  useEffect(() => {
    try {
      const savedTemplates = localStorage.getItem(TEMPLATES_STORAGE_KEY);
      if (savedTemplates) {
        setTemplates(JSON.parse(savedTemplates));
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      showToast('Failed to load templates', 'error');
    }
  }, [showToast]);

  // Save templates to localStorage
  const saveTemplates = (newTemplates: PageTemplate[]) => {
    try {
      localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(newTemplates));
      setTemplates(newTemplates);
    } catch (error) {
      console.error('Error saving templates:', error);
      showToast('Failed to save templates', 'error');
    }
  };

  const handleSaveTemplate = (template: PageTemplate) => {
    const existingIndex = templates.findIndex(t => t.id === template.id);
    let newTemplates: PageTemplate[];

    if (existingIndex >= 0) {
      // Update existing template
      newTemplates = [...templates];
      newTemplates[existingIndex] = template;
      showToast('Template updated successfully', 'success');
    } else {
      // Add new template
      newTemplates = [...templates, template];
      showToast('Template created successfully', 'success');
    }

    saveTemplates(newTemplates);
    setShowBuilder(false);
    setEditingTemplate(undefined);
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      const newTemplates = templates.filter(t => t.id !== templateId);
      saveTemplates(newTemplates);
      showToast('Template deleted', 'info');
    }
  };

  const handleDuplicateTemplate = (template: PageTemplate) => {
    const duplicatedTemplate: PageTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newTemplates = [...templates, duplicatedTemplate];
    saveTemplates(newTemplates);
    showToast('Template duplicated', 'success');
  };

  const handleExportTemplate = (template: PageTemplate) => {
    try {
      const dataStr = JSON.stringify(template, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${template.name.replace(/[^a-z0-9]/gi, '_')}_template.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      showToast('Template exported successfully', 'success');
    } catch (error) {
      console.error('Error exporting template:', error);
      showToast('Failed to export template', 'error');
    }
  };

  const handleImportTemplate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const template = JSON.parse(e.target?.result as string) as PageTemplate;
        
        // Validate template structure
        if (!template.id || !template.name || !template.mainSections || !template.sidebarWidgets) {
          throw new Error('Invalid template file format');
        }

        // Generate new ID to avoid conflicts
        template.id = Date.now().toString();
        template.updatedAt = new Date().toISOString();
        
        const newTemplates = [...templates, template];
        saveTemplates(newTemplates);
        showToast('Template imported successfully', 'success');
      } catch (error) {
        console.error('Error importing template:', error);
        showToast('Failed to import template file', 'error');
      }
    };
    reader.readAsText(file);

    // Reset file input
    event.target.value = '';
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (showBuilder) {
    return (
      <PageTemplateBuilder
        template={editingTemplate}
        onSave={handleSaveTemplate}
        onClose={() => {
          setShowBuilder(false);
          setEditingTemplate(undefined);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Page Template Builder</h1>
              <p className="text-gray-600 mt-2">Create and manage flexible page templates with drag-and-drop functionality</p>
            </div>
            <div className="flex items-center space-x-3">
              <label className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center cursor-pointer transition-colors">
                <Upload className="w-4 h-4 mr-2" />
                Import Template
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportTemplate}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => setShowBuilder(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Template
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            {templates.length === 0 ? (
              <div>
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates yet</h3>
                <p className="text-gray-600 mb-6">Create your first page template to get started</p>
                <button
                  onClick={() => setShowBuilder(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center mx-auto transition-colors"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Template
                </button>
              </div>
            ) : (
              <div>
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates found</h3>
                <p className="text-gray-600">Try adjusting your search terms</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Template Preview */}
                <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 p-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
                  <div className="relative z-10 h-full">
                    <div className="text-xs text-gray-500 mb-2">
                      {template.mainSections.length} sections • {template.sidebarWidgets.length} widgets
                    </div>
                    <div className="flex space-x-2 h-full">
                      {/* Main content preview */}
                      <div className="flex-1 bg-white rounded border border-gray-200 p-2">
                        <div className="space-y-1">
                          {template.mainSections.slice(0, 3).map((section, index) => (
                            <div
                              key={section.id}
                              className="h-3 rounded"
                              style={{ backgroundColor: template.styles.primaryColor + '20' }}
                            />
                          ))}
                        </div>
                      </div>
                      
                      {/* Sidebar preview */}
                      {template.layout.sidebarPosition !== 'none' && (
                        <div className="w-16 bg-gray-100 rounded border border-gray-200 p-1">
                          <div className="space-y-1">
                            {template.sidebarWidgets.slice(0, 4).map((widget, index) => (
                              <div
                                key={widget.id}
                                className="h-2 bg-gray-300 rounded"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>Updated {formatDate(template.updatedAt)}</span>
                    <span className="capitalize">{template.layout.sidebarPosition} sidebar</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setEditingTemplate(template);
                        setShowBuilder(true);
                      }}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center transition-colors"
                    >
                      <Edit3 className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                    
                    <button
                      onClick={() => handleDuplicateTemplate(template)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleExportTemplate(template)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors"
                      title="Export"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};