"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase-client"

export default function RobustLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `[${new Date().toISOString()}] ${message}`])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setLogs([])

    try {
      addLog("Attempting to sign in...")

      // Sign in with Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        addLog(`❌ Sign in error: ${signInError.message}`)
        throw signInError
      }

      addLog(`✅ Sign in successful! User ID: ${data.user.id}`)

      // Get user metadata directly from auth
      const userRole = data.user.user_metadata?.role || "client"
      addLog(`User role from metadata: ${userRole}`)

      // Redirect based on role
      if (userRole === "admin") {
        addLog("Redirecting to admin dashboard...")
        router.push("/admin")
      } else {
        addLog(`Redirecting to client dashboard: ${data.user.id}`)
        router.push(`/dashboard/${data.user.id}/automations`)
      }
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message || "Invalid email or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Robust Login</CardTitle>
            <CardDescription>Sign in without querying the profiles table</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <div className="text-sm text-red-500">{error}</div>}
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </form>

            {logs.length > 0 && (
              <div className="mt-4 bg-gray-100 p-3 rounded text-xs font-mono text-gray-800 max-h-40 overflow-auto">
                {logs.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-center text-sm">
              <Link href="/login" className="text-blue-600 hover:underline">
                Back to standard login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

