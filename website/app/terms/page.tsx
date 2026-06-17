import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Terms — OpenHole",
  description: "Acceptable use policy for OpenHole tunnels. Report abuse at abuse@openhole.dev.",
};

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="min-h-[80vh] pb-24 pt-28 sm:pt-36">
        <div className="page-container">
          <div className="max-w-3xl">
            <Link
              href="/"
              className="mb-12 inline-block text-sm text-neutral-500 transition-colors hover:text-cyan"
            >
              ← Back to home
            </Link>

            <p className="text-accent mb-3 font-mono text-[11px] uppercase tracking-[0.2em] opacity-80">
              Legal
            </p>
            <h1 className="mb-8 text-4xl font-bold tracking-tight text-white">
              Acceptable Use Policy
            </h1>

            <div className="space-y-6 text-lg leading-relaxed text-neutral-400">
              <p>
                OpenHole is a developer tool designed strictly for exposing local applications
                during development, testing, and demonstrations.
              </p>
              <p>
                You may not use OpenHole to host phishing pages, malware, spam,
                illegal content, or to impersonate brands, banks, or login pages.
                We actively block reserved subdomains and rate-limit usage to prevent abuse.
                Tunnels violating these terms will be terminated immediately without notice.
              </p>
              <div className="card-base mt-12 p-6">
                <p className="m-0 text-base text-neutral-300">
                  To report abuse, phishing, or malware, please contact:{" "}
                  <a
                    href="mailto:abuse@openhole.dev"
                    className="font-medium text-white transition-colors hover:text-cyan"
                  >
                    abuse@openhole.dev
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
