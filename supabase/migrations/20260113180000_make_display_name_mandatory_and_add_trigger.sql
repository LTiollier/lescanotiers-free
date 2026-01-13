-- Make display_name mandatory and add trigger for profile creation

-- First, ensure all existing profiles have a display_name (if any)
UPDATE public.profiles SET display_name = username WHERE display_name IS NULL;
UPDATE public.profiles SET display_name = 'Utilisateur' WHERE display_name IS NULL;

-- Make display_name NOT NULL
ALTER TABLE public.profiles ALTER COLUMN display_name SET NOT NULL;

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', new.email),
    COALESCE(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'displayName', 'Utilisateur'),
    COALESCE(new.raw_user_meta_data->>'role', 'employee')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
