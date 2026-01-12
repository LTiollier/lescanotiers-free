-- Initial database schema for Les Canotiers
-- Created: 2025-01-12
--
-- IMPORTANT: This migration is wrapped in a transaction
-- If any error occurs, everything will be rolled back automatically
-- You can also manually rollback by running: ROLLBACK;

BEGIN;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLES
-- =====================================================

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  role TEXT NOT NULL DEFAULT 'employee' CHECK (role IN ('admin', 'employee')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Parcels table
CREATE TABLE parcels (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vegetable categories table
CREATE TABLE vegetable_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vegetables table
CREATE TABLE vegetables (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category_id INT REFERENCES vegetable_categories(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cycles table
CREATE TABLE cycles (
  id SERIAL PRIMARY KEY,
  vegetable_id INT NOT NULL REFERENCES vegetables(id),
  parcel_id INT NOT NULL REFERENCES parcels(id),
  starts_at DATE NOT NULL,
  ends_at DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activities table
CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Times table
CREATE TABLE times (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id),
  cycle_id INT NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
  activity_id INT NOT NULL REFERENCES activities(id),
  date DATE NOT NULL,
  minutes INT NOT NULL,
  quantity NUMERIC(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, role)
  VALUES (NEW.id, NEW.email, 'employee');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE vegetable_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE vegetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE times ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PROFILES POLICIES
-- =====================================================

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- =====================================================
-- PARCELS POLICIES
-- =====================================================

CREATE POLICY "Authenticated users can view parcels"
  ON parcels FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert parcels"
  ON parcels FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update parcels"
  ON parcels FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete parcels"
  ON parcels FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =====================================================
-- VEGETABLE CATEGORIES POLICIES
-- =====================================================

CREATE POLICY "Authenticated users can view vegetable categories"
  ON vegetable_categories FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage vegetable categories"
  ON vegetable_categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =====================================================
-- VEGETABLES POLICIES
-- =====================================================

CREATE POLICY "Authenticated users can view vegetables"
  ON vegetables FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage vegetables"
  ON vegetables FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =====================================================
-- CYCLES POLICIES
-- =====================================================

CREATE POLICY "Authenticated users can view cycles"
  ON cycles FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage cycles"
  ON cycles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =====================================================
-- ACTIVITIES POLICIES
-- =====================================================

CREATE POLICY "Authenticated users can view activities"
  ON activities FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage activities"
  ON activities FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =====================================================
-- TIMES POLICIES
-- =====================================================

CREATE POLICY "Users can view own time entries"
  ON times FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all time entries"
  ON times FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can insert own time entries"
  ON times FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own time entries"
  ON times FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own time entries"
  ON times FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_times_user_id ON times(user_id);
CREATE INDEX idx_times_cycle_id ON times(cycle_id);
CREATE INDEX idx_times_activity_id ON times(activity_id);
CREATE INDEX idx_times_date ON times(date);

CREATE INDEX idx_cycles_vegetable_id ON cycles(vegetable_id);
CREATE INDEX idx_cycles_parcel_id ON cycles(parcel_id);
CREATE INDEX idx_cycles_dates ON cycles(starts_at, ends_at);

CREATE INDEX idx_vegetables_category_id ON vegetables(category_id);

-- =====================================================
-- SEED DATA (Optional - for testing)
-- =====================================================

-- Insert some initial activities
INSERT INTO activities (name) VALUES
  ('Semis'),
  ('Plantation'),
  ('Arrosage'),
  ('Désherbage'),
  ('Récolte'),
  ('Entretien')
ON CONFLICT (name) DO NOTHING;

-- Insert some initial vegetable categories
INSERT INTO vegetable_categories (name) VALUES
  ('Légumes racines'),
  ('Légumes feuilles'),
  ('Légumes fruits'),
  ('Légumineuses'),
  ('Alliacées')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- COMMIT TRANSACTION
-- =====================================================

-- If everything succeeded, commit the transaction
COMMIT;

-- If you need to rollback manually (before COMMIT), run:
-- ROLLBACK;
