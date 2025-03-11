import { FeatureGrid } from "@/components/features"
import { Hero } from "@/components/hero"
import { PricingGrid } from "@/components/pricing"
import { ClipboardList, Cog, LineChart } from "lucide-react"

export default async function IndexPage() {
  return (
    <>
      <Hero
        title={
          <div className="flex flex-col items-center">
            <span>The Business</span>
            <span className="text-blue-600">Automation</span>
            <span>Platform</span>
          </div>
        }
        subtitle={
          <>
            <span className="text-blue-600">Streamline</span> your business processes with custom automations.
            <br />
            <span className="text-blue-600">Eliminate</span> repetitive tasks and manual workflows.
            <br />
            Make your organization <span className="text-blue-600">more efficient</span>.
          </>
        }
        primaryCtaText="Start Chat"
        primaryCtaLink="https://wa.link/hg2u97"
        secondaryCtaText="See How It Works"
        secondaryCtaLink="#how-it-works"
      />

      <div id="how-it-works" />
      <FeatureGrid
        title="How Turbo Automations Works"
        subtitle="We build custom automation solutions that save you time, reduce errors, and cut operational costs"
        items={[
          {
            icon: <ClipboardList className="h-5 w-5" />,
            title: "1. Define Your Process",
            description: "Tell us about the business process you want to automate.",
          },
          {
            icon: <Cog className="h-5 w-5" />,
            title: "2. We Build the Automation",
            description: "Our team creates a custom automation solution tailored to your needs.",
          },
          {
            icon: <LineChart className="h-5 w-5" />,
            title: "3. Monitor & Optimize",
            description: "Track performance and make adjustments to improve efficiency.",
          },
        ]}
      />

      <PricingGrid
        title="Pricing"
        subtitle="Affordable automation solutions for businesses of all sizes."
        items={[
          {
            title: "Starter",
            price: "$49",
            period: "per automation / month",
            description: "For small businesses with simple automation needs.",
            features: [
              "Up to 3 simple automations",
              "Basic data integrations",
              "Email notifications",
              "Standard support",
              "Weekly execution schedule",
            ],
            buttonText: "Start Chat",
            buttonHref: "https://wa.link/hg2u97",
          },
          {
            title: "Professional",
            price: "$99",
            period: "per automation / month",
            description: "For growing businesses with moderate complexity.",
            features: [
              "Up to 10 automations",
              "Advanced data integrations",
              "Email & SMS notifications",
              "Priority support",
              "Daily execution schedule",
              "Custom reporting",
            ],
            buttonText: "Start Chat",
            isPopular: true,
            buttonHref: "https://wa.link/hg2u97",
          },
          {
            title: "Enterprise",
            price: "Custom",
            period: "tailored pricing",
            description: "For organizations with complex automation needs.",
            features: [
              "Unlimited automations",
              "Enterprise integrations",
              "Advanced notifications",
              "Dedicated support",
              "Custom execution schedule",
              "Advanced security features",
              "SLA guarantees",
            ],
            buttonText: "Contact Us",
            buttonHref: "https://wa.link/hg2u97",
          },
        ]}
        footerText="All prices are in USD. Discounts available for annual billing. Complex automations may require custom pricing."
      />
    </>
  )
}

