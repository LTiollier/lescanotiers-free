/**
 * Test Supabase connection and verify database setup
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import type { Database } from '../src/types/database.types';

config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('🧪 Testing Supabase connection and database setup...\n');

  const tables = [
    'profiles',
    'parcels',
    'vegetable_categories',
    'vegetables',
    'cycles',
    'activities',
    'times',
  ];

  let allSuccess = true;

  for (const table of tables) {
    try {
      const { error, count } = await supabase
        .from(table as never)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
        allSuccess = false;
      } else {
        console.log(`✅ ${table}: Table exists (${count ?? 0} rows)`);
      }
    } catch (err) {
      console.log(`❌ ${table}: ${err}`);
      allSuccess = false;
    }
  }

  console.log('');

  if (allSuccess) {
    console.log('🎉 All tables are accessible!\n');
    console.log('Testing seed data...');

    // Check activities
    const { data: activities } = await supabase.from('activities').select('name').order('name');

    if (activities && activities.length > 0) {
      console.log(
        `✅ Activities (${activities.length}):`,
        activities.map((a) => a.name).join(', '),
      );
    }

    // Check vegetable categories
    const { data: categories } = await supabase
      .from('vegetable_categories')
      .select('name')
      .order('name');

    if (categories && categories.length > 0) {
      console.log(
        `✅ Vegetable categories (${categories.length}):`,
        categories.map((c) => c.name).join(', '),
      );
    }

    console.log('\n🚀 Supabase setup is complete and working!');
  } else {
    console.log('⚠️  Some tables are not accessible. Check your RLS policies.');
    process.exit(1);
  }
}

testConnection();
