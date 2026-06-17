import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { DocsSidebar } from "@/components/DocsSidebar";
import { DocsGitHubLink, DocsMarkdown } from "@/components/DocsMarkdown";
import { docPages, getDocContent, getDocMeta, getDocSlugs } from "@/lib/docs";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getDocSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const meta = getDocMeta(slug);
  if (!meta) return {};
  return {
    title: `${meta.title} — OpenHole Docs`,
    description: meta.description,
  };
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const meta = getDocMeta(slug);
  if (!meta) notFound();

  const content = getDocContent(slug);
  const index = docPages.findIndex((p) => p.slug === slug);
  const prev = index > 0 ? docPages[index - 1] : null;
  const next = index < docPages.length - 1 ? docPages[index + 1] : null;

  return (
    <>
      <Nav />
      <main className="min-h-[80vh] pb-24 pt-28 sm:pt-36">
        <div className="page-container">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/docs"
              className="text-sm text-neutral-500 transition-colors hover:text-white"
            >
              ← Documentation
            </Link>
            <DocsGitHubLink slug={slug} />
          </div>

          <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
            <aside className="lg:w-56 lg:shrink-0">
              <div className="lg:sticky lg:top-28">
                <DocsSidebar activeSlug={slug} />
              </div>
            </aside>

            <article className="docs-content min-w-0 flex-1 max-w-3xl">
              <DocsMarkdown content={content} />
            </article>
          </div>

          {(prev || next) && (
            <div className="mt-16 flex flex-col gap-4 border-t border-white/[0.06] pt-8 sm:flex-row sm:justify-between">
              {prev ? (
                <Link
                  href={`/docs/${prev.slug}`}
                  className="text-sm text-neutral-400 transition-colors hover:text-white"
                >
                  ← {prev.title}
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link
                  href={`/docs/${next.slug}`}
                  className="text-sm text-neutral-400 transition-colors hover:text-white sm:text-right"
                >
                  {next.title} →
                </Link>
              ) : null}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
