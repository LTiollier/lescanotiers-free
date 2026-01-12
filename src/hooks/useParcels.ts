import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type Parcel = Database['public']['Tables']['parcels']['Row'];

/**
 * Hook to fetch all parcels from Supabase
 * Example usage of TanStack Query with Supabase
 */
export function useParcels() {
  return useQuery({
    queryKey: ['parcels'],
    queryFn: async (): Promise<Parcel[]> => {
      const { data, error } = await supabase
        .from('parcels')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        throw error;
      }

      return data;
    },
  });
}
