import React, { useState, useEffect } from 'react';
import { Save, FolderOpen, Trash2, Download, Upload, Clock, FileText, X, Edit3, Check } from 'lucide-react';
import { DraftManager } from '../utils/draftManager';
import { SupabaseDraftManager } from '../utils/supabaseDraftManager';
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
  const [drafts, setDrafts] = useState<DraftResume[]>([]);
  const [saveName, setSaveName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingDraftId, setLoadingDraftId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadDraftsFromSupabase();
    }
  }, [isOpen]);

  const loadDraftsFromSupabase = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const allDrafts = await SupabaseDraftManager.getAllDrafts();
      console.log('Loaded drafts from Supabase:', allDrafts);
      setDrafts(allDrafts);
    } catch (err) {
      console.error('Error loading drafts from Supabase:', err);
      console.log('Falling back to local storage...');
      
      loadDraftsFromLocal();
    } finally {
      setIsLoading(false);
    }
  };

  const loadDraftsFromLocal = () => {
    try {
      const localDrafts = DraftManager.getAllDrafts();
      console.log('Loaded drafts from local storage:', localDrafts);
      setDrafts(localDrafts);
      if (localDrafts.length > 0) {
        setError('Showing local drafts (cloud sync unavailable)');
      }
    } catch (localError) {
      console.error('Error loading local drafts:', localError);
      setError(t('draftManager.errors.loadFailed'));
    }
  };

  const refreshDrafts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const allDrafts = await SupabaseDraftManager.getAllDrafts();
      setDrafts(allDrafts);
    } catch (err) {
      console.error('Error refreshing drafts from Supabase:', err);
      loadDraftsFromLocal();
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSave = async () => {
    if (!currentResumeData || !saveName.trim()) {
      setError('Please enter a draft name');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      
      const name = saveName.trim();
      let draftId: string;
      
      try {
        // Try Supabase first
        draftId = await SupabaseDraftManager.saveDraft(
          name,
          currentResumeData,
          currentTemplate || 'azurill',
          currentCustomizations || {
            colors: { primary: '#2563EB', secondary: '#1E40AF', accent: '#3B82F6' },
            typography: { fontFamily: 'Inter, sans-serif' },
            sectionOrder: ['summary', 'experience', 'education', 'skills', 'certifications']
          },
          currentStep || 1,
          currentDraftId || undefined
        );

        // Also save primary resume data
        await SupabaseDraftManager.saveResumeData(currentResumeData);
        showToast('Draft saved to cloud successfully!', 'success');
      } catch (supabaseError) {
        console.error('Error saving draft to Supabase:', supabaseError);
        
        // Fallback to local storage
        draftId = DraftManager.saveDraft(
          name,
          currentResumeData,
          currentTemplate || 'azurill',
          currentCustomizations || {
            colors: { primary: '#2563EB', secondary: '#1E40AF', accent: '#3B82F6' },
            typography: { fontFamily: 'Inter, sans-serif' },
            sectionOrder: ['summary', 'experience', 'education', 'skills', 'certifications']
          },
          currentStep || 1,
          currentDraftId || undefined
        );
        
        showToast('Draft saved locally (cloud sync unavailable)', 'warning');
      }
      
      setSaveName('');
      await refreshDrafts();
    } catch (err) {
      console.error('Critical error saving draft:', err);
      setError('Failed to save draft');
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
        await SupabaseDraftManager.deleteDraft(id);
        await refreshDrafts();
        setError(null);
        showToast('Draft deleted successfully!', 'success');
      } catch (err) {
        console.error('Error deleting draft from Supabase:', err);
        
        // Fallback to local storage
        try {
          DraftManager.deleteDraft(id);
          loadDraftsFromLocal(); // Just refresh local drafts, don't try Supabase again
          setError(null);
          showToast('Draft deleted locally (cloud delete failed)', 'warning');
        } catch (localError) {
          console.error('Error deleting draft locally:', localError);
          setError(t('draftManager.errors.deleteFailed'));
          showToast(t('draftManager.errors.deleteFailed'), 'error');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRenameDraft = async (id: string, newName: string) => {
    const draft = drafts.find(d => d.id === id);
    if (!draft || !newName.trim()) {
      setError('Invalid draft or name');
      return;
    }

    try {
      setIsLoading(true);
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
      await refreshDrafts();
      showToast('Draft renamed successfully!', 'success');
    } catch (err) {
      console.error('Error renaming draft in Supabase:', err);
      
      // Fallback to local storage
      try {
        DraftManager.saveDraft(
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
        loadDraftsFromLocal(); // Just refresh local drafts, don't try Supabase again
        showToast('Draft renamed locally (cloud update failed)', 'warning');
      } catch (localError) {
        console.error('Error renaming draft locally:', localError);
        setError('Failed to rename draft');
        showToast('Failed to rename draft', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportDraft = (id: string) => {
    try {
      DraftManager.exportDraft(id);
      setError(null);
      showToast('Draft exported successfully!', 'success');
    } catch (err) {
      console.error('Error exporting draft:', err);
      setError(t('draftManager.errors.exportFailed'));
      showToast(t('draftManager.errors.exportFailed'), 'error');
    }
  };

  const handleImportDraft = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    DraftManager.importDraft(file)
      .then(() => {
        refreshDrafts();
        setError(null);
        showToast(t('draftManager.status.importedSuccessfully'), 'success');
      })
      .catch((error) => {
        console.error('Import error:', error);
        setError(t('draftManager.errors.importFailed', { error: error.message }));
        showToast(t('draftManager.errors.importFailed', { error: error.message }), 'error');
      })
      .finally(() => {
        setIsLoading(false);
      });

    // Reset file input
    event.target.value = '';
  };

  const handleLoadDraft = async (draft: DraftResume) => {
    try {
      setLoadingDraftId(draft.id);
      setError(null);
      
      console.log('Loading draft in DraftManager:', draft);
      
      // Validate draft data before loading
      if (!draft.resumeData || !draft.resumeData.personalInfo) {
        throw new Error(t('draftManager.errors.invalidDraft'));
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
        selectedTemplate: draft.selectedTemplate || 'modern-two-column',
        customizations: draft.customizations || {
          colors: { primary: '#2563EB', secondary: '#1E40AF', accent: '#3B82F6' },
          font: 'Inter',
          sectionOrder: ['summary', 'experience', 'education', 'skills', 'certifications']
        },
        step: Math.max(0, Math.min(3, draft.step || 0))
      };

      console.log('Validated draft before loading:', validatedDraft);

      // Show loading feedback
      setLoadingDraftId(draft.id);
      
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));

      // Call the parent component's load function
      await onLoadDraft(validatedDraft);
      
      console.log('Draft load function called successfully');
      
    } catch (err) {
      console.error('Error loading draft:', err);
      setError(t('draftManager.errors.loadFailed'));
      showToast(t('draftManager.errors.loadFailed'), 'error');
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
            <h2 className="text-xl font-bold text-gray-900">{t('draftManager.title')}</h2>
            <p className="text-sm text-gray-600">{t('draftManager.subtitle')}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Error Display */}
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

          {/* Save Current Draft */}
          {currentResumeData && (
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
          <div className="mb-6 flex space-x-3">
            <label className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center text-sm cursor-pointer transition-colors">
              <Upload className="w-4 h-4 mr-2" />
              {t('draftManager.buttons.importDraft')}
              <input
                type="file"
                accept=".json"
                onChange={handleImportDraft}
                className="hidden"
                disabled={isLoading}
              />
            </label>
          </div>

          {/* Drafts List */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <FolderOpen className="w-5 h-5 mr-2" />
              {t('draftManager.info.draftsCount', { count: drafts.length })}
            </h3>

            {isLoading && !loadingDraftId ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-3"></div>
                <p className="text-gray-500">{t('draftManager.status.loadingDrafts')}</p>
              </div>
            ) : drafts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>{t('draftManager.status.noDrafts')}</p>
                <p className="text-sm">{t('draftManager.status.noDraftsDescription')}</p>
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
                                {t('draftManager.status.current')}
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
                            <span>{t('draftManager.info.updated', { date: formatDate(draft.updatedAt) })}</span>
                          </div>
                          <div>
                            <span className="font-medium">{t('draftManager.info.step', { stepName: getStepName(draft.step) })}</span>
                          </div>
                          <div>
                            <span className="font-medium">{t('draftManager.info.template', { templateName: draft.selectedTemplate })}</span>
                          </div>
                          <div>
                            <span className="font-medium">{t('draftManager.info.name', { name: draft.resumeData?.personalInfo?.name || 'Not set' })}</span>
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
                              {t('app.status.loading')}
                            </>
                          ) : (
                            t('draftManager.buttons.loadDraft')
                          )}
                        </button>
                        <button
                          onClick={() => handleExportDraft(draft.id)}
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                          title={t('draftManager.buttons.exportDraft')}
                          disabled={isLoading}
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDraft(draft.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title={t('draftManager.buttons.deleteDraft')}
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
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {t('draftManager.info.localStorage')}
            </p>
            <button
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              disabled={isLoading}
            >
              {t('app.buttons.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};