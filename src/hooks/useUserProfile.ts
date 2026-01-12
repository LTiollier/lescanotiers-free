import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

/**
 * Hook to fetch the current user's profile
 * Includes role and username information
 */
export function useUserProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async (): Promise<Profile | null> => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      return data;
    },
    enabled: !!user,
  });
}

/**
 * Hook to check if the current user is an admin
 */
export function useIsAdmin() {
  const { data: profile } = useUserProfile();
  return profile?.role === 'admin';
}
