"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { assignAutomationToClient } from "@/app/admin/actions"

export default function ClientAutomationsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [client, setClient] = useState<any>(null)
  const [automations, setAutomations] = useState<any[]>([])
  const [assignedAutomations, setAssignedAutomations] = useState<string[]>([])
  const [availableAutomations, setAvailableAutomations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch client details
        const { data: clientData, error: clientError } = await supabaseAdmin
          .from("profiles")
          .select("*")
          .eq("id", params.id)
          .single()

        if (clientError) throw clientError
        setClient(clientData)

        // Fetch all automations
        const { data: allAutomations, error: automationsError } = await supabaseAdmin
          .from("automations")
          .select("*")
          .order("name")

        if (automationsError) throw automationsError
        setAutomations(allAutomations || [])

        // Fetch assigned automations
        const { data: clientAutomations, error: assignedError } = await supabaseAdmin
          .from("client_automations")
          .select("automation_id")
          .eq("client_id", params.id)

        if (assignedError) throw assignedError

        const assignedIds = (clientAutomations || []).map((item) => item.automation_id)
        setAssignedAutomations(assignedIds)

        // Filter available automations
        setAvailableAutomations(allAutomations || [])
      } catch (err: any) {
        console.error("Error loading data:", err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [params.id])

  const toggleAutomation = (automationId: string) => {
    setAssignedAutomations((prev) =>
      prev.includes(automationId) ? prev.filter((id) => id !== automationId) : [...prev, automationId],
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)

    try {
      // First, delete all existing assignments
      const { error: deleteError } = await supabaseAdmin.from("client_automations").delete().eq("client_id", params.id)

      if (deleteError) throw deleteError

      // Then add new assignments
      for (const automationId of assignedAutomations) {
        const result = await assignAutomationToClient(params.id, automationId)
        if (!result.success) throw new Error(result.error)
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/admin/clients")
        router.refresh()
      }, 2000)
    } catch (err: any) {
      console.error("Error saving automations:", err)
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-6">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Loading...</h1>
      </div>
    )
  }

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Manage Automations for {client?.company_name}</h1>
      <p className="text-muted-foreground mb-6">Select which automations should be assigned to this client</p>

      {success ? (
        <Card>
          <CardContent className="pt-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md">
              <p className="text-green-800 dark:text-green-300">Automations updated successfully! Redirecting...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Available Automations</CardTitle>
            </CardHeader>
            <CardContent>
              {availableAutomations.length === 0 ? (
                <p className="text-muted-foreground">No automations available. Create some first.</p>
              ) : (
                <div className="space-y-4">
                  {availableAutomations.map((automation) => (
                    <div key={automation.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`automation-${automation.id}`}
                        checked={assignedAutomations.includes(automation.id)}
                        onCheckedChange={() => toggleAutomation(automation.id)}
                      />
                      <Label htmlFor={`automation-${automation.id}`} className="text-sm font-medium cursor-pointer">
                        {automation.name}
                        <span className="block text-xs text-muted-foreground">{automation.description}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md text-red-800 dark:text-red-300 text-sm mt-4">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => router.push("/admin/clients")}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleSave}
              disabled={isSaving || availableAutomations.length === 0}
            >
              {isSaving ? "Saving..." : "Save Assignments"}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

