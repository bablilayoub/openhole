"use client";

import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { CopyButton } from "@/components/CopyButton";
import { ProductStage } from "@/components/ProductStage";
import { Button } from "@/components/ui/Button";
import { Glow } from "@/components/ui/Glow";
import { hero, installTargets } from "@/lib/content";
import { scrollToSection } from "@/lib/scroll";
import { githubReleases } from "@/lib/site";

const rise = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function Hero() {
  const reduced = useReducedMotion();
  const install = installTargets[0];

  return (
    <section className="relative overflow-hidden pt-32 sm:pt-40">
      <Glow
        className="inset-x-0 top-0 h-[40rem]"
        gradient="radial-gradient(60rem 24rem at 50% -8rem, var(--glow), transparent 70%)"
      />

      <motion.div
        initial={reduced ? false : "hidden"}
        animate="show"
        transition={{ staggerChildren: 0.08 }}
        className="page-container flex flex-col items-center text-center"
      >
        <motion.a
          variants={rise}
          transition={{ duration: 0.5 }}
          href={githubReleases}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex h-8 items-center gap-2 rounded-full border border-line bg-surface pr-3 pl-1.5 text-sm text-muted transition-colors hover:border-line-2 hover:text-ink"
        >
          <span className="rounded-full bg-ink px-2 py-0.5 text-2xs font-medium text-void">
            New
          </span>
          {hero.badge}
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </motion.a>

        <motion.h1
          variants={rise}
          transition={{ duration: 0.6 }}
          className="mt-7 max-w-3xl text-[clamp(2.5rem,6.2vw,4.75rem)] leading-[1.02] font-medium tracking-[-0.035em] text-balance"
        >
          {hero.title}
        </motion.h1>

        <motion.p
          variants={rise}
          transition={{ duration: 0.6 }}
          className="mt-6 max-w-xl text-md leading-relaxed text-muted text-pretty sm:text-lg"
        >
          {hero.subtitle}
        </motion.p>

        <motion.div
          variants={rise}
          transition={{ duration: 0.6 }}
          className="mt-8 flex items-center gap-3"
        >
          <Button onClick={() => scrollToSection("install")}>Install OpenHole</Button>
          <Button href="/docs" variant="secondary">
            Read the docs
            <ArrowRight className="size-3.5" />
          </Button>
        </motion.div>

        <motion.div
          variants={rise}
          transition={{ duration: 0.6 }}
          className="mt-5 inline-flex h-9 max-w-full items-center gap-2 rounded-full border border-line bg-surface pr-1 pl-4 font-mono text-xs text-muted"
        >
          <span className="text-faint">{install.prompt}</span>
          <span className="truncate text-ink/80">{install.command}</span>
          <CopyButton text={install.command} className="h-7 rounded-full" />
        </motion.div>
      </motion.div>

      <ProductStage />
    </section>
  );
}
