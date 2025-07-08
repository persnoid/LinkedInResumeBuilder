import { DraftResume, ResumeData } from '../types/resume';

// DEPRECATED: This class is deprecated and only kept for backwards compatibility
// All draft operations should now use SupabaseDraftManager for cloud storage
export class DraftManager {
  static saveDraft(
    name: string,
    resumeData: ResumeData,
    selectedTemplate: string,
    customizations: any,
    step: number,
    draftId?: string
  ): string {
    console.warn('DraftManager.saveDraft is deprecated. Use SupabaseDraftManager instead.');
    throw new Error('Local storage for drafts is no longer supported. Please sign in to save drafts to cloud storage.');
  }

  static getAllDrafts(): DraftResume[] {
    console.warn('DraftManager.getAllDrafts is deprecated. Use SupabaseDraftManager instead.');
    return [];
  }

  static getDraft(id: string): DraftResume | null {
    console.warn('DraftManager.getDraft is deprecated. Use SupabaseDraftManager instead.');
    return null;
  }

  static deleteDraft(id: string): void {
    console.warn('DraftManager.deleteDraft is deprecated. Use SupabaseDraftManager instead.');
    throw new Error('Local storage for drafts is no longer supported. Please sign in to manage drafts in cloud storage.');
  }

  static getCurrentDraftId(): string | undefined {
    console.warn('DraftManager.getCurrentDraftId is deprecated. Current draft tracking is now handled by application state.');
    return undefined;
  }

  static clearCurrentDraft(): void {
    console.warn('DraftManager.clearCurrentDraft is deprecated. Current draft tracking is now handled by application state.');
    throw new Error('Local storage for drafts is no longer supported.');
  }

  static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  static exportDraft(id: string): void {
    console.warn('DraftManager.exportDraft is deprecated. Use SupabaseDraftManager instead.');
    throw new Error('Local storage export is no longer supported. Please use cloud storage export functionality.');
  }

  static importDraft(file: File): Promise<DraftResume> {
    console.warn('DraftManager.importDraft is deprecated. Use SupabaseDraftManager instead.');
    return Promise.reject(new Error('Local storage import is no longer supported. Please use cloud storage import functionality.'));
  }

  static getRecentDrafts(limit: number = 5): DraftResume[] {
    console.warn('DraftManager.getRecentDrafts is deprecated. Use SupabaseDraftManager instead.');
    return [];
  }
}