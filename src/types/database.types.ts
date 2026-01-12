/**
 * Database Types
 *
 * This file contains TypeScript types for the Supabase database schema.
 * These types are automatically generated using the Supabase CLI.
 *
 * To regenerate types after schema changes:
 * ```bash
 * npx supabase gen types typescript --project-id <your-project-id> --schema public > src/types/database.types.ts
 * ```
 *
 * Or if using local development:
 * ```bash
 * npx supabase gen types typescript --local > src/types/database.types.ts
 * ```
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          role: string;
          created_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          role?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          role?: string;
          created_at?: string;
        };
      };
      parcels: {
        Row: {
          id: number;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          created_at?: string;
        };
      };
      vegetable_categories: {
        Row: {
          id: number;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          created_at?: string;
        };
      };
      vegetables: {
        Row: {
          id: number;
          name: string;
          category_id: number | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          category_id?: number | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          category_id?: number | null;
          created_at?: string;
        };
      };
      cycles: {
        Row: {
          id: number;
          vegetable_id: number;
          parcel_id: number;
          starts_at: string;
          ends_at: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          vegetable_id: number;
          parcel_id: number;
          starts_at: string;
          ends_at: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          vegetable_id?: number;
          parcel_id?: number;
          starts_at?: string;
          ends_at?: string;
          created_at?: string;
        };
      };
      activities: {
        Row: {
          id: number;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          created_at?: string;
        };
      };
      times: {
        Row: {
          id: number;
          user_id: string;
          cycle_id: number;
          activity_id: number;
          date: string;
          minutes: number;
          quantity: number | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          cycle_id: number;
          activity_id: number;
          date: string;
          minutes: number;
          quantity?: number | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          cycle_id?: number;
          activity_id?: number;
          date?: string;
          minutes?: number;
          quantity?: number | null;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
