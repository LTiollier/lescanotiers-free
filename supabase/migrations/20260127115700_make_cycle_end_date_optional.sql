-- Make ends_at column optional in cycles table
ALTER TABLE public.cycles ALTER COLUMN ends_at DROP NOT NULL;
