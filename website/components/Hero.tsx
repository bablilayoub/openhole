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
    }).from(".hero-terminal", {
      y: 40,
      opacity: 0,
      duration: 1,
    }, "-=0.4");
  }, { scope: root });

  return (
    <section ref={root} className="pt-32 pb-20 sm:pt-40 sm:pb-32 px-6">
      <div className="mx-auto max-w-6xl">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="hero-text text-5xl sm:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
            Share localhost. <br className="hidden sm:block" />
            <span className="text-neutral-500">Zero configuration.</span>
          </h1>
          <p className="hero-text text-lg sm:text-xl text-neutral-400 mb-10 max-w-2xl mx-auto">
            Expose any local port to the internet over HTTPS. No accounts, no API keys, no dashboard. Just a single command.
          </p>
          <div className="hero-text flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#install" className="w-full sm:w-auto bg-white text-black px-8 py-3.5 rounded-full font-medium hover:bg-neutral-200 transition-colors">
              Get Started
            </a>
            <a href="https://github.com/bablilayoub/openhole" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-neutral-900 text-white border border-neutral-800 px-8 py-3.5 rounded-full font-medium hover:bg-neutral-800 transition-colors">
              View on GitHub
            </a>
          </div>
        </div>

        <div className="hero-terminal max-w-4xl mx-auto card-base shadow-2xl shadow-white/5">
          <div className="flex items-center px-4 py-3 border-b border-neutral-800 bg-neutral-900/50">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-neutral-700" />
              <div className="w-3 h-3 rounded-full bg-neutral-700" />
              <div className="w-3 h-3 rounded-full bg-neutral-700" />
            </div>
            <div className="mx-auto text-xs font-mono text-neutral-500">bash — openhole</div>
          </div>
          
          <div className="p-6 sm:p-8 font-mono text-sm sm:text-base leading-relaxed">
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
                <span className="text-neutral-400">Forwarding to 127.0.0.1:3000</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-800/50 space-y-2 text-xs sm:text-sm">
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
