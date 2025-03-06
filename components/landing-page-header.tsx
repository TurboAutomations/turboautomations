"use client"

import { cn } from "@/lib/utils"
import { useStackApp, useUser } from "@stackframe/stack"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import * as React from "react"
import { ColorModeSwitcher } from "./color-mode-switcher"
import { buttonVariants } from "./ui/button"

interface NavItem {
  title: string
  href: string
  disabled?: boolean
  external?: boolean
}

export function LandingPageHeader(props: {
  items?: NavItem[]
}) {
  const app = useStackApp()
  const user = useUser()
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false)

  // Use provided items or fallback to default navigation
  const navigationItems = props.items || [
    { title: "Blog", href: "/blog" },
    { title: "Customers", href: "/customers" },
    { title: "Pricing", href: "/#pricing" },
    { title: "Resources", href: "#" },
    { title: "Talk to us", href: "/contact" },
  ]

  return (
    <header className="fixed w-full z-50 bg-background/80 backdrop-blur border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-bold text-xl">
            Turbo
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navigationItems.map((item, index) => (
              <div key={index} className="relative group">
                <Link
                  href={item.disabled ? "#" : item.href}
                  className={cn(
                    "text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1",
                    item.disabled && "cursor-not-allowed opacity-60",
                  )}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer" : undefined}
                >
                  {item.title}
                  {item.title === "Resources" && <ChevronDown className="h-4 w-4" />}
                </Link>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ColorModeSwitcher />
          <Link href={app.urls.signIn} className={cn(buttonVariants({ variant: "ghost" }), "text-sm font-medium")}>
            Log in
          </Link>
          <Link
            href={app.urls.signUp}
            className={cn(buttonVariants({ variant: "default" }), "bg-blue-600 hover:bg-blue-700")}
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  )
}

