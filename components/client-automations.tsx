"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlayCircle, PauseCircle, AlertCircle, CheckCircle } from "lucide-react"
import { useState } from "react"

interface Automation {
  id: string
  name: string
  description: string
  status: string
  createdAt: string
  updatedAt: string
}

export function ClientAutomations({ automations }: { automations: Automation[] }) {
  const [localAutomations, setLocalAutomations] = useState<Automation[]>(automations)

  // Function to toggle automation status (in a real app, this would call an API)
  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active"

    try {
      // In a real implementation, you would call your API here
      // await updateAutomationStatus(id, newStatus)

      // For now, just update the local state
      setLocalAutomations((prev) =>
        prev.map((automation) => (automation.id === id ? { ...automation, status: newStatus } : automation)),
      )
    } catch (error) {
      console.error("Error updating automation status:", error)
    }
  }

  // Helper function to render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "paused":
        return <Badge className="bg-yellow-500">Paused</Badge>
      case "error":
        return <Badge className="bg-red-500">Error</Badge>
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>
    }
  }

  // Helper function to render status icon
  const renderStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "paused":
        return <PauseCircle className="h-5 w-5 text-yellow-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  if (localAutomations.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-medium mb-2">No automations assigned yet</h2>
        <p className="text-muted-foreground">
          Your administrator will assign automations to your account when they're ready.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {localAutomations.map((automation) => (
        <Card key={automation.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{automation.name}</CardTitle>
              {renderStatusBadge(automation.status)}
            </div>
            <CardDescription className="line-clamp-2">{automation.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {renderStatusIcon(automation.status)}
              <span>
                {automation.status === "active"
                  ? "Automation is running"
                  : automation.status === "paused"
                    ? "Automation is paused"
                    : "Automation has an error"}
              </span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleStatus(automation.id, automation.status)}
              disabled={automation.status === "error"}
            >
              {automation.status === "active" ? (
                <>
                  <PauseCircle className="h-4 w-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Activate
                </>
              )}
            </Button>
            <Button variant="ghost" size="sm">
              View Details
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

