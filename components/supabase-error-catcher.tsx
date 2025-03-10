"use client"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SupabaseErrorCatcher() {
  const [logs, setLogs] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [supabaseUrl, setSupabaseUrl] = useState(process.env.NEXT_PUBLIC_SUPABASE_URL || "")
  const [supabaseKey, setSupabaseKey] = useState(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "")

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `[${new Date().toISOString()}] ${message}`])
  }

  const runTest = async () => {
    setIsRunning(true)
    setLogs([])

    try {
      // Log the environment variables
      addLog(`Using Supabase URL: ${supabaseUrl}`)
      addLog(
        `Using Supabase Key: ${supabaseKey ? `${supabaseKey.substring(0, 5)}...${supabaseKey.substring(supabaseKey.length - 5)}` : "Not provided"}`,
      )

      // Create a new Supabase client with detailed error logging
      addLog("Creating Supabase client...")

      const options = {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
        global: {
          fetch: (url: RequestInfo | URL, options?: RequestInit) => {
            addLog(`Fetch request to: ${url.toString()}`)
            return fetch(url, options)
              .then((response) => {
                addLog(`Fetch response status: ${response.status}`)
                return response
              })
              .catch((err) => {
                addLog(`Fetch error: ${err.toString()}`)
                throw err
              })
          },
        },
      }

      const supabase = createClient(supabaseUrl, supabaseKey, options)
      addLog("Supabase client created")

      // Test 1: Basic connectivity
      addLog("\nTest 1: Basic connectivity")
      try {
        addLog("Making a simple request to Supabase...")
        const start = Date.now()
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          headers: {
            apikey: supabaseKey,
            "Content-Type": "application/json",
          },
        })
        const end = Date.now()

        addLog(`Response status: ${response.status}`)
        addLog(`Response time: ${end - start}ms`)

        if (response.ok) {
          addLog("✅ Basic connectivity test passed")
        } else {
          const text = await response.text()
          addLog(`❌ Basic connectivity test failed: ${text}`)
        }
      } catch (err: any) {
        addLog(`❌ Basic connectivity error: ${err.toString()}`)
        // Log all properties of the error
        addLog("Error details:")
        for (const key in err) {
          try {
            const value = typeof err[key] === "object" ? JSON.stringify(err[key]) : err[key]
            addLog(`  ${key}: ${value}`)
          } catch (e) {
            addLog(`  ${key}: [Cannot stringify]`)
          }
        }
      }

      // Test 2: Auth API
      addLog("\nTest 2: Auth API")
      try {
        addLog("Testing Auth API...")
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          addLog(`❌ Auth API error: ${JSON.stringify(error)}`)
        } else {
          addLog("✅ Auth API test passed")
          addLog(`Session: ${data.session ? "Active" : "None"}`)
        }
      } catch (err: any) {
        addLog(`❌ Auth API exception: ${err.toString()}`)
        // Log all properties of the error
        addLog("Error details:")
        for (const key in err) {
          try {
            const value = typeof err[key] === "object" ? JSON.stringify(err[key]) : err[key]
            addLog(`  ${key}: ${value}`)
          } catch (e) {
            addLog(`  ${key}: [Cannot stringify]`)
          }
        }
      }

      // Test 3: Database API
      addLog("\nTest 3: Database API")
      try {
        addLog("Testing Database API...")
        const { data, error, status, statusText } = await supabase.from("nonexistent_table").select("*").limit(1)

        addLog(`Status: ${status} ${statusText}`)

        if (error) {
          addLog(`Expected error: ${JSON.stringify(error)}`)
          if (error.message && error.message.includes("relation") && error.message.includes("does not exist")) {
            addLog("✅ Database API test passed (got expected error for nonexistent table)")
          } else {
            addLog("❌ Database API test failed (unexpected error)")
          }
        } else {
          addLog("❓ Database API test unexpected success (should have errored)")
        }
      } catch (err: any) {
        addLog(`❌ Database API exception: ${err.toString()}`)
        // Log all properties of the error
        addLog("Error details:")
        for (const key in err) {
          try {
            const value = typeof err[key] === "object" ? JSON.stringify(err[key]) : err[key]
            addLog(`  ${key}: ${value}`)
          } catch (e) {
            addLog(`  ${key}: [Cannot stringify]`)
          }
        }
      }

      addLog("\nAll tests completed")
    } catch (err: any) {
      addLog(`❌ Unexpected error: ${err.toString()}`)
      // Log all properties of the error
      addLog("Error details:")
      for (const key in err) {
        try {
          const value = typeof err[key] === "object" ? JSON.stringify(err[key]) : err[key]
          addLog(`  ${key}: ${value}`)
        } catch (e) {
          addLog(`  ${key}: [Cannot stringify]`)
        }
      }
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Supabase Error Catcher</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-4">
          <div className="grid gap-2">
            <Label htmlFor="supabaseUrl">Supabase URL</Label>
            <Input
              id="supabaseUrl"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://your-project-id.supabase.co"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="supabaseKey">Supabase Anon Key</Label>
            <Input
              id="supabaseKey"
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              type="password"
              placeholder="your-anon-key"
            />
          </div>
        </div>

        <Button onClick={runTest} disabled={isRunning} className="mb-4">
          {isRunning ? "Running Tests..." : "Run Detailed Tests"}
        </Button>

        <div className="bg-black text-green-400 font-mono text-sm p-4 rounded h-[400px] overflow-auto">
          {logs.length === 0 ? (
            <p className="text-gray-500">Click "Run Detailed Tests" to start...</p>
          ) : (
            logs.map((log, i) => <div key={i}>{log}</div>)
          )}
        </div>

        <div className="mt-4 space-y-4">
          <h3 className="font-semibold">About Empty Error Objects</h3>
          <p className="text-sm text-gray-600">An empty error object ({`{}`}) usually indicates one of these issues:</p>
          <ul className="list-disc ml-6 text-sm text-gray-600 space-y-1">
            <li>Network connectivity problems (CORS, firewall, etc.)</li>
            <li>The error is being caught incorrectly in your code</li>
            <li>The Supabase service might be down or unreachable</li>
            <li>Your environment variables might be incorrect</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

