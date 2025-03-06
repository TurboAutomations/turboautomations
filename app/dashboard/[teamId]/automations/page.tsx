import { ClientAutomations } from "@/components/client-automations"

// This is a server component
export default async function AutomationsPage({ params }: { params: { teamId: string } }) {
  // In a real app, you would fetch this data from your API
  const clientAutomations = await fetchClientAutomations(params.teamId)

  return (
    <div className="container space-y-6 p-6">
      <ClientAutomations clientId={params.teamId} initialAutomations={clientAutomations} />
    </div>
  )
}

// Mock function to fetch client automations
async function fetchClientAutomations(clientId: string) {
  // In a real app, this would be a database query
  if (clientId === "uber-eats") {
    return [
      {
        id: "daily-sales",
        name: "Daily Sales Report",
        description: "Generates a daily sales report from CRM data and emails it to stakeholders",
        type: "Report Generation",
        status: "active",
        lastRun: "Today at 2:30 PM",
        schedule: "Daily at 2:00 PM",
      },
    ]
  }

  return []
}

