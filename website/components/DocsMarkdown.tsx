import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { githubRepo } from "@/lib/site";

type DocsMarkdownProps = {
  content: string;
  basePath?: string;
};

function resolveHref(href: string | undefined, basePath: string): string | undefined {
  if (!href) return href;
  if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("#")) {
    return href;
  }
  if (href.endsWith(".md")) {
    const slug = href.replace(/\.md$/, "").replace(/^\.\//, "");
    if (slug === "README") return basePath;
    return `${basePath}/${slug}`;
  }
  return href;
}

export function DocsMarkdown({ content, basePath = "/docs" }: DocsMarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="docs-heading mt-12 mb-4 text-2xl font-semibold tracking-tight text-white">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="docs-heading mt-8 mb-3 text-lg font-semibold text-white">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="mb-4 text-base leading-relaxed text-neutral-400">{children}</p>
        ),
        a: ({ href, children }) => {
          const resolved = resolveHref(href, basePath);
          const external = resolved?.startsWith("http") || resolved?.startsWith("mailto:");
          if (external) {
            return (
              <a
                href={resolved}
                target={resolved?.startsWith("http") ? "_blank" : undefined}
                rel={resolved?.startsWith("http") ? "noopener noreferrer" : undefined}
                className="font-medium text-white underline decoration-white/20 underline-offset-4 transition-colors hover:text-cyan hover:decoration-cyan/40"
              >
                {children}
              </a>
            );
          }
          return (
            <Link
              href={resolved || "#"}
              className="font-medium text-white underline decoration-white/20 underline-offset-4 transition-colors hover:text-cyan hover:decoration-cyan/40"
            >
              {children}
            </Link>
          );
        },
        ul: ({ children }) => (
          <ul className="mb-4 list-disc space-y-2 pl-6 text-neutral-400">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-4 list-decimal space-y-2 pl-6 text-neutral-400">{children}</ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        strong: ({ children }) => <strong className="font-semibold text-neutral-200">{children}</strong>,
        code: ({ className, children }) => {
          const isBlock = className?.includes("language-");
          if (isBlock) {
            return <code className={className}>{children}</code>;
          }
          return (
            <code className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-sm text-cyan">
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre className="docs-pre mb-6 overflow-x-auto rounded-xl border border-white/[0.06] bg-void p-4 font-mono text-sm leading-relaxed text-neutral-300">
            {children}
          </pre>
        ),
        table: ({ children }) => (
          <div className="docs-table-wrap mb-6 overflow-x-auto rounded-xl border border-white/[0.06]">
            <table className="w-full min-w-[32rem] text-left text-sm">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="border-b border-white/[0.06] bg-surface">{children}</thead>,
        th: ({ children }) => (
          <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-neutral-500">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border-t border-white/[0.04] px-4 py-3 text-neutral-400">{children}</td>
        ),
        hr: () => <hr className="my-10 border-white/[0.06]" />,
        blockquote: ({ children }) => (
          <blockquote className="mb-4 border-l-2 border-cyan/40 pl-4 text-neutral-400">{children}</blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export function DocsGitHubLink({ slug }: { slug?: string }) {
  const file = slug ? `${slug}.md` : "README.md";
  return (
    <a
      href={`${githubRepo}/blob/main/docs/${file}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm text-neutral-500 transition-colors hover:text-white"
    >
      Edit on GitHub
    </a>
  );
}
