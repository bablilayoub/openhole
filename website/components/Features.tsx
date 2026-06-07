"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const features = [
  { icon: "01", label: "No login required", desc: "Start tunneling instantly without creating an account or managing API keys." },
  { icon: "02", label: "One command setup", desc: "Just pass your local port to the CLI and you're live on the internet." },
  { icon: "03", label: "HTTPS by default", desc: "Every tunnel gets a secure, trusted TLS certificate automatically." },
  { icon: "04", label: "Random public URLs", desc: "Get a fresh, readable subdomain every time you start a new tunnel." },
  { icon: "05", label: "Custom subdomains", desc: "Claim a specific subdomain to keep your webhook URLs stable during dev." },
  { icon: "06", label: "Simple self-hosting", desc: "Deploy your own OpenHole server on any VPS with Docker Compose." },
  { icon: "07", label: "Fast Go binary", desc: "Written in Go for minimal memory footprint and blazing fast performance." },
  { icon: "08", label: "Clean request logs", desc: "See exactly what's hitting your local server right in your terminal." },
];

export function Features() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".feature-card",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        },
      }
    );
  }, { scope: container });

  return (
    <section ref={container} id="features" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="mb-16 md:text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need.</h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            A focused feature set designed to get out of your way and let you build.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div 
              key={f.label} 
              className="feature-card p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 hover:bg-zinc-900/80 hover:border-accent/30 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center font-mono text-sm font-bold mb-4 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-zinc-100 font-semibold mb-2">{f.label}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
