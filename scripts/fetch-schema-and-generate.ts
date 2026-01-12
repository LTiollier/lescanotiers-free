/**
 * Fetch schema from Supabase and generate accurate TypeScript types
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fetchSchema() {
  console.log('🔍 Fetching real database schema from Supabase...\n');

  // Query information_schema to get actual column types
  const { data: columns, error } = await supabase.rpc('get_table_columns', {});

  if (error) {
    console.log("⚠️  Could not fetch schema via RPC (expected if function doesn't exist)");
    console.log('Using the CLI is the recommended approach.\n');
    console.log('Run: npx supabase login');
    console.log(
      'Then: npx supabase gen types typescript --project-id iiqcmoqzilxpsbcycrjz > src/types/database.types.ts\n',
    );
    return;
  }

  console.log('✅ Schema fetched successfully!');
  console.log(columns);
}

fetchSchema();
