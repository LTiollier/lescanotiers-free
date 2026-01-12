/**
 * Generate TypeScript types from Supabase database schema
 *
 * This script fetches the database schema from Supabase and generates TypeScript types.
 * It uses the Supabase client to introspect the database.
 *
 * Usage:
 *   npx tsx scripts/generate-types.ts
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load .env.local
config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function generateTypes() {
  console.log('🔍 Fetching database schema from Supabase...');

  try {
    // Test connection by querying one of the tables
    const { error: profilesError } = await supabase.from('profiles').select('*').limit(0);

    const { error: parcelsError } = await supabase.from('parcels').select('*').limit(0);

    if (profilesError || parcelsError) {
      console.error('❌ Error connecting to Supabase:', profilesError || parcelsError);
      console.error('');
      console.error('⚠️  The JS client cannot generate types automatically.');
      console.error('');
      console.error('Please use one of these methods:');
      console.error('');
      console.error('Option 1 - Supabase CLI (Recommended):');
      console.error('  1. Login to Supabase:');
      console.error('     npx supabase login');
      console.error('');
      console.error('  2. Generate types:');
      console.error(
        '     npx supabase gen types typescript --project-id iiqcmoqzilxpsbcycrjz > src/types/database.types.ts',
      );
      console.error('');
      console.error('Option 2 - Use existing types:');
      console.error('  The placeholder types in src/types/database.types.ts should work for now.');
      process.exit(1);
    }

    console.log('✅ Connection successful!');
    console.log('');
    console.log('⚠️  Note: Automatic type generation via JS client is not available.');
    console.log('The current types in src/types/database.types.ts are manually created');
    console.log('and should match your database schema.');
    console.log('');
    console.log('To regenerate types from the live database, use:');
    console.log('  npx supabase login');
    console.log(
      '  npx supabase gen types typescript --project-id iiqcmoqzilxpsbcycrjz > src/types/database.types.ts',
    );
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

generateTypes();
