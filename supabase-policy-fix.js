// This is a script to help you understand the issue and fix it
// You'll need to apply these changes in your Supabase dashboard

// The issue: Infinite recursion in RLS policy
console.log("ISSUE: Infinite recursion detected in policy for relation 'profiles'")
console.log("This happens when a policy creates a circular reference.")

console.log("\nLikely causes:")
console.log("1. A policy that checks the profiles table while querying the profiles table")
console.log("2. Policies that reference each other in a circular way")
console.log("3. A policy using a function that queries the profiles table")

console.log("\nHere's how to fix it in the Supabase dashboard:")

console.log("\n--- SOLUTION 1: Update the profiles table policies ---")
console.log("1. Go to your Supabase dashboard")
console.log("2. Navigate to Authentication > Policies")
console.log("3. Find the 'profiles' table")
console.log("4. Review and modify the policies to avoid circular references")

console.log("\nExample of a problematic policy:")
console.log(`
CREATE POLICY "Users can view their own profile"
ON profiles
FOR SELECT
USING (
  -- This might cause recursion if it queries profiles again
  auth.uid() = id OR 
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
`)

console.log("\nExample of a fixed policy:")
console.log(`
-- Separate policies for different roles
CREATE POLICY "Users can view their own profile"
ON profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON profiles
FOR SELECT
USING (
  -- Get role directly from auth.jwt() to avoid querying profiles
  (auth.jwt() ->> 'role')::text = 'admin'
);
`)

console.log("\n--- SOLUTION 2: Store role in JWT claims ---")
console.log("1. Create a database function to set claims when a user logs in")
console.log("2. This avoids querying the profiles table in policies")
console.log(`
-- Create a function to set claims on login
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (new.id, 'client')
  ON CONFLICT (id) DO NOTHING;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to get user role and set it in JWT
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text AS $$
DECLARE
  user_role text;
BEGIN
  SELECT role INTO user_role FROM profiles WHERE id = auth.uid();
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`)

console.log("\n3. Then update your policies to use the JWT claim instead of querying profiles")

