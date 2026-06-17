"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { HashLink } from "./HashLink";
import { PortalBackdrop } from "./PortalBackdrop";
import { cliVersion, githubReleases, tunnelDomain as domain } from "@/lib/site";

gsap.registerPlugin(useGSAP);

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
      stagger: 0.12,
    }).from(
      ".hero-terminal",
      { y: 40, opacity: 0, duration: 1 },
      "-=0.4"
    );
  }, { scope: root });

  return (
    <section ref={root} className="relative overflow-hidden pb-24 pt-28 sm:pb-32 sm:pt-36">
      <PortalBackdrop />

      <div className="page-container relative">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <a
            href={githubReleases}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-text mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-neutral-300 transition-colors hover:bg-white/10"
          >
            <span className="flex h-2 w-2 rounded-full bg-cyan"></span>
            v{cliVersion} is here — WebSocket passthrough
          </a>

          <h1 className="hero-text mb-6 text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-7xl">
            Share localhost. <br className="hidden sm:block" />
            Zero configuration.
          </h1>
          <p className="hero-text mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-neutral-400 sm:text-xl">
            One command exposes your local server over HTTPS. No accounts, no
            dashboard, no config files — just a tunnel from the internet to your
            machine.
          </p>
          <div className="hero-text flex flex-col items-center justify-center gap-4 sm:flex-row">
            <HashLink section="install" className="btn-primary w-full sm:w-auto">
              Get started
            </HashLink>
            <a
              href="https://github.com/bablilayoub/openhole"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost w-full sm:w-auto"
            >
              View on GitHub
            </a>
          </div>
        </div>

        <div className="relative">
          <div
            className="hero-terminal-glow pointer-events-none absolute -inset-8 -z-10 mx-auto max-w-3xl sm:-inset-12"
            aria-hidden
          />
          <div className="hero-terminal card-base mx-auto w-full max-w-3xl shadow-2xl shadow-black">
            <div className="flex items-center border-b border-white/[0.06] bg-[#111111] px-4 py-3">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-white/20" />
                <div className="h-3 w-3 rounded-full bg-white/20" />
                <div className="h-3 w-3 rounded-full bg-white/20" />
              </div>
              <div className="mx-auto font-mono text-xs text-neutral-500">
                bash — openhole
              </div>
            </div>

            <div className="p-6 font-mono text-sm leading-relaxed sm:p-8 sm:text-base">
              <div className="flex gap-3 overflow-x-auto">
                <span className="shrink-0 text-neutral-600">$</span>
                <span className="whitespace-nowrap text-white">
                  openhole 3000 --subdomain myapp
                </span>
              </div>

              <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-200/80 sm:text-sm">
                ⚠ Exposes http://localhost:3000 to the internet
              </div>

              <div className="mt-5 space-y-2 text-neutral-400">
                <div className="font-bold text-white">
                  OpenHole v{cliVersion}
                  <span className="ml-2 text-xs font-normal text-cyan">new</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-accent">✓</span>
                  <span className="text-accent">Tunnel ready</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-neutral-600">→</span>
                  <span className="text-white">https://myapp.{domain}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-neutral-600">→</span>
                  <span className="text-neutral-500">
                    forwarding to http://localhost:3000
                  </span>
                </div>
              </div>

              <div className="mt-8 space-y-2 border-t border-white/[0.06] pt-6 text-xs sm:text-sm">
                <div className="grid grid-cols-[3rem_1fr_3rem_4rem] gap-4 text-neutral-400">
                  <span className="font-bold text-white">GET</span>
                  <span>/api/users</span>
                  <span className="text-accent">200</span>
                  <span className="text-right text-neutral-600">12ms</span>
                </div>
                <div className="grid grid-cols-[3rem_1fr_3rem_4rem] gap-4 text-neutral-400">
                  <span className="font-bold text-cyan">WS</span>
                  <span>/_next/webpack-hmr</span>
                  <span className="text-accent">101</span>
                  <span className="text-right text-neutral-600">2ms</span>
                </div>
                <div className="grid grid-cols-[3rem_1fr_3rem_4rem] gap-4 text-neutral-400">
                  <span className="font-bold text-white">POST</span>
                  <span>/webhooks/stripe</span>
                  <span className="text-accent">201</span>
                  <span className="text-right text-neutral-600">45ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
