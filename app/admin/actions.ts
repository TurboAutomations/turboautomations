"use server"

import { supabaseAdmin } from "@/lib/supabase-admin"

export async function addClient(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const companyName = (formData.get("companyName") as string) || "Default Company"
  const contactName = (formData.get("contactName") as string) || ""
  const contactEmail = (formData.get("contactEmail") as string) || email
  const phone = (formData.get("phone") as string) || ""
  const role = "client" // Default role for clients

  try {
    console.log("Creating user with email:", email)

    // Create the user in Supabase Auth
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        company: companyName,
        name: contactName,
        role: role,
      },
      app_metadata: {
        role: role,
      },
    })

    if (userError) {
      console.error("Error creating user:", userError)
      throw userError
    }

    console.log("User created successfully, ID:", userData.user.id)

    // The profile should be created automatically by the trigger
    // But let's verify it exists
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userData.user.id)
      .single()

    if (profileError) {
      console.error("Error verifying profile:", profileError)

      // If profile wasn't created by trigger, create it manually
      const { error: insertError } = await supabaseAdmin.from("profiles").insert({
        id: userData.user.id,
        company_name: companyName,
        contact_name: contactName,
        contact_email: contactEmail,
        phone: phone,
        role: role,
      })

      if (insertError) {
        throw insertError
      }
    } else {
      console.log("Profile verified:", profile)
    }

    return { success: true, userId: userData.user.id }
  } catch (error: any) {
    console.error("Error adding client:", error)
    return { success: false, error: error.message }
  }
}

