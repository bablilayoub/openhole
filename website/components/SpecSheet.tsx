"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const specs = [
  {
    cmd: "openhole 3000",
    title: "Random subdomain",
    detail: "Starts a tunnel on port 3000. You get a readable HTTPS URL like blue-fox.ophl.link in under a second.",
  },
  {
    cmd: "openhole 8080 --subdomain my-api",
    title: "Sticky subdomain",
    detail: "Claim a name for stable webhook URLs while you iterate locally.",
  },
  {
    cmd: "docker compose up",
    title: "Self-host",
    detail: "Run your own edge with Caddy, Cloudflare DNS-01, and the Go server. Full stack in one repo.",
  },
];

const traits = [
  "No accounts or API keys",
  "HTTPS on every tunnel",
  "Single static Go binary",
  "Live request log in terminal",
  "Rate limits + abuse blocklist",
  "Open source, MIT licensed",
];

export function SpecSheet() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      gsap.from(".spec-row", {
        x: -30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: root.current,
          start: "top 75%",
        },
      });

      gsap.fromTo(
        ".trait-line",
        { width: 0 },
        {
          width: "2rem",
          duration: 0.8,
          stagger: 0.06,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: ".trait-list",
            start: "top 80%",
          },
        }
      );
    },
    { scope: root }
  );

  return (
    <section ref={root} id="spec" className="border-t-2 border-ink">
      <div className="grid lg:grid-cols-2">
        <div className="px-6 md:px-10 lg:px-16 py-16 lg:py-24 border-b-2 lg:border-b-0 lg:border-r-2 border-ink">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted mb-6">
            01 — usage
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-12 uppercase">
            Three commands.<br />That&apos;s the product.
          </h2>

          <div className="space-y-10">
            {specs.map((s) => (
              <article key={s.cmd} className="spec-row">
                <code className="block font-mono text-sm bg-panel text-paper px-4 py-3 mb-3 w-fit">
                  {s.cmd}
                </code>
                <h3 className="font-semibold text-lg mb-1">{s.title}</h3>
                <p className="text-muted leading-relaxed">{s.detail}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="px-6 md:px-10 lg:px-16 py-16 lg:py-24 bg-ink text-paper">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-paper/50 mb-6">
            02 — traits
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-12 uppercase">
            Built lean.<br />Shipped fast.
          </h2>

          <ul className="trait-list space-y-5">
            {traits.map((t) => (
              <li key={t} className="flex items-start gap-4 font-mono text-sm md:text-base">
                <span className="trait-line block h-px w-8 bg-hole mt-3 shrink-0" />
                <span>{t}</span>
              </li>
            ))}
          </ul>

          <p className="mt-12 text-sm text-paper/60 leading-relaxed">
            Dev and demos only. No phishing, malware, or brand impersonation.
            Report abuse at{" "}
            <a href="mailto:abuse@openhole.dev" className="text-hole hover:underline">
              abuse@openhole.dev
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
