import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import { SelfHostFragment, StatusFragment } from "@/components/fragments";
import { Reveal } from "@/components/Reveal";
import { Glow } from "@/components/ui/Glow";
import { SectionHeader } from "@/components/SectionHeader";
import { operate, type OperateFragment } from "@/lib/content";
import { cn } from "@/lib/utils";

const fragment: Record<OperateFragment, React.ComponentType> = {
  status: StatusFragment,
  selfhost: SelfHostFragment,
};

export function Operate() {
  return (
    <section id="selfhost" className="overflow-hidden border-t border-line py-24 sm:py-32">
      <div className="page-container">
        <Reveal>
          <SectionHeader
            icon={Layers}
            label="Operate"
            title="Everything after the first tunnel."
            description="More ports, a status line you can read from another terminal, and the same binary pointed at an edge you run yourself."
          />
        </Reveal>

        <div className="mt-16 space-y-20 sm:space-y-28">
          {operate.map((row) => {
            const Fragment = fragment[row.id];
            return (
              <Reveal key={row.id}>
                <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                  <div className={cn("min-w-0", row.flip && "lg:order-2")}>
                    <h3 className="text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
                      {row.title}
                    </h3>
                    <p className="mt-3 max-w-md text-base leading-relaxed text-muted">
                      {row.description}
                    </p>
                    <ul className="mt-6 divide-y divide-line border-y border-line">
                      {row.bullets.map((b) => (
                        <li
                          key={b.command}
                          className="flex items-center justify-between gap-4 py-3"
                        >
                          <code className="min-w-0 truncate font-mono text-sm text-ink/90">
                            {b.command}
                          </code>
                          <span className="shrink-0 text-sm text-faint">{b.note}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={row.href}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink transition-colors hover:text-accent"
                    >
                      Learn more
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>

                  <div
                    className={cn(
                      "relative min-w-0",
                      row.flip && "lg:order-1"
                    )}
                  >
                    <Glow className="-inset-10 opacity-60 blur-2xl" />
                    <Fragment />
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
