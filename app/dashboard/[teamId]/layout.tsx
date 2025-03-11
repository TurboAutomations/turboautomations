import type React from "react"
import { supabase } from "@/lib/supabase-client"
import { redirect } from "next/navigation"
import { ClientConfig } from "./client-config"

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { teamId: string }
}) {
  const { teamId } = params

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect("/login")
  }

  // Fetch the user's profile to ensure they have access to this team
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("team_id")
    .eq("id", session.user.id)
    .single()

  if (profileError || !profile || profile.team_id !== teamId) {
    console.error("Error fetching profile or unauthorized access:", profileError)
    redirect("/dashboard")
  }

  // Fetch the team details
  const { data: team, error: teamError } = await supabase.from("teams").select("name").eq("id", teamId).single()

  if (teamError || !team) {
    console.error("Error fetching team:", teamError)
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <ClientConfig teamId={teamId} teamName={team.name} />
      <div className="flex-1">{children}</div>
    </div>
  )
}

