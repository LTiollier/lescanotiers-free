import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type Time = Database['public']['Tables']['times']['Row'];
type TimeInsert = Database['public']['Tables']['times']['Insert'];
type TimeUpdate = Database['public']['Tables']['times']['Update'];

export interface TimeWithRelations extends Time {
  profiles?: { id: string; username: string | null };
  cycles?: {
    id: number;
    vegetables?: { id: number; name: string };
    parcels?: { id: number; name: string };
  };
  activities?: { id: number; name: string };
}

/**
 * Hook to fetch all times from Supabase with related profiles, cycles, and activities
 */
export function useTimes() {
  return useQuery({
    queryKey: ['times'],
    queryFn: async (): Promise<TimeWithRelations[]> => {
      const { data, error } = await supabase
        .from('times')
        .select(
          `
          *,
          profiles(id, username),
          cycles(id, vegetables(id, name), parcels(id, name)),
          activities(id, name)
        `,
        )
        .order('date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

/**
 * Hook to create a new time entry
 */
export function useCreateTime() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (time: TimeInsert) => {
      const { data, error } = await supabase.from('times').insert(time).select().single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['times'] });
    },
  });
}

/**
 * Hook to update an existing time entry
 */
export function useUpdateTime() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: TimeUpdate }) => {
      const { data, error } = await supabase
        .from('times')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['times'] });
    },
  });
}

/**
 * Hook to delete a time entry
 */
export function useDeleteTime() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('times').delete().eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['times'] });
    },
  });
}
