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
      <main className="min-h-screen">
        <Hero />
        <WhyOpenHole />
        <HowItWorks />
        <Features />
        <Install />

        <section id="self-host" className="py-24 border-t border-zinc-800/50 bg-zinc-900/10">
          <div className="container mx-auto px-6 max-w-3xl text-center">
            <h2 className="text-3xl font-bold mb-4">Run your own server</h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              OpenHole is open source. Deploy with Docker Compose, Caddy, and Cloudflare DNS on any VPS. 
              Full instructions are available in the{" "}
              <a
                href="https://github.com/bablilayoub/openhole#self-hosting"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                README
              </a>.
            </p>
          </div>
        </section>

        <section id="terms-preview" className="py-12 border-t border-zinc-800/50">
          <div className="container mx-auto px-6 max-w-3xl text-center">
            <p className="text-zinc-500 text-sm">
              Acceptable use: dev and demos only. No phishing or brand impersonation.{" "}
              <a href="mailto:abuse@openhole.dev" className="text-zinc-400 hover:text-accent transition-colors">
                abuse@openhole.dev
              </a>
              {" · "}
              <a href="/terms" className="text-zinc-400 hover:text-accent transition-colors">
                Terms
              </a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
