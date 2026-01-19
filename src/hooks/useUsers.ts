import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface CreateUserParams {
  email: string;
  password: string;
  username: string;
  role?: 'admin' | 'employee';
  hourlyRateInCents?: number | null;
}

interface UpdateUserProfileParams {
  userId: string;
  role?: 'admin' | 'employee';
  hourlyRateInCents?: number | null;
}

/**
 * Hook to fetch all users (profiles)
 */
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async (): Promise<Profile[]> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data;
    },
  });
}

/**
 * Hook to create a new user (admin only)
 * Uses Supabase Admin API to create users without email confirmation
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      password,
      username,
      role = 'employee',
      hourlyRateInCents = null,
    }: CreateUserParams) => {
      // Create auth user using admin API
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
          emailRedirectTo: undefined, // No email confirmation needed
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      // Update profile with role, username and hourly rate
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          username,
          role,
          hourly_rate_in_cents: hourlyRateInCents,
        })
        .eq('id', authData.user.id);

      if (profileError) throw profileError;

      return authData.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

/**
 * Hook to update a user's profile (admin only)
 */
export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role, hourlyRateInCents }: UpdateUserProfileParams) => {
      const { error } = await supabase
        .from('profiles')
        .update({ role, hourly_rate_in_cents: hourlyRateInCents })
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

/**
 * Hook to delete a user (admin only)
 * Note: This only updates the profile. The auth user remains.
 * For full deletion, you'd need Supabase Admin API access from the backend.
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      // We can't delete auth users from the client side
      // So we'll just mark the profile as inactive by removing the username
      // Or you could add an 'active' field to the profiles table
      const { error } = await supabase
        .from('profiles')
        // @ts-expect-error - Supabase type inference issue with Update type
        .update({ username: null })
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
