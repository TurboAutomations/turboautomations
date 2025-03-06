import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function AdminAutomationsPage() {
  return (
    <div className="container space-y-6 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Automations</h1>
          <p className="text-lg text-muted-foreground">Create and manage automations for your clients</p>
        </div>
        <Link href="/admin/automations/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Create New Automation
          </Button>
        </Link>
      </div>

      <AdminAutomationsList />
    </div>
  )
}

// This would be a client component in a real app
function AdminAutomationsList() {
  // In a real app, you would fetch this data from your API
  const automations = [
    {
      id: "daily-sales",
      name: "Daily Sales Report",
      description: "Generates a daily sales report from CRM data and emails it to stakeholders",
      type: "Report Generation",
      clients: ["uber-eats"],
      createdAt: "2025-02-15",
    },
    {
      id: "customer-data-sync",
      name: "Customer Data Sync",
      description: "Synchronizes customer data between CRM and marketing platform",
      type: "Data Integration",
      clients: [],
      createdAt: "2025-03-01",
    },
  ]

  return (
    <div className="grid gap-6">
      {automations.map((automation) => (
        <Card key={automation.id}>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-xl">{automation.name}</CardTitle>
              <p className="text-muted-foreground mt-1">{automation.description}</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/automations/${automation.id}/edit`}>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </Link>
              <Link href={`/admin/automations/${automation.id}/assign`}>
                <Button variant="outline" size="sm">
                  Assign to Clients
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Type</p>
                <p className="text-sm text-muted-foreground">{automation.type}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm text-muted-foreground">{automation.createdAt}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium">Assigned to</p>
                <p className="text-sm text-muted-foreground">
                  {automation.clients.length > 0 ? automation.clients.join(", ") : "Not assigned to any clients"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

