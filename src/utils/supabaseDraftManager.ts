import { supabase } from '../lib/supabase';
import { DraftResume, ResumeData } from '../types/resume';

export class SupabaseDraftManager {
  // Check if user is authenticated before operations
  private static async checkAuth() {
    console.log('🔒 SupabaseDraftManager: Checking authentication...');
    const { data: { user }, error } = await supabase.auth.getUser();
    console.log('🔒 SupabaseDraftManager: Auth check result:', { 
      hasUser: !!user, 
      userEmail: user?.email,
      error: error?.message 
    });
    if (error) {
      console.error('Auth check error:', error);
      throw new Error('Authentication failed');
    }
    if (!user) {
      console.error('🔒 SupabaseDraftManager: No user found in auth check');
      throw new Error('User not authenticated');
    }
    console.log('🔒 SupabaseDraftManager: User authenticated successfully');
    return user;
  }

  static async saveDraft(
    name: string,
    resumeData: ResumeData,
    selectedTemplate: string,
    customizations: any,
    step: number,
    draftId?: string
  ): Promise<string> {
    try {
      console.log('📤 SupabaseDraftManager: Starting saveDraft for:', name.substring(0, 20));
      const user = await this.checkAuth();

      const draftData = {
        user_id: user.id,
        name: name.trim(),
        resume_data: resumeData,
        selected_template: selectedTemplate,
        customizations: customizations || {},
        step: step,
        updated_at: new Date().toISOString()
      };

      if (draftId) {
        console.log('📤 SupabaseDraftManager: Updating existing draft:', draftId);
        // Update existing draft
        const { data, error } = await supabase
          .from('drafts')
          .update(draftData)
          .eq('id', draftId)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        console.log('📤 SupabaseDraftManager: Successfully updated draft:', data.id);
        return data.id;
      } else {
        console.log('📤 SupabaseDraftManager: Creating new draft');
        // Create new draft
        const { data, error } = await supabase
          .from('drafts')
          .insert(draftData)
          .select()
          .single();

        if (error) throw error;
        console.log('📤 SupabaseDraftManager: Successfully created draft:', data.id);
        return data.id;
      }
    } catch (error) {
      console.error('Error saving draft to Supabase:', error);
      throw new Error('Failed to save draft to cloud');
    }
  }

