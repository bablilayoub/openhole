"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const installCmd = "curl -fsSL https://openhole.dev/install.sh | sh";
const goCmd = "go install github.com/bablilayoub/openhole/cmd/openhole@latest";

export function Install() {
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      gsap.from(".install-block", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root.current,
          start: "top 80%",
        },
      });
    },
    { scope: root }
  );

  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section ref={root} id="install" className="border-t-2 border-ink bg-hole text-paper">
      <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-16 py-20 md:py-28">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-paper/70 mb-4">
          03 — install
        </p>
        <h2 className="text-4xl md:text-6xl font-extrabold uppercase tracking-tight mb-12">
          Ten seconds.<br />Then tunnel.
        </h2>

        <div className="install-block space-y-4 max-w-3xl">
          <button
            type="button"
            onClick={() => copy(installCmd)}
            className="w-full text-left border-2 border-paper/30 bg-ink px-5 py-4 font-mono text-sm md:text-base hover:border-paper transition-colors group"
          >
            <span className="text-paper/50 mr-2">$</span>
            {installCmd}
            <span className="float-right text-xs text-paper/50 group-hover:text-paper">
              {copied ? "copied" : "click to copy"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => copy(goCmd)}
            className="w-full text-left border-2 border-paper/20 px-5 py-4 font-mono text-sm text-paper/80 hover:border-paper/50 transition-colors"
          >
            <span className="text-paper/40 mr-2">#</span>
            {goCmd}
          </button>
        </div>
      </div>
    </section>
  );
}
