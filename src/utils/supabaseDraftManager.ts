import { supabase } from '../lib/supabase';
import { DraftResume, ResumeData } from '../types/resume';
import { getCurrentUserSync } from '../lib/authUtils';

export class SupabaseDraftManager {
  // Check if user is authenticated before operations
  // If user is provided, skip the auth check (already authenticated)
  private static async checkAuth(timeoutMs: number = 3000, providedUser?: any) {
    if (providedUser) {
      console.log('🗄️ SupabaseDraftManager: Using provided authenticated user:', {
        userId: providedUser.id,
        email: providedUser.email
      });
      return providedUser;
    }
    
    console.log('🗄️ SupabaseDraftManager: Checking authentication...');

    try {
      // Try reading cached session first to avoid extension issues
      const cachedUser = getCurrentUserSync();
      if (cachedUser) {
        console.log('🗄️ SupabaseDraftManager: Returning cached user from localStorage:', {
          userId: cachedUser.id,
          email: cachedUser.email
        });
        return cachedUser;
      }

      console.log('🗄️ SupabaseDraftManager: Calling supabase.auth.getSession()...');
      
      // Add timeout to prevent hanging
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Auth session timeout')), timeoutMs)
      );
      
      const { data: { session }, error: sessionError } = await Promise.race([sessionPromise, timeoutPromise]) as any;
      
      console.log('🗄️ SupabaseDraftManager: supabase.auth.getSession() completed');
      console.log('🗄️ SupabaseDraftManager: getSession result:', {
        hasSession: !!session,
        userEmail: session?.user?.email,
        userId: session?.user?.id,
        error: sessionError?.message,
        errorCode: sessionError?.code,
        timestamp: new Date().toISOString()
      });

      if (sessionError) {
        console.error('🗄️ SupabaseDraftManager: Session retrieval error details:', {
          message: sessionError.message,
          code: sessionError.code,
          status: sessionError.status,
          details: sessionError.details
        });
        throw new Error(`Session error: ${sessionError.message}`);
      }

      if (session?.user) {
        console.log('🗄️ SupabaseDraftManager: Returning cached session user:', {
          userId: session.user.id,
          email: session.user.email
        });
        return session.user;
      }

      // Fallback to getUser if no session
      const authPromise = supabase.auth.getUser();
      const userTimeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Auth check timeout')), timeoutMs)
      );

      console.log('🗄️ SupabaseDraftManager: Calling supabase.auth.getUser()...');
      const { data: { user }, error } = await Promise.race([authPromise, userTimeoutPromise]) as any;
      console.log('🗄️ SupabaseDraftManager: supabase.auth.getUser() completed');
      console.log('🗄️ SupabaseDraftManager: Auth check result:', {
        hasUser: !!user,
        userEmail: user?.email,
        userId: user?.id,
        error: error?.message,
        errorCode: error?.code,
        timestamp: new Date().toISOString()
      });
      
