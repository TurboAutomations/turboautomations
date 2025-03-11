"use server"

import { supabase } from "@/lib/supabase-client"
import { revalidatePath } from "next/cache"

export async function assignAutomationToClients(automationId: string, clientIds: string[]) {
  // First, get all existing assignments for this automation
  const { data: existingAssignments, error: fetchError } = await supabase
    .from("team_automations")
    .select("team_id")
    .eq("automation_id", automationId)

  if (fetchError) {
    console.error("Error fetching existing assignments:", fetchError)
    throw new Error(fetchError.message)
  }

  // Create a set of existing team IDs for quick lookup
  const existingTeamIds = new Set(existingAssignments?.map((a) => a.team_id) || [])

  // Determine which assignments to add and which to remove
  const teamsToAdd = clientIds.filter((id) => !existingTeamIds.has(id))
  const teamsToRemove = Array.from(existingTeamIds).filter((id) => !clientIds.includes(id as string))

  // Add new assignments
  if (teamsToAdd.length > 0) {
    const newAssignments = teamsToAdd.map((teamId) => ({
      team_id: teamId,
      automation_id: automationId,
    }))

    const { error: insertError } = await supabase.from("team_automations").insert(newAssignments)

    if (insertError) {
      console.error("Error adding assignments:", insertError)
      throw new Error(insertError.message)
    }
  }

  // Remove assignments that are no longer needed
  if (teamsToRemove.length > 0) {
    const { error: deleteError } = await supabase
      .from("team_automations")
      .delete()
      .eq("automation_id", automationId)
      .in("team_id", teamsToRemove)

    if (deleteError) {
      console.error("Error removing assignments:", deleteError)
      throw new Error(deleteError.message)
    }
  }

  // Revalidate relevant paths
  revalidatePath(`/admin/automations/${automationId}`)
  revalidatePath("/admin/automations")
  clientIds.forEach((teamId) => {
    revalidatePath(`/dashboard/${teamId}/automations`)
  })

  return { success: true }
}

