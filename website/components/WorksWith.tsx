import * as simpleIcons from "simple-icons";
import { worksWith } from "@/lib/content";

type SimpleIcon = { title: string; path: string };

function iconFor(key?: string): SimpleIcon | undefined {
  if (!key) return undefined;
  return (simpleIcons as unknown as Record<string, SimpleIcon | undefined>)[key];
}

export function WorksWith() {
  return (
    <section className="py-6 sm:py-8">
      <div className="page-container">
        <p className="text-center text-sm text-faint">
          Works with everything that needs to reach your machine
        </p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-9 gap-y-4">
          {worksWith.map((item) => {
            const icon = iconFor(item.icon);
            return (
              <li
                key={item.name}
                className="flex items-center gap-2 text-base font-medium tracking-[-0.01em] text-muted/70"
              >
                {icon ? (
                  <svg viewBox="0 0 24 24" className="size-[18px] fill-current" aria-hidden>
                    <path d={icon.path} />
                  </svg>
                ) : null}
                <span>{item.name}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
