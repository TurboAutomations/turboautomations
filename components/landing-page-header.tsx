"use client"

import { cn } from "@/lib/utils"
import { ChevronDown, Menu } from "lucide-react"
import Link from "next/link"
import * as React from "react"
import { ColorModeSwitcher } from "./color-mode-switcher"
import { Button, buttonVariants } from "./ui/button"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"

interface NavItem {
  title: string
  href: string
  disabled?: boolean
  external?: boolean
}

export function LandingPageHeader(props: {
  items?: NavItem[]
}) {
  const [isOpen, setIsOpen] = React.useState(false)

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
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-10">
          <Link href="/" className="font-bold text-xl">
            Turbo Automations
          </Link>

          {/* Desktop Navigation - Left Side */}
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

        {/* Right Side - Theme Switcher and Login */}
        <div className="ml-auto flex items-center gap-4">
          <ColorModeSwitcher />
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "default" }), "bg-blue-600 hover:bg-blue-700 text-white")}
          >
            Log in
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                {navigationItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.disabled ? "#" : item.href}
                    className={cn(
                      "text-lg font-medium text-muted-foreground hover:text-foreground",
                      item.disabled && "cursor-not-allowed opacity-60",
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.title}
                  </Link>
                ))}
                <div className="h-px bg-border my-4" />
                <div className="flex items-center gap-4">
                  <ColorModeSwitcher />
                  <span className="text-sm text-muted-foreground">Toggle theme</span>
                </div>
                <div className="h-px bg-border my-4" />
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    className={cn(
                      buttonVariants({ variant: "default" }),
                      "bg-blue-600 hover:bg-blue-700 text-white justify-start",
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    Log in
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

