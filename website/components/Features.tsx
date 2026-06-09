"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Section, SectionHeader } from "./Section";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const features = [
  {
    badge: "FREE",
    title: "No accounts required",
    description: "We don't want your email. Download the binary and start tunneling immediately. No signup flow, no API keys.",
  },
  {
    badge: "TLS",
    title: "HTTPS by default",
    description: "Every tunnel gets a secure, trusted TLS certificate automatically via Caddy and Cloudflare DNS-01.",
  },
  {
    badge: "URL",
    title: "Custom subdomains",
    description: "Pass --subdomain for a stable URL. A reclaim token keeps the name across reconnects, even from a new network.",
  },
  {
    badge: "LOG",
    title: "Live request logging",
    description: "See exactly what's hitting your local server. Method, path, status code, and latency printed right in your terminal.",
  },
  {
    badge: "GO",
    title: "Single Go binary",
    description: "Written in Go for blazing fast startup times and minimal memory footprint. No runtime dependencies.",
  },
  {
    badge: "OSS",
    title: "100% Self-hostable",
    description: "The entire stack is open source. Deploy your own edge server with our provided Docker Compose setup.",
  },
];

export function Features() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    gsap.from(root.current?.querySelectorAll(".feature-card") ?? [], {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: root.current,
        start: "top 80%",
      },
    });
  }, { scope: root });

  return (
    <Section id="features" border>
      <div ref={root}>
        <SectionHeader
          title={
            <>
              Everything you need.
              <br />
              Nothing you don&apos;t.
            </>
          }
          description="HTTPS hits ophl.link, relays over WebSocket to your CLI, then localhost. Anyone with the URL can access your tunnel — use it carefully."
        />

        <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="feature-card card-base p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-700 hover:shadow-lg hover:shadow-black/30 sm:p-8"
            >
              <span className="mb-4 inline-block rounded-md border border-neutral-800 bg-neutral-900 px-2 py-0.5 font-mono text-[10px] tracking-wider text-emerald-500/90">
                {feature.badge}
              </span>
              <h3 className="mb-3 text-lg font-semibold text-white">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-neutral-400 sm:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
