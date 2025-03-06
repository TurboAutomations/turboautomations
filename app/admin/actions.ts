"use server"

import { supabaseAdmin } from "@/lib/supabase-admin"

export async function addClient(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const companyName = formData.get("companyName") as string
  const contactName = formData.get("contactName") as string
  const contactEmail = (formData.get("contactEmail") as string) || email
  const phone = formData.get("phone") as string

  try {
    // 1. Create the user in Supabase Auth
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Skip email confirmation
      user_metadata: {
        company: companyName,
        role: "client",
      },
    })

    if (userError) throw userError

    // 2. Create a profile record in the profiles table
    const { error: profileError } = await supabaseAdmin.from("profiles").insert({
      id: userData.user.id,
      company_name: companyName,
      contact_name: contactName,
      contact_email: contactEmail,
      phone: phone,
    })

    if (profileError) throw profileError

    return { success: true, userId: userData.user.id }
  } catch (error: any) {
    console.error("Error adding client:", error)
    return { success: false, error: error.message }
  }
}

export async function assignAutomationToClient(clientId: string, automationId: string) {
  try {
    const { error } = await supabaseAdmin.from("client_automations").insert({
      client_id: clientId,
      automation_id: automationId,
    })

    if (error) throw error

    return { success: true }
  } catch (error: any) {
    console.error("Error assigning automation:", error)
    return { success: false, error: error.message }
  }
}

export async function updateClient(
  clientId: string,
  data: {
    company_name?: string
    contact_name?: string
    contact_email?: string
    phone?: string
  },
) {
  try {
    const { error } = await supabaseAdmin.from("profiles").update(data).eq("id", clientId)

    if (error) throw error

    return { success: true }
  } catch (error: any) {
    console.error("Error updating client:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteClient(clientId: string) {
  try {
    // Delete the user from auth (this will cascade delete the profile due to RLS)
    const { error } = await supabaseAdmin.auth.admin.deleteUser(clientId)

    if (error) throw error

    return { success: true }
  } catch (error: any) {
    console.error("Error deleting client:", error)
    return { success: false, error: error.message }
  }
}

export async function createAutomation(data: {
  name: string
  description: string
  type: string
  script_content?: string
}) {
  try {
    const { error } = await supabaseAdmin.from("automations").insert(data)

    if (error) throw error

    return { success: true }
  } catch (error: any) {
    console.error("Error creating automation:", error)
    return { success: false, error: error.message }
  }
}

export async function updateAutomation(
  automationId: string,
  data: {
    name?: string
    description?: string
    type?: string
    script_content?: string
  },
) {
  try {
    const { error } = await supabaseAdmin.from("automations").update(data).eq("id", automationId)

    if (error) throw error

    return { success: true }
  } catch (error: any) {
    console.error("Error updating automation:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteAutomation(automationId: string) {
  try {
    const { error } = await supabaseAdmin.from("automations").delete().eq("id", automationId)

    if (error) throw error

    return { success: true }
  } catch (error: any) {
    console.error("Error deleting automation:", error)
    return { success: false, error: error.message }
  }
}

export async function getClientAutomations(clientId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("client_automations")
      .select(`
        id,
        status,
        last_run,
        next_run,
        automations:automation_id(
          id,
          name,
          description,
          type
        )
      `)
      .eq("client_id", clientId)

    if (error) throw error

    return { success: true, data }
  } catch (error: any) {
    console.error("Error fetching client automations:", error)
    return { success: false, error: error.message, data: [] }
  }
}

