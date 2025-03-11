"use server"

import { supabaseAdmin } from "@/lib/supabase-admin"

type ClientFormData = {
  companyName: string
  contactName: string
  email: string
  phone: string
  password: string
}

export async function createClient(formData: ClientFormData) {
  try {
    // 1. Create a new user in auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: formData.email,
      password: formData.password,
      email_confirm: true,
      user_metadata: {
        company_name: formData.companyName,
        full_name: formData.contactName,
        role: "client",
      },
    })

    if (authError) throw authError

    // 2. Create profile for the new user
    const { error: profileError } = await supabaseAdmin.from("profiles").insert([
      {
        id: authData.user.id,
        company_name: formData.companyName,
        contact_name: formData.contactName,
        contact_email: formData.email,
        phone: formData.phone,
        role: "client",
        is_admin: false,
      },
    ])

    if (profileError) throw profileError

    return { success: true, userId: authData.user.id }
  } catch (error: any) {
    console.error("Error creating client:", error)
    throw new Error(error.message || "Failed to create client")
  }
}

