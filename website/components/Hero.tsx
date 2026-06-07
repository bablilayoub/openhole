"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { TunnelDiagram } from "./TunnelDiagram";

gsap.registerPlugin(useGSAP);

const lines = ["PUNCH", "A HOLE", "THROUGH", "LOCALHOST"];

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        gsap.set(".hero-line, .hero-sub, .hero-cta, .hero-diagram", { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(".hero-line", {
        yPercent: 110,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
      })
        .from(
          ".hero-sub",
          { y: 24, opacity: 0, duration: 0.7 },
          "-=0.35"
        )
        .from(
          ".hero-cta > *",
          { y: 16, opacity: 0, duration: 0.5, stagger: 0.08 },
          "-=0.4"
        )
        .from(
          ".hero-diagram",
          { y: 40, opacity: 0, duration: 0.9 },
          "-=0.2"
        );
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="min-h-[calc(100vh-4rem)] flex flex-col justify-center px-6 md:px-10 lg:px-16 pt-28 pb-16"
    >
      <div className="max-w-6xl mx-auto w-full">
        <p className="hero-sub font-mono text-xs uppercase tracking-[0.3em] text-muted mb-8">
          ophl.link · no login · one binary
        </p>

        <h1 className="mb-10">
          {lines.map((line) => (
            <span
              key={line}
              className="hero-line block text-[clamp(3.5rem,14vw,9rem)] font-extrabold leading-[0.88] tracking-[-0.04em] uppercase overflow-hidden"
            >
              {line === "A HOLE" ? (
                <>
                  A{" "}
                  <span className="text-hole underline decoration-[6px] underline-offset-[0.12em]">
                    HOLE
                  </span>
                </>
              ) : (
                line
              )}
            </span>
          ))}
        </h1>

        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-end">
          <div>
            <p className="hero-sub text-lg md:text-xl text-muted max-w-md leading-relaxed mb-8">
              Expose any local port to HTTPS in one command. No accounts, no YAML, no dashboard — just a tunnel that works.
            </p>

            <div className="hero-cta flex flex-wrap gap-4">
              <a
                href="#install"
                className="inline-block bg-ink text-paper px-6 py-3 font-mono text-sm font-medium hover:bg-hole transition-colors"
              >
                $ curl install
              </a>
              <a
                href="https://github.com/bablilayoub/openhole"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border-2 border-ink px-6 py-3 font-mono text-sm hover:bg-ink hover:text-paper transition-colors"
              >
                github →
              </a>
            </div>
          </div>

          <div className="hero-diagram">
            <TunnelDiagram />
          </div>
        </div>
      </div>
    </section>
  );
}
