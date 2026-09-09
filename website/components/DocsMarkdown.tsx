import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { ArrowUpRight } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
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

const linkClass =
  "font-medium text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-ink";

export function DocsMarkdown({ content, basePath = "/docs" }: DocsMarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSlug]}
      components={{
        h1: ({ children }) => (
          <h1 className="mb-4 text-[2.25rem] leading-[1.1] font-medium tracking-[-0.03em] text-ink sm:text-[2.75rem]">
            {children}
          </h1>
        ),
        h2: ({ children, id }) => (
          <h2
            id={id}
            className="docs-heading group mt-14 mb-4 text-2xl font-medium tracking-[-0.02em] text-ink"
          >
            {children}
          </h2>
        ),
        h3: ({ children, id }) => (
          <h3
            id={id}
            className="docs-heading mt-9 mb-3 text-lg font-medium tracking-[-0.01em] text-ink"
          >
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="mb-4 text-base leading-relaxed text-muted">{children}</p>
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
                className={linkClass}
              >
                {children}
              </a>
            );
          }
          return (
            <Link href={resolved || "#"} className={linkClass}>
              {children}
            </Link>
          );
        },
        ul: ({ children }) => (
          <ul className="mb-4 list-disc space-y-1.5 pl-5 text-base text-muted marker:text-faint">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-4 list-decimal space-y-1.5 pl-5 text-base text-muted marker:text-faint">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        strong: ({ children }) => <strong className="font-medium text-ink">{children}</strong>,
        code: ({ className, children }) => {
          const isBlock = className?.includes("language-");
          if (isBlock) return <code className={className}>{children}</code>;
          return (
            <code className="rounded-md border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre className="docs-pre window mb-6 overflow-x-auto bg-terminal p-4 font-mono text-sm leading-relaxed text-terminal-fg">
            {children}
          </pre>
        ),
        table: ({ children }) => (
          <div className="docs-table-wrap mb-6 overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[32rem] text-left text-sm">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-surface-2/60">{children}</thead>,
        th: ({ children }) => (
          <th className="px-4 py-2.5 text-xs font-medium text-muted">{children}</th>
        ),
        td: ({ children }) => (
          <td className="border-t border-line px-4 py-3 align-top text-muted [&_code]:whitespace-nowrap">{children}</td>
        ),
        hr: () => <hr className="my-10 border-line" />,
        blockquote: ({ children }) => (
          <blockquote className="mb-4 rounded-r-lg border-l-2 border-accent/60 bg-surface py-3 pr-4 pl-4 text-muted [&>p]:mb-0">
            {children}
          </blockquote>
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
      className={buttonClasses("ghost", "sm", "-mr-3")}
    >
      Edit on GitHub
      <ArrowUpRight className="size-3.5" />
    </a>
  );
}
