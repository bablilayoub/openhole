"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const steps = [
  {
    num: "01",
    title: "Install the CLI",
    desc: "Download the binary for macOS or Linux.",
    cmd: "curl -fsSL https://openhole.dev/install.sh | sh",
    prompt: "$"
  },
  {
    num: "02",
    title: "Start your local app",
    desc: "Run your Next.js, Vite, or Django server normally.",
    cmd: "npm run dev",
    prompt: "$"
  },
  {
    num: "03",
    title: "Open the hole",
    desc: "Point OpenHole at your local port to get a public URL.",
    cmd: "openhole 3000",
    prompt: "$"
  }
];

export function Install() {
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useGSAP(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    gsap.from(".step-card", {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: root.current,
        start: "top 80%",
      },
    });
  }, { scope: root });

  async function copy(text: string, id: string) {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <section ref={root} id="install" className="py-24 sm:py-32 border-t border-neutral-900">
      <div className="mx-auto max-w-6xl px-6">
        
        <div className="mb-16 max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            Start tunneling in seconds
          </h2>
          <p className="text-lg text-neutral-400">
            No signup required. Just install the CLI and run it.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.num} className="step-card flex flex-col">
              <div className="mb-6">
                <span className="text-sm font-mono text-neutral-500 mb-2 block">{step.num}</span>
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-neutral-400 text-sm">{step.desc}</p>
              </div>
              
              <div className="mt-auto card-base bg-neutral-900/50 p-4 flex items-center justify-between group">
                <code className="font-mono text-sm text-neutral-300 overflow-x-auto whitespace-nowrap scrollbar-hide">
                  <span className="text-neutral-500 mr-2">{step.prompt}</span>
                  {step.cmd}
                </code>
                <button 
                  onClick={() => copy(step.cmd, step.num)}
                  className="ml-4 text-xs font-medium text-neutral-500 hover:text-white transition-colors shrink-0"
                >
                  {copied === step.num ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-neutral-500">
            Prefer Go? <code className="text-neutral-300 font-mono bg-neutral-900 px-2 py-1 rounded mx-1">go install github.com/bablilayoub/openhole/cmd/openhole@latest</code>
          </p>
        </div>

      </div>
    </section>
  );
}
