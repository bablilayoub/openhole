import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { WhyOpenHole } from "@/components/WhyOpenHole";
import { HowItWorks } from "@/components/HowItWorks";
import { Features } from "@/components/Features";
import { Install } from "@/components/Install";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <WhyOpenHole />
        <HowItWorks />
        <Features />
        <Install />

        <section className="section" id="self-host">
          <div className="container container-narrow">
            <p className="section-label">Self-hosting</p>
            <h2 className="section-title">Run your own server</h2>
            <p className="section-desc" style={{ marginBottom: 0 }}>
              OpenHole is open source. Deploy with Docker Compose, Caddy, and
              Cloudflare DNS. Full instructions in the{" "}
              <a
                href="https://github.com/bablilayoub/openhole#self-hosting"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--accent)" }}
              >
                README
              </a>
              .
            </p>
          </div>
        </section>

        <div className="divider" />

        <section className="section" id="terms-preview" style={{ paddingTop: 0 }}>
          <div className="container container-narrow">
            <p className="section-desc" style={{ marginBottom: 0, fontSize: "0.9375rem" }}>
              Acceptable use: dev and demos only. No phishing or brand impersonation.{" "}
              <a href="mailto:abuse@openhole.dev" style={{ color: "var(--accent)" }}>
                abuse@openhole.dev
              </a>
              {" · "}
              <a href="/terms" style={{ color: "var(--accent)" }}>
                Terms
              </a>
            </p>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
