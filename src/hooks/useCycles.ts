import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type Cycle = Database['public']['Tables']['cycles']['Row'];
type CycleInsert = Database['public']['Tables']['cycles']['Insert'];
type CycleUpdate = Database['public']['Tables']['cycles']['Update'];

export interface CycleWithRelations extends Cycle {
  vegetables?: { id: number; name: string };
  parcels?: { id: number; name: string };
}

/**
 * Hook to fetch all cycles from Supabase with related vegetables and parcels
 */
export function useCycles() {
  return useQuery({
    queryKey: ['cycles'],
    queryFn: async (): Promise<CycleWithRelations[]> => {
      const { data, error } = await supabase
        .from('cycles')
        .select('*, vegetables(id, name), parcels(id, name)')
        .order('starts_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

/**
 * Hook to create a new cycle
 */
export function useCreateCycle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cycle: CycleInsert) => {
      const { data, error } = await supabase.from('cycles').insert(cycle).select().single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cycles'] });
    },
  });
}

/**
 * Hook to update an existing cycle
 */
export function useUpdateCycle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: CycleUpdate }) => {
      const { data, error } = await supabase
        .from('cycles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cycles'] });
    },
  });
}

/**
 * Hook to delete a cycle
 */
export function useDeleteCycle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('cycles').delete().eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cycles'] });
    },
  });
}
