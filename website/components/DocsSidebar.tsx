import Link from "next/link";
import { docPages } from "@/lib/docs";

export function DocsSidebar({ activeSlug }: { activeSlug?: string }) {
  return (
    <nav className="space-y-1">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-600">
        Documentation
      </p>
      <Link
        href="/docs"
        className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
          !activeSlug
            ? "bg-white/5 font-medium text-white"
            : "text-neutral-400 hover:bg-white/[0.03] hover:text-white"
        }`}
      >
        Overview
      </Link>
      {docPages.map((page) => (
        <Link
          key={page.slug}
          href={`/docs/${page.slug}`}
          className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
            activeSlug === page.slug
              ? "bg-white/5 font-medium text-white"
              : "text-neutral-400 hover:bg-white/[0.03] hover:text-white"
          }`}
        >
          {page.title}
        </Link>
      ))}
    </nav>
  );
}
