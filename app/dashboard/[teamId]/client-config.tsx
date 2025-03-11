"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function ClientConfig({ teamId, teamName }: { teamId: string; teamName: string }) {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Dashboard",
      href: `/dashboard/${teamId}`,
    },
    {
      name: "Automations",
      href: `/dashboard/${teamId}/automations`,
    },
    {
      name: "Settings",
      href: `/dashboard/${teamId}/settings`,
    },
  ]

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold">{teamName}</h1>
            </div>
            <nav className="ml-10 flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-md",
                    pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
              Logout
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

