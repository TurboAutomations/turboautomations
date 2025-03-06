"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase-client"

export function SignOutButton({ variant = "outline" }: { variant?: "outline" | "ghost" }) {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }

    // Always redirect to login regardless of sign out success
    router.push("/login")
  }

  return (
    <Button variant={variant} onClick={handleSignOut} className="w-full">
      <LogOut className="mr-2 h-4 w-4" />
      Sign Out
    </Button>
  )
}

