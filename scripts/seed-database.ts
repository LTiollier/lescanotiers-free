/**
 * Seed database with initial data
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import type { Database } from '../src/types/database.types';

config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

async function seedDatabase() {
  console.log('🌱 Seeding database with initial data...\n');

  // Seed activities
  const activities = [
    { name: 'Semis' },
    { name: 'Plantation' },
    { name: 'Arrosage' },
    { name: 'Désherbage' },
    { name: 'Récolte' },
    { name: 'Entretien' },
  ];

  console.log('📝 Inserting activities...');
  for (const activity of activities) {
    const { error } = await supabase.from('activities').upsert(activity, { onConflict: 'name' });

    if (error) {
      console.log(`  ⚠️  ${activity.name}: ${error.message}`);
    } else {
      console.log(`  ✅ ${activity.name}`);
    }
  }

  // Seed vegetable categories
  const categories = [
    { name: 'Légumes racines' },
    { name: 'Légumes feuilles' },
    { name: 'Légumes fruits' },
    { name: 'Légumineuses' },
    { name: 'Alliacées' },
  ];

  console.log('\n📝 Inserting vegetable categories...');
  for (const category of categories) {
    const { error } = await supabase
      .from('vegetable_categories')
      .upsert(category, { onConflict: 'name' });

    if (error) {
      console.log(`  ⚠️  ${category.name}: ${error.message}`);
    } else {
      console.log(`  ✅ ${category.name}`);
    }
  }

  console.log('\n🎉 Database seeding complete!');
}

seedDatabase();
