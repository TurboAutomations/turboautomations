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
          { title: "Github", href: "https://github.com/stack-auth/stack-template", external: true },
        ]}
      />
      <main className="flex-1">{children}</main>
      <Footer
        builtBy="Turbo Automations"
        builtByLink="https://turboautomations.com/"
        githubLink="https://github.com/turbo-automations"
        twitterLink="https://twitter.com/turbo_automations"
        linkedinLink="https://linkedin.com/company/turbo-automations"
      />
    </div>
  )
}

