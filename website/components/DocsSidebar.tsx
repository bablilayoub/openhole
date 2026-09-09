import Link from "next/link";
import { docGroups, docPages } from "@/lib/docs";
import { cn } from "@/lib/utils";

function itemClass(active: boolean) {
  return cn(
    "block rounded-md px-2.5 py-1.5 text-sm whitespace-nowrap transition-colors",
    active ? "bg-surface-2 font-medium text-ink" : "text-muted hover:bg-surface-2/60 hover:text-ink"
  );
}

/** Grouped page list. Vertical on desktop, a scrolling row of chips on small screens. */
export function DocsSidebar({ activeSlug }: { activeSlug?: string }) {
  return (
    <nav
      aria-label="Documentation"
      className="-mx-5 flex gap-1 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 lg:mx-0 lg:block lg:space-y-6 lg:overflow-visible lg:px-0 lg:pb-0"
    >
      <Link href="/docs" className={itemClass(!activeSlug)}>
        Overview
      </Link>
      {docGroups.map((group) => (
        <div key={group} className="contents lg:block">
          <p className="hidden px-2.5 pb-1.5 text-2xs font-medium tracking-wide text-faint uppercase lg:block">
            {group}
          </p>
          {docPages
            .filter((p) => p.group === group)
            .map((page) => (
              <Link
                key={page.slug}
                href={`/docs/${page.slug}`}
                aria-current={activeSlug === page.slug ? "page" : undefined}
                className={itemClass(activeSlug === page.slug)}
              >
                {page.title}
              </Link>
            ))}
        </div>
      ))}
    </nav>
  );
}
