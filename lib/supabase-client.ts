import { createClient } from "@supabase/supabase-js"

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Log configuration for debugging (only in development)
if (process.env.NODE_ENV === "development") {
  console.log("Supabase Configuration:")
  console.log("URL:", supabaseUrl ? "Set" : "Not set")
  console.log("Anon Key:", supabaseAnonKey ? "Set" : "Not set")
}

// Check for missing configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing Supabase configuration. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.",
  )
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

