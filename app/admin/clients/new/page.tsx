"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabaseAdmin } from "@/lib/supabase-admin"

export default function NewAutomationPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const type = formData.get("type") as string
    const scriptContent = formData.get("scriptContent") as string

    try {
      const { error } = await supabaseAdmin.from("automations").insert({
        name,
        description,
        type,
        script_content: scriptContent,
      })

      if (error) throw error

      setSuccess(true)
      // Redirect after a short delay
      setTimeout(() => {
        router.push("/admin/automations")
        router.refresh()
      }, 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Create New Automation</h1>

      {success ? (
        <Card>
          <CardContent className="pt-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md">
              <p className="text-green-800 dark:text-green-300">Automation created successfully! Redirecting...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Automation Name</Label>
                  <Input id="name" name="name" placeholder="e.g., Daily Sales Report" required />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" name="description" placeholder="What does this automation do?" required />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="type">Type</Label>
                  <Input id="type" name="type" placeholder="e.g., Report Generation, Data Integration" required />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Automation Script</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <Label htmlFor="scriptContent">Script Content</Label>
                  <Textarea
                    id="scriptContent"
                    name="scriptContent"
                    rows={10}
                    className="min-h-[200px] font-mono"
                    placeholder="// Enter your automation script here"
                  />
                </div>
              </CardContent>
            </Card>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md text-red-800 dark:text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/automations")}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Automation"}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}

