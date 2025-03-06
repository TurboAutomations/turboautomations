"use client"

import { useState } from "react"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CreateAdminPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("Admin User")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleCreateAdmin = async () => {
    setLoading(true)
    setResult(null)

    try {
      // 1. Create the user in Supabase Auth
      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Skip email confirmation
        user_metadata: {
          name,
          role: "admin",
        },
      })

      if (userError) throw userError

      // 2. Create a profile record in the profiles table
      const { error: profileError } = await supabaseAdmin.from("profiles").insert({
        id: userData.user.id,
        company_name: "Admin Company",
        contact_name: name,
        contact_email: email,
        role: "admin", // Set the role to admin
      })

      if (profileError) throw profileError

      setResult({
        success: true,
        message: `Admin user created successfully! User ID: ${userData.user.id}`,
      })
    } catch (error: any) {
      console.error("Error creating admin:", error)
      setResult({
        success: false,
        message: `Error: ${error.message}`,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create Admin User</h1>

      <Card>
        <CardHeader>
          <CardTitle>New Admin User</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Secure password"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Admin User" />
            </div>

            <Button className="w-full" onClick={handleCreateAdmin} disabled={loading || !email || !password}>
              {loading ? "Creating..." : "Create Admin User"}
            </Button>

            {result && (
              <div
                className={`p-3 rounded-md ${
                  result.success
                    ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                    : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                }`}
              >
                {result.message}
                {result.success && (
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => (window.location.href = "/login")}
                    >
                      Go to Login
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

