"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ConnectionTest() {
  const [logs, setLogs] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `[${new Date().toISOString()}] ${message}`])
  }

  const runTest = async () => {
    setIsRunning(true)
    setLogs([])

    try {
      // Test 1: Check environment variables
      addLog("Checking environment variables...")
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl) {
        addLog("❌ NEXT_PUBLIC_SUPABASE_URL is not set")
      } else {
        addLog(`✅ NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl}`)
      }

      if (!supabaseKey) {
        addLog("❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set")
      } else {
        addLog("✅ NEXT_PUBLIC_SUPABASE_ANON_KEY is set")
      }

      // Test 2: Direct fetch to Supabase
      addLog("Testing direct fetch to Supabase...")
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          headers: {
            apikey: supabaseKey || "",
          },
        })

        addLog(`Response status: ${response.status}`)

        if (response.ok) {
          addLog("✅ Direct fetch successful")
        } else {
          const text = await response.text()
          addLog(`❌ Direct fetch failed: ${text}`)
        }
      } catch (err: any) {
        addLog(`❌ Direct fetch error: ${err.message}`)
      }

      addLog("Tests completed")
    } catch (err: any) {
      addLog(`❌ Unexpected error: ${err.message}`)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Connection Test</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={runTest} disabled={isRunning} className="mb-4">
          {isRunning ? "Running..." : "Run Test"}
        </Button>

        <div className="bg-black text-green-400 font-mono text-sm p-4 rounded h-[300px] overflow-auto">
          {logs.length === 0 ? (
            <p className="text-gray-500">Click "Run Test" to start...</p>
          ) : (
            logs.map((log, i) => <div key={i}>{log}</div>)
          )}
        </div>
      </CardContent>
    </Card>
  )
}

