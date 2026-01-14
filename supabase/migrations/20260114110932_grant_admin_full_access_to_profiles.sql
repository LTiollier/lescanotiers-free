-- Drop existing policies on the profiles table to redefine access rules.
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create a policy for admins to have unrestricted access to profiles.
-- This policy allows users with the 'admin' role to perform any action (SELECT, INSERT, UPDATE, DELETE)
-- on any row in the 'profiles' table.
CREATE POLICY "Admins can manage all profiles"
ON public.profiles
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create a policy for authenticated users to view all profiles.
-- This is important for non-admin users to be able to see who is on the platform.
CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
USING (auth.role() = 'authenticated');

-- Create a policy for users to update their own profile.
-- This allows non-admin users to change their own 'username', 'display_name', etc.
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
