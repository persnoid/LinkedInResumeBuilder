import React, { useState } from 'react';
import { Plus, Trash2, FileText, Edit3, Save, X } from 'lucide-react';

interface CustomTextSectionProps {
  data: any;
  styles: any;
  sectionStyles: any;
  config: any;
  editMode?: boolean;
  onDataUpdate?: (field: string, value: any) => void;
  showConfirmation?: (options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
  }) => Promise<boolean>;
}

interface CustomSectionData {
  title: string;
  content: string;
}

export const CustomTextSection: React.FC<CustomTextSectionProps> = ({
  data,
  styles,
  sectionStyles,
  config,
  editMode = false,
  onDataUpdate,
  showConfirmation
}) => {
  const { customSections } = data;
  const sectionId = config.id;
  
  // Get section data or provide defaults
  const sectionData: CustomSectionData = customSections?.[sectionId] || {
    title: config.name || 'Custom Section',
    content: 'Add your custom content here...'
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(sectionData.title);
  const [editContent, setEditContent] = useState(sectionData.content);

  const handleSave = () => {
    if (onDataUpdate) {
      const updatedCustomSections = {
        ...customSections,
        [sectionId]: {
          title: editTitle.trim(),
          content: editContent.trim()
        }
      };
      onDataUpdate('customSections', updatedCustomSections);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(sectionData.title);
    setEditContent(sectionData.content);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const EditableText: React.FC<{
    value: string;
    onSave: (value: string) => void;
    className?: string;
    style?: React.CSSProperties;
    placeholder?: string;
    multiline?: boolean;
  }> = ({ value, onSave, className = '', style = {}, placeholder = '', multiline = false }) => {
    const [isEditingInline, setIsEditingInline] = useState(false);
    const [editValue, setEditValue] = useState(value);

    const handleSaveInline = () => {
      onSave(editValue);
      setIsEditingInline(false);
    };

    const handleKeyDownInline = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !multiline) {
        e.preventDefault();
        handleSaveInline();
      } else if (e.key === 'Escape') {
        setEditValue(value);
        setIsEditingInline(false);
      }
    };

    if (editMode && isEditingInline) {
      return multiline ? (
        <textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSaveInline}
          onKeyDown={handleKeyDownInline}
          className={`${className} border-2 border-blue-500 rounded px-2 py-1 resize-none w-full`}
          style={style}
          placeholder={placeholder}
          autoFocus
          rows={4}
        />
      ) : (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSaveInline}
          onKeyDown={handleKeyDownInline}
          className={`${className} border-2 border-blue-500 rounded px-2 py-1 w-full`}
          style={style}
          placeholder={placeholder}
          autoFocus
        />
      );
    }

    return (
      <span
        className={`${className} ${editMode ? 'cursor-pointer hover:bg-blue-50 hover:outline hover:outline-2 hover:outline-blue-300 rounded px-1' : ''}`}
        style={style}
        onClick={() => editMode && setIsEditingInline(true)}
        title={editMode ? 'Click to edit' : ''}
      >
        {value || placeholder}
      </span>
    );
  };

  return (
    <div className="custom-text-section">
      <div className="flex items-center justify-between mb-3">
        <h3 
          className="section-title font-bold uppercase tracking-wide flex items-center"
          style={{ 
            fontSize: styles.typography.fontSize.heading3,
            color: styles.colors.primary,
            borderBottom: sectionStyles?.headerStyle === 'underline' ? `2px solid ${styles.colors.primary}` : 'none',
            backgroundColor: sectionStyles?.headerStyle === 'background' ? `${styles.colors.primary}10` : 'transparent',
            padding: sectionStyles?.headerStyle === 'background' ? '8px 12px' : '0 0 4px 0',
            borderRadius: sectionStyles?.headerStyle === 'background' ? '6px' : '0',
            textTransform: sectionStyles?.textTransform || 'uppercase',
            fontWeight: sectionStyles?.fontWeight ? styles.typography.fontWeight[sectionStyles.fontWeight] : styles.typography.fontWeight.bold
          }}
        >
          <FileText className="w-3 h-3 mr-2" />
          <EditableText
            value={sectionData.title}
            onSave={(value) => {
              if (onDataUpdate) {
                const updatedCustomSections = {
                  ...customSections,
                  [sectionId]: {
                    ...sectionData,
                    title: value
                  }
                };
                onDataUpdate('customSections', updatedCustomSections);
              }
            }}
            placeholder="Section Title"
          />
        </h3>
        {editMode && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center text-sm transition-colors"
            title="Edit section content"
          >
            <Edit3 className="w-4 h-4 mr-1" />
            Edit Content
          </button>
        )}
      </div>
      
      <div 
        style={{
          padding: sectionStyles?.padding || '0',
          margin: sectionStyles?.margin || '0',
          backgroundColor: sectionStyles?.backgroundColor || 'transparent',
          borderRadius: sectionStyles?.borderRadius ? styles.effects?.borderRadius?.[sectionStyles.borderRadius] || '0' : '0',
          border: sectionStyles?.borderWidth ? `${sectionStyles.borderWidth} ${sectionStyles.borderStyle || 'solid'} ${sectionStyles.borderColor || styles.colors.border}` : 'none',
          boxShadow: sectionStyles?.shadow ? styles.effects?.shadow?.[sectionStyles.shadow] || 'none' : 'none'
        }}
      >
        <div className="custom-content">
          <EditableText
            value={sectionData.content}
            onSave={(value) => {
              if (onDataUpdate) {
                const updatedCustomSections = {
                  ...customSections,
                  [sectionId]: {
                    ...sectionData,
                    content: value
                  }
                };
                onDataUpdate('customSections', updatedCustomSections);
              }
            }}
            className="block leading-relaxed"
            style={{ 
              fontSize: styles.typography.fontSize.base,
              lineHeight: styles.typography.lineHeight.relaxed,
              color: styles.colors.text,
            }}
            placeholder="Add your custom content here..."
            multiline={true}
          />
        </div>
      </div>

      {/* Full Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit Section Content
              </h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-4">
                {/* Section Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Section Title *
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter section title"
                  />
                </div>

                {/* Section Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content *
                  </label>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={8}
                    placeholder="Enter your content here. You can add paragraphs, bullet points, or any text you need for this section."
                  />
                </div>

                {/* Content Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Content Tips:</h4>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Use this section for any additional information not covered by standard sections</li>
                    <li>• Examples: Projects, Volunteer Work, Awards, Publications, etc.</li>
                    <li>• Keep content concise and relevant to your target role</li>
                    <li>• Use bullet points or short paragraphs for better readability</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
              <button
                onClick={handleCancel}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Content
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};