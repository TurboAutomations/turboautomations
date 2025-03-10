"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase-client"

export default function DashboardRedirectPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkUserAndRedirect() {
      try {
        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
          console.log("No authenticated user found, redirecting to login")
          router.push("/login")
          return
        }

        console.log("User authenticated:", user.id)

        // Get user profile to determine role and client ID
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        // Handle missing profile
        if (profileError) {
          console.error("Profile error:", profileError)

          if (profileError.code === "PGRST116") {
            console.log("Profile not found, creating default profile")

            // Create a default profile for the user
            const { error: insertError } = await supabase.from("profiles").insert({
              id: user.id,
              role: "client",
              company_name: "Default Company",
              contact_name: user.email,
              contact_email: user.email,
            })

            if (insertError) {
              console.error("Error creating profile:", insertError)
              setError("Failed to create user profile. Please contact support.")
              return
            }

            // Redirect to client dashboard
            router.push(`/dashboard/${user.id}/automations`)
            return
          }

          throw profileError
        }

        if (profile.role === "admin") {
          router.push("/admin")
        } else {
          // For client users, redirect to their specific dashboard
          router.push(`/dashboard/${user.id}/automations`)
        }
      } catch (err: any) {
        console.error("Redirect error:", err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    checkUserAndRedirect()
  }, [router])

  if (error) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md max-w-md">
          <p className="text-red-800 dark:text-red-300">Error: {error}</p>
          <button
            onClick={() => router.push("/login")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-lg">Loading your dashboard...</p>
      </div>
    </div>
  )
}

