"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabaseAdmin } from "@/lib/supabase-admin"

export default function TestSetupPage() {
  const [logs, setLogs] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `[${new Date().toISOString()}] ${message}`])
  }

  const runTests = async () => {
    setIsRunning(true)
    setLogs([])

    try {
      addLog("Starting tests...")

      // Test 1: Check if tables exist
      addLog("Test 1: Checking if tables exist...")
      const tables = ["profiles", "automations", "client_automations"]

      for (const table of tables) {
        try {
          const { count, error } = await supabaseAdmin.from(table).select("*", { count: "exact", head: true })

          if (error) {
            addLog(`❌ Table '${table}' error: ${error.message}`)
          } else {
            addLog(`✅ Table '${table}' exists with ${count} rows`)
          }
        } catch (err: any) {
          addLog(`❌ Error checking table '${table}': ${err.message}`)
        }
      }

      // Test 2: Create a test user
      addLog("\nTest 2: Creating a test user...")
      const testEmail = `test-${Date.now()}@example.com`
      const testPassword = "password123"
      const testCompany = "Test Company"

      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
        email: testEmail,
        password: testPassword,
        email_confirm: true,
        user_metadata: {
          company: testCompany,
          role: "client",
        },
        app_metadata: {
          role: "client",
        },
      })

      if (userError) {
        addLog(`❌ Error creating test user: ${userError.message}`)
      } else {
        addLog(`✅ Test user created with ID: ${userData.user.id}`)

        // Check if profile was created
        const { data: profile, error: profileError } = await supabaseAdmin
          .from("profiles")
          .select("*")
          .eq("id", userData.user.id)
          .single()

        if (profileError) {
          addLog(`❌ Error finding profile: ${profileError.message}`)
        } else {
          addLog(`✅ Profile created automatically:`)
          addLog(`   Company: ${profile.company_name}`)
          addLog(`   Role: ${profile.role}`)
        }
      }

      // Test 3: Create a test automation
      addLog("\nTest 3: Creating a test automation...")
      const { data: automation, error: automationError } = await supabaseAdmin
        .from("automations")
        .insert({
          name: "Test Automation",
          description: "Created during setup test",
          type: "Test",
        })
        .select()
        .single()

      if (automationError) {
        addLog(`❌ Error creating automation: ${automationError.message}`)
      } else {
        addLog(`✅ Test automation created with ID: ${automation.id}`)
      }

      addLog("\nAll tests completed!")
    } catch (err: any) {
      addLog(`❌ Unexpected error: ${err.message}`)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Test Supabase Setup</h1>

      <Card>
        <CardHeader>
          <CardTitle>Run Setup Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={runTests} disabled={isRunning} className="mb-4">
            {isRunning ? "Running Tests..." : "Run Tests"}
          </Button>

          <div className="bg-black text-green-400 font-mono text-sm p-4 rounded h-[400px] overflow-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">Click "Run Tests" to start...</p>
            ) : (
              logs.map((log, i) => <div key={i}>{log}</div>)
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

