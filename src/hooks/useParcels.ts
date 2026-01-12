import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type Parcel = Database['public']['Tables']['parcels']['Row'];
type ParcelInsert = Database['public']['Tables']['parcels']['Insert'];
type ParcelUpdate = Database['public']['Tables']['parcels']['Update'];

/**
 * Hook to fetch all parcels from Supabase
 */
export function useParcels() {
  return useQuery({
    queryKey: ['parcels'],
    queryFn: async (): Promise<Parcel[]> => {
      const { data, error } = await supabase
        .from('parcels')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data;
    },
  });
}

/**
 * Hook to create a new parcel
 */
export function useCreateParcel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (parcel: ParcelInsert) => {
      const { data, error } = await supabase.from('parcels').insert(parcel).select().single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parcels'] });
    },
  });
}

/**
 * Hook to update an existing parcel
 */
export function useUpdateParcel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: ParcelUpdate }) => {
      const { data, error } = await supabase
        .from('parcels')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parcels'] });
    },
  });
}

/**
 * Hook to delete a parcel
 */
export function useDeleteParcel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('parcels').delete().eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parcels'] });
    },
  });
}
