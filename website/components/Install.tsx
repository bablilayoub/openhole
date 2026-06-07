"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function Install() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".install-content",
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        },
      }
    );
  }, { scope: container });

  return (
    <section ref={container} id="install" className="py-32 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10 max-w-3xl text-center install-content">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready in 10 seconds.</h2>
        <p className="text-zinc-400 text-lg mb-12">
          Install the binary and start tunneling immediately. No signup required.
        </p>

        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-2 mb-8 shadow-2xl text-left">
          <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/50 rounded-xl mb-2">
            <span className="text-zinc-400 text-sm font-mono">macOS / Linux</span>
            <button 
              className="text-zinc-500 hover:text-accent transition-colors"
              onClick={() => navigator.clipboard.writeText("curl -fsSL https://openhole.dev/install.sh | sh")}
              title="Copy to clipboard"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          <div className="px-4 py-4 font-mono text-sm text-zinc-300 overflow-x-auto">
            <span className="text-accent mr-2">$</span>
            curl -fsSL https://openhole.dev/install.sh | sh
          </div>
        </div>

        <div className="text-sm text-zinc-500 font-mono">
          Or install with Go: <br className="md:hidden" />
          <code className="text-zinc-400 bg-zinc-900 px-2 py-1 rounded ml-2">go install github.com/bablilayoub/openhole/cmd/openhole@latest</code>
        </div>
      </div>
    </section>
  );
}
