-- Seed data for Les Canotiers
-- Run this in the Supabase SQL Editor to populate initial data

BEGIN;

-- Insert activities (disable RLS temporarily for seeding)
INSERT INTO activities (name) VALUES
  ('Semis'),
  ('Plantation'),
  ('Arrosage'),
  ('Désherbage'),
  ('Récolte'),
  ('Entretien')
ON CONFLICT (name) DO NOTHING;

-- Insert vegetable categories
INSERT INTO vegetable_categories (name) VALUES
  ('Légumes racines'),
  ('Légumes feuilles'),
  ('Légumes fruits'),
  ('Légumineuses'),
  ('Alliacées')
ON CONFLICT (name) DO NOTHING;

COMMIT;

-- Verify seed data
SELECT 'Activities:', COUNT(*) FROM activities;
SELECT 'Vegetable Categories:', COUNT(*) FROM vegetable_categories;
