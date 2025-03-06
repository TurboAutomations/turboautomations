import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, Users, Play, BarChart } from "lucide-react"
import Link from "next/link"

export default function AdminDashboardPage() {
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
          value="2"
          icon={<Users className="h-5 w-5" />}
          href="/admin/clients"
        />
        <DashboardCard
          title="Automations"
          description="Create and assign automations"
          value="2"
          icon={<Play className="h-5 w-5" />}
          href="/admin/automations"
        />
        <DashboardCard
          title="Active Runs"
          description="Monitor automation executions"
          value="1"
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
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-700 font-medium">UE</span>
                  </div>
                  <div>
                    <p className="font-medium">Uber Eats</p>
                    <p className="text-sm text-muted-foreground">Added on Mar 5, 2025</p>
                  </div>
                </div>
                <Link
                  href="/admin/clients/uber-eats"
                  className="text-blue-600 hover:underline text-sm flex items-center"
                >
                  View <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-red-700 font-medium">DD</span>
                  </div>
                  <div>
                    <p className="font-medium">DoorDash</p>
                    <p className="text-sm text-muted-foreground">Added on Mar 1, 2025</p>
                  </div>
                </div>
                <Link
                  href="/admin/clients/doordash"
                  className="text-blue-600 hover:underline text-sm flex items-center"
                >
                  View <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Automations</CardTitle>
            <CardDescription>Recently created automations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Daily Sales Report</p>
                  <p className="text-sm text-muted-foreground">Created on Feb 15, 2025</p>
                </div>
                <Link
                  href="/admin/automations/daily-sales"
                  className="text-blue-600 hover:underline text-sm flex items-center"
                >
                  View <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Customer Data Sync</p>
                  <p className="text-sm text-muted-foreground">Created on Mar 1, 2025</p>
                </div>
                <Link
                  href="/admin/automations/customer-data-sync"
                  className="text-blue-600 hover:underline text-sm flex items-center"
                >
                  View <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>
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

