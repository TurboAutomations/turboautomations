"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

export function FeatureGridItem(props: {
  icon: React.ReactNode
  title: string
  description: string
  index?: number
  total?: number
}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-background p-2 transition-all duration-300 hover:shadow-md hover:scale-[1.03]",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5",
      )}
      style={{
        transitionDelay: props.index ? `${props.index * 100}ms` : "0ms",
        transitionProperty: "transform, opacity, box-shadow",
        transitionDuration: "300ms",
      }}
    >
      <div className="flex h-[180px] flex-col rounded-md p-6 gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 transition-colors duration-300 group-hover:bg-blue-600">
          <div className="flex items-center justify-center text-blue-600 transition-colors duration-300 group-hover:text-white">
            {props.icon}
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="font-bold">{props.title}</h3>
          <p className="text-sm text-muted-foreground">{props.description}</p>
        </div>
      </div>

      {/* Connecting line for desktop */}
      {props.index !== undefined && props.total !== undefined && props.index < props.total - 1 && (
        <div
          className="absolute right-0 top-1/2 hidden h-[2px] w-8 -translate-y-1/2 bg-border md:block"
          style={{ left: "calc(100% - 1rem)" }}
        />
      )}
    </div>
  )
}

export function FeatureGrid(props: {
  title: string
  subtitle: string
  items: {
    icon: React.ReactNode
    title: string
    description: string
  }[]
}) {
  return (
    <section id="features" className="container space-y-6 py-8 md:py-12 lg:py-24">
      <div className="mx-auto flex max-w-6xl flex-col items-center space-y-4 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold">{props.title}</h2>
        <p className="max-w-[85%] text-muted-foreground sm:text-lg">{props.subtitle}</p>
      </div>

      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-5xl md:grid-cols-3">
        {props.items.map((item, index) => (
          <FeatureGridItem key={index} {...item} index={index} total={props.items.length} />
        ))}
      </div>
    </section>
  )
}

