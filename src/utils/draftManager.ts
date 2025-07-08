import { DraftResume, ResumeData } from '../types/resume';

const DRAFTS_STORAGE_KEY = 'linkedin_resume_drafts';
const CURRENT_DRAFT_KEY = 'linkedin_resume_current_draft';

export class DraftManager {
  static saveDraft(
    name: string,
    resumeData: ResumeData,
    selectedTemplate: string,
    customizations: any,
    step: number,
    draftId?: string
  ): string {
    try {
      const drafts = this.getAllDrafts();
      const now = new Date().toISOString();
      
      const draft: DraftResume = {
        id: draftId || this.generateId(),
        name: name.trim(),
        resumeData,
        selectedTemplate,
        customizations,
        createdAt: draftId ? drafts.find(d => d.id === draftId)?.createdAt || now : now,
        updatedAt: now,
        step
      };

      if (draftId) {
        // Update existing draft
        const index = drafts.findIndex(d => d.id === draftId);
        if (index !== -1) {
          drafts[index] = draft;
        } else {
          drafts.push(draft);
        }
      } else {
        // Create new draft
        drafts.push(draft);
      }

      localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
      localStorage.setItem(CURRENT_DRAFT_KEY, draft.id);
      
      console.log('Draft saved successfully:', draft.id); // Debug log
      return draft.id;
    } catch (error) {
      console.error('Error saving draft:', error);
      throw new Error('Failed to save draft');
    }
  }

