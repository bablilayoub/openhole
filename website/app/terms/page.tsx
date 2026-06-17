import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Terms — OpenHole",
  description: "Acceptable use policy for OpenHole tunnels. Report abuse at abuse@openhole.dev.",
};

const prohibited = [
  "Phishing pages or credential harvesting",
  "Malware, cryptominers, or command-and-control infrastructure",
  "Spam campaigns or bulk unsolicited messaging",
  "Illegal content or services",
  "Impersonation of brands, banks, or login pages",
  "Attacks against third parties through tunneled traffic",
];

const allowed = [
  "Local development and debugging",
  "Testing webhooks and API integrations",
  "Demos and stakeholder previews",
  "Sharing work-in-progress with collaborators",
];

const enforcement = [
  "Reserved subdomains are blocked at registration",
  "Per-IP rate limits on registration and requests",
  "Tunnels violating these terms may be terminated without notice",
  "Repeat abuse may result in IP blocks",
];

function PolicyCard({
  title,
  items,
  variant = "default",
}: {
  title: string;
  items: string[];
  variant?: "default" | "danger";
}) {
  return (
    <div
      className={`rounded-2xl border p-6 sm:p-7 ${
        variant === "danger"
          ? "border-red-500/20 bg-red-500/[0.03]"
          : "border-white/[0.08] bg-surface"
      }`}
    >
      <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500">
        {title}
      </h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-relaxed text-neutral-400 sm:text-base">
            <span
              className={`mt-2 h-1 w-1 shrink-0 rounded-full ${
                variant === "danger" ? "bg-red-400/80" : "bg-neutral-600"
              }`}
              aria-hidden
            />
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
      <main className="min-h-[80vh] pb-24 pt-28 sm:pt-36">
        <div className="page-container">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/"
              className="text-sm text-neutral-500 transition-colors hover:text-white"
            >
              ← Back to home
            </Link>
            <p className="font-mono text-xs text-neutral-600">Last updated June 2026</p>
          </div>

          <div className="mx-auto max-w-3xl">
            <header className="mb-12 border-b border-white/[0.06] pb-10">
              <p className="text-accent mb-3 font-mono text-[11px] uppercase tracking-[0.2em] opacity-80">
                Legal
              </p>
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Acceptable Use Policy
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-neutral-400">
                OpenHole is a developer tool for exposing local applications during development,
                testing, and demonstrations. By using the public tunnel service, you agree to
                these terms.
              </p>
            </header>

            <div className="mb-8 space-y-4 text-base leading-relaxed text-neutral-400">
              <p>
                Tunnels create a public HTTPS URL that forwards to your machine. Anyone with the
                link can access what you expose. Use OpenHole responsibly and only for purposes
                you would accept on a staging server.
              </p>
            </div>

            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              <PolicyCard title="Permitted use" items={allowed} />
              <PolicyCard title="Prohibited use" items={prohibited} variant="danger" />
            </div>

            <PolicyCard title="Enforcement" items={enforcement} />

            <div className="card-base mt-10 overflow-hidden">
              <div className="border-b border-white/[0.06] bg-white/[0.02] px-6 py-4 sm:px-7">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500">
                  Report abuse
                </p>
              </div>
              <div className="space-y-4 px-6 py-6 sm:px-7">
                <p className="text-base leading-relaxed text-neutral-400">
                  If you encounter phishing, malware, or other abuse on an OpenHole tunnel, please
                  report it. Include the tunnel URL and any relevant details.
                </p>
                <a
                  href="mailto:abuse@openhole.dev"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  abuse@openhole.dev
                </a>
              </div>
            </div>

            <div className="mt-12 flex flex-col gap-4 border-t border-white/[0.06] pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-neutral-500">
                See also{" "}
                <Link href="/docs/security" className="text-neutral-300 transition-colors hover:text-white">
                  Security documentation
                </Link>
              </p>
              <p className="font-mono text-xs text-neutral-600">MIT License · OpenHole</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
