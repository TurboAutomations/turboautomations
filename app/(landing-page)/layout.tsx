import { Footer } from "@/components/footer"
import { LandingPageHeader } from "@/components/landing-page-header"
import type { ReactNode } from "react"

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingPageHeader
        items={[
          { title: "Home", href: "/" },
          { title: "Features", href: "/#features" },
          { title: "Pricing", href: "/#pricing" },
        ]}
      />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

