import { type ReactNode } from "react";
import Link from "next/link";
import { githubRepo } from "@/lib/site";
import { HashLink } from "./HashLink";
import { Logo } from "./Logo";

const siteLinks = [
  { section: "features" as const, label: "Features" },
  { section: "compare" as const, label: "Compare" },
  { section: "install" as const, label: "Install" },
];

const resourceLinks = [
  { href: githubRepo, label: "GitHub", external: true },
  { href: "/terms", label: "Terms" },
  {
    href: "https://github.com/bablilayoub/openhole#self-hosting",
    label: "Self-host",
    external: true,
  },
];

const linkClass =
  "text-sm text-neutral-400 transition-colors hover:text-white";

function FooterLink({
  href,
  label,
  external,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  if (external || href.startsWith("http")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={linkClass}>
      {label}
    </Link>
  );
}

function LinkGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-600">
        {title}
      </p>
      <nav className="flex flex-col gap-2.5">{children}</nav>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="page-container py-14 sm:py-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="max-w-sm">
            <Logo iconClassName="h-9 w-9 sm:h-10 sm:w-10" />
            <p className="mt-4 text-sm leading-relaxed text-neutral-500">
              Expose localhost over HTTPS in one command. No accounts, no
              dashboard.
            </p>
          </div>

          <div className="flex gap-12 sm:gap-16">
            <LinkGroup title="Site">
              {siteLinks.map((link) => (
                <HashLink key={link.label} section={link.section} className={linkClass}>
                  {link.label}
                </HashLink>
              ))}
            </LinkGroup>

            <LinkGroup title="Resources">
              {resourceLinks.map((link) => (
                <FooterLink key={link.label} {...link} />
              ))}
            </LinkGroup>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/[0.06] pt-8 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Built by{" "}
            <a
              href="https://abablil.me"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-300 transition-colors hover:text-white"
            >
              Ayoub Bablil
            </a>
          </p>
          <p className="font-mono text-xs text-neutral-600">
            MIT · © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
