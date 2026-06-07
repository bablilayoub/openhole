"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const steps = [
  {
    num: "1",
    title: "Install the CLI",
    desc: "Download the binary for macOS or Linux.",
    cmd: "curl -fsSL https://openhole.dev/install.sh | sh",
    prompt: "$"
  },
  {
    num: "2",
    title: "Start your local app",
    desc: "Run your Next.js, Vite, or Django server normally.",
    cmd: "npm run dev",
    prompt: "$"
  },
  {
    num: "3",
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

    gsap.from(".step-row", {
      y: 20,
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
      <div className="mx-auto max-w-4xl px-6">
        
        <div className="mb-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            Start tunneling in seconds
          </h2>
          <p className="text-lg text-neutral-400">
            No signup required. Just install the CLI and run it.
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {steps.map((step) => (
            <div key={step.num} className="step-row card-base p-6 sm:p-8 flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-900 text-neutral-400 font-mono text-sm border border-neutral-800 shrink-0">
                    {step.num}
                  </span>
                  <h3 className="text-lg sm:text-xl font-semibold text-white">{step.title}</h3>
                </div>
                <p className="text-neutral-400 text-sm md:ml-12">{step.desc}</p>
              </div>
              
              <div className="w-full md:w-auto md:min-w-[420px]">
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-2 pl-4 flex items-center justify-between group">
                  <code className="font-mono text-[13px] sm:text-sm text-neutral-300">
                    <span className="text-neutral-500 mr-2">{step.prompt}</span>
                    {step.cmd}
                  </code>
                  <button 
                    onClick={() => copy(step.cmd, step.num)}
                    className="shrink-0 ml-4 px-4 py-2 text-xs font-medium text-neutral-500 hover:text-white transition-colors rounded-lg hover:bg-neutral-800"
                  >
                    {copied === step.num ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-neutral-500">
            Prefer Go? <code className="text-neutral-300 font-mono bg-neutral-900 px-2 py-1 rounded mx-1">go install github.com/bablilayoub/openhole/cmd/openhole@latest</code>
          </p>
        </div>

      </div>
    </section>
  );
}
