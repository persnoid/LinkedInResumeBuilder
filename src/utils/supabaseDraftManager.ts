import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { ResumeData, DraftResume, Customizations } from '../types/resume';

interface SupabaseResumeData {
  id: string;
  user_id: string;
  personal_info: any;
  summary: string | null;
  experience: any;
  education: any;
  skills: any;
  certifications: any;
  languages: any;
  custom_sections: any;
  created_at: string;
  updated_at: string;
}

interface SupabaseDraft {
  id: string;
  user_id: string;
  name: string;
  resume_data: any;
  selected_template: string;
  customizations: any;
  step: number;
  created_at: string;
  updated_at: string;
}

export class SupabaseDraftManager {
  private static readonly QUERY_TIMEOUT = 5000; // 5 seconds

  /**
   * Check authentication with timeout
   */
  private static async checkAuth(providedUser?: User | null, timeout: number = 10000): Promise<User> {
    console.log('🗄️ SupabaseDraftManager: checkAuth called with providedUser:', !!providedUser);
    
    // If user is provided from AuthContext, use it directly
    if (providedUser) {
      console.log('🗄️ SupabaseDraftManager: Using provided user:', providedUser.email);
      return providedUser;
    }

    console.log('🗄️ SupabaseDraftManager: No provided user, checking Supabase session...');
    try {
      // Simplified auth check without Promise.race
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('🗄️ SupabaseDraftManager: Auth error:', error);
        throw new Error(`Authentication error: ${error.message}`);
      }
      
      if (!session?.user) {
        console.error('🗄️ SupabaseDraftManager: No authenticated user');
        throw new Error('No authenticated user found. Please sign in.');
      }
      
      console.log('🗄️ SupabaseDraftManager: Auth check successful for user:', session.user.email);
      return session.user;
    } catch (error: any) {
      console.error('🗄️ SupabaseDraftManager: Exception in checkAuth:', {
        error,
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }

  /**
   * Get all drafts for a user
   */
  static async getAllDrafts(providedUser?: User | null): Promise<DraftResume[]> {
    console.log('🗄️ SupabaseDraftManager: getAllDrafts called');
    try {
      const user = await this.checkAuth(providedUser);
      console.log('🗄️ SupabaseDraftManager: Getting drafts for user:', user.email);

      // Create a timeout promise
      const queryPromise = supabase
        .from('drafts')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout - please check your internet connection')), this.QUERY_TIMEOUT)
      );

      const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;

      if (error) {
        console.error('🗄️ SupabaseDraftManager: Database error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      const drafts: DraftResume[] = (data || []).map((draft: SupabaseDraft) => ({
        id: draft.id,
        name: draft.name,
        resumeData: this.transformFromSupabase(draft.resume_data),
        selectedTemplate: draft.selected_template,
        customizations: draft.customizations || {},
        step: draft.step,
        createdAt: draft.created_at,
        updatedAt: draft.updated_at
      }));

      console.log('🗄️ SupabaseDraftManager: Successfully retrieved', drafts.length, 'drafts');
      return drafts;
    } catch (error: any) {
      console.error('🗄️ SupabaseDraftManager: Exception in getAllDrafts:', {
        error,
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }

  /**
   * Get recent drafts (limited number)
   */
  static async getRecentDrafts(limit: number = 5, providedUser?: User | null): Promise<DraftResume[]> {
    console.log('🗄️ SupabaseDraftManager: getRecentDrafts called with limit:', limit);
    try {
      const allDrafts = await this.getAllDrafts(providedUser);
      return allDrafts.slice(0, limit);
    } catch (error: any) {
      console.error('🗄️ SupabaseDraftManager: Exception in getRecentDrafts:', error);
      throw error;
    }
  }

  /**
   * Save a draft
   */
  static async saveDraft(
    name: string,
    resumeData: ResumeData,
    selectedTemplate: string,
    customizations: Customizations,
    step: number,
    draftId?: string,
    providedUser?: User | null
  ): Promise<string> {
    console.log('🗄️ SupabaseDraftManager: saveDraft called:', { name, selectedTemplate, step, draftId: !!draftId });
    try {
      const user = await this.checkAuth(providedUser);
      console.log('🗄️ SupabaseDraftManager: Saving draft for user:', user.email);

      const draftData = {
        user_id: user.id,
        name: name.trim(),
        resume_data: this.transformToSupabase(resumeData),
        selected_template: selectedTemplate,
        customizations: customizations || {},
        step: Math.max(0, Math.min(3, step))
      };

      let result;
      if (draftId) {
        // Update existing draft
        console.log('🗄️ SupabaseDraftManager: Updating existing draft:', draftId);
        const { data, error } = await supabase
          .from('drafts')
          .update(draftData)
          .eq('id', draftId)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) {
          console.error('🗄️ SupabaseDraftManager: Update error:', error);
          throw new Error(`Failed to update draft: ${error.message}`);
        }
        result = data;
      } else {
        // Create new draft
        console.log('🗄️ SupabaseDraftManager: Creating new draft');
        const { data, error } = await supabase
          .from('drafts')
          .insert(draftData)
          .select()
          .single();

        if (error) {
          console.error('🗄️ SupabaseDraftManager: Insert error:', error);
          throw new Error(`Failed to create draft: ${error.message}`);
        }
        result = data;
      }

      console.log('🗄️ SupabaseDraftManager: Draft saved successfully with ID:', result.id);
      return result.id;
    } catch (error: any) {
      console.error('🗄️ SupabaseDraftManager: Exception in saveDraft:', error);
      throw error;
    }
  }

  /**
   * Delete a draft
   */
  static async deleteDraft(draftId: string, providedUser?: User | null): Promise<void> {
    console.log('🗄️ SupabaseDraftManager: deleteDraft called for ID:', draftId);
    try {
      const user = await this.checkAuth(providedUser);
      console.log('🗄️ SupabaseDraftManager: Deleting draft for user:', user.email);

      const { error } = await supabase
        .from('drafts')
        .delete()
        .eq('id', draftId)
        .eq('user_id', user.id);

      if (error) {
        console.error('🗄️ SupabaseDraftManager: Delete error:', error);
        throw new Error(`Failed to delete draft: ${error.message}`);
      }

      console.log('🗄️ SupabaseDraftManager: Draft deleted successfully');
    } catch (error: any) {
      console.error('🗄️ SupabaseDraftManager: Exception in deleteDraft:', error);
      throw error;
    }
  }

  /**
   * Get primary resume data for a user
   */
  static async getResumeData(providedUser?: User | null): Promise<ResumeData | null> {
    console.log('🗄️ SupabaseDraftManager: getResumeData called');
    try {
      const user = await this.checkAuth(providedUser);
      console.log('🗄️ SupabaseDraftManager: Getting resume data for user:', user.email);

      const { data, error } = await supabase
        .from('resume_data')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('🗄️ SupabaseDraftManager: Resume data query error:', error);
        throw new Error(`Failed to get resume data: ${error.message}`);
      }

      if (!data) {
        console.log('🗄️ SupabaseDraftManager: No resume data found for user');
        return null;
      }

      const resumeData = this.transformFromSupabase({
        personal_info: data.personal_info,
        summary: data.summary,
        experience: data.experience,
        education: data.education,
        skills: data.skills,
        certifications: data.certifications,
        languages: data.languages,
        custom_sections: data.custom_sections
      });

      console.log('🗄️ SupabaseDraftManager: Resume data retrieved successfully');
      return resumeData;
    } catch (error: any) {
      console.error('🗄️ SupabaseDraftManager: Exception in getResumeData:', {
        error,
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }

  /**
   * Save primary resume data for a user
   */
  static async saveResumeData(resumeData: ResumeData, providedUser?: User | null): Promise<void> {
    console.log('🗄️ SupabaseDraftManager: saveResumeData called');
    try {
      const user = await this.checkAuth(providedUser);
      console.log('🗄️ SupabaseDraftManager: Saving resume data for user:', user.email);

      const supabaseData = this.transformToSupabase(resumeData);
      const dataToSave = {
        user_id: user.id,
        personal_info: supabaseData.personal_info,
        summary: supabaseData.summary,
        experience: supabaseData.experience,
        education: supabaseData.education,
        skills: supabaseData.skills,
        certifications: supabaseData.certifications,
        languages: supabaseData.languages,
        custom_sections: supabaseData.custom_sections
      };

      // Check if resume data already exists
      const { data: existing } = await supabase
        .from('resume_data')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      let result;
      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from('resume_data')
          .update(dataToSave)
          .eq('user_id', user.id);
        
        if (error) {
          throw new Error(`Failed to update resume data: ${error.message}`);
        }
      } else {
        // Insert new record
        const { error } = await supabase
          .from('resume_data')
          .insert(dataToSave);
        
        if (error) {
          throw new Error(`Failed to save resume data: ${error.message}`);
        }
      }

      console.log('🗄️ SupabaseDraftManager: Resume data saved successfully');
    } catch (error: any) {
      console.error('🗄️ SupabaseDraftManager: Exception in saveResumeData:', error);
      throw error;
    }
  }

  /**
   * Transform frontend ResumeData to Supabase format
   */
  private static transformToSupabase(resumeData: ResumeData): any {
    return {
      personal_info: resumeData.personalInfo || {},
      summary: resumeData.summary || '',
      experience: resumeData.experience || [],
      education: resumeData.education || [],
      skills: resumeData.skills || [],
      certifications: resumeData.certifications || [],
      languages: resumeData.languages || [],
      custom_sections: resumeData.customSections || {}
    };
  }

  /**
   * Transform Supabase data to frontend ResumeData format
   */
  private static transformFromSupabase(supabaseData: any): ResumeData {
    return {
      personalInfo: supabaseData.personal_info || {
        name: '',
        title: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        linkedin: '',
        photo: ''
      },
      summary: supabaseData.summary || '',
      experience: supabaseData.experience || [],
      education: supabaseData.education || [],
      skills: supabaseData.skills || [],
      certifications: supabaseData.certifications || [],
      languages: supabaseData.languages || [],
      customSections: supabaseData.custom_sections || {}
    };
  }

  /**
   * Check if a user has permission to access a draft
   */
  static async checkDraftAccess(draftId: string, providedUser?: User | null): Promise<boolean> {
    try {
      const user = await this.checkAuth(providedUser);
      
      const { data, error } = await supabase
        .from('drafts')
        .select('user_id')
        .eq('id', draftId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('🗄️ SupabaseDraftManager: Access check error:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('🗄️ SupabaseDraftManager: Exception in checkDraftAccess:', error);
      return false;
    }
  }

  /**
   * Get a specific draft by ID
   */
  static async getDraft(draftId: string, providedUser?: User | null): Promise<DraftResume | null> {
    console.log('🗄️ SupabaseDraftManager: getDraft called for ID:', draftId);
    try {
      const user = await this.checkAuth(providedUser);
      
      const { data, error } = await supabase
        .from('drafts')
        .select('*')
        .eq('id', draftId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('🗄️ SupabaseDraftManager: Get draft error:', error);
        throw new Error(`Failed to get draft: ${error.message}`);
      }

      if (!data) {
        console.log('🗄️ SupabaseDraftManager: Draft not found:', draftId);
        return null;
      }

      const draft: DraftResume = {
        id: data.id,
        name: data.name,
        resumeData: this.transformFromSupabase(data.resume_data),
        selectedTemplate: data.selected_template,
        customizations: data.customizations || {},
        step: data.step,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      console.log('🗄️ SupabaseDraftManager: Draft retrieved successfully');
      return draft;
    } catch (error: any) {
      console.error('🗄️ SupabaseDraftManager: Exception in getDraft:', error);
      throw error;
    }
  }
}