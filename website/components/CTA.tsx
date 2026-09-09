"use client";

import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/Button";
import { Glow } from "@/components/ui/Glow";
import { cta } from "@/lib/content";
import { scrollToSection } from "@/lib/scroll";
import { githubRepo } from "@/lib/site";

export function CTA() {
  return (
    <section className="relative border-t border-line py-28 sm:py-36">
      <Glow
        className="inset-x-0 bottom-0 h-[30rem]"
        gradient="radial-gradient(50rem 22rem at 50% 100%, var(--glow), transparent 70%)"
      />
      <Reveal className="page-container flex flex-col items-center text-center">
        <h2 className="max-w-2xl text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] font-medium tracking-[-0.035em] text-balance">
          {cta.title}
        </h2>
        <p className="mt-5 max-w-md text-md text-muted text-pretty">{cta.subtitle}</p>
        <div className="mt-8 flex items-center gap-3">
          <Button onClick={() => scrollToSection("install")}>Install OpenHole</Button>
          <Button href={githubRepo} variant="secondary">
            Star on GitHub
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
