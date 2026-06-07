import Link from "next/link";
import { scriptPath } from "@/lib/site";
import { Logo } from "./Logo";

const projectLinks = [
  { href: "#features", label: "Features" },
  { href: "#install", label: "Install" },
  { href: "/terms", label: "Terms & Abuse" },
  {
    href: "https://github.com/bablilayoub/openhole#self-hosting",
    label: "Self-host",
    external: true,
  },
];

const connectLinks = [
  {
    href: "https://github.com/bablilayoub/openhole",
    label: "GitHub",
    external: true,
  },
  { href: scriptPath("install"), label: "install.sh" },
  { href: scriptPath("uninstall"), label: "uninstall.sh" },
  { href: "mailto:abuse@openhole.dev", label: "abuse@openhole.dev" },
];

function FooterLink({
  href,
  label,
  external,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  const className =
    "w-fit text-sm text-neutral-400 transition-colors hover:text-white";

  if (external || href.startsWith("http") || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className={className}
      >
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="relative border-t border-neutral-900">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-neutral-700/80 to-transparent"
        aria-hidden
      />

      <div className="page-container py-16 sm:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Logo iconClassName="h-9 w-9 sm:h-10 sm:w-10" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-neutral-500">
              Expose localhost to the internet in one command. HTTPS by default.
              No accounts, no dashboard.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950 px-3 py-1.5 font-mono text-xs text-neutral-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              tunnel.openhole.dev
            </div>
          </div>

          <div className="lg:col-span-3 lg:col-start-7">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-600">
              Project
            </p>
            <nav className="flex flex-col gap-3">
              {projectLinks.map((link) => (
                <FooterLink key={link.label} {...link} />
              ))}
            </nav>
          </div>

          <div className="lg:col-span-3">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-600">
              Connect
            </p>
            <nav className="flex flex-col gap-3">
              {connectLinks.map((link) => (
                <FooterLink key={link.label} {...link} />
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-neutral-900 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-neutral-500">
            Built by{" "}
            <a
              href="https://abablil.me"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-neutral-300 underline decoration-neutral-700 underline-offset-4 transition-colors hover:text-white hover:decoration-neutral-500"
            >
              Ayoub Bablil
            </a>
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-neutral-600">
            <span>MIT License</span>
            <span className="hidden text-neutral-800 sm:inline" aria-hidden>
              ·
            </span>
            <span>Open source</span>
            <span className="hidden text-neutral-800 sm:inline" aria-hidden>
              ·
            </span>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
