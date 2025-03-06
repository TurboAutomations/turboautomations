"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

export default function AssignAutomationPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()

  // In a real app, you would fetch this data from your API
  const automation = {
    id: params.id,
    name: params.id === "daily-sales" ? "Daily Sales Report" : "Customer Data Sync",
    description:
      params.id === "daily-sales"
        ? "Generates a daily sales report from CRM data and emails it to stakeholders"
        : "Synchronizes customer data between CRM and marketing platform",
  }

  // In a real app, you would fetch this data from your API
  const clients = [
    { id: "uber-eats", name: "Uber Eats", assigned: params.id === "daily-sales" },
    { id: "doordash", name: "DoorDash", assigned: false },
    { id: "grubhub", name: "Grubhub", assigned: false },
  ]

  const [assignedClients, setAssignedClients] = useState(
    clients.filter((client) => client.assigned).map((client) => client.id),
  )

  const toggleClient = (clientId: string) => {
    setAssignedClients((prev) => (prev.includes(clientId) ? prev.filter((id) => id !== clientId) : [...prev, clientId]))
  }

  const handleSave = async () => {
    // In a real app, you would send this data to your API
    console.log(`Assigning automation ${params.id} to clients:`, assignedClients)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Redirect back to the automations list
    router.push("/admin/automations")
  }

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Assign Automation to Clients</h1>
      <p className="text-muted-foreground mb-6">Select which clients should have access to this automation</p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{automation.name}</CardTitle>
          <p className="text-muted-foreground">{automation.description}</p>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clients.map((client) => (
              <div key={client.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`client-${client.id}`}
                  checked={assignedClients.includes(client.id)}
                  onChange={() => toggleClient(client.id)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={`client-${client.id}`} className="text-sm font-medium">
                  {client.name}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4 mt-6">
        <Button variant="outline" onClick={() => router.push("/admin/automations")}>
          Cancel
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSave}>
          Save Assignments
        </Button>
      </div>
    </div>
  )
}

