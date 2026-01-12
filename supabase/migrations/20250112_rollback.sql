-- Rollback script for initial schema migration
-- Created: 2025-01-12
--
-- USE THIS ONLY IF YOU NEED TO COMPLETELY REMOVE THE SCHEMA
-- This will DROP all tables, functions, triggers, and policies
--
-- WARNING: This will delete ALL data in these tables!

BEGIN;

-- =====================================================
-- DROP POLICIES
-- =====================================================

-- Times policies
DROP POLICY IF EXISTS "Users can delete own time entries" ON times;
DROP POLICY IF EXISTS "Users can update own time entries" ON times;
DROP POLICY IF EXISTS "Users can insert own time entries" ON times;
DROP POLICY IF EXISTS "Admins can view all time entries" ON times;
DROP POLICY IF EXISTS "Users can view own time entries" ON times;

-- Activities policies
DROP POLICY IF EXISTS "Admins can manage activities" ON activities;
DROP POLICY IF EXISTS "Authenticated users can view activities" ON activities;

-- Cycles policies
DROP POLICY IF EXISTS "Admins can manage cycles" ON cycles;
DROP POLICY IF EXISTS "Authenticated users can view cycles" ON cycles;

-- Vegetables policies
DROP POLICY IF EXISTS "Admins can manage vegetables" ON vegetables;
DROP POLICY IF EXISTS "Authenticated users can view vegetables" ON vegetables;

-- Vegetable categories policies
DROP POLICY IF EXISTS "Admins can manage vegetable categories" ON vegetable_categories;
DROP POLICY IF EXISTS "Authenticated users can view vegetable categories" ON vegetable_categories;

-- Parcels policies
DROP POLICY IF EXISTS "Admins can delete parcels" ON parcels;
DROP POLICY IF EXISTS "Admins can update parcels" ON parcels;
DROP POLICY IF EXISTS "Admins can insert parcels" ON parcels;
DROP POLICY IF EXISTS "Authenticated users can view parcels" ON parcels;

-- Profiles policies
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;

-- =====================================================
-- DROP TRIGGERS
-- =====================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- =====================================================
-- DROP FUNCTIONS
-- =====================================================

DROP FUNCTION IF EXISTS public.handle_new_user();

-- =====================================================
-- DROP INDEXES
-- =====================================================

DROP INDEX IF EXISTS idx_vegetables_category_id;
DROP INDEX IF EXISTS idx_cycles_dates;
DROP INDEX IF EXISTS idx_cycles_parcel_id;
DROP INDEX IF EXISTS idx_cycles_vegetable_id;
DROP INDEX IF EXISTS idx_times_date;
DROP INDEX IF EXISTS idx_times_activity_id;
DROP INDEX IF EXISTS idx_times_cycle_id;
DROP INDEX IF EXISTS idx_times_user_id;

-- =====================================================
-- DROP TABLES (in reverse order of dependencies)
-- =====================================================

DROP TABLE IF EXISTS times CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS cycles CASCADE;
DROP TABLE IF EXISTS vegetables CASCADE;
DROP TABLE IF EXISTS vegetable_categories CASCADE;
DROP TABLE IF EXISTS parcels CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- =====================================================
-- COMMIT ROLLBACK
-- =====================================================

COMMIT;

-- All schema objects have been removed
-- You can now re-run the initial migration if needed
