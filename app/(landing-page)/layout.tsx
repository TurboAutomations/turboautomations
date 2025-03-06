import { Footer } from "@/components/footer";
import { LandingPageHeader } from "@/components/landing-page-header";

export default function Layout(props: { children: React.ReactNode }) {
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
      <main className="flex-1">{props.children}</main>
      <Footer
        builtBy="Turbo Automations"
        builtByLink="https://turboautomations.com/"
           githubLink="https://github.com/turbo-automations"
           twitterLink="https://twitter.com/turbo_automations"
           linkedinLink="linkedin.com/company/turbo-automations"
      />
    </div>
  );
}
