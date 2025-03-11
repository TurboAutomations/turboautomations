"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { supabase } from "@/lib/supabase-client"
import { ArrowUpRight, Users, Play, BarChart } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    clientCount: "0",
    automationCount: "0",
    activeRunsCount: "0",
  })
  const [recentClients, setRecentClients] = useState<any[]>([])
  const [recentAutomations, setRecentAutomations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)

        // Fetch client count
        const { count: clientCount, error: clientError } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("role", "client")

        if (clientError) throw clientError

        // Fetch automation count
        const { count: automationCount, error: automationError } = await supabase
          .from("automations")
          .select("*", { count: "exact", head: true })

        if (automationError) throw automationError

        // Fetch active runs count
        const { count: activeRunsCount, error: runsError } = await supabase
          .from("automation_runs")
          .select("*", { count: "exact", head: true })
          .eq("status", "running")

        if (runsError) throw runsError

        // Fetch recent clients
        const { data: recentClientsData, error: recentClientsError } = await supabase
          .from("profiles")
          .select("*")
          .eq("role", "client")
          .order("created_at", { ascending: false })
          .limit(5)

        if (recentClientsError) throw recentClientsError

        // Fetch recent automations
        const { data: recentAutomationsData, error: recentAutomationsError } = await supabase
          .from("automations")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5)

        if (recentAutomationsError) throw recentAutomationsError

        setStats({
          clientCount: String(clientCount || 0),
          automationCount: String(automationCount || 0),
          activeRunsCount: String(activeRunsCount || 0),
        })

        setRecentClients(recentClientsData || [])
        setRecentAutomations(recentAutomationsData || [])
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Function to generate initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "CL"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Format date function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="container space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-lg text-muted-foreground">Manage your clients and automations</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Clients"
          description="Manage client accounts"
          value={loading ? "..." : stats.clientCount}
          icon={<Users className="h-5 w-5" />}
          href="/admin/clients"
        />
        <DashboardCard
          title="Automations"
          description="Create and assign automations"
          value={loading ? "..." : stats.automationCount}
          icon={<Play className="h-5 w-5" />}
          href="/admin/automations"
        />
        <DashboardCard
          title="Active Runs"
          description="Monitor automation executions"
          value={loading ? "..." : stats.activeRunsCount}
          icon={<BarChart className="h-5 w-5" />}
          href="/admin/runs"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Clients</CardTitle>
            <CardDescription>Recently added client accounts</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : recentClients.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No clients yet</div>
            ) : (
              <div className="space-y-4">
                {recentClients.map((client) => (
                  <div key={client.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-700 font-medium">
                          {getInitials(client.company_name || client.contact_name)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{client.company_name}</p>
                        <p className="text-sm text-muted-foreground">Added on {formatDate(client.created_at)}</p>
                      </div>
                    </div>
                    <Link
                      href={`/admin/clients/${client.id}`}
                      className="text-blue-600 hover:underline text-sm flex items-center"
                    >
                      View <ArrowUpRight className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Automations</CardTitle>
            <CardDescription>Recently created automations</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : recentAutomations.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No automations yet</div>
            ) : (
              <div className="space-y-4">
                {recentAutomations.map((automation) => (
                  <div key={automation.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{automation.name}</p>
                      <p className="text-sm text-muted-foreground">Created on {formatDate(automation.created_at)}</p>
                    </div>
                    <Link
                      href={`/admin/automations/${automation.id}`}
                      className="text-blue-600 hover:underline text-sm flex items-center"
                    >
                      View <ArrowUpRight className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DashboardCard({
  title,
  description,
  value,
  icon,
  href,
}: {
  title: string
  description: string
  value: string
  icon: React.ReactNode
  href: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <div className="mt-4">
          <Link href={href} className="text-sm text-blue-600 hover:underline flex items-center">
            View all
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

