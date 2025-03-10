-- First, remove existing policies to start fresh
DROP POLICY IF EXISTS "Admins can do anything with profiles" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by users who created them" ON profiles;
DROP POLICY IF EXISTS "Profiles can be updated by users who created them" ON profiles;

-- Create new, simplified policies that avoid recursion

-- Admin policy using auth.jwt() instead of querying profiles
CREATE POLICY "Admins can do anything"
ON profiles
AS PERMISSIVE
FOR ALL
TO public
USING (
  auth.jwt() ->> 'role' = 'admin'
  OR auth.uid() = id
);

-- View policy (simpler version that just matches user ID)
CREATE POLICY "Users can view own profile"
ON profiles
FOR SELECT
TO public
USING (
  auth.uid() = id
);

-- Update policy (simpler version that just matches user ID)
CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
TO public
USING (
  auth.uid() = id
);

-- Optional: Add a policy for inserting new profiles
CREATE POLICY "Users can insert own profile"
ON profiles
FOR INSERT
TO public
WITH CHECK (
  auth.uid() = id
);

