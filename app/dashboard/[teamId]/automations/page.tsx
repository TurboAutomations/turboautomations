import { ClientAutomations } from "@/components/client-automations"

export default function AutomationsPage({ params }: { params: { teamId: string } }) {
  return (
    <div className="container space-y-6 p-6">
      <ClientAutomations clientId={params.teamId} />
    </div>
  )
}

