import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { DocsSidebar } from "@/components/DocsSidebar";
import { DocsGitHubLink, DocsMarkdown } from "@/components/DocsMarkdown";
import { getDocIndexContent } from "@/lib/docs";

export const metadata = {
  title: "Documentation — OpenHole",
  description:
    "OpenHole docs: install, CLI usage, WebSocket passthrough, config file, self-hosting, and more.",
};

export default function DocsIndexPage() {
  const content = getDocIndexContent();

  return (
    <>
      <Nav />
      <main className="min-h-[80vh] pb-24 pt-28 sm:pt-36">
        <div className="page-container">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/"
              className="text-sm text-neutral-500 transition-colors hover:text-white"
            >
              ← Back to home
            </Link>
            <DocsGitHubLink />
          </div>

          <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
            <aside className="lg:w-56 lg:shrink-0">
              <div className="lg:sticky lg:top-28">
                <DocsSidebar />
              </div>
            </aside>

            <article className="docs-content min-w-0 flex-1 max-w-3xl">
              <DocsMarkdown content={content} />
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
