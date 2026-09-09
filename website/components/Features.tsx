import Link from "next/link";
import { Radio } from "lucide-react";
import { AuthFragment, HmrFragment, SubdomainFragment } from "@/components/fragments";
import { Reveal } from "@/components/Reveal";
import { Glow } from "@/components/ui/Glow";
import { SectionHeader } from "@/components/SectionHeader";
import { features, type FeatureFragment } from "@/lib/content";

const fragment: Record<FeatureFragment, React.ComponentType> = {
  hmr: HmrFragment,
  auth: AuthFragment,
  subdomain: SubdomainFragment,
};

export function Features() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="page-container">
        <Reveal>
          <SectionHeader
            icon={Radio}
            label="Tunnels"
            title="Made for the hour before you ship."
            description="The three things you reach for when the demo is in ten minutes and the webhook has to land on your laptop."
          />
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {features.map((feature, i) => {
            const Fragment = fragment[feature.id];
            return (
              <Reveal key={feature.id} delay={i * 0.08} className="min-w-0">
                <Link href={feature.href} className="card group flex h-full flex-col">
                  <div className="relative h-56 overflow-hidden border-b border-line bg-surface-2/40">
                    <Glow
                      className="inset-0 z-0 opacity-70"
                      gradient="radial-gradient(24rem 12rem at 50% 0%, var(--glow), transparent 70%)"
                    />
                    <Fragment />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-base font-medium">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {feature.description}
                    </p>
                    <code className="mt-5 block truncate font-mono text-xs text-faint transition-colors group-hover:text-muted">
                      <span>$ </span>
                      {feature.command}
                    </code>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
