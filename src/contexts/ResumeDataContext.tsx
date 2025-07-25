import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { ResumeData, DraftResume, Customizations } from '../types/resume';
import { SupabaseDraftManager } from '../utils/supabaseDraftManager';
import { useAuth } from './AuthContext';

interface ResumeDataContextType {
  // Core data state
  resumeData: ResumeData | null;
  drafts: DraftResume[];
  activeDraftId: string | null;
  activeDraftName: string | null;
  
  // Loading and error states
  isLoading: boolean;
  isDataLoaded: boolean;
  error: string | null;
  
  // Data management functions
  loadAllUserData: (user: User) => Promise<void>;
  updateResumeData: (newData: ResumeData) => Promise<void>;
  saveDraft: (name: string, data: ResumeData, template: string, customizations: Customizations, step: number, draftId?: string) => Promise<string>;
  deleteDraft: (draftId: string) => Promise<void>;
  setActiveDraft: (draftId: string | null, draftName?: string | null) => void;
  loadDraft: (draft: DraftResume) => void;
  clearData: () => void;
  
  // Template and customization state
  selectedTemplate: string;
  customizations: Customizations;
  setSelectedTemplate: (template: string) => void;
  setCustomizations: (customizations: Customizations) => void;
}

const ResumeDataContext = createContext<ResumeDataContextType | undefined>(undefined);

interface ResumeDataProviderProps {
  children: ReactNode;
}

