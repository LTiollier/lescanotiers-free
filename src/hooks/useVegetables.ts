import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type Vegetable = Database['public']['Tables']['vegetables']['Row'];
type VegetableInsert = Database['public']['Tables']['vegetables']['Insert'];
type VegetableUpdate = Database['public']['Tables']['vegetables']['Update'];

/**
 * Hook to fetch all vegetables from Supabase
 */
export function useVegetables() {
  return useQuery({
    queryKey: ['vegetables'],
    queryFn: async (): Promise<Vegetable[]> => {
      const { data, error } = await supabase
        .from('vegetables')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data;
    },
  });
}

/**
 * Hook to create a new vegetable
 */
export function useCreateVegetable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vegetable: VegetableInsert) => {
      const { data, error } = await supabase
        .from('vegetables')
        .insert(vegetable as never)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vegetables'] });
    },
  });
}

/**
 * Hook to update an existing vegetable
 */
export function useUpdateVegetable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: VegetableUpdate }) => {
      const { data, error } = await supabase
        .from('vegetables')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vegetables'] });
    },
  });
}

/**
 * Hook to delete a vegetable
 */
export function useDeleteVegetable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('vegetables').delete().eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vegetables'] });
    },
  });
}
