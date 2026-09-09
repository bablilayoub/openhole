import Link from "next/link";
import { Check, ShieldAlert, X } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { Button } from "@/components/ui/Button";
import type { LucideIcon } from "lucide-react";

export const metadata = {
  title: "Terms",
  description: "Acceptable use policy for OpenHole tunnels. Report abuse at abuse@openhole.dev.",
};

const allowed = [
  "Local development and debugging",
  "Testing webhooks and API integrations",
  "Demos and stakeholder previews",
  "Sharing work-in-progress with collaborators",
];

const prohibited = [
  "Phishing pages or credential harvesting",
  "Malware, cryptominers, or command-and-control infrastructure",
  "Spam campaigns or bulk unsolicited messaging",
  "Illegal content or services",
  "Impersonation of brands, banks, or login pages",
  "Attacks against third parties through tunneled traffic",
];

const enforcement = [
  "Reserved subdomains are blocked at registration",
  "Per-IP rate limits on registration and requests",
  "Tunnels violating these terms may be terminated without notice",
  "Repeat abuse may result in IP blocks",
];

function PolicyList({
  title,
  items,
  icon: Icon,
  tone,
}: {
  title: string;
  items: string[];
  icon: LucideIcon;
  tone: "live" | "warn" | "muted";
}) {
  const iconTone = { live: "text-live", warn: "text-warn", muted: "text-muted" }[tone];
  return (
    <div className="card p-6">
      <h2 className="text-sm font-medium">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted">
            <Icon className={`mt-1 size-3.5 shrink-0 ${iconTone}`} aria-hidden />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="min-h-[80vh] pt-32 pb-24 sm:pt-40">
        <div className="page-container">
          <div className="mx-auto max-w-3xl">
            <p className="eyebrow">Legal · Last updated June 2026</p>
            <h1 className="mt-4 text-[2.25rem] leading-[1.1] font-medium tracking-[-0.03em] sm:text-[2.75rem]">
              Acceptable use
            </h1>
            <p className="mt-5 max-w-2xl text-md leading-relaxed text-muted">
              OpenHole is a developer tool for exposing local applications during
              development, testing and demos. By using the public tunnel service you agree
              to these terms.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
              A tunnel creates a public HTTPS URL that forwards to your machine. Anyone
              with the link can reach what you expose. Use it the way you would use a
              staging server.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <PolicyList title="Permitted" items={allowed} icon={Check} tone="live" />
              <PolicyList title="Prohibited" items={prohibited} icon={X} tone="warn" />
            </div>
            <div className="mt-4">
              <PolicyList title="Enforcement" items={enforcement} icon={ShieldAlert} tone="muted" />
            </div>

            <div className="card mt-4 p-6">
              <h2 className="text-sm font-medium">Report abuse</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                Seen phishing, malware or other abuse on an OpenHole tunnel? Send the tunnel
                URL and anything else relevant.
              </p>
              <Button href="mailto:abuse@openhole.dev" size="sm" className="mt-4">
                abuse@openhole.dev
              </Button>
            </div>

            <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
              <p>
                See also the{" "}
                <Link href="/docs/security" className="link">
                  security documentation
                </Link>
                .
              </p>
              <p className="font-mono text-xs">MIT License · OpenHole</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
