"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play } from "lucide-react"
import { supabase } from "@/lib/supabase-client"

export function ClientAutomations({
  clientId,
}: {
  clientId: string
}) {
  const [clientProfile, setClientProfile] = useState<any>(null)
  const [automations, setAutomations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        // Get client profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", clientId)
          .single()

        if (profileError) throw profileError
        setClientProfile(profile)

        // First, get the client's automation assignments
        const { data: clientAutomationData, error: clientAutomationError } = await supabase
          .from("client_automations")
          .select("id, automation_id, status, last_run, next_run")
          .eq("client_id", clientId)

        if (clientAutomationError) throw clientAutomationError

        if (clientAutomationData.length === 0) {
          setAutomations([])
          setIsLoading(false)
          return
        }

        // Get the automation details for each assigned automation
        const automationIds = clientAutomationData.map((item) => item.automation_id)
        const { data: automationDetails, error: automationError } = await supabase
          .from("automations")
          .select("id, name, description, type")
          .in("id", automationIds)

        if (automationError) throw automationError

        // Combine the data
        const formattedAutomations = clientAutomationData.map((clientAutomation) => {
          const automationDetail = automationDetails.find((detail) => detail.id === clientAutomation.automation_id)

          return {
            id: clientAutomation.id,
            name: automationDetail?.name || "Unknown Automation",
            description: automationDetail?.description || "",
            type: automationDetail?.type || "Unknown Type",
            status: clientAutomation.status,
            lastRun: clientAutomation.last_run ? new Date(clientAutomation.last_run).toLocaleString() : null,
            nextRun: clientAutomation.next_run ? new Date(clientAutomation.next_run).toLocaleString() : null,
          }
        })

        setAutomations(formattedAutomations)
      } catch (err: any) {
        console.error("Error loading client automations:", err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [clientId])

  if (isLoading) {
    return <div className="p-4">Loading automations...</div>
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
        <p className="text-red-800 dark:text-red-300">Error: {error}</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Automations</h1>
          <p className="text-lg text-muted-foreground">Manage and run your custom automations</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">Request New Automation</Button>
      </div>

      {automations.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border rounded-xl p-6 text-center">
          <p className="text-muted-foreground mb-4">No automations have been set up yet.</p>
          <Button className="bg-blue-600 hover:bg-blue-700">Request Your First Automation</Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {automations.map((automation) => (
            <Card key={automation.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="space-y-1">
                  <CardTitle className="text-2xl">{automation.name}</CardTitle>
                  <p className="text-muted-foreground">{automation.description}</p>
                </div>
                <Button variant="ghost" size="icon">
                  <span className="sr-only">More options</span>
                  <svg
                    width="15"
                    height="3"
                    viewBox="0 0 15 3"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-foreground"
                  >
                    <path
                      d="M1.5 3C2.32843 3 3 2.32843 3 1.5C3 0.671573 2.32843 0 1.5 0C0.671573 0 0 0.671573 0 1.5C0 2.32843 0.671573 3 1.5 3Z"
                      fill="currentColor"
                    />
                    <path
                      d="M7.5 3C8.32843 3 9 2.32843 9 1.5C9 0.671573 8.32843 0 7.5 0C6.67157 0 6 0.671573 6 1.5C6 2.32843 6.67157 3 7.5 3Z"
                      fill="currentColor"
                    />
                    <path
                      d="M13.5 3C14.3284 3 15 2.32843 15 1.5C15 0.671573 14.3284 0 13.5 0C12.6716 0 12 0.671573 12 1.5C12 2.32843 12.6716 3 13.5 3Z"
                      fill="currentColor"
                    />
                  </svg>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white bg-blue-600">
                    {automation.status}
                  </div>
                  <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
                    {automation.type}
                  </div>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  {automation.lastRun && (
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M8 3.5V8L11 9.5M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Last run: {automation.lastRun}
                    </div>
                  )}
                  {automation.nextRun && (
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M11.5 2.5H4.5C3.11929 2.5 2 3.61929 2 5V11C2 12.3807 3.11929 13.5 4.5 13.5H11.5C12.8807 13.5 14 12.3807 14 11V5C14 3.61929 12.8807 2.5 11.5 2.5Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M5.5 1.5V3.5M10.5 1.5V3.5M2 6.5H14"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Next run: {automation.nextRun}
                    </div>
                  )}
                </div>

                <Button className="w-full text-white bg-blue-600 hover:bg-blue-700">
                  <Play className="mr-2 h-4 w-4" />
                  Run Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}

