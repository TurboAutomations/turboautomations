"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SupabaseConnectionTest() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading")
  const [error, setError] = useState<string | null>(null)
  const [supabaseUrl, setSupabaseUrl] = useState<string | null>(null)

  useEffect(() => {
    async function testConnection() {
      try {
        // Get the Supabase URL from environment variables
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL
        setSupabaseUrl(url || "Not found in environment variables")

        // Simple query that doesn't require authentication
        const { count, error } = await supabase.from("profiles").select("*", { count: "exact", head: true })

        if (error) throw error

        setStatus("connected")
      } catch (err: any) {
        console.error("Supabase connection error:", err)
        setStatus("error")
        setError(err.message || "Unknown error")
      }
    }

    testConnection()
  }, [])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Supabase Connection Test</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="font-medium">Status:</div>
            <div>
              {status === "loading" && "Testing connection..."}
              {status === "connected" && <span className="text-green-600 font-medium">Connected</span>}
              {status === "error" && <span className="text-red-600 font-medium">Error</span>}
            </div>

            <div className="font-medium">Supabase URL:</div>
            <div className="break-all text-sm">{supabaseUrl}</div>

            {error && (
              <>
                <div className="font-medium">Error:</div>
                <div className="text-red-600 text-sm break-all">{error}</div>
              </>
            )}
          </div>

          <div className="text-sm text-gray-500 mt-4">
            <p>This test checks if your application can connect to Supabase.</p>
            <p className="mt-2">If you see "Connected", your Supabase configuration is working correctly.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

