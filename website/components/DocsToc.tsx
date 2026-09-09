"use client";

import { useEffect, useState } from "react";
import type { DocHeading } from "@/lib/docs";
import { cn } from "@/lib/utils";

/** "On this page" with a scroll-spy. Hidden when there are fewer than two headings. */
export function DocsToc({ headings }: { headings: DocHeading[] }) {
  const [active, setActive] = useState<string | null>(headings[0]?.id ?? null);

  useEffect(() => {
    if (headings.length === 0) return;
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="mb-3 text-2xs font-medium tracking-wide text-faint uppercase">On this page</p>
      <ul className="space-y-0.5 border-l border-line">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={cn(
                "-ml-px block border-l py-1 pr-2 transition-colors",
                h.level === 3 ? "pl-6" : "pl-3",
                active === h.id
                  ? "border-ink text-ink"
                  : "border-transparent text-muted hover:text-ink"
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
