"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Section, SectionHeader } from "./Section";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const features: {
  badge: string;
  title: string;
  description: string;
  highlight?: boolean;
}[] = [
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
    badge: "NEW",
    title: "WebSocket passthrough",
    description: "Next.js HMR, Vite live reload, Socket.io, and other WebSocket upgrades relay through the tunnel. Shipped in v0.2.0.",
    highlight: true,
  },
  {
    badge: "LOG",
    title: "Live request logging",
    description: "See exactly what's hitting your local server. Method, path, status code, and latency printed right in your terminal.",
  },
  {
    badge: "CLI",
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

    const cards = root.current?.querySelectorAll(".feature-card");
    if (!cards || cards.length === 0) return;

    gsap.fromTo(
      cards,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        clearProps: "transform",
        scrollTrigger: {
          trigger: root.current,
          start: "top 85%",
          once: true,
        },
      }
    );
  }, { scope: root });

  return (
    <Section id="features" border>
      <div ref={root}>
        <SectionHeader
          eyebrow="Features"
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
              className={`feature-card card-base p-6 transition-all duration-200 hover:-translate-y-0.5 sm:p-8 ${
                feature.highlight ? "feature-card-highlight" : ""
              }`}
            >
              <span
                className={
                  feature.highlight
                    ? "badge-new mb-4"
                    : "badge-mono mb-4"
                }
              >
                {feature.badge}
              </span>
              <h3 className="mb-3 text-lg font-semibold text-white">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-neutral-400 sm:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-10 max-w-3xl text-sm leading-relaxed text-neutral-500">
          <span className="font-medium text-neutral-400">Limitations:</span> 10 MB body limit per HTTP
          request, and random subdomains change on reconnect unless you use{" "}
          <code className="font-mono text-neutral-300">--subdomain</code>.
        </p>
      </div>
    </Section>
  );
}
