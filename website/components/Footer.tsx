import Link from "next/link";
import { githubReleases, scriptPath } from "@/lib/site";
import { Logo } from "./Logo";

const productLinks = [
  { href: "#features", label: "Features" },
  { href: "#install", label: "Install" },
  {
    href: "https://github.com/bablilayoub/openhole#self-hosting",
    label: "Self-host",
    external: true,
  },
  { href: githubReleases, label: "Releases", external: true },
];

const resourceLinks = [
  {
    href: "https://github.com/bablilayoub/openhole",
    label: "GitHub",
    external: true,
  },
  { href: scriptPath("install"), label: "install.sh" },
  { href: scriptPath("uninstall"), label: "uninstall.sh" },
];

const legalLinks = [
  { href: "/terms", label: "Terms & Abuse" },
  { href: "mailto:security@openhole.dev", label: "security@openhole.dev" },
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
    "w-fit text-sm text-neutral-400 transition-all hover:text-emerald-400 hover:translate-x-0.5";

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
    <footer className="relative border-t border-neutral-900/50 bg-black/50 backdrop-blur-3xl mt-24">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"
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
            
            <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-emerald-500/10 bg-emerald-500/5 px-4 py-2 font-mono text-xs text-emerald-400/80 backdrop-blur-md transition-colors hover:bg-emerald-500/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              tunnel.openhole.dev
            </div>
          </div>

          <div className="lg:col-span-2 lg:col-start-7">
            <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-600">
              Product
            </p>
            <nav className="flex flex-col gap-3.5">
              {productLinks.map((link) => (
                <FooterLink key={link.label} {...link} />
              ))}
            </nav>
          </div>

          <div className="lg:col-span-2">
            <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-600">
              Resources
            </p>
            <nav className="flex flex-col gap-3.5">
              {resourceLinks.map((link) => (
                <FooterLink key={link.label} {...link} />
              ))}
            </nav>
          </div>

          <div className="lg:col-span-3">
            <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-600">
              Legal & Support
            </p>
            <nav className="flex flex-col gap-3.5">
              {legalLinks.map((link) => (
                <FooterLink key={link.label} {...link} />
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-6 border-t border-neutral-900/50 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-neutral-500">
            Built by{" "}
            <a
              href="https://abablil.me"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-neutral-300 underline decoration-neutral-700 underline-offset-4 transition-colors hover:text-emerald-400 hover:decoration-emerald-500/50"
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
