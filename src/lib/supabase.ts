import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided as environment variables.');
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,      // Keep session in localStorage
      autoRefreshToken: true,    // Refresh tokens automatically
      detectSessionInUrl: false, // For SPAs - don't detect session from URL
      multiTab: false,           // Disable multi-tab to avoid conflicts
      flowType: 'implicit'       // Use implicit flow for better compatibility
    }
  }
);

// Expose to window for debugging
if (typeof window !== 'undefined') {
  (window as any).supabase = supabase;
}
// Database types for better TypeScript support
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      drafts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          resume_data: any;
          selected_template: string;
          customizations: any;
          step: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          resume_data: any;
          selected_template: string;
          customizations?: any;
          step: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          resume_data?: any;
          selected_template?: string;
          customizations?: any;
          step?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      resume_data: {
        Row: {
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
        };
        Insert: {
          id?: string;
          user_id: string;
          personal_info: any;
          summary?: string | null;
          experience?: any;
          education?: any;
          skills?: any;
          certifications?: any;
          languages?: any;
          custom_sections?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          personal_info?: any;
          summary?: string | null;
          experience?: any;
          education?: any;
          skills?: any;
          certifications?: any;
          languages?: any;
          custom_sections?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};