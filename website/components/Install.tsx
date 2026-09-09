"use client";

import Link from "next/link";
import { Terminal } from "lucide-react";
import { Tabs } from "radix-ui";
import { CopyButton } from "@/components/CopyButton";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { Glow } from "@/components/ui/Glow";
import { installTargets } from "@/lib/content";
import { firstRun } from "@/lib/fixtures";

export function Install() {
  return (
    <section id="install" className="relative border-t border-line py-24 sm:py-32">
      <Glow
        className="inset-x-0 top-0 h-full opacity-60"
        gradient="radial-gradient(48rem 20rem at 50% 30%, var(--glow), transparent 70%)"
      />
      <div className="page-container">
        <Reveal>
          <SectionHeader
            align="center"
            icon={Terminal}
            label="Install"
            title="Ten seconds to a public URL."
            description="A single static binary for macOS, Linux and Windows. No runtime, no background service."
          />
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-12 max-w-2xl">
          <Tabs.Root defaultValue={installTargets[0].id} className="window bg-surface">
            <Tabs.List
              aria-label="Operating system"
              className="flex h-12 items-center gap-1 border-b border-line px-2"
            >
              {installTargets.map((t) => (
                <Tabs.Trigger
                  key={t.id}
                  value={t.id}
                  className="h-8 rounded-full px-3.5 text-sm font-medium text-muted transition-colors hover:text-ink data-[state=active]:bg-surface-2 data-[state=active]:text-ink"
                >
                  {t.label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            {installTargets.map((t) => (
              <Tabs.Content key={t.id} value={t.id} className="outline-none">
                <div className="flex items-center gap-3 px-5 py-4">
                  <code className="min-w-0 flex-1 font-mono text-sm break-all sm:text-sm sm:break-normal">
                    <span className="text-faint">{t.prompt} </span>
                    {t.command}
                  </code>
                  <CopyButton text={t.command} label />
                </div>
              </Tabs.Content>
            ))}

            <div className="flex items-center gap-3 border-t border-line bg-surface-2/40 px-5 py-3.5">
              <span className="text-2xs font-medium tracking-wide text-faint uppercase">
                then
              </span>
              <code className="min-w-0 flex-1 font-mono text-sm sm:text-sm">
                <span className="text-faint">$ </span>
                {firstRun}
              </code>
              <CopyButton text={firstRun} />
            </div>
          </Tabs.Root>

          <p className="mt-6 text-center text-sm text-muted">
            Prefer a package manager?{" "}
            <Link href="/docs/package-managers" className="link">
              Homebrew, Scoop and apt
            </Link>
            . Updates with <code className="font-mono text-ink">openhole update</code>.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
