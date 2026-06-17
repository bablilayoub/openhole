"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { installPs1Url, scriptUrl } from "@/lib/site";
import { Section, SectionHeader } from "./Section";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type InstallOS = "unix" | "windows";

type InstallOption = {
  id: InstallOS;
  label: string;
  desc: string;
  cmd: string;
  prompt: string;
};

const installOptions: InstallOption[] = [
  {
    id: "unix",
    label: "macOS / Linux",
    desc: "Install script for macOS (Intel & Apple Silicon) and Linux (amd64 & arm64). Verifies checksums when available.",
    cmd: `curl -fsSL ${scriptUrl("install")} | sh`,
    prompt: "$",
  },
  {
    id: "windows",
    label: "Windows",
    desc: "PowerShell installer for amd64 and arm64. Adds openhole to your user PATH.",
    cmd: `irm ${installPs1Url()} | iex`,
    prompt: ">",
  },
];

const runSteps = [
  {
    num: "02",
    title: "Start your local app",
    desc: "Run your Next.js, Vite, or Django server normally.",
    cmd: "npm run dev",
    prompt: "$",
  },
  {
    num: "03",
    title: "Open the hole",
    desc: "Point OpenHole at your local port to get a public URL.",
    cmd: "openhole 3000",
    prompt: "$",
  },
];

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

function highlightCmd(cmd: string) {
  return cmd.split(/(\s+)/).map((part, i) => {
    if (part === "|" || part === "sh" || part === "iex") {
      return (
        <span key={i} className="text-neutral-500">
          {part}
        </span>
      );
    }
    if (part === "openhole") {
      return (
        <span key={i} className="text-accent">
          {part}
        </span>
      );
    }
    if (/^(curl|npm|irm|brew|scoop)$/.test(part)) {
      return (
        <span key={i} className="text-white">
          {part}
        </span>
      );
    }
    return (
      <span key={i} className="text-neutral-300">
        {part}
      </span>
    );
  });
}

function StepCode({
  cmd,
  id,
  prompt,
  copied,
  onCopy,
}: {
  cmd: string;
  id: string;
  prompt: string;
  copied: string | null;
  onCopy: (text: string, id: string) => void;
}) {
  return (
    <div className="code-block">
      <code className="min-w-0 flex-1 font-mono text-sm leading-relaxed break-all">
        <span className="text-neutral-500">{prompt} </span>
        {highlightCmd(cmd)}
      </code>
      <CopyButton cmd={cmd} id={id} copied={copied} onCopy={onCopy} />
    </div>
  );
}

function OSTabs({
  active,
  onChange,
}: {
  active: InstallOS;
  onChange: (id: InstallOS) => void;
}) {
  return (
    <div
      className="mb-5 inline-flex max-w-full flex-wrap gap-1 rounded-xl border border-white/[0.06] bg-void p-1"
      role="tablist"
      aria-label="Choose your operating system"
    >
      {installOptions.map((opt) => {
        const selected = active === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(opt.id)}
            className={`rounded-lg px-3 py-1.5 font-mono text-xs transition-colors sm:text-[13px] ${
              selected
                ? "bg-white text-black"
                : "text-neutral-400 hover:bg-white/[0.05] hover:text-white"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function InstallStepCard({
  copied,
  onCopy,
}: {
  copied: string | null;
  onCopy: (text: string, id: string) => void;
}) {
  const [os, setOs] = useState<InstallOS>("unix");
  const current = installOptions.find((o) => o.id === os) ?? installOptions[0];

  return (
    <div className="step-card flex h-full flex-col">
      <span className="text-accent mb-3 block font-mono text-sm opacity-80">01</span>
      <h3 className="mb-2 text-lg font-semibold text-white">Install the CLI</h3>
      <p className="mb-5 flex-1 text-sm leading-relaxed text-neutral-400 sm:text-base">
        {current.desc}
      </p>

      <OSTabs active={os} onChange={setOs} />

      <StepCode
        cmd={current.cmd}
        id={`install-${os}`}
        prompt={current.prompt}
        copied={copied}
        onCopy={onCopy}
      />
    </div>
  );
}

function StepCard({
  num,
  title,
  desc,
  cmd,
  prompt,
  copied,
  onCopy,
}: {
  num: string;
  title: string;
  desc: string;
  cmd: string;
  prompt: string;
  copied: string | null;
  onCopy: (text: string, id: string) => void;
}) {
  return (
    <div className="step-card flex h-full flex-col">
      <span className="text-accent mb-3 block font-mono text-sm opacity-80">{num}</span>
      <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      <p className="mb-6 flex-1 text-sm leading-relaxed text-neutral-400 sm:text-base">{desc}</p>
      <StepCode cmd={cmd} id={num} prompt={prompt} copied={copied} onCopy={onCopy} />
    </div>
  );
}

export function Install() {
  const root = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useGSAP(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const steps = root.current?.querySelectorAll(".step-card");
    if (!steps || steps.length === 0) return;

    gsap.fromTo(
      steps,
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.12,
        ease: "power2.out",
        clearProps: "transform",
        scrollTrigger: {
          trigger: root.current,
          start: "top 85%",
          once: true,
        },
      }
    );
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
          eyebrow="Install"
          title="Start tunneling in seconds"
          description="No signup required. Just install the CLI and run it."
        />

        <div className="space-y-8">
          <InstallStepCard copied={copied} onCopy={copy} />

          <div className="grid gap-8 sm:grid-cols-2">
            {runSteps.map((step) => (
              <StepCard
                key={step.num}
                num={step.num}
                title={step.title}
                desc={step.desc}
                cmd={step.cmd}
                prompt={step.prompt}
                copied={copied}
                onCopy={copy}
              />
            ))}
          </div>

          <p className="text-sm leading-relaxed text-neutral-400 sm:text-base">
            Pin a version with{" "}
            <code className="font-mono text-accent">OPENHOLE_VERSION=v0.2.1</code>. Also available
            via{" "}
            <a href="/docs/package-managers" className="text-neutral-300 transition-colors hover:text-cyan">
              Homebrew, Scoop, and apt
            </a>
            .
          </p>
        </div>
      </div>
    </Section>
  );
}
