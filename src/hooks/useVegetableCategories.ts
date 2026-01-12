import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type VegetableCategory = Database['public']['Tables']['vegetable_categories']['Row'];

/**
 * Hook to fetch all vegetable categories from Supabase
 */
export function useVegetableCategories() {
  return useQuery({
    queryKey: ['vegetable_categories'],
    queryFn: async (): Promise<VegetableCategory[]> => {
      const { data, error } = await supabase
        .from('vegetable_categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data;
    },
  });
}
