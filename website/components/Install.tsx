"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Section, SectionHeader } from "./Section";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const installStep = {
  num: "01",
  title: "Install the CLI",
  desc: "Download the binary for macOS or Linux.",
  cmd: "curl -fsSL https://openhole.dev/install.sh | sh",
};

const runSteps = [
  {
    num: "02",
    title: "Start your local app",
    desc: "Run your Next.js, Vite, or Django server normally.",
    cmd: "npm run dev",
  },
  {
    num: "03",
    title: "Open the hole",
    desc: "Point OpenHole at your local port to get a public URL.",
    cmd: "openhole 3000",
  },
];

const goCmd = "go install github.com/bablilayoub/openhole/cmd/openhole@latest";

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function CopyButton({
  cmd,
  id,
  copied,
  onCopy,
}: {
  cmd: string;
  id: string;
  copied: string | null;
  onCopy: (text: string, id: string) => void;
}) {
  const isCopied = copied === id;

  return (
    <button
      type="button"
      onClick={() => onCopy(cmd, id)}
      aria-label={isCopied ? "Copied" : "Copy command"}
      className="shrink-0 rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-white"
    >
      {isCopied ? <CheckIcon /> : <CopyIcon />}
    </button>
  );
}

function StepCode({
  cmd,
  id,
  copied,
  onCopy,
}: {
  cmd: string;
  id: string;
  copied: string | null;
  onCopy: (text: string, id: string) => void;
}) {
  return (
    <div className="code-block">
      <code className="min-w-0 flex-1 font-mono text-sm leading-relaxed text-neutral-300 break-all">
        <span className="text-neutral-500">$ </span>
        {cmd}
      </code>
      <CopyButton cmd={cmd} id={id} copied={copied} onCopy={onCopy} />
    </div>
  );
}

function StepCard({
  num,
  title,
  desc,
  cmd,
  copied,
  onCopy,
}: {
  num: string;
  title: string;
  desc: string;
  cmd: string;
  copied: string | null;
  onCopy: (text: string, id: string) => void;
}) {
  return (
    <div className="step-card flex h-full flex-col">
      <span className="mb-3 block font-mono text-sm text-neutral-500">{num}</span>
      <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      <p className="mb-6 flex-1 text-sm leading-relaxed text-neutral-400 sm:text-base">{desc}</p>
      <StepCode cmd={cmd} id={num} copied={copied} onCopy={onCopy} />
    </div>
  );
}

export function Install() {
  const root = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useGSAP(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    gsap.from(root.current?.querySelectorAll(".step-card") ?? [], {
      y: 24,
      opacity: 0,
      duration: 0.6,
      stagger: 0.12,
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
    <Section id="install" border>
      <div ref={root}>
        <SectionHeader
          title="Start tunneling in seconds"
          description="No signup required. Just install the CLI and run it."
        />

        <div className="space-y-8">
          <StepCard
            num={installStep.num}
            title={installStep.title}
            desc={installStep.desc}
            cmd={installStep.cmd}
            copied={copied}
            onCopy={copy}
          />

          <div className="grid gap-8 sm:grid-cols-2">
            {runSteps.map((step) => (
              <StepCard
                key={step.num}
                num={step.num}
                title={step.title}
                desc={step.desc}
                cmd={step.cmd}
                copied={copied}
                onCopy={copy}
              />
            ))}
          </div>

          <div className="card-base bg-neutral-900/30 p-5 sm:p-6">
            <p className="mb-4 text-sm text-neutral-500">Prefer Go?</p>
            <div className="code-block border-none bg-transparent p-0">
              <code className="min-w-0 flex-1 font-mono text-sm text-neutral-300 break-all">{goCmd}</code>
              <CopyButton cmd={goCmd} id="go" copied={copied} onCopy={copy} />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
