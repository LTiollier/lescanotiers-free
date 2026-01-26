-- Initial Schema for Les Canotiers

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
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
