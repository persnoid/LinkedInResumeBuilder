import React, { useState, useEffect } from 'react';
import { Save, FolderOpen, Trash2, Download, Upload, Clock, FileText, X, Edit3, Check } from 'lucide-react';
import { SupabaseDraftManager } from '../utils/supabaseDraftManager';
import { useAuth } from '../contexts/AuthContext';
import { DraftResume, ResumeData } from '../types/resume';
import { useTranslation } from '../hooks/useTranslation';

interface DraftManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadDraft: (draft: DraftResume) => void;
  currentResumeData?: ResumeData | null;
  currentTemplate?: string;
  currentCustomizations?: any;
  currentStep?: number;
  currentDraftId?: string | null;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning', duration?: number) => void;
  showConfirmation: (options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
  }) => Promise<boolean>;
}

export const DraftManagerComponent: React.FC<DraftManagerProps> = ({
  isOpen,
  onClose,
  onLoadDraft,
  currentResumeData,
  currentTemplate,
  currentCustomizations,
  currentStep,
  currentDraftId,
  showToast,
  showConfirmation
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [drafts, setDrafts] = useState<DraftResume[]>([]);
  const [saveName, setSaveName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [loadingDraftId, setLoadingDraftId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // DEBUG: Log render state
  console.log('🗂️ DraftManager: RENDER - isLoading:', isLoading, 'drafts.length:', drafts.length, 'error:', error, 'warning:', warning);

  useEffect(() => {
    if (isOpen && user) {
      console.log('🗂️ DraftManager: useEffect triggered - Modal opened with user, starting to load drafts...');
      loadDrafts();
    } else if (isOpen && !user) {
      console.log('🗂️ DraftManager: useEffect triggered - Modal opened but no user authenticated');
      setError('You must be signed in to manage drafts');
      setDrafts([]);
    } else {
      console.log('🗂️ DraftManager: useEffect triggered - Modal closed, resetting state...');
      // Reset state when modal closes
      setError(null);
      setWarning(null);
      setIsLoading(false);
      setDrafts([]);
    }
  }, [isOpen, user]);

  const loadDrafts = async () => {
    console.log('🗂️ DraftManager: loadDrafts() START - isLoading before:', isLoading);
    try {
      setIsLoading(true);
      console.log('🗂️ DraftManager: loadDrafts() - isLoading set to TRUE');
      setError(null);
      setWarning(null);
      console.log('🗂️ DraftManager: Starting draft loading process...');
      console.log('🗂️ DraftManager: User authenticated:', !!user, user?.email);

      if (!user) {
        console.log('🗂️ DraftManager: No user authenticated, cannot load drafts');
        setError('You must be signed in to access drafts');
        setDrafts([]);
        setIsLoading(false);
        return;
      }

      console.log('🗂️ DraftManager: User is authenticated, loading from Supabase...');
      const supabaseDrafts = await SupabaseDraftManager.getAllDrafts();
      console.log('🗂️ DraftManager: Successfully loaded', supabaseDrafts.length, 'drafts from Supabase');
      
      setDrafts(supabaseDrafts);
      console.log('🗂️ DraftManager: setDrafts called with', supabaseDrafts.length, 'drafts');
      setError(null);
      setWarning(null);
      
      if (supabaseDrafts.length === 0) {
        setWarning('No drafts found. Create your first draft by saving your current work.');
      }
    } catch (error) {
      console.error('🗂️ DraftManager: Error loading drafts:', error);
      setError('Failed to load drafts. Please try again.');
      setDrafts([]);
    } finally {
      setIsLoading(false);
      console.log('🗂️ DraftManager: loadDrafts() COMPLETE - isLoading set to FALSE');
    }
  };

  const refreshDrafts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setWarning(null);
      
      if (user) {
        console.log('🗂️ DraftManager: Refreshing from Supabase...');
        await loadDrafts();
      } else {
        console.log('🗂️ DraftManager: No user, cannot refresh drafts');
        setError('You must be signed in to access drafts');
        setDrafts([]);
      }
    } catch (error) {
      console.error('🗂️ DraftManager: Error refreshing drafts:', error);
      setError('Failed to refresh drafts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSave = async () => {
    if (!currentResumeData || !saveName.trim()) {
      setError('Please enter a draft name');
      setWarning(null);
      return;
    }

    if (!user) {
      setError('You must be signed in to save drafts');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      setWarning(null);
      console.log('🗂️ DraftManager: Quick save started for:', saveName.trim());
      
      const name = saveName.trim();
      
      console.log('🗂️ DraftManager: Saving to Supabase...');
      const draftId = await SupabaseDraftManager.saveDraft(
        name,
        currentResumeData,
        currentTemplate || 'azurill',
        currentCustomizations || {
          colors: { primary: '#2563EB', secondary: '#1E40AF', accent: '#3B82F6' },
          typography: { fontFamily: 'Inter, sans-serif' },
          sectionOrder: ['summary', 'experience', 'education', 'skills', 'certifications']
        },
        currentStep ?? 0,
        currentDraftId || undefined
      );

      // Also save primary resume data
      await SupabaseDraftManager.saveResumeData(currentResumeData);
      console.log('🗂️ DraftManager: Successfully saved to Supabase with ID:', draftId);
      showToast('Draft saved successfully!', 'success');
      
      setSaveName('');
      await refreshDrafts();
    } catch (err) {
      console.error('🗂️ DraftManager: Error saving draft:', err);
      setError('Failed to save draft. Please try again.');
      showToast('Failed to save draft. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDraft = async (id: string) => {
    const confirmed = await showConfirmation({
      title: 'Delete Draft',
      message: 'Are you sure you want to delete this draft? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    });

    if (confirmed) {
      try {
        setIsLoading(true);
        console.log('🗂️ DraftManager: Deleting draft:', id);
        
        await SupabaseDraftManager.deleteDraft(id);
        await refreshDrafts();
        setError(null);
        setWarning(null);
        showToast('Draft deleted successfully!', 'success');
      } catch (err) {
        console.error('🗂️ DraftManager: Error deleting draft:', err);
        setError('Failed to delete draft');
        showToast('Failed to delete draft', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRenameDraft = async (id: string, newName: string) => {
    const draft = drafts.find(d => d.id === id);
    if (!draft || !newName.trim()) {
      setError('Invalid draft or name');
      setWarning(null);
      return;
    }

    try {
      setIsLoading(true);
      console.log('🗂️ DraftManager: Renaming draft:', id, 'to:', newName.trim());
      
      await SupabaseDraftManager.saveDraft(
        newName.trim(),
        draft.resumeData,
        draft.selectedTemplate,
        draft.customizations,
        draft.step,
        id
      );
      
      setEditingId(null);
      setEditingName('');
      setError(null);
      setWarning(null);
      await refreshDrafts();
      showToast('Draft renamed successfully!', 'success');
    } catch (err) {
      console.error('🗂️ DraftManager: Error renaming draft:', err);
      setError('Failed to rename draft');
      showToast('Failed to rename draft', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportDraft = async (id: string) => {
    try {
      console.log('🗂️ DraftManager: Exporting draft:', id);
      const draft = drafts.find(d => d.id === id);
      if (!draft) {
        throw new Error('Draft not found');
      }

      const dataStr = JSON.stringify(draft, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${draft.name.replace(/[^a-z0-9]/gi, '_')}_draft.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      setError(null);
      setWarning(null);
      showToast('Draft exported successfully!', 'success');
    } catch (err) {
      console.error('🗂️ DraftManager: Error exporting draft:', err);
      setError('Failed to export draft');
      showToast('Failed to export draft', 'error');
    }
  };

  const handleImportDraft = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!user) {
      setError('You must be signed in to import drafts');
      return;
    }

    console.log('🗂️ DraftManager: Importing draft from file:', file.name);
    setIsLoading(true);
    
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const draft = JSON.parse(e.target?.result as string) as DraftResume;
          
          // Validate draft structure
          if (!draft.id || !draft.name || !draft.resumeData || !draft.selectedTemplate) {
            throw new Error('Invalid draft file format');
          }

          // Save imported draft to Supabase
          await SupabaseDraftManager.saveDraft(
            draft.name,
            draft.resumeData,
            draft.selectedTemplate,
            draft.customizations || {},
            draft.step || 0
          );
          
          console.log('🗂️ DraftManager: Draft imported successfully');
          await refreshDrafts();
          setError(null);
          setWarning(null);
          showToast('Draft imported successfully!', 'success');
        } catch (error) {
          console.error('🗂️ DraftManager: Import error:', error);
          setError('Failed to import draft');
          showToast('Failed to import draft', 'error');
        } finally {
          setIsLoading(false);
        }
      };
      
      reader.onerror = () => {
        console.error('🗂️ DraftManager: File reader error');
        setError('Failed to read file');
        showToast('Failed to read file', 'error');
        setIsLoading(false);
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('🗂️ DraftManager: Error setting up file reader:', error);
      setError('Failed to process file');
      showToast('Failed to process file', 'error');
      setIsLoading(false);
    }

    // Reset file input
    event.target.value = '';
  };

  const handleLoadDraft = async (draft: DraftResume) => {
    try {
      setLoadingDraftId(draft.id);
      setError(null);
      setWarning(null);
      
      console.log('🗂️ DraftManager: Loading draft:', draft.id, draft.name);
      
      // Validate draft data before loading
      if (!draft.resumeData || !draft.resumeData.personalInfo) {
        throw new Error('Invalid draft data');
      }

      // Ensure all required fields exist
      const validatedDraft = {
        ...draft,
        resumeData: {
          personalInfo: draft.resumeData.personalInfo || {},
          summary: draft.resumeData.summary || '',
          experience: draft.resumeData.experience || [],
          education: draft.resumeData.education || [],
          skills: draft.resumeData.skills || [],
          certifications: draft.resumeData.certifications || [],
          languages: draft.resumeData.languages || []
        },
        selectedTemplate: draft.selectedTemplate || 'azurill',
        customizations: draft.customizations || {
          colors: { primary: '#2563EB', secondary: '#1E40AF', accent: '#3B82F6' },
          typography: { fontFamily: 'Inter, sans-serif' },
          sectionOrder: ['summary', 'experience', 'education', 'skills', 'certifications']
        },
        step: Math.max(0, Math.min(3, draft.step || 0))
      };

      console.log('🗂️ DraftManager: Validated draft before loading:', validatedDraft.id);

      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));

      // Call the parent component's load function
      await onLoadDraft(validatedDraft);
      
      console.log('🗂️ DraftManager: Draft load function called successfully');
      
    } catch (err) {
      console.error('🗂️ DraftManager: Error loading draft:', err);
      setError('Failed to load draft');
      showToast('Failed to load draft', 'error');
    } finally {
      setLoadingDraftId(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      return 'Invalid date';
    }
  };

  const getStepName = (step: number) => {
    const steps = ['Upload', 'Review Data', 'Choose Template', 'Customize'];
    return steps[step] || 'Unknown';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Draft Manager</h2>
            <p className="text-sm text-gray-600">Save, load, and manage your resume drafts</p>
            <div className="flex items-center mt-1">
              <span className="text-xs text-gray-500">Data Source: Cloud Storage</span>
              {user && (
                <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  Signed in as {user.email}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Error and Warning Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <div className="flex items-center justify-between">
                <span>{error}</span>
                <button 
                  onClick={() => setError(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          
          {warning && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
              <div className="flex items-center justify-between">
                <span>{warning}</span>
                <button 
                  onClick={() => setWarning(null)}
                  className="text-yellow-500 hover:text-yellow-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Save Current Draft */}
          {currentResumeData && user && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-900 mb-4">Quick Save Current Work</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder={currentDraftId ? 'Update draft name...' : 'Enter name for your draft...'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleQuickSave()}
                  disabled={isSaving}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleQuickSave}
                    disabled={!saveName.trim() || isSaving}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-md text-sm transition-colors flex items-center"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {currentDraftId ? 'Update Draft' : 'Save Draft'}
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setSaveName('');
                      setError(null);
                      setWarning(null);
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm transition-colors"
                    disabled={isSaving}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Import/Export */}
          {user && (
            <div className="mb-6 flex space-x-3">
              <label className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center text-sm cursor-pointer transition-colors">
                <Upload className="w-4 h-4 mr-2" />
                Import Draft
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportDraft}
                  className="hidden"
                  disabled={isLoading}
                />
              </label>
              
              <button
                onClick={refreshDrafts}
                disabled={isLoading}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg flex items-center text-sm transition-colors"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Refreshing...
                  </>
                ) : (
                  <>
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Refresh
                  </>
                )}
              </button>
            </div>
          )}

          {/* Authentication Required Message */}
          {!user && (
            <div className="text-center py-8 text-gray-500">
              <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-lg font-medium">Sign In Required</p>
              <p className="text-sm mt-1">You must be signed in to save and manage drafts</p>
            </div>
          )}

          {/* Drafts List */}
          {user && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <FolderOpen className="w-5 h-5 mr-2" />
                Saved Drafts ({drafts.length})
              </h3>

              {isLoading && !loadingDraftId ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-3"></div>
                  <p className="text-gray-500">Loading drafts...</p>
                  <p className="text-xs text-gray-400 mt-1">Checking cloud storage...</p>
                </div>
              ) : drafts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No drafts saved yet</p>
                  <p className="text-sm">Save your current progress to continue later</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {drafts.map((draft) => (
                    <div
                      key={draft.id}
                      className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                        currentDraftId === draft.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {editingId === draft.id ? (
                            <div className="flex items-center space-x-2 mb-2">
                              <input
                                type="text"
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleRenameDraft(draft.id, editingName);
                                  }
                                }}
                                autoFocus
                              />
                              <button
                                onClick={() => handleRenameDraft(draft.id, editingName)}
                                className="text-green-600 hover:text-green-700"
                                disabled={isLoading}
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingId(null);
                                  setEditingName('');
                                }}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold text-gray-900">{draft.name}</h4>
                              {currentDraftId === draft.id && (
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                  Current
                                </span>
                              )}
                              <button
                                onClick={() => {
                                  setEditingId(draft.id);
                                  setEditingName(draft.name);
                                }}
                                className="text-gray-400 hover:text-gray-600"
                                disabled={isLoading}
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                            </div>
                          )}

                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>Updated: {formatDate(draft.updatedAt)}</span>
                            </div>
                            <div>
                              <span className="font-medium">Step: {getStepName(draft.step)}</span>
                            </div>
                            <div>
                              <span className="font-medium">Template: {draft.selectedTemplate}</span>
                            </div>
                            <div>
                              <span className="font-medium">Name: {draft.resumeData?.personalInfo?.name || 'Not set'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleLoadDraft(draft)}
                            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-3 py-1 rounded text-sm transition-colors flex items-center min-w-[80px] justify-center"
                            disabled={isLoading || loadingDraftId === draft.id}
                          >
                            {loadingDraftId === draft.id ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent mr-1"></div>
                                Loading
                              </>
                            ) : (
                              'Load'
                            )}
                          </button>
                          <button
                            onClick={() => handleExportDraft(draft.id)}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                            title="Export draft"
                            disabled={isLoading}
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDraft(draft.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            title="Delete draft"
                            disabled={isLoading}
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
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <p>Data stored in: Cloud Storage</p>
              {user && (
                <p className="text-xs text-green-600 mt-1">✓ Signed in - drafts sync across devices</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              disabled={isLoading}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};