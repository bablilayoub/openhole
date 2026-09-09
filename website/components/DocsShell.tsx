import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { DocsSidebar } from "@/components/DocsSidebar";
import { DocsToc } from "@/components/DocsToc";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import type { DocHeading, DocMeta } from "@/lib/docs";

type DocsShellProps = {
  activeSlug?: string;
  title?: string;
  headings?: DocHeading[];
  actions?: ReactNode;
  prev?: DocMeta | null;
  next?: DocMeta | null;
  children: ReactNode;
};

/** Three-column docs layout: sidebar, article, on-this-page. */
export function DocsShell({
  activeSlug,
  title,
  headings = [],
  actions,
  prev,
  next,
  children,
}: DocsShellProps) {
  return (
    <>
      <Nav />
      <main className="min-h-[80vh] pt-24 pb-24 sm:pt-28">
        <div className="page-container">
          <div className="grid gap-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14 xl:grid-cols-[13rem_minmax(0,1fr)_11rem]">
            <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
              <DocsSidebar activeSlug={activeSlug} />
            </aside>

            <article className="docs-content min-w-0 max-w-3xl">
              <div className="mb-8 flex items-center justify-between gap-4">
                <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted">
                  <Link href="/docs" className="transition-colors hover:text-ink">
                    Docs
                  </Link>
                  {title ? (
                    <>
                      <ChevronRight className="size-3.5 text-faint" />
                      <span className="text-ink">{title}</span>
                    </>
                  ) : null}
                </nav>
                {actions}
              </div>

              {children}

              {prev || next ? (
                <div className="mt-16 grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
                  {prev ? (
                    <Link
                      href={`/docs/${prev.slug}`}
                      className="card group flex items-center gap-3 p-4"
                    >
                      <ArrowLeft className="size-4 shrink-0 text-faint transition-colors group-hover:text-ink" />
                      <span className="min-w-0">
                        <span className="block text-2xs font-medium tracking-wide text-faint uppercase">
                          Previous
                        </span>
                        <span className="block truncate text-sm font-medium">{prev.title}</span>
                      </span>
                    </Link>
                  ) : (
                    <span />
                  )}
                  {next ? (
                    <Link
                      href={`/docs/${next.slug}`}
                      className="card group flex items-center justify-end gap-3 p-4 text-right"
                    >
                      <span className="min-w-0">
                        <span className="block text-2xs font-medium tracking-wide text-faint uppercase">
                          Next
                        </span>
                        <span className="block truncate text-sm font-medium">{next.title}</span>
                      </span>
                      <ArrowRight className="size-4 shrink-0 text-faint transition-colors group-hover:text-ink" />
                    </Link>
                  ) : null}
                </div>
              ) : null}
            </article>

            <aside className="hidden xl:block">
              <div className="sticky top-24">
                <DocsToc headings={headings} />
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
