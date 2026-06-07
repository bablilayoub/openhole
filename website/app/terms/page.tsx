import Link from "next/link";

export const metadata = {
  title: "Terms — OpenHole",
};

export default function TermsPage() {
  return (
    <main>
      <section style={{ paddingTop: "4rem" }}>
        <div className="container">
          <Link href="/" style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
            ← Back
          </Link>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 600,
              marginTop: "2rem",
              marginBottom: "1.5rem",
            }}
          >
            Acceptable Use
          </h1>
          <div style={{ color: "var(--text-muted)", fontSize: "0.9375rem", maxWidth: "36rem" }}>
            <p style={{ marginBottom: "1rem" }}>
              OpenHole is a developer tool for exposing local applications during
              development and demos.
            </p>
            <p style={{ marginBottom: "1rem" }}>
              You may not use OpenHole to host phishing pages, malware, spam,
              illegal content, or to impersonate brands, banks, or login pages. We
              block reserved subdomains and rate-limit usage. Tunnels may be
              terminated without notice for abuse.
            </p>
            <p>
              Report abuse:{" "}
              <a href="mailto:abuse@openhole.dev">abuse@openhole.dev</a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
