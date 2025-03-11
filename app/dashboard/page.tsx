"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClientHeader } from "@/components/client-header"
import { supabase } from "@/lib/supabase-client"
import { BarChart, Clock, MessageSquare, FileText, Zap } from "lucide-react"

export default function ClientDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalAutomations: 0,
    activeAutomations: 0,
    completedRuns: 0,
  })
  const [automations, setAutomations] = useState<any[]>([])
  const [recentRuns, setRecentRuns] = useState<any[]>([])
  const [reports, setReports] = useState<any[]>([])

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()
        if (sessionError) throw sessionError

        if (!session) {
          router.push("/login")
          return
        }

        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()

        if (profileError) throw profileError
        setUser(profile)

        // Fetch automations
        const { data: clientAutomations, error: automationsError } = await supabase
          .from("client_automations")
          .select(`
            *,
            automations (*)
          `)
          .eq("client_id", session.user.id)

        if (automationsError) throw automationsError
        setAutomations(clientAutomations || [])

        // Get active automations count
        const activeAutomations = clientAutomations?.filter((a) => a.status === "active") || []

        // Fetch recent runs
        const { data: runs, error: runsError } = await supabase
          .from("automation_runs")
          .select(`
            *,
            client_automations(
              *,
              automations(name)
            )
          `)
          .in("client_automation_id", clientAutomations?.map((a) => a.id) || [])
          .order("started_at", { ascending: false })
          .limit(5)

        if (runsError) throw runsError
        setRecentRuns(runs || [])

        // Fetch reports
        const { data: reportData, error: reportsError } = await supabase
          .from("reports")
          .select("*")
          .eq("client_id", session.user.id)
          .order("created_at", { ascending: false })
          .limit(5)

        if (reportsError) throw reportsError
        setReports(reportData || [])

        setStats({
          totalAutomations: clientAutomations?.length || 0,
          activeAutomations: activeAutomations.length,
          completedRuns: runs?.filter((r) => r.status === "completed").length || 0,
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [router])

  const handleRequestAutomation = () => {
    // Replace with your WhatsApp business number
    const whatsappNumber = "1234567890"
    const message = `Hi, I'd like to request a new automation for my business (${user?.company_name}).`
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank")
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <ClientHeader user={user} />

      <main className="container py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user?.company_name}</h1>
          <p className="text-muted-foreground mt-2">Manage your automations and view reports</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Automations</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAutomations}</div>
              <p className="text-xs text-muted-foreground mt-1">Automations assigned</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Automations</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeAutomations}</div>
              <p className="text-xs text-muted-foreground mt-1">Currently running</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed Runs</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedRuns}</div>
              <p className="text-xs text-muted-foreground mt-1">Successfully completed</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end mb-6">
          <Button onClick={handleRequestAutomation}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Request New Automation
          </Button>
        </div>

        <Tabs defaultValue="automations" className="space-y-4">
          <TabsList>
            <TabsTrigger value="automations">Automations</TabsTrigger>
            <TabsTrigger value="runs">Recent Runs</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="automations" className="space-y-4">
            {automations.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <Zap className="h-8 w-8 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No automations yet</p>
                  <p className="text-sm text-muted-foreground mb-4">Get started by requesting your first automation</p>
                  <Button onClick={handleRequestAutomation}>Request Automation</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {automations.map((automation) => (
                  <Card key={automation.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">{automation.automations?.name}</h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            automation.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                          }`}
                        >
                          {automation.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{automation.automations?.description}</p>
                      <div className="text-sm text-muted-foreground">
                        Last run:{" "}
                        {automation.last_run_at ? new Date(automation.last_run_at).toLocaleDateString() : "Never"}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="runs">
            <Card>
              <CardContent className="p-6">
                {recentRuns.length === 0 ? (
                  <div className="text-center py-10">
                    <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium">No automation runs yet</p>
                    <p className="text-sm text-muted-foreground">
                      Your automation runs will appear here once they start
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentRuns.map((run) => (
                      <div key={run.id} className="flex items-center justify-between border-b pb-4">
                        <div>
                          <div className="font-medium">{run.client_automations?.automations?.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(run.started_at).toLocaleString()}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            run.status === "completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : run.status === "failed"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                          }`}
                        >
                          {run.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardContent className="p-6">
                {reports.length === 0 ? (
                  <div className="text-center py-10">
                    <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium">No reports yet</p>
                    <p className="text-sm text-muted-foreground">Your automation reports will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <div key={report.id} className="flex items-center justify-between border-b pb-4">
                        <div>
                          <div className="font-medium">{report.title}</div>
                          <div className="text-sm text-muted-foreground">
                            Generated on {new Date(report.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={report.file_url} target="_blank" rel="noopener noreferrer">
                            Download
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