  static getAllDrafts(): DraftResume[] {
    console.log('🗂️ DraftManager.getAllDrafts(): START');
    try {
      const drafts = localStorage.getItem(DRAFTS_STORAGE_KEY);
      console.log('🗂️ DraftManager.getAllDrafts(): Raw localStorage content:', drafts ? `${drafts.length} characters` : 'null');
      console.log('🗂️ DraftManager.getAllDrafts(): Raw localStorage content preview:', drafts ? drafts.substring(0, 200) + '...' : 'null');
      if (!drafts) {
        console.log('No drafts found in localStorage'); // Debug log
        console.log('🗂️ DraftManager.getAllDrafts(): END - returning empty array (no data)');
        return [];
      }
      
      const parsedDrafts = JSON.parse(drafts);
      console.log('Loaded drafts from localStorage:', parsedDrafts); // Debug log
      console.log('🗂️ DraftManager.getAllDrafts(): Parsed', parsedDrafts.length, 'raw drafts from JSON');
      
      // Validate draft structure
      const validDrafts = parsedDrafts.filter((draft: any) => {
        const isValid = draft && 
               typeof draft.id === 'string' && 
               typeof draft.name === 'string' && 
               draft.resumeData && 
               typeof draft.selectedTemplate === 'string' &&
               typeof draft.step === 'number';
        if (!isValid) {
          console.log('🗂️ DraftManager.getAllDrafts(): Invalid draft filtered out:', draft?.id || 'unknown', draft?.name || 'unknown');
        }
        return draft && 
               typeof draft.id === 'string' && 
               typeof draft.name === 'string' && 
               draft.resumeData && 
               typeof draft.selectedTemplate === 'string' &&
               typeof draft.step === 'number';
      });
      
      console.log('🗂️ DraftManager.getAllDrafts(): After validation:', validDrafts.length, 'valid drafts');
      if (validDrafts.length !== parsedDrafts.length) {
        console.warn('Some drafts were invalid and filtered out');
        console.log('🗂️ DraftManager.getAllDrafts(): Filtered out', parsedDrafts.length - validDrafts.length, 'invalid drafts');
        // Save cleaned drafts back to localStorage
        localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(validDrafts));
        console.log('🗂️ DraftManager.getAllDrafts(): Cleaned drafts saved back to localStorage');
      }
      
      console.log('🗂️ DraftManager.getAllDrafts(): END - returning', validDrafts.length, 'valid drafts');
      return validDrafts;
    } catch (error) {
      console.error('Error loading drafts:', error);
      console.log('🗂️ DraftManager.getAllDrafts(): ERROR - clearing corrupted data and returning empty array');
      // Clear corrupted data
      localStorage.removeItem(DRAFTS_STORAGE_KEY);
      return [];
    }
  }

  static getDraft(id: string): DraftResume | null {
    console.log('🗂️ DraftManager.getDraft(): START for ID:', id);
    try {
      const drafts = this.getAllDrafts();
      console.log('🗂️ DraftManager.getDraft(): Got', drafts.length, 'total drafts to search');
      const draft = drafts.find(draft => draft.id === id) || null;
      console.log('Retrieved draft:', id, draft); // Debug log
      console.log('🗂️ DraftManager.getDraft(): END - found draft:', !!draft);
      return draft;
    } catch (error) {
      console.error('Error getting draft:', error);
      console.log('🗂️ DraftManager.getDraft(): ERROR - returning null');
      return null;
    }
  }

  static deleteDraft(id: string): void {
    try {
      const drafts = this.getAllDrafts();
      const filteredDrafts = drafts.filter(draft => draft.id !== id);
      localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(filteredDrafts));
      
      // Clear current draft if it was deleted
      const currentDraftId = localStorage.getItem(CURRENT_DRAFT_KEY);
      if (currentDraftId === id) {
        localStorage.removeItem(CURRENT_DRAFT_KEY);
      }
      
      console.log('Draft deleted successfully:', id); // Debug log
    } catch (error) {
      console.error('Error deleting draft:', error);
      throw new Error('Failed to delete draft');
    }
  }

  static getCurrentDraftId(): string | undefined {
    try {
      return localStorage.getItem(CURRENT_DRAFT_KEY) || undefined;
    } catch (error) {
      console.error('Error getting current draft ID:', error);
      return undefined;
    }
  }

  static clearCurrentDraft(): void {
    try {
      localStorage.removeItem(CURRENT_DRAFT_KEY);
      console.log('Current draft cleared'); // Debug log
    } catch (error) {
      console.error('Error clearing current draft:', error);
    }
  }

  static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  static exportDraft(id: string): void {
    try {
      const draft = this.getDraft(id);
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
      console.log('Draft exported successfully:', id); // Debug log
    } catch (error) {
      console.error('Error exporting draft:', error);
      throw new Error('Failed to export draft');
    }
  }

  static importDraft(file: File): Promise<DraftResume> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const draft = JSON.parse(e.target?.result as string) as DraftResume;
          
          // Validate draft structure
          if (!draft.id || !draft.name || !draft.resumeData || !draft.selectedTemplate) {
            throw new Error('Invalid draft file format');
          }

          // Generate new ID to avoid conflicts
          draft.id = this.generateId();
          draft.updatedAt = new Date().toISOString();
          
          // Save imported draft
          const drafts = this.getAllDrafts();
          drafts.push(draft);
          localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
          
          console.log('Draft imported successfully:', draft.id); // Debug log
          resolve(draft);
        } catch (error) {
          console.error('Error importing draft:', error);
          reject(new Error('Failed to import draft file'));
        }
      };
      reader.onerror = () => {
        console.error('File reader error');
        reject(new Error('Failed to read file'));
      };
      reader.readAsText(file);
    });
  }

  static getRecentDrafts(limit: number = 5): DraftResume[] {
    try {
      const drafts = this.getAllDrafts();
      return drafts
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting recent drafts:', error);
      return [];
    }
  }

  // Debug method to check localStorage
  static debugStorage(): void {
    console.log('=== Draft Manager Debug ===');
    console.log('Drafts in localStorage:', localStorage.getItem(DRAFTS_STORAGE_KEY));
    console.log('Current draft ID:', localStorage.getItem(CURRENT_DRAFT_KEY));
    console.log('All drafts:', this.getAllDrafts());
    console.log('========================');
  }
}