  static async getAllDrafts(): Promise<DraftResume[]> {
    try {
      console.log('📥 SupabaseDraftManager: Starting getAllDrafts');
      console.log('📥 SupabaseDraftManager: About to check auth...');
      const user = await this.checkAuth();
      console.log('📥 SupabaseDraftManager: User authenticated:', user.email);

      const { data, error } = await supabase
        .from('drafts')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('📥 SupabaseDraftManager: Supabase query error:', error);
        throw error;
        throw new Error(`Database query failed: ${error.message}`);
      }

      console.log('📥 SupabaseDraftManager: Query successful, returned:', data?.length || 0, 'drafts');
      return (data || []).map(draft => ({
        id: draft.id,
        name: draft.name,
        resumeData: draft.resume_data,
        selectedTemplate: draft.selected_template,
        customizations: draft.customizations || {},
        createdAt: draft.created_at,
        updatedAt: draft.updated_at,
        step: draft.step
      }));
    } catch (error) {
      console.error('📥 SupabaseDraftManager: Error in getAllDrafts:', error);
      console.error('📥 SupabaseDraftManager: Full error details:', error);
      throw error; // Re-throw to let caller handle fallback
    }
  }

  static async getDraft(id: string): Promise<DraftResume | null> {
    try {
      console.log('📥 SupabaseDraftManager: Starting getDraft for:', id);
      console.log('📥 SupabaseDraftManager: About to check auth for getDraft...');
      const user = await this.checkAuth();

      const { data, error } = await supabase
        .from('drafts')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('📥 SupabaseDraftManager: Draft not found:', id);
          return null; // Draft not found
        }
        console.error('📥 SupabaseDraftManager: Query error:', error);
        throw error;
      }

      console.log('📥 SupabaseDraftManager: Successfully retrieved draft:', id);
      return {
        id: data.id,
        name: data.name,
        resumeData: data.resume_data,
        selectedTemplate: data.selected_template,
        customizations: data.customizations || {},
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        step: data.step
      };
    } catch (error) {
      console.error('📥 SupabaseDraftManager: Error in getDraft:', error);
      throw error; // Re-throw to let caller handle fallback
    }
  }

  static async deleteDraft(id: string): Promise<void> {
    try {
      console.log('🗑️ SupabaseDraftManager: Starting deleteDraft for:', id);
      const user = await this.checkAuth();

      const { error } = await supabase
        .from('drafts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('🗑️ SupabaseDraftManager: Delete error:', error);
        throw error;
      }
      
      console.log('🗑️ SupabaseDraftManager: Successfully deleted draft:', id);
    } catch (error) {
      console.error('🗑️ SupabaseDraftManager: Error in deleteDraft:', error);
      throw new Error('Failed to delete draft from cloud');
    }
  }

  static async getRecentDrafts(limit: number = 5): Promise<DraftResume[]> {
    try {
      console.log('📥 SupabaseDraftManager: Starting getRecentDrafts, limit:', limit);
      const user = await this.checkAuth();

      const { data, error } = await supabase
        .from('drafts')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('📥 SupabaseDraftManager: getRecentDrafts error:', error);
        throw error;
      }

      console.log('📥 SupabaseDraftManager: Retrieved recent drafts:', data?.length || 0);
      return (data || []).map(draft => ({
        id: draft.id,
        name: draft.name,
        resumeData: draft.resume_data,
        selectedTemplate: draft.selected_template,
        customizations: draft.customizations || {},
        createdAt: draft.created_at,
        updatedAt: draft.updated_at,
        step: draft.step
      }));
    } catch (error) {
      console.error('📥 SupabaseDraftManager: Error in getRecentDrafts:', error);
      throw error; // Re-throw to let caller handle fallback
    }
  }

  // Save resume data separately for backup
  static async saveResumeData(resumeData: ResumeData): Promise<string> {
    try {
      console.log('📤 SupabaseDraftManager: Starting saveResumeData');
      const user = await this.checkAuth();

      // Check if user already has resume data
      const { data: existing, error: fetchError } = await supabase
        .from('resume_data')
        .select('id')
        .eq('user_id', user.id)
        .single();

      const resumeRecord = {
        user_id: user.id,
        personal_info: resumeData.personalInfo,
        summary: resumeData.summary,
        experience: resumeData.experience,
        education: resumeData.education,
        skills: resumeData.skills,
        certifications: resumeData.certifications,
        languages: resumeData.languages || [],
        custom_sections: resumeData.customSections || {},
        updated_at: new Date().toISOString()
      };

      if (existing && !fetchError) {
        // Update existing record
        const { data, error } = await supabase
          .from('resume_data')
          .update(resumeRecord)
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        console.log('📤 SupabaseDraftManager: Updated existing resume data:', data.id);
        return data.id;
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('resume_data')
          .insert(resumeRecord)
          .select()
          .single();

        if (error) throw error;
        console.log('📤 SupabaseDraftManager: Created new resume data:', data.id);
        return data.id;
      }
    } catch (error) {
      console.error('Error saving resume data to Supabase:', error);
      throw new Error('Failed to save resume data to cloud');
    }
  }

  static async getResumeData(): Promise<ResumeData | null> {
    try {
      console.log('📥 SupabaseDraftManager: Starting getResumeData');
      const user = await this.checkAuth();

      const { data, error } = await supabase
        .from('resume_data')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('📥 SupabaseDraftManager: No resume data found');
          return null; // No resume data found
        }
        throw error;
      }

      console.log('📥 SupabaseDraftManager: Successfully retrieved resume data');
      return {
        personalInfo: data.personal_info,
        summary: data.summary || '',
        experience: data.experience || [],
        education: data.education || [],
        skills: data.skills || [],
        certifications: data.certifications || [],
        languages: data.languages || [],
        customSections: data.custom_sections || {}
      };
    } catch (error) {
      console.error('📥 SupabaseDraftManager: Error in getResumeData:', error);
      throw error; // Re-throw to let caller handle fallback
    }
  }
}