"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase-client"
import { BarChart4, FileText, Globe, Play } from "lucide-react"
import SidebarLayout, { type SidebarItem } from "@/components/sidebar-layout"

const navigationItems: SidebarItem[] = [
  {
    name: "Overview",
    href: "/",
    icon: Globe,
    type: "item",
  },
  {
    type: "label",
    name: "Management",
  },
  {
    name: "Automations",
    href: "/automations",
    icon: Play,
    type: "item",
  },
  {
    name: "Reports",
    href: "/reports",
    icon: FileText,
    type: "item",
  },
  {
    type: "label",
    name: "Revenue",
  },
  {
    name: "Monetization",
    href: "/monetization",
    icon: BarChart4,
    type: "item",
  },
]

export default function Layout(props: { children: React.ReactNode }) {
  const params = useParams<{ teamId: string }>()
  const router = useRouter()
  const [clientProfile, setClientProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadClientProfile() {
      try {
        // Check if user is authenticated
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
          router.push("/login")
          return
        }

        // Verify this user has access to this client dashboard
        if (user.id !== params.teamId) {
          // Check if user is admin (admins can view any client dashboard)
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single()

          if (profileError || profile.role !== "admin") {
            router.push("/dashboard")
            return
          }
        }

        // Get client profile data
        const { data: clientData, error: clientError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", params.teamId)
          .single()

        if (clientError) throw clientError

        setClientProfile(clientData)
      } catch (err: any) {
        console.error("Error loading client profile:", err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadClientProfile()
  }, [params.teamId, router])

  if (isLoading) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (error || !clientProfile) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md max-w-md">
          <p className="text-red-800 dark:text-red-300">{error || "Client profile not found"}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // Custom sidebar top component with client info
  const SidebarTop = () => {
    return (
      <div className="flex items-center gap-2 px-4 py-2">
        <div className="flex flex-col">
          <span className="font-medium">{clientProfile.company_name}</span>
          <span className="text-xs text-muted-foreground">Client Dashboard</span>
        </div>
      </div>
    )
  }

  return (
    <SidebarLayout
      items={navigationItems}
      basePath={`/dashboard/${params.teamId}`}
      sidebarTop={<SidebarTop />}
      baseBreadcrumb={[
        {
          title: clientProfile.company_name,
          href: `/dashboard/${params.teamId}`,
        },
      ]}
    >
      {props.children}
    </SidebarLayout>
  )
}