export const ResumeDataProvider: React.FC<ResumeDataProviderProps> = ({ children }) => {
  // Core data state
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [drafts, setDrafts] = useState<DraftResume[]>([]);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [activeDraftName, setActiveDraftName] = useState<string | null>(null);
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Template and customization state
  const [selectedTemplate, setSelectedTemplate] = useState('azurill');
  const [customizations, setCustomizations] = useState<Customizations>({
    colors: { primary: '#1f2937', secondary: '#6b7280', accent: '#3b82f6' },
    typography: { fontFamily: 'Inter, sans-serif' },
    spacing: {},
    sections: {}
  });

  const { user } = useAuth();

  console.log('📊 ResumeDataContext - Current state:', {
    hasUser: !!user,
    hasResumeData: !!resumeData,
    draftsCount: drafts.length,
    isLoading,
    isDataLoaded,
    activeDraftId,
    error
  });

  // Clear all data when user signs out
  useEffect(() => {
    if (!user && isDataLoaded) {
      console.log('📊 ResumeDataContext - User signed out, clearing all data');
      clearData();
    }
  }, [user, isDataLoaded]);

  const clearData = useCallback(() => {
    console.log('📊 ResumeDataContext - Clearing all data');
    setResumeData(null);
    setDrafts([]);
    setActiveDraftId(null);
    setActiveDraftName(null);
    setIsLoading(false);
    setIsDataLoaded(false);
    setError(null);
    setSelectedTemplate('azurill');
    setCustomizations({
      colors: { primary: '#1f2937', secondary: '#6b7280', accent: '#3b82f6' },
      typography: { fontFamily: 'Inter, sans-serif' },
      spacing: {},
      sections: {}
    });
  }, []);

  const loadAllUserData = useCallback(async (user: User) => {
    console.log('📊 ResumeDataContext - loadAllUserData called for user:', user.email);
    
    if (isLoading || isDataLoaded) {
      console.log('📊 ResumeDataContext - Data already loading or loaded, skipping');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('📊 ResumeDataContext - Loading resume data and drafts...');
      
      // Load both resume data and drafts in parallel
      const [userResumeData, userDrafts] = await Promise.all([
        SupabaseDraftManager.getResumeData(user),
        SupabaseDraftManager.getAllDrafts(user)
      ]);

      console.log('📊 ResumeDataContext - Data loaded:', {
        hasResumeData: !!userResumeData,
        draftsCount: userDrafts.length
      });

      setResumeData(userResumeData);
      setDrafts(userDrafts);
      setIsDataLoaded(true);
      setError(null);

    } catch (error: any) {
      console.error('📊 ResumeDataContext - Error loading user data:', error);
      setError(error.message || 'Failed to load user data');
      setIsDataLoaded(true); // Mark as loaded even with error to prevent retry loops
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, isDataLoaded]);

  const updateResumeData = useCallback(async (newData: ResumeData) => {
    console.log('📊 ResumeDataContext - updateResumeData called');
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      // Optimistically update the cache first
      setResumeData(newData);
      
      // Then persist to database
      await SupabaseDraftManager.saveResumeData(newData, user);
      console.log('📊 ResumeDataContext - Resume data updated successfully');
      
    } catch (error: any) {
      console.error('📊 ResumeDataContext - Error updating resume data:', error);
      // Revert optimistic update on error
      // Note: We could implement more sophisticated error recovery here
      throw error;
    }
  }, [user]);

  const saveDraft = useCallback(async (
    name: string,
    data: ResumeData,
    template: string,
    customizations: Customizations,
    step: number,
    draftId?: string
  ): Promise<string> => {
    console.log('📊 ResumeDataContext - saveDraft called:', { name, template, step, draftId: !!draftId });
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      // Save to database first
      const savedDraftId = await SupabaseDraftManager.saveDraft(
        name,
        data,
        template,
        customizations,
        step,
        draftId,
        user
      );

      // Update cache after successful database save
      const draftData: DraftResume = {
        id: savedDraftId,
        name,
        resumeData: data,
        selectedTemplate: template,
        customizations,
        step,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (draftId) {
        // Update existing draft in cache
        setDrafts(prev => prev.map(draft => 
          draft.id === draftId ? draftData : draft
        ));
      } else {
        // Add new draft to cache
        setDrafts(prev => [draftData, ...prev]);
      }

      // Update active draft info
      setActiveDraftId(savedDraftId);
      setActiveDraftName(name);

      console.log('📊 ResumeDataContext - Draft saved successfully, ID:', savedDraftId);
      return savedDraftId;
      
    } catch (error: any) {
      console.error('📊 ResumeDataContext - Error saving draft:', error);
      throw error;
    }
  }, [user]);

  const deleteDraft = useCallback(async (draftId: string) => {
    console.log('📊 ResumeDataContext - deleteDraft called for ID:', draftId);
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      // Delete from database first
      await SupabaseDraftManager.deleteDraft(draftId, user);
      
      // Remove from cache after successful database deletion
      setDrafts(prev => prev.filter(draft => draft.id !== draftId));
      
      // Clear active draft if it was the deleted one
      if (activeDraftId === draftId) {
        setActiveDraftId(null);
        setActiveDraftName(null);
      }

      console.log('📊 ResumeDataContext - Draft deleted successfully');
      
    } catch (error: any) {
      console.error('📊 ResumeDataContext - Error deleting draft:', error);
      throw error;
    }
  }, [user, activeDraftId]);

  const setActiveDraft = useCallback((draftId: string | null, draftName?: string | null) => {
    console.log('📊 ResumeDataContext - setActiveDraft called:', { draftId, draftName });
    setActiveDraftId(draftId);
    setActiveDraftName(draftName || null);
  }, []);

  const loadDraft = useCallback((draft: DraftResume) => {
    console.log('📊 ResumeDataContext - loadDraft called:', draft.id, draft.name);
    setResumeData(draft.resumeData);
    setSelectedTemplate(draft.selectedTemplate);
    setCustomizations(draft.customizations);
    setActiveDraftId(draft.id);
    setActiveDraftName(draft.name);
  }, []);

  const contextValue: ResumeDataContextType = {
    // Core data state
    resumeData,
    drafts,
    activeDraftId,
    activeDraftName,
    
    // Loading and error states
    isLoading,
    isDataLoaded,
    error,
    
    // Data management functions
    loadAllUserData,
    updateResumeData,
    saveDraft,
    deleteDraft,
    setActiveDraft,
    loadDraft,
    clearData,
    
    // Template and customization state
    selectedTemplate,
    customizations,
    setSelectedTemplate,
    setCustomizations,
  };

  return (
    <ResumeDataContext.Provider value={contextValue}>
      {children}
    </ResumeDataContext.Provider>
  );
};

export const useResumeData = (): ResumeDataContextType => {
  const context = useContext(ResumeDataContext);
  if (context === undefined) {
    throw new Error('useResumeData must be used within a ResumeDataProvider');
  }
  return context;
};