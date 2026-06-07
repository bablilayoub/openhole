"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const reasons = [
  {
    title: "Zero friction",
    text: "No accounts, API keys, or YAML files. Install the binary and run it.",
  },
  {
    title: "HTTPS by default",
    text: "Every tunnel gets a secure public URL on ophl.link automatically.",
  },
  {
    title: "Built for devs",
    text: "Clean terminal output, custom subdomains, and a single static Go binary.",
  },
];

export function WhyOpenHole() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".why-card",
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        },
      }
    );
  }, { scope: container });

  return (
    <section ref={container} id="why" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="mb-16 md:text-center">
          <p className="text-accent font-semibold tracking-wide uppercase text-sm mb-3">Why OpenHole</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ngrok-like tunnels, without the baggage</h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Share localhost with teammates, test webhooks, or demo a WIP app — in seconds, not minutes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reasons.map((r) => (
            <article key={r.title} className="why-card p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 hover:bg-zinc-900/80 transition-colors">
              <h3 className="text-xl font-semibold text-zinc-100 mb-3">{r.title}</h3>
              <p className="text-zinc-400 leading-relaxed">{r.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
