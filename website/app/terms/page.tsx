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
            className="mb-12 inline-block text-sm text-neutral-500 hover:text-white transition-colors"
          >
            ← Back to home
          </Link>

          <h1 className="mb-8 text-4xl font-bold tracking-tight text-white">
            Acceptable Use Policy
          </h1>

          <div className="space-y-6 text-lg text-neutral-400 leading-relaxed">
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
            <div className="mt-12 p-6 rounded-2xl border border-neutral-800 bg-neutral-900/30">
              <p className="text-base text-neutral-300 m-0">
                To report abuse, phishing, or malware, please contact:{" "}
                <a href="mailto:abuse@openhole.dev" className="text-white font-medium hover:underline">
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