      if (error) {
        console.error('🗄️ SupabaseDraftManager: Auth check error details:', {
          message: error.message,
          code: error.code,
          status: error.status,
          details: error.details
        });
        throw new Error(`Authentication failed: ${error.message}`);
      }
      if (!user) {
        console.error('🗄️ SupabaseDraftManager: No user found in auth check');
        throw new Error('User not authenticated');
      }
      console.log('🗄️ SupabaseDraftManager: User authenticated successfully:', {
        userId: user.id,
        email: user.email
      });
      return user;
    } catch (authError) {
      if (authError instanceof Error && authError.message.includes('callback is no longer runnable')) {
        console.warn('🗄️ SupabaseDraftManager: Ignoring stale callback error from Supabase auth', authError);
        throw new Error('Authentication failed. Please sign in again.');
      }
      if (authError instanceof Error && authError.message.includes('timeout')) {
        console.warn('🗄️ SupabaseDraftManager: Auth check timed out');
        throw new Error('Authentication check timed out. Please try again.');
      }
      console.error('🗄️ SupabaseDraftManager: Exception in checkAuth():', {
        error: authError,
        message: authError instanceof Error ? authError.message : String(authError),
        stack: authError instanceof Error ? authError.stack : undefined
      });
      throw authError;
    }
  }

  static async saveDraft(
    name: string,
    resumeData: ResumeData,
    selectedTemplate: string,
    customizations: any,
    step: number,
    draftId?: string,
    providedUser?: any
  ): Promise<string> {
    try {
      console.log('📤 SupabaseDraftManager: Starting saveDraft:', {
        name: name.substring(0, 30) + (name.length > 30 ? '...' : ''),
        template: selectedTemplate,
        step: step,
        isUpdate: !!draftId,
        draftId: draftId
      });
      
      console.log('📤 SupabaseDraftManager: About to check auth for saveDraft...');
      const user = await this.checkAuth(3000, providedUser);
      console.log('📤 SupabaseDraftManager: User authenticated for saveDraft:', {
        userId: user.id,
        email: user.email
      });

      const draftData = {
        user_id: user.id,
        name: name.trim(),
        resume_data: resumeData,
        selected_template: selectedTemplate,
        customizations: customizations || {},
        step: step,
        updated_at: new Date().toISOString()
      };
      
      console.log('📤 SupabaseDraftManager: Draft data prepared:', {
        user_id: draftData.user_id,
        name: draftData.name,
        selected_template: draftData.selected_template,
        step: draftData.step,
        hasResumeData: !!draftData.resume_data,
        hasCustomizations: !!draftData.customizations
      });

      if (draftId) {
        console.log('📤 SupabaseDraftManager: Updating existing draft:', {
          draftId: draftId,
          name: draftData.name
        });
        console.log('📤 SupabaseDraftManager: Starting Supabase update query...');
        // Update existing draft
        const { data, error } = await supabase
          .from('drafts')
          .update(draftData)
          .eq('id', draftId)
          .eq('user_id', user.id)
          .select()
          .single();

        console.log('📤 SupabaseDraftManager: Update query completed');
        console.log('📤 SupabaseDraftManager: Update result:', {
          hasData: !!data,
          hasError: !!error,
          errorMessage: error?.message,
          errorCode: error?.code,
          returnedId: data?.id
        });
        
        if (error) {
          console.error('📤 SupabaseDraftManager: Update error:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
          });
          throw error;
        }
        
        console.log('📤 SupabaseDraftManager: Successfully updated draft:', {
          id: data.id,
          name: data.name
        });
        return data.id;
      } else {
        console.log('📤 SupabaseDraftManager: Creating new draft for:', draftData.name);
        console.log('📤 SupabaseDraftManager: Starting Supabase insert query...');
        // Create new draft
        const { data, error } = await supabase
          .from('drafts')
          .insert(draftData)
          .select()
          .single();

        console.log('📤 SupabaseDraftManager: Insert query completed');
        console.log('📤 SupabaseDraftManager: Insert result:', {
          hasData: !!data,
          hasError: !!error,
          errorMessage: error?.message,
          errorCode: error?.code,
          returnedId: data?.id
        });
        
        if (error) {
          console.error('📤 SupabaseDraftManager: Insert error:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
          });
          throw error;
        }
        
        console.log('📤 SupabaseDraftManager: Successfully created draft:', {
          id: data.id,
          name: data.name
        });
        return data.id;
      }
    } catch (error) {
      console.error('📤 SupabaseDraftManager: Exception in saveDraft:', {
        error: error,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      });
      throw new Error('Failed to save draft to cloud');
    }
  }

  static async getAllDrafts(providedUser?: any): Promise<DraftResume[]> {
    try {
      console.log('📥 SupabaseDraftManager: Starting getAllDrafts');
      
      console.log('📥 SupabaseDraftManager: About to check auth for getAllDrafts...');
      const user = await this.checkAuth(3000, providedUser);
      console.log('📥 SupabaseDraftManager: User authenticated for getAllDrafts:', {
        userId: user.id,
        email: user.email
      });

      console.log('📥 SupabaseDraftManager: Starting Supabase query for getAllDrafts...');
      console.log('📥 SupabaseDraftManager: Query parameters:', {
        table: 'drafts',
        userId: user.id,
        orderBy: 'updated_at desc'
      });
      
      // Add timeout to query as well
      const queryPromise = supabase
        .from('drafts')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      
      const queryTimeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout - please check your internet connection')), 10000) // 10 second timeout for query
      );
      
      const { data, error } = await Promise.race([queryPromise, queryTimeoutPromise]) as any;

      console.log('📥 SupabaseDraftManager: Supabase query completed for getAllDrafts');
      console.log('📥 SupabaseDraftManager: Query result details:', {
        hasData: !!data,
        dataLength: data?.length || 0,
        hasError: !!error,
        errorMessage: error?.message,
        errorCode: error?.code,
        errorDetails: error?.details
      });
      
      if (error) {
        console.error('📥 SupabaseDraftManager: Supabase query error for getAllDrafts:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        // Re-throw the error so the UI can handle it properly
        throw new Error(`Failed to load drafts: ${error.message}`);
      }

      console.log('📥 SupabaseDraftManager: Query successful for getAllDrafts, returned:', data?.length || 0, 'drafts');
      
      if (data && data.length > 0) {
        console.log('📥 SupabaseDraftManager: Sample draft data (first draft):', {
          id: data[0].id,
          name: data[0].name,
          template: data[0].selected_template,
          step: data[0].step,
          updatedAt: data[0].updated_at
        });
      }
      
      console.log('📥 SupabaseDraftManager: Starting data transformation for getAllDrafts...');
      const transformedData = (data || []).map(draft => ({
        id: draft.id,
        name: draft.name,
        resumeData: draft.resume_data,
        selectedTemplate: draft.selected_template,
        customizations: draft.customizations || {},
        createdAt: draft.created_at,
        updatedAt: draft.updated_at,
        step: draft.step
      }));
      
      console.log('📥 SupabaseDraftManager: Data transformation completed for getAllDrafts, returning:', transformedData.length, 'drafts');
      return transformedData;
    } catch (error) {
      console.error('📥 SupabaseDraftManager: Exception in getAllDrafts:', {
        error: error,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      });
      
      // Re-throw the error so the UI can show proper error messages
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          throw new Error('Request timeout - please check your internet connection and try again');
        } else if (error.message.includes('Authentication failed') || error.message.includes('User not authenticated')) {
          throw new Error('Please sign in to access your drafts');
        } else {
          throw new Error(`Failed to load drafts: ${error.message}`);
        }
      } else {
        throw new Error('Failed to load drafts. Please try again.');
      }
    }
  }

  static async getDraft(id: string, providedUser?: any): Promise<DraftResume | null> {
    try {
      console.log('📥 SupabaseDraftManager: Starting getDraft for:', id);
      console.log('📥 SupabaseDraftManager: About to check auth for getDraft...');
      const user = await this.checkAuth(3000, providedUser);

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

  static async deleteDraft(id: string, providedUser?: any): Promise<void> {
    try {
      console.log('🗑️ SupabaseDraftManager: Starting deleteDraft for:', id);
      const user = await this.checkAuth(3000, providedUser);

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

  static async getRecentDrafts(limit: number = 5, providedUser?: any): Promise<DraftResume[]> {
    try {
      console.log('📥 SupabaseDraftManager: Starting getRecentDrafts, limit:', limit);
      
      console.log('📥 SupabaseDraftManager: About to check auth for getRecentDrafts...');
      const user = await this.checkAuth(3000, providedUser);
      console.log('📥 SupabaseDraftManager: User authenticated for getRecentDrafts:', {
        userId: user.id,
        email: user.email
      });

      console.log('📥 SupabaseDraftManager: Starting Supabase query for getRecentDrafts...');
      console.log('📥 SupabaseDraftManager: Query parameters:', {
        table: 'drafts',
        userId: user.id,
        limit: limit,
        orderBy: 'updated_at desc'
      });
      
      // Add timeout to query
      const queryPromise = supabase
        .from('drafts')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(limit);
      
      const queryTimeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout - please check your internet connection')), 8000) // 8 second timeout
      );
      
      const { data, error } = await Promise.race([queryPromise, queryTimeoutPromise]) as any;

      console.log('📥 SupabaseDraftManager: Supabase query completed for getRecentDrafts');
      console.log('📥 SupabaseDraftManager: Query result details:', {
        hasData: !!data,
        dataLength: data?.length || 0,
        hasError: !!error,
        errorMessage: error?.message,
        errorCode: error?.code,
        errorDetails: error?.details
      });
      
      if (error) {
        console.error('📥 SupabaseDraftManager: Supabase query error for getRecentDrafts:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        // Re-throw the error so the UI can handle it properly
        throw new Error(`Failed to load recent drafts: ${error.message}`);
      }

      console.log('📥 SupabaseDraftManager: Query successful for getRecentDrafts, returned:', data?.length || 0, 'drafts');
      
      if (data && data.length > 0) {
        console.log('📥 SupabaseDraftManager: Recent drafts summary:', data.map(draft => ({
          id: draft.id,
          name: draft.name,
          template: draft.selected_template,
          step: draft.step,
          updatedAt: draft.updated_at
        })));
      } else {
        console.log('📥 SupabaseDraftManager: No recent drafts found for user:', user.id);
      }
      
      console.log('📥 SupabaseDraftManager: Starting data transformation for getRecentDrafts...');
      const transformedData = (data || []).map(draft => ({
        id: draft.id,
        name: draft.name,
        resumeData: draft.resume_data,
        selectedTemplate: draft.selected_template,
        customizations: draft.customizations || {},
        createdAt: draft.created_at,
        updatedAt: draft.updated_at,
        step: draft.step
      }));
      
      console.log('📥 SupabaseDraftManager: Data transformation completed for getRecentDrafts, returning:', transformedData.length, 'drafts');
      return transformedData;
    } catch (error) {
      console.error('📥 SupabaseDraftManager: Exception in getRecentDrafts:', {
        error: error,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      });
      
      // Re-throw the error so the UI can show proper error messages
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          throw new Error('Request timeout - please check your internet connection and try again');
        } else if (error.message.includes('Authentication failed') || error.message.includes('User not authenticated')) {
          throw new Error('Please sign in to access your drafts');
        } else {
          throw new Error(`Failed to load recent drafts: ${error.message}`);
        }
      } else {
        throw new Error('Failed to load recent drafts. Please try again.');
      }
    }
  }

  // Save resume data separately for backup
  static async saveResumeData(resumeData: ResumeData, providedUser?: any): Promise<string> {
    try {
      console.log('📤 SupabaseDraftManager: Starting saveResumeData');
      const user = await this.checkAuth(3000, providedUser);

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

  static async getResumeData(providedUser?: any): Promise<ResumeData | null> {
    try {
      console.log('🗄️ SupabaseDraftManager: Starting getResumeData');
      console.log('🗄️ SupabaseDraftManager: About to check auth for getResumeData...');
      const user = await this.checkAuth(3000, providedUser);
      console.log('🗄️ SupabaseDraftManager: User authenticated for getResumeData:', {
        userId: user.id,
        email: user.email
      });

      console.log('🗄️ SupabaseDraftManager: Starting Supabase query for getResumeData...');
      const { data, error } = await supabase
        .from('resume_data')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      console.log('🗄️ SupabaseDraftManager: getResumeData query completed');
      console.log('🗄️ SupabaseDraftManager: Query result details:', {
        hasData: !!data,
        hasError: !!error,
        errorMessage: error?.message,
        errorCode: error?.code,
        errorDetails: error?.details
      });

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('🗄️ SupabaseDraftManager: No resume data found for user:', user.id);
          return null; // No resume data found
        }
        console.error('🗄️ SupabaseDraftManager: getResumeData query error:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log('🗄️ SupabaseDraftManager: Successfully retrieved resume data:', {
        hasPersonalInfo: !!data.personal_info,
        personalInfoName: data.personal_info?.name,
        experienceCount: data.experience?.length || 0,
        skillsCount: data.skills?.length || 0,
        timestamp: new Date().toISOString()
      });
      
      console.log('🗄️ SupabaseDraftManager: Starting data transformation for getResumeData...');
      const transformedData = {
        personalInfo: data.personal_info,
        summary: data.summary || '',
        experience: data.experience || [],
        education: data.education || [],
        skills: data.skills || [],
        certifications: data.certifications || [],
        languages: data.languages || [],
        customSections: data.custom_sections || {}
      };
      
      console.log('🗄️ SupabaseDraftManager: Data transformation completed for getResumeData');
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
      console.error('🗄️ SupabaseDraftManager: Exception in getResumeData:', {
        error: error,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      });
      throw error; // Re-throw to let caller handle fallback
    }
  }
}