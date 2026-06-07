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
      <main>
        <section className="section" style={{ paddingTop: "3rem" }}>
          <div className="container container-narrow">
            <Link href="/" className="back-link">
              ← Back to home
            </Link>
            <h1 className="section-title" style={{ marginTop: "2rem" }}>
              Acceptable Use
            </h1>
            <div className="terms-content">
              <p>
                OpenHole is a developer tool for exposing local applications
                during development and demos.
              </p>
              <p>
                You may not use OpenHole to host phishing pages, malware, spam,
                illegal content, or to impersonate brands, banks, or login pages.
                We block reserved subdomains and rate-limit usage. Tunnels may be
                terminated without notice for abuse.
              </p>
              <p>
                Report abuse:{" "}
                <a href="mailto:abuse@openhole.dev" style={{ color: "var(--accent)" }}>
                  abuse@openhole.dev
                </a>
              </p>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
