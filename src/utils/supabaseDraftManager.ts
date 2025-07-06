import { supabase } from '../lib/supabase';
import { DraftResume, ResumeData } from '../types/resume';

export class SupabaseDraftManager {
  static async saveDraft(
    name: string,
    resumeData: ResumeData,
    selectedTemplate: string,
    customizations: any,
    step: number,
    draftId?: string
  ): Promise<string> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

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
        // Update existing draft
        const { data, error } = await supabase
          .from('drafts')
          .update(draftData)
          .eq('id', draftId)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        return data.id;
      } else {
        // Create new draft
        const { data, error } = await supabase
          .from('drafts')
          .insert(draftData)
          .select()
          .single();

        if (error) throw error;
        return data.id;
      }
    } catch (error) {
      console.error('Error saving draft to Supabase:', error);
      throw new Error('Failed to save draft to cloud');
    }
  }

  static async getAllDrafts(): Promise<DraftResume[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }

      const { data, error } = await supabase
        .from('drafts')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

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
      console.error('Error loading drafts from Supabase:', error);
      return [];
    }
  }

  static async getDraft(id: string): Promise<DraftResume | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }

      const { data, error } = await supabase
        .from('drafts')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Draft not found
        }
        throw error;
      }

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
      console.error('Error getting draft from Supabase:', error);
      return null;
    }
  }

  static async deleteDraft(id: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('drafts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting draft from Supabase:', error);
      throw new Error('Failed to delete draft from cloud');
    }
  }

  static async getRecentDrafts(limit: number = 5): Promise<DraftResume[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }

      const { data, error } = await supabase
        .from('drafts')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

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
      console.error('Error loading recent drafts from Supabase:', error);
      return [];
    }
  }

  // Save resume data separately for backup
  static async saveResumeData(resumeData: ResumeData): Promise<string> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

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
        return data.id;
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('resume_data')
          .insert(resumeRecord)
          .select()
          .single();

        if (error) throw error;
        return data.id;
      }
    } catch (error) {
      console.error('Error saving resume data to Supabase:', error);
      throw new Error('Failed to save resume data to cloud');
    }
  }

  static async getResumeData(): Promise<ResumeData | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }

      const { data, error } = await supabase
        .from('resume_data')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No resume data found
        }
        throw error;
      }

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
      console.error('Error loading resume data from Supabase:', error);
      return null;
    }
  }
}