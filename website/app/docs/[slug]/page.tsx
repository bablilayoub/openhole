import { notFound } from "next/navigation";
import { DocsGitHubLink, DocsMarkdown } from "@/components/DocsMarkdown";
import { DocsShell } from "@/components/DocsShell";
import {
  docPages,
  getDocContent,
  getDocHeadings,
  getDocMeta,
  getDocSlugs,
} from "@/lib/docs";

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
  return { title: meta.title, description: meta.description };
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const meta = getDocMeta(slug);
  if (!meta) notFound();

  const content = getDocContent(slug);
  const headings = getDocHeadings(content);
  const index = docPages.findIndex((p) => p.slug === slug);
  const prev = index > 0 ? docPages[index - 1] : null;
  const next = index < docPages.length - 1 ? docPages[index + 1] : null;

  return (
    <DocsShell
      activeSlug={slug}
      title={meta.title}
      headings={headings}
      actions={<DocsGitHubLink slug={slug} />}
      prev={prev}
      next={next}
    >
      <DocsMarkdown content={content} />
    </DocsShell>
  );
}
