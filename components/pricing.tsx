import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"

interface PricingItem {
  title: string
  price: string
  period?: string
  description: string
  features: string[]
  buttonText: string
  buttonHref: string
  isPopular?: boolean
}

export function PricingGrid(props: {
  title: string
  subtitle: string
  items: PricingItem[]
  footerText?: string
}) {
  return (
    <section className="container py-24" id="pricing">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{props.title}</h2>
        <p className="mt-4 text-lg text-muted-foreground">{props.subtitle}</p>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
        {props.items.map((item, index) => (
          <Card
            key={index}
            className={`flex flex-col ${item.isPopular ? "border-blue-600 shadow-lg dark:border-blue-500" : ""}`}
          >
            <CardHeader>
              <CardTitle className="text-xl">{item.title}</CardTitle>
              <div className="mt-2">
                <span className="text-3xl font-bold">{item.price}</span>
                {item.period && <span className="text-sm text-muted-foreground"> {item.period}</span>}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              {item.isPopular && (
                <div className="absolute right-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white">
                  Popular
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2">
                {item.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Link href={item.buttonHref} className="w-full">
                <Button
                  className={`w-full ${
                    item.isPopular ? "bg-blue-600 hover:bg-blue-700" : "bg-primary hover:bg-primary/90"
                  }`}
                >
                  {item.buttonText}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {props.footerText && (
        <div className="mt-8 text-sm text-muted-foreground text-left max-w-5xl mx-auto">{props.footerText}</div>
      )}
    </section>
  )
}

