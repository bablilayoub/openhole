import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DocsGitHubLink, DocsMarkdown } from "@/components/DocsMarkdown";
import { DocsShell } from "@/components/DocsShell";
import { docGroups, docPages, getDocHeadings, getDocIndexContent } from "@/lib/docs";

export const metadata = {
  title: "Documentation",
  description:
    "OpenHole docs: install, CLI usage, WebSocket passthrough, config file, self-hosting, and more.",
};

export default function DocsIndexPage() {
  const content = getDocIndexContent();
  const headings = getDocHeadings(content);

  return (
    <DocsShell headings={headings} actions={<DocsGitHubLink />}>
      <h1 className="text-[2.25rem] leading-[1.1] font-medium tracking-[-0.03em] sm:text-[2.75rem]">
        Documentation
      </h1>
      <p className="mt-4 max-w-xl text-md leading-relaxed text-muted">
        Everything the CLI does, how to run your own edge, and what the public
        service will and will not do.
      </p>

      <div className="mt-10 space-y-8">
        {docGroups.map((group) => (
          <section key={group}>
            <p className="mb-3 text-2xs font-medium tracking-wide text-faint uppercase">{group}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {docPages
                .filter((p) => p.group === group)
                .map((page) => (
                  <Link
                    key={page.slug}
                    href={`/docs/${page.slug}`}
                    className="card group flex flex-col p-5"
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="text-base font-medium">{page.title}</span>
                      <ArrowUpRight className="size-4 text-faint transition-colors group-hover:text-ink" />
                    </span>
                    <span className="mt-1.5 text-sm leading-relaxed text-muted">
                      {page.description}
                    </span>
                  </Link>
                ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-14 border-t border-line pt-10 [&>h1]:hidden">
        <DocsMarkdown content={content} />
      </div>
    </DocsShell>
  );
}
