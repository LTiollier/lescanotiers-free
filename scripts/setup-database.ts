/**
 * Database Setup Script
 *
 * This script applies the initial database migration to Supabase.
 * It reads the SQL file and executes it using the Supabase client.
 *
 * Usage:
 *   npx tsx scripts/setup-database.ts
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Note: Need service role key for admin operations

if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL not found in environment variables');
  process.exit(1);
}

if (!supabaseServiceKey) {
  console.error('⚠️  SUPABASE_SERVICE_ROLE_KEY not found.');
  console.error('');
  console.error('To run this script, you need the service_role key from Supabase.');
  console.error('Get it from: Settings → API → service_role key');
  console.error('');
  console.error('Then add to .env.local:');
  console.error('SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  console.error('');
  console.error('⚠️  ALTERNATIVE: Run the migration manually in Supabase SQL Editor:');
  console.error(
    `   https://supabase.com/dashboard/project/${extractProjectRef(supabaseUrl)}/sql/new`,
  );
  process.exit(1);
}

// Note: We create the client but don't use it - kept for potential future use
const _supabase = createClient(supabaseUrl, supabaseServiceKey);

function extractProjectRef(url: string): string {
  const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
  return match ? match[1] : 'unknown';
}

async function applyMigration() {
  console.log('📦 Reading migration file...');

  const migrationPath = join(process.cwd(), 'supabase/migrations/20250112_initial_schema.sql');
  // Note: Read the file to verify it exists, but we can't execute it via JS client
  const _sql = readFileSync(migrationPath, 'utf-8');

  console.log('🚀 Applying migration to Supabase...');
  console.log('');

  // Note: Supabase JS client doesn't support executing raw SQL directly
  // You need to use the Supabase Management API or CLI for this
  console.error('⚠️  The Supabase JS client cannot execute raw SQL migrations.');
  console.error('');
  console.error('Please apply the migration manually:');
  console.error('');
  console.error('Option 1 - SQL Editor (Recommended):');
  console.error(
    `  1. Go to: https://supabase.com/dashboard/project/${extractProjectRef(supabaseUrl)}/sql/new`,
  );
  console.error('  2. Copy contents of: supabase/migrations/20250112_initial_schema.sql');
  console.error('  3. Paste and click "Run"');
  console.error('');
  console.error('Option 2 - Supabase CLI:');
  console.error(`  npx supabase link --project-ref ${extractProjectRef(supabaseUrl)}`);
  console.error('  npx supabase db push');
  console.error('');
}

applyMigration().catch(console.error);
