"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { supabase } from "@/lib/supabase-client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rememberMe, setRememberMe] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "error">("checking")
  const [connectionError, setConnectionError] = useState<string | null>(null)

  // Check Supabase connection on page load
  useEffect(() => {
    async function checkConnection() {
      try {
        // Log the environment variables (without exposing the full key)
        console.log("Checking Supabase connection with URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
        console.log("Anon key available:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

        // First, check if we can make a simple fetch request to the Supabase URL
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
            headers: {
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
            },
          })

          console.log("Direct fetch response status:", response.status)

          if (!response.ok) {
            throw new Error(`Direct fetch failed with status: ${response.status}`)
          }
        } catch (fetchErr) {
          console.error("Direct fetch error:", fetchErr)
          // Continue with Supabase client test even if direct fetch fails
        }

        // Simple query that doesn't require authentication or specific tables
        // We'll query a non-existent table to see if we get the expected "table doesn't exist" error
        // rather than a connection error
        const { error } = await supabase.from("_dummy_nonexistent_table_").select("*", { count: "exact", head: true })

        // If we get a "relation does not exist" error, that's actually good!
        // It means we connected to Supabase but the table doesn't exist (as expected)
        if (error && error.message && error.message.includes("relation") && error.message.includes("does not exist")) {
          console.log("Supabase connection successful (got expected table not found error)")
          setConnectionStatus("connected")
          return
        }

        // If we get here without an error about a non-existent table, try a simple auth check
        const { data: authData, error: authError } = await supabase.auth.getSession()

        if (authError) {
          throw authError
        }

        console.log("Auth check successful:", !!authData)
        setConnectionStatus("connected")
      } catch (err) {
        console.error("Supabase connection error:", err)
        setConnectionStatus("error")
        setConnectionError(err.message|| "Unknown error")
      }
    }

    checkConnection()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Sign in with Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      // Skip profile query for now and redirect to dashboard
      router.push("/dashboard")
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message || "Invalid email or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Enter your credentials to sign in to your account</p>
        </div>

        {connectionStatus === "checking" ? (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2">Checking Supabase connection...</span>
              </div>
            </CardContent>
          </Card>
        ) : connectionStatus === "error" ? (
          <Card>
            <CardContent className="pt-6">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
                <p className="text-red-800 dark:text-red-300 font-medium">Supabase Connection Error</p>
                <p className="text-red-800 dark:text-red-300 text-sm mt-1">{connectionError}</p>
                <p className="text-sm mt-4">
                  Please check your Supabase configuration and make sure your environment variables are set correctly.
                </p>
                <div className="mt-4 text-xs bg-white p-2 rounded border">
                  <p className="font-medium">Environment Variables:</p>
                  <p>NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || "Not set"}</p>
                  <p>NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not set"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl">Sign in</CardTitle>
              <CardDescription>Enter your email and password to access your dashboard</CardDescription>
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
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link href="/forgot-password" className="text-sm font-medium text-blue-600 hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Remember me
                    </label>
                  </div>
                  {error && <div className="text-sm text-red-500">{error}</div>}
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col">
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Contact your administrator if you need access to the platform.
              </p>
            </CardFooter>
          </Card>
        )}

        <div className="text-center">
          <Link href="/supabase-test" className="text-sm text-blue-600 hover:underline">
            Run Supabase Connection Test
          </Link>
        </div>
      </div>
    </div>
  )
}

