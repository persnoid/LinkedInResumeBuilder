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
    const drafts = this.getAllDrafts();
    const now = new Date().toISOString();
    
    const draft: DraftResume = {
      id: draftId || this.generateId(),
      name,
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
    
    return draft.id;
  }

  static getAllDrafts(): DraftResume[] {
    try {
      const drafts = localStorage.getItem(DRAFTS_STORAGE_KEY);
      return drafts ? JSON.parse(drafts) : [];
    } catch (error) {
      console.error('Error loading drafts:', error);
      return [];
    }
  }

  static getDraft(id: string): DraftResume | null {
    const drafts = this.getAllDrafts();
    return drafts.find(draft => draft.id === id) || null;
  }

  static deleteDraft(id: string): void {
    const drafts = this.getAllDrafts();
    const filteredDrafts = drafts.filter(draft => draft.id !== id);
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(filteredDrafts));
    
    // Clear current draft if it was deleted
    const currentDraftId = localStorage.getItem(CURRENT_DRAFT_KEY);
    if (currentDraftId === id) {
      localStorage.removeItem(CURRENT_DRAFT_KEY);
    }
  }

  static getCurrentDraftId(): string | null {
    return localStorage.getItem(CURRENT_DRAFT_KEY);
  }

  static clearCurrentDraft(): void {
    localStorage.removeItem(CURRENT_DRAFT_KEY);
  }

  static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  static exportDraft(id: string): void {
    const draft = this.getDraft(id);
    if (!draft) return;

    const dataStr = JSON.stringify(draft, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${draft.name.replace(/[^a-z0-9]/gi, '_')}_draft.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  static importDraft(file: File): Promise<DraftResume> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const draft = JSON.parse(e.target?.result as string) as DraftResume;
          
          // Validate draft structure
          if (!draft.id || !draft.name || !draft.resumeData) {
            throw new Error('Invalid draft file format');
          }

          // Generate new ID to avoid conflicts
          draft.id = this.generateId();
          draft.updatedAt = new Date().toISOString();
          
          // Save imported draft
          const drafts = this.getAllDrafts();
          drafts.push(draft);
          localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
          
          resolve(draft);
        } catch (error) {
          reject(new Error('Failed to import draft file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  static getRecentDrafts(limit: number = 5): DraftResume[] {
    const drafts = this.getAllDrafts();
    return drafts
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, limit);
  }
}