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
      <main className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <Link href="/" className="inline-flex items-center text-sm text-zinc-500 hover:text-accent transition-colors mb-12">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to home
          </Link>
          
          <h1 className="text-4xl font-bold mb-8">Acceptable Use</h1>
          
          <div className="prose prose-invert prose-zinc max-w-none text-zinc-400">
            <p className="text-lg mb-6">
              OpenHole is a developer tool for exposing local applications
              during development and demos.
            </p>
            <p className="mb-6">
              You may not use OpenHole to host phishing pages, malware, spam,
              illegal content, or to impersonate brands, banks, or login pages.
              We block reserved subdomains and rate-limit usage. Tunnels may be
              terminated without notice for abuse.
            </p>
            <p className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
              Report abuse:{" "}
              <a href="mailto:abuse@openhole.dev" className="text-accent hover:underline font-medium">
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
