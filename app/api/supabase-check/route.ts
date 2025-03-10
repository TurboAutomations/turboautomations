import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({
      success: false,
      error: "Missing environment variables",
      env: {
        url: supabaseUrl ? "Set" : "Not set",
        key: supabaseKey ? "Set" : "Not set",
      },
    })
  }

  try {
    // First, try a direct fetch to the Supabase URL
    let fetchResult
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
          apikey: supabaseKey,
          "Content-Type": "application/json",
        },
      })

      fetchResult = {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: response.status !== 200 ? await response.text() : "(not fetched)",
      }
    } catch (err: any) {
      fetchResult = {
        error: err.message,
        stack: err.stack,
      }
    }

    // Now try with the Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Test auth
    const { data: authData, error: authError } = await supabase.auth.getSession()

    // Test database
    const { data: dbData, error: dbError, status } = await supabase.from("nonexistent_table").select("*").limit(1)

    return NextResponse.json({
      success: true,
      fetchTest: fetchResult,
      authTest: {
        success: !authError,
        error: authError,
        session: authData?.session ? "Active" : "None",
      },
      dbTest: {
        success: dbError?.message?.includes("relation") && dbError?.message?.includes("does not exist"),
        error: dbError,
        status,
      },
    })
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message,
      stack: err.stack,
    })
  }
}

