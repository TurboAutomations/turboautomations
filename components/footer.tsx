import { cn } from "@/lib/utils"
import Link from "next/link"
import { Github, Linkedin, Twitter } from "lucide-react"

export function Footer({
  className,
  githubLink,
  twitterLink,
  linkedinLink,
}: {
  className?: string
  githubLink?: string
  twitterLink?: string
  linkedinLink?: string
}) {
  const hasSocialLinks = githubLink || twitterLink || linkedinLink

  return (
    <footer className={cn("border-t py-6 md:py-0", className)}>
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 Turbo Automations™ (Turbo Automations LLC). All Rights Reserved.
          </p>
        </div>

        {hasSocialLinks && (
          <div className="flex gap-4">
            {githubLink && (
              <Link
                href={githubLink}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            )}
            {twitterLink && (
              <Link
                href={twitterLink}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            )}
            {linkedinLink && (
              <Link
                href={linkedinLink}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </footer>
  )
}

