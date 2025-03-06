"use client"

import type React from "react"
import { useParams } from "next/navigation"
import SidebarLayout, { type SidebarItem } from "@/components/sidebar-layout"
import { BarChart4, FileText, Globe, Play } from "lucide-react"
import { useClientConfig } from "./client-config"
import Image from "next/image"

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
  const clientConfig = useClientConfig()

  // Custom sidebar top component with client logo
  const SidebarTop = () => {
    if (clientConfig) {
      return (
        <div className="flex items-center gap-2 px-4 py-2">
          {clientConfig.logo && (
            <div className="relative h-8 w-8 overflow-hidden rounded">
              <Image
                src={clientConfig.logo || "/placeholder.svg"}
                alt={`${clientConfig.name} logo`}
                fill
                className="object-contain"
              />
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-medium">{clientConfig?.name || "Client Dashboard"}</span>
            <span className="text-xs text-muted-foreground">Client Dashboard</span>
          </div>
        </div>
      )
    }

    // Fallback to teamId
    return (
      <div className="flex items-center gap-2 px-4 py-2">
        <div className="flex flex-col">
          <span className="font-medium">{params.teamId}</span>
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
          title: clientConfig?.name || params.teamId,
          href: `/dashboard/${params.teamId}`,
        },
      ]}
    >
      {props.children}
    </SidebarLayout>
  )
}

