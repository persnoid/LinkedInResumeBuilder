import { User } from '@supabase/supabase-js';

export function getCurrentUserSync(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('supabase.auth.token');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const session = parsed.currentSession || parsed;
    return session?.user ?? null;
  } catch (e) {
    console.warn('Failed to read cached Supabase user:', e);
    return null;
  }
}
