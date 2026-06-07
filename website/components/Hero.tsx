"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const domain = process.env.NEXT_PUBLIC_TUNNEL_DOMAIN || "ophl.link";

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(".hero-text", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
    }).from(
      ".hero-terminal",
      { y: 40, opacity: 0, duration: 1 },
      "-=0.4"
    );
  }, { scope: root });

  return (
    <section ref={root} className="pb-24 pt-28 sm:pb-32 sm:pt-36">
      <div className="page-container">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h1 className="hero-text mb-6 text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-7xl">
            Share localhost. <br className="hidden sm:block" />
            <span className="text-neutral-500">Zero configuration.</span>
          </h1>
          <p className="hero-text mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-neutral-400 sm:text-xl">
            Expose any local port to the internet over HTTPS. No accounts, no API keys, no dashboard. Just a single command.
          </p>
          <div className="hero-text flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#install"
              className="w-full rounded-full bg-white px-8 py-3.5 font-medium text-black transition-colors hover:bg-neutral-200 sm:w-auto"
            >
              Get Started
            </a>
            <a
              href="https://github.com/bablilayoub/openhole"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-full border border-neutral-800 bg-neutral-900 px-8 py-3.5 font-medium text-white transition-colors hover:bg-neutral-800 sm:w-auto"
            >
              View on GitHub
            </a>
          </div>
        </div>

        <div className="hero-terminal mx-auto max-w-4xl card-base shadow-2xl shadow-white/5">
          <div className="flex items-center border-b border-neutral-800 bg-neutral-900/50 px-4 py-3">
            <div className="flex gap-2">
              <div className="h-3 w-3 rounded-full bg-neutral-700" />
              <div className="h-3 w-3 rounded-full bg-neutral-700" />
              <div className="h-3 w-3 rounded-full bg-neutral-700" />
            </div>
            <div className="mx-auto font-mono text-xs text-neutral-500">bash — openhole</div>
          </div>

          <div className="p-6 font-mono text-sm leading-relaxed sm:p-8 sm:text-base">
            <div className="flex gap-3">
              <span className="text-neutral-500">$</span>
              <span className="text-white">openhole 3000</span>
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex gap-3">
                <span className="text-emerald-500">✓</span>
                <span className="text-neutral-300">Tunnel registered successfully</span>
              </div>
              <div className="flex gap-3">
                <span className="text-neutral-500">→</span>
                <span className="text-white">https://blue-fox.{domain}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-neutral-500">→</span>
                <span className="text-neutral-400">Forwarding to localhost:3000</span>
              </div>
            </div>

            <div className="mt-8 space-y-2 border-t border-neutral-800/50 pt-6 text-xs sm:text-sm">
              <div className="grid grid-cols-[3rem_1fr_3rem_4rem] gap-4 text-neutral-400">
                <span className="text-white">GET</span>
                <span>/api/users</span>
                <span className="text-emerald-500">200</span>
                <span className="text-right">12ms</span>
              </div>
              <div className="grid grid-cols-[3rem_1fr_3rem_4rem] gap-4 text-neutral-400">
                <span className="text-white">POST</span>
                <span>/webhooks/stripe</span>
                <span className="text-emerald-500">201</span>
                <span className="text-right">45ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
