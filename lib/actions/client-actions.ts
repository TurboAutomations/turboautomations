"use server"

import { supabase } from "@/lib/supabase-client"
import { revalidatePath } from "next/cache"

interface CreateClientData {
  name: string
  contactName: string
  email: string
  password: string
}

export async function createClient(data: CreateClientData) {
  // 1. Create the user account in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: data.email,
    password: data.password,
    email_confirm: true, // Auto-confirm the email
  })

  if (authError) {
    console.error("Error creating user:", authError)
    throw new Error(authError.message)
  }

  // 2. Create a team (client) record
  const { data: teamData, error: teamError } = await supabase
    .from("teams")
    .insert([
      {
        name: data.name,
        created_by: authData.user.id,
      },
    ])
    .select()
    .single()

  if (teamError) {
    console.error("Error creating team:", teamError)
    throw new Error(teamError.message)
  }

  // 3. Update the user's profile with additional info
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: data.contactName,
      team_id: teamData.id,
      is_admin: false,
    })
    .eq("id", authData.user.id)

  if (profileError) {
    console.error("Error updating profile:", profileError)
    throw new Error(profileError.message)
  }

  // Revalidate the clients page
  revalidatePath("/admin/clients")

  return { success: true }
}

