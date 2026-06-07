import { Hero } from "@/components/Hero";
import { TerminalDemo } from "@/components/TerminalDemo";
import { Features } from "@/components/Features";
import { Install } from "@/components/Install";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <TerminalDemo />

      <section id="usage">
        <div className="container">
          <h2>Usage</h2>
          <div className="code-block" style={{ marginBottom: "0.75rem" }}>
            openhole 3000
          </div>
          <div className="code-block" style={{ marginBottom: "0.75rem" }}>
            openhole 3000 --subdomain myapp
          </div>
          <div className="code-block">openhole 3000 --host 127.0.0.1</div>
        </div>
      </section>

      <Features />
      <Install />

      <section id="self-host">
        <div className="container">
          <h2>Self-hosting</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem" }}>
            OpenHole is open source. Run your own server with Docker Compose,
            Caddy, and Cloudflare DNS. See the{" "}
            <a
              href="https://github.com/bablilayoub/openhole"
              target="_blank"
              rel="noopener noreferrer"
            >
              README
            </a>{" "}
            for deployment steps.
          </p>
        </div>
      </section>

      <section id="terms-preview">
        <div className="container">
          <h2>Acceptable use</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem" }}>
            OpenHole is for development and demos. No phishing, malware, or brand
            impersonation. Report abuse:{" "}
            <a href="mailto:abuse@openhole.dev">abuse@openhole.dev</a>.{" "}
            <a href="/terms">Full terms</a>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
