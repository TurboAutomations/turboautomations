import type React from "react"
import { Logo } from "@/components/logo"
import Link from "next/link"
import { ColorModeSwitcher } from "@/components/color-mode-switcher"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur z-50">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <ColorModeSwitcher />
        </div>
      </header>
      <main className="flex-1 pt-14">{children}</main>
    </div>
  )
}

