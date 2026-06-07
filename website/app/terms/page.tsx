import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Terms — OpenHole",
};

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 px-6 md:px-10 lg:px-16">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/"
            className="inline-block font-mono text-xs uppercase tracking-wider text-muted hover:text-hole mb-12"
          >
            ← back
          </Link>

          <h1 className="text-5xl font-extrabold uppercase tracking-tight mb-8">
            Acceptable use
          </h1>

          <div className="space-y-6 text-muted leading-relaxed text-lg">
            <p>
              OpenHole is a developer tool for exposing local applications during
              development and demos.
            </p>
            <p>
              You may not use OpenHole to host phishing pages, malware, spam,
              illegal content, or to impersonate brands, banks, or login pages.
              We block reserved subdomains and rate-limit usage. Tunnels may be
              terminated without notice for abuse.
            </p>
            <p className="border-2 border-ink p-5 font-mono text-sm text-ink">
              Report abuse:{" "}
              <a href="mailto:abuse@openhole.dev" className="text-hole hover:underline">
                abuse@openhole.dev
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
