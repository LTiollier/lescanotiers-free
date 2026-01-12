# Supabase Setup Guide

This guide will help you configure Supabase for the Les Canotiers application.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Node.js and npm installed

## Step 1: Create a Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in the project details:
   - **Name**: les-canotiers
   - **Database Password**: Choose a strong password (save it securely)
   - **Region**: Choose the closest region to your users
4. Click "Create new project" and wait for the setup to complete

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJhbGc...`)

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Never commit `.env.local` to git** (it's already in `.gitignore`)

## Step 4: Create the Database Schema

Run the following SQL in the Supabase SQL Editor:

### 1. Enable UUID extension
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### 2. Create tables

```sql
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
```

### 3. Create automatic profile creation trigger

```sql
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
```

### 4. Enable Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE vegetable_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE vegetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE times ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Parcels policies (all authenticated users can read)
CREATE POLICY "Authenticated users can view parcels"
  ON parcels FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage parcels"
  ON parcels FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Similar policies for other tables...
-- (Add more policies as needed for your security requirements)
```

## Step 5: Generate TypeScript Types

After creating your database schema, generate TypeScript types:

```bash
npx supabase gen types typescript --project-id your-project-id --schema public > src/types/database.types.ts
```

Or if using Supabase CLI locally:

```bash
npx supabase gen types typescript --local > src/types/database.types.ts
```

## Step 6: Verify the Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. The app should now connect to Supabase without errors
3. Check the browser console for any connection issues

## Optional: Install Supabase CLI

For local development and migrations:

```bash
npm install -g supabase
```

Then initialize Supabase in your project:

```bash
supabase init
supabase login
supabase link --project-ref your-project-ref
```

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Make sure `.env.local` exists and contains the correct values
- Restart the dev server after creating `.env.local`

### Error: "Invalid API key"
- Double-check that you copied the **anon/public** key, not the service_role key
- Make sure there are no extra spaces in the `.env.local` file

### Database connection errors
- Verify your Supabase project is running (check the dashboard)
- Check that your IP is not blocked (Supabase has IP restrictions in some regions)

## Next Steps

- Set up authentication flows
- Implement CRUD operations for parcels, vegetables, etc.
- Add more RLS policies for fine-grained access control
- Configure realtime subscriptions if needed
