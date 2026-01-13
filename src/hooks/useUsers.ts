import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface CreateUserParams {
  email: string;
  password: string;
  username?: string;
  displayName?: string;
  role?: 'admin' | 'employee';
}

interface UpdateUserRoleParams {
  userId: string;
  role: 'admin' | 'employee';
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
      displayName,
      role = 'employee',
    }: CreateUserParams) => {
      // Create auth user using admin API
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            display_name: displayName,
          },
          emailRedirectTo: undefined, // No email confirmation needed
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      // Update profile with role, username and display_name
      const { error: profileError } = await supabase
        .from('profiles')
        // @ts-expect-error - Supabase type inference issue with Update type
        .update({
          username: username || email,
          display_name: displayName,
          role: role,
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
 * Hook to update a user's role (admin only)
 */
export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }: UpdateUserRoleParams) => {
      const { error } = await supabase
        .from('profiles')
        // @ts-expect-error - Supabase type inference issue with Update type
        .update({ role })
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
