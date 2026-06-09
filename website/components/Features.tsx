"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Section, SectionHeader } from "./Section";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const features = [
  {
    title: "No accounts required",
    description: "We don't want your email. Download the binary and start tunneling immediately. No signup flow, no API keys.",
  },
  {
    title: "HTTPS by default",
    description: "Every tunnel gets a secure, trusted TLS certificate automatically via Caddy and Cloudflare DNS-01.",
  },
  {
    title: "Custom subdomains",
    description: "Pass --subdomain for a stable URL. A reclaim token keeps the name across reconnects, even from a new network.",
  },
  {
    title: "Live request logging",
    description: "See exactly what's hitting your local server. Method, path, status code, and latency printed right in your terminal.",
  },
  {
    title: "Single Go binary",
    description: "Written in Go for blazing fast startup times and minimal memory footprint. No runtime dependencies.",
  },
  {
    title: "100% Self-hostable",
    description: "The entire stack is open source. Deploy your own edge server with our provided Docker Compose setup.",
  },
];

export function Features() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!root.current) return;
      const cards = root.current.querySelectorAll(".bento-card");
      for (const card of cards) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        (card as HTMLElement).style.setProperty("--mouse-x", `${x}px`);
        (card as HTMLElement).style.setProperty("--mouse-y", `${y}px`);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useGSAP(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    gsap.from(root.current?.querySelectorAll(".feature-card") ?? [], {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
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
              <span className="text-neutral-500">Nothing you don&apos;t.</span>
            </>
          }
          description="HTTPS hits ophl.link, relays over WebSocket to your CLI, then localhost. Anyone with the URL can access your tunnel — use it carefully."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`feature-card bento-card p-6 sm:p-8 ${
                i === 0 || i === 3 ? "lg:col-span-2" : "lg:col-span-1"
              }`}
            >
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
