"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase-client"
import { assignAutomationToClients } from "@/lib/actions/automation-actions"

interface Client {
  id: string
  name: string
  isAssigned: boolean
}

export default function AssignAutomationPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id: automationId } = params
  const [clients, setClients] = useState<Client[]>([])
  const [automationName, setAutomationName] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedClients, setSelectedClients] = useState<string[]>([])
  const [notification, setNotification] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch automation details
        const { data: automation, error: automationError } = await supabase
          .from("automations")
          .select("name")
          .eq("id", automationId)
          .single()

        if (automationError) throw automationError
        setAutomationName(automation.name)

        // Fetch all clients
        const { data: teams, error: teamsError } = await supabase.from("teams").select("id, name")

        if (teamsError) throw teamsError

        // Fetch existing assignments
        const { data: assignments, error: assignmentsError } = await supabase
          .from("team_automations")
          .select("team_id")
          .eq("automation_id", automationId)

        if (assignmentsError) throw assignmentsError

        // Create a set of assigned team IDs for quick lookup
        const assignedTeamIds = new Set(assignments?.map((a) => a.team_id) || [])

        // Mark clients as assigned if they already have this automation
        const clientsWithAssignmentStatus =
          teams?.map((team) => ({
            id: team.id,
            name: team.name,
            isAssigned: assignedTeamIds.has(team.id),
          })) || []

        setClients(clientsWithAssignmentStatus)

        // Initialize selected clients with those that are already assigned
        setSelectedClients(clientsWithAssignmentStatus.filter((client) => client.isAssigned).map((client) => client.id))

        setIsLoading(false)
      } catch (error: any) {
        console.error("Error fetching data:", error)
        setNotification({
          type: "error",
          message: error.message || "Failed to load data",
        })
        setIsLoading(false)
      }
    }

    fetchData()
  }, [automationId])

  const handleClientToggle = (clientId: string) => {
    setSelectedClients((prev) => {
      if (prev.includes(clientId)) {
        return prev.filter((id) => id !== clientId)
      } else {
        return [...prev, clientId]
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setNotification(null)

    try {
      await assignAutomationToClients(automationId, selectedClients)
      setNotification({
        type: "success",
        message: "Automation assigned successfully",
      })
      // Redirect after a short delay to show the success message
      setTimeout(() => {
        router.push(`/admin/automations/${automationId}`)
      }, 1500)
    } catch (error: any) {
      console.error("Error assigning automation:", error)
      setNotification({
        type: "error",
        message: error.message || "Failed to assign automation",
      })
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Assign Automation</h1>

      {notification && (
        <div
          className={`mb-6 p-4 rounded-md ${
            notification.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <p className="font-medium">{notification.type === "success" ? "Success" : "Error"}</p>
          <p>{notification.message}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Assign "{automationName}" to Clients</CardTitle>
          <CardDescription>Select which clients should have access to this automation.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              {clients.length === 0 ? (
                <p>No clients available. Create clients first.</p>
              ) : (
                clients.map((client) => (
                  <div key={client.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`client-${client.id}`}
                      checked={selectedClients.includes(client.id)}
                      onCheckedChange={() => handleClientToggle(client.id)}
                    />
                    <Label htmlFor={`client-${client.id}`}>{client.name}</Label>
                  </div>
                ))
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/admin/automations/${automationId}`)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving || clients.length === 0}>
              {isSaving ? "Saving..." : "Save Assignments"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

