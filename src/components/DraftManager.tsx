import React, { useState, useEffect } from 'react';
import { Save, FolderOpen, Trash2, Download, Upload, Clock, FileText, X, Edit3, Check } from 'lucide-react';
import { DraftManager } from '../utils/draftManager';
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
  const [loadingDraftId, setLoadingDraftId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [dataSource, setDataSource] = useState<'supabase' | 'local' | 'none'>('none');

  useEffect(() => {
    if (isOpen) {
      console.log('🗂️ DraftManager: Modal opened, starting to load drafts...');
      loadDrafts();
    } else {
      // Reset state when modal closes
      setError(null);
      setIsLoading(false);
      setDataSource('none');
    }
  }, [isOpen]);

  const loadDrafts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('🗂️ DraftManager: Starting draft loading process...');
      console.log('🗂️ DraftManager: User authenticated:', !!user, user?.email);

      if (user) {
        console.log('🗂️ DraftManager: User is authenticated, trying Supabase...');
        await loadDraftsFromSupabase();
      } else {
        console.log('🗂️ DraftManager: No user authenticated, using local storage only...');
        loadDraftsFromLocal();
      }
    } catch (error) {
      console.error('🗂️ DraftManager: Critical error in loadDrafts:', error);
      setError('Failed to load drafts');
    } finally {
      setIsLoading(false);
      console.log('🗂️ DraftManager: Loading process completed');
    }
  };

  const loadDraftsFromSupabase = async () => {
    try {
      console.log('🗂️ DraftManager: Attempting to load drafts from Supabase...');
      const supabaseDrafts = await SupabaseDraftManager.getAllDrafts();
      console.log('🗂️ DraftManager: Successfully loaded', supabaseDrafts.length, 'drafts from Supabase');
      
      setDrafts(supabaseDrafts);
      setDataSource('supabase');
      setError(null);
      
      if (supabaseDrafts.length === 0) {
        console.log('🗂️ DraftManager: No drafts found in Supabase, checking local storage...');
        const localDrafts = DraftManager.getAllDrafts();
        if (localDrafts.length > 0) {
          console.log('🗂️ DraftManager: Found', localDrafts.length, 'local drafts, showing hybrid message');
          setError('No cloud drafts found. Local drafts are available but not synced to cloud.');
        }
      }
    } catch (supabaseError) {
      console.error('🗂️ DraftManager: Supabase loading failed:', supabaseError);
      console.log('🗂️ DraftManager: Falling back to local storage...');
      loadDraftsFromLocal();
    }
  };

  const loadDraftsFromLocal = () => {
    try {
      console.log('🗂️ DraftManager: Loading drafts from local storage...');
      const localDrafts = DraftManager.getAllDrafts();
      console.log('🗂️ DraftManager: Successfully loaded', localDrafts.length, 'drafts from local storage');
      
      setDrafts(localDrafts);
      setDataSource('local');
      
      if (localDrafts.length > 0) {
        setError('Showing local drafts (cloud sync unavailable)');
      } else {
        setError(null);
      }
    } catch (localError) {
      console.error('🗂️ DraftManager: Local storage loading failed:', localError);
      setDrafts([]);
      setDataSource('none');
      setError('Failed to load drafts from both cloud and local storage');
    }
  };

  const refreshDrafts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (user && dataSource === 'supabase') {
        console.log('🗂️ DraftManager: Refreshing from Supabase...');
        await loadDraftsFromSupabase();
      } else {
        console.log('🗂️ DraftManager: Refreshing from local storage...');
        loadDraftsFromLocal();
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
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      console.log('🗂️ DraftManager: Quick save started for:', saveName.trim());
      
      const name = saveName.trim();
      let draftId: string;
      let savedToCloud = false;
      
      if (user) {
        try {
          console.log('🗂️ DraftManager: Attempting to save to Supabase...');
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
          console.log('🗂️ DraftManager: Successfully saved to Supabase with ID:', draftId);
          showToast('Draft saved to cloud successfully!', 'success');
          savedToCloud = true;
        } catch (supabaseError) {
          console.error('🗂️ DraftManager: Supabase save failed:', supabaseError);
          
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
          
          console.log('🗂️ DraftManager: Saved to local storage with ID:', draftId);
          showToast('Draft saved locally (cloud sync unavailable)', 'warning');
        }
      } else {
        // No user, save locally only
        console.log('🗂️ DraftManager: No user, saving locally only...');
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
        
        console.log('🗂️ DraftManager: Saved to local storage with ID:', draftId);
        showToast('Draft saved locally', 'success');
      }
      
      setSaveName('');
      await refreshDrafts();
      
      // Update data source if we successfully saved to cloud
      if (savedToCloud) {
        setDataSource('supabase');
      }
    } catch (err) {
      console.error('🗂️ DraftManager: Critical error saving draft:', err);
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
        console.log('🗂️ DraftManager: Deleting draft:', id);
        
        if (dataSource === 'supabase' && user) {
          console.log('🗂️ DraftManager: Deleting from Supabase...');
          await SupabaseDraftManager.deleteDraft(id);
        } else {
          console.log('🗂️ DraftManager: Deleting from local storage...');
          DraftManager.deleteDraft(id);
        }
        
        await refreshDrafts();
        setError(null);
        showToast('Draft deleted successfully!', 'success');
      } catch (err) {
        console.error('🗂️ DraftManager: Error deleting draft:', err);
        
        // If cloud delete failed, try local delete
        if (dataSource === 'supabase') {
          try {
            console.log('🗂️ DraftManager: Cloud delete failed, trying local delete...');
            DraftManager.deleteDraft(id);
            loadDraftsFromLocal(); // Refresh local drafts only
            setError('Draft deleted locally (cloud delete failed)');
            showToast('Draft deleted locally (cloud delete failed)', 'warning');
          } catch (localError) {
            console.error('🗂️ DraftManager: Local delete also failed:', localError);
            setError('Failed to delete draft');
            showToast('Failed to delete draft', 'error');
          }
        } else {
          setError('Failed to delete draft');
          showToast('Failed to delete draft', 'error');
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
      console.log('🗂️ DraftManager: Renaming draft:', id, 'to:', newName.trim());
      
      if (dataSource === 'supabase' && user) {
        console.log('🗂️ DraftManager: Renaming in Supabase...');
        await SupabaseDraftManager.saveDraft(
          newName.trim(),
          draft.resumeData,
          draft.selectedTemplate,
          draft.customizations,
          draft.step,
          id
        );
      } else {
        console.log('🗂️ DraftManager: Renaming in local storage...');
        DraftManager.saveDraft(
          newName.trim(),
          draft.resumeData,
          draft.selectedTemplate,
          draft.customizations,
          draft.step,
          id
        );
      }

      setEditingId(null);
      setEditingName('');
      setError(null);
      await refreshDrafts();
      showToast('Draft renamed successfully!', 'success');
    } catch (err) {
      console.error('🗂️ DraftManager: Error renaming draft:', err);
      
      // If cloud rename failed, try local rename
      if (dataSource === 'supabase') {
        try {
          console.log('🗂️ DraftManager: Cloud rename failed, trying local rename...');
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
          setError('Draft renamed locally (cloud update failed)');
          loadDraftsFromLocal(); // Refresh local drafts only
          showToast('Draft renamed locally (cloud update failed)', 'warning');
        } catch (localError) {
          console.error('🗂️ DraftManager: Local rename also failed:', localError);
          setError('Failed to rename draft');
          showToast('Failed to rename draft', 'error');
        }
      } else {
        setError('Failed to rename draft');
        showToast('Failed to rename draft', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportDraft = (id: string) => {
    try {
      console.log('🗂️ DraftManager: Exporting draft:', id);
      DraftManager.exportDraft(id);
      setError(null);
      showToast('Draft exported successfully!', 'success');
    } catch (err) {
      console.error('🗂️ DraftManager: Error exporting draft:', err);
      setError(t('draftManager.errors.exportFailed'));
      showToast(t('draftManager.errors.exportFailed'), 'error');
    }
  };

  const handleImportDraft = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('🗂️ DraftManager: Importing draft from file:', file.name);
    setIsLoading(true);
    DraftManager.importDraft(file)
      .then(() => {
        console.log('🗂️ DraftManager: Draft imported successfully');
        refreshDrafts();
        setError(null);
        showToast(t('draftManager.status.importedSuccessfully'), 'success');
      })
      .catch((error) => {
        console.error('🗂️ DraftManager: Import error:', error);
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
      
      console.log('🗂️ DraftManager: Loading draft:', draft.id, draft.name);
      
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

  const getDataSourceDisplay = () => {
    switch (dataSource) {
      case 'supabase':
        return 'Cloud Storage';
      case 'local':
        return 'Local Storage';
      default:
        return 'No Data';
    }
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
            <div className="flex items-center mt-1">
              <span className="text-xs text-gray-500">Data Source: {getDataSourceDisplay()}</span>
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
          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
              <div className="flex items-center justify-between">
                <span>{error}</span>
                <button 
                  onClick={() => setError(null)}
                  className="text-yellow-500 hover:text-yellow-700"
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
                <p className="text-xs text-gray-400 mt-1">Checking cloud and local storage...</p>
              </div>
            ) : drafts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>{t('draftManager.status.noDrafts')}</p>
                <p className="text-sm">{t('draftManager.status.noDraftsDescription')}</p>
                {!user && (
                  <p className="text-xs text-blue-600 mt-2">Sign in to sync drafts across devices</p>
                )}
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
            <div className="text-sm text-gray-600">
              <p>Data stored in: {getDataSourceDisplay()}</p>
              {dataSource === 'local' && (
                <p className="text-xs text-yellow-600">Sign in to sync drafts to cloud storage</p>
              )}
            </div>
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