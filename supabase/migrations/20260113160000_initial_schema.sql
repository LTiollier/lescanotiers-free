-- Initial Schema for Les Canotiers

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  role TEXT NOT NULL DEFAULT 'employee',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Parcels table
CREATE TABLE IF NOT EXISTS public.parcels (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Vegetable Categories table
CREATE TABLE IF NOT EXISTS public.vegetable_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Vegetables table
CREATE TABLE IF NOT EXISTS public.vegetables (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category_id INT REFERENCES public.vegetable_categories(id) ON DELETE SET NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Cycles table
CREATE TABLE IF NOT EXISTS public.cycles (
  id SERIAL PRIMARY KEY,
  vegetable_id INT NOT NULL REFERENCES public.vegetables(id) ON DELETE CASCADE,
  parcel_id INT NOT NULL REFERENCES public.parcels(id) ON DELETE CASCADE,
  starts_at DATE NOT NULL,
  ends_at DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Activities table
CREATE TABLE IF NOT EXISTS public.activities (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Times table
CREATE TABLE IF NOT EXISTS public.times (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cycle_id INT NOT NULL REFERENCES public.cycles(id) ON DELETE CASCADE,
  activity_id INT NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  minutes INT NOT NULL,
  quantity NUMERIC(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vegetable_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vegetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.times ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (Simplified for initial migration)
-- Profiles: Users can read all profiles, but only update their own
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Other tables: Authenticated users can read everything, only admins can write (except for 'times')
-- Parcels
CREATE POLICY "Parcels are viewable by everyone" ON public.parcels FOR SELECT USING (true);
CREATE POLICY "Admins can manage parcels" ON public.parcels FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Vegetable Categories
CREATE POLICY "Categories are viewable by everyone" ON public.vegetable_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.vegetable_categories FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Vegetables
CREATE POLICY "Vegetables are viewable by everyone" ON public.vegetables FOR SELECT USING (true);
CREATE POLICY "Admins can manage vegetables" ON public.vegetables FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Cycles
CREATE POLICY "Cycles are viewable by everyone" ON public.cycles FOR SELECT USING (true);
CREATE POLICY "Admins can manage cycles" ON public.cycles FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Activities
CREATE POLICY "Activities are viewable by everyone" ON public.activities FOR SELECT USING (true);
CREATE POLICY "Admins can manage activities" ON public.activities FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Times
CREATE POLICY "Times are viewable by everyone" ON public.times FOR SELECT USING (true);
CREATE POLICY "Users can manage their own times" ON public.times FOR ALL
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
