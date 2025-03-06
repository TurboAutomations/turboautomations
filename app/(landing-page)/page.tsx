import { FeatureGrid } from "@/components/features"
import { Hero } from "@/components/hero"
import { PricingGrid } from "@/components/pricing"
import { stackServerApp } from "@/stack"
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
        primaryCtaText="Get Started"
        primaryCtaLink={stackServerApp.urls.signUp}
        secondaryCtaText="See How It Works"
        secondaryCtaLink="#how-it-works"
      />

      <div id="how-it-works" />
      <FeatureGrid
        title="How Turbo Automations Works"
        subtitle="Our platform makes it easy to automate your business processes and workflows."
        items={[
          {
            icon: (
              <div className="bg-blue-100 p-4 rounded-full">
                <ClipboardList className="h-8 w-8 text-blue-600" />
              </div>
            ),
            title: "1. Define Your Process",
            description: "Tell us about the business process you want to automate.",
          },
          {
            icon: (
              <div className="bg-blue-100 p-4 rounded-full">
                <Cog className="h-8 w-8 text-blue-600" />
              </div>
            ),
            title: "2. We Build the Automation",
            description: "Our team creates a custom automation solution tailored to your needs.",
          },
          {
            icon: (
              <div className="bg-blue-100 p-4 rounded-full">
                <LineChart className="h-8 w-8 text-blue-600" />
              </div>
            ),
            title: "3. Monitor & Optimize",
            description: "Track performance and make adjustments to improve efficiency.",
          },
        ]}
      />

      <PricingGrid
        title="Pricing"
        subtitle="Flexible plans for every team."
        items={[
          {
            title: "Basic",
            price: "Free",
            description: "For individuals and small projects.",
            features: ["Full access to platform", "Community support", "Free forever", "No credit card required"],
            buttonText: "Get Started",
            buttonHref: stackServerApp.urls.signUp,
          },
          {
            title: "Pro",
            price: "$0.00",
            description: "Ideal for growing teams and businesses.",
            features: [
              "All Basic features",
              "Priority support",
              "Advanced automations",
              "Team collaboration",
              "API access",
            ],
            buttonText: "Upgrade to Pro",
            isPopular: true,
            buttonHref: stackServerApp.urls.signUp,
          },
          {
            title: "Enterprise",
            price: "Custom",
            description: "For large organizations.",
            features: [
              "All Pro features",
              "Dedicated support",
              "Custom integrations",
              "Advanced security",
              "SLA guarantees",
            ],
            buttonText: "Contact Us",
            buttonHref: stackServerApp.urls.signUp,
          },
        ]}
      />
    </>
  )
}

