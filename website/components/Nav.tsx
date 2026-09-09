"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HashLink } from "@/components/HashLink";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { buttonClasses } from "@/components/ui/Button";
import { githubRepo } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Nav() {
  const pathname = usePathname();
  const onDocs = pathname.startsWith("/docs");

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-void/70 backdrop-blur-xl">
      <div className="page-container grid h-16 grid-cols-[1fr_auto_1fr] items-center">
        <Logo iconClassName="h-6 w-6" />

        <nav className="hidden items-center gap-1 md:flex">
          <HashLink section="features" className={buttonClasses("ghost", "sm")}>
            Features
          </HashLink>
          <HashLink section="install" className={buttonClasses("ghost", "sm")}>
            Install
          </HashLink>
          <Link
            href="/docs"
            aria-current={onDocs ? "page" : undefined}
            className={buttonClasses("ghost", "sm", cn(onDocs && "text-ink"))}
          >
            Docs
          </Link>
          <a
            href={githubRepo}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses("ghost", "sm")}
          >
            GitHub
          </a>
        </nav>

        <div className="flex items-center justify-end gap-2">
          <ThemeToggle />
          <HashLink section="install" className={buttonClasses("primary", "sm")}>
            Install
          </HashLink>
        </div>
      </div>
    </header>
  );
}
