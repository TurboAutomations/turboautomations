"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

// This is a simple client configuration store
// In a real app, you would fetch this from your database
type ClientConfig = {
  id: string
  name: string
  logo: string
  primaryColor: string
  secondaryColor: string
  automations: {
    id: string
    name: string
    description: string
    type: string
    lastRun?: string
    schedule?: string
    status: "active" | "inactive" | "error"
  }[]
}

const clientConfigs: Record<string, ClientConfig> = {
  "uber-eats": {
    id: "uber-eats",
    name: "Uber Eats",
    logo: "/clients/uber-eats-logo.svg", // You would replace this with the actual logo path
    primaryColor: "#06C167", // Uber Eats green
    secondaryColor: "#142328", // Uber Eats dark color
    automations: [
      {
        id: "daily-sales",
        name: "Daily Sales Report",
        description: "Generates a daily sales report from CRM data and emails it to stakeholders",
        type: "Report Generation",
        lastRun: "Today at 2:30 PM",
        schedule: "Daily at 2:00 PM",
        status: "active",
      },
    ],
  },
}

export function useClientConfig() {
  const params = useParams<{ teamId: string }>()
  const [clientConfig, setClientConfig] = useState<ClientConfig | null>(null)

  useEffect(() => {
    // In a real app, you would fetch this from your API
    // For now, we'll just use the teamId to look up the client config
    const config = clientConfigs[params.teamId] || null
    setClientConfig(config)
  }, [params.teamId])

  return clientConfig
}

