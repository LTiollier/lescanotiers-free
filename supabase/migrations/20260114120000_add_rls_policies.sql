-- Migration to add RLS policies for all tables

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vegetable_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vegetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.times ENABLE ROW LEVEL SECURITY;

-- Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 1. Profiles Policies
CREATE POLICY "Admins have full access to profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 2. Parcels Policies
CREATE POLICY "Admins have full access to parcels"
  ON public.parcels FOR ALL
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Users can view parcels"
  ON public.parcels FOR SELECT
  TO authenticated
  USING (true);

-- 3. Vegetable Categories Policies
CREATE POLICY "Admins have full access to vegetable_categories"
  ON public.vegetable_categories FOR ALL
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Users can view vegetable_categories"
  ON public.vegetable_categories FOR SELECT
  TO authenticated
  USING (true);

-- 4. Vegetables Policies
CREATE POLICY "Admins have full access to vegetables"
  ON public.vegetables FOR ALL
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Users can view vegetables"
  ON public.vegetables FOR SELECT
  TO authenticated
  USING (true);

-- 5. Cycles Policies
CREATE POLICY "Admins have full access to cycles"
  ON public.cycles FOR ALL
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Users can view cycles"
  ON public.cycles FOR SELECT
  TO authenticated
  USING (true);

-- 6. Activities Policies
CREATE POLICY "Admins have full access to activities"
  ON public.activities FOR ALL
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Users can view activities"
  ON public.activities FOR SELECT
  TO authenticated
  USING (true);

-- 7. Times Policies
CREATE POLICY "Admins have full access to times"
  ON public.times FOR ALL
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Users can view all times"
  ON public.times FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own times"
  ON public.times FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own times"
  ON public.times FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own times"
  ON public.times FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
