import fs from "fs";
import path from "path";
import GithubSlugger from "github-slugger";
import { toString } from "mdast-util-to-string";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";

export type DocGroup = "Start" | "Use" | "Operate";

export type DocMeta = {
  slug: string;
  title: string;
  description: string;
  group: DocGroup;
};

export type DocHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

const contentDir = path.join(process.cwd(), "content", "docs");

export const docGroups: DocGroup[] = ["Start", "Use", "Operate"];

export const docPages: DocMeta[] = [
  {
    slug: "getting-started",
    title: "Getting started",
    description: "Install OpenHole and expose your first local port in under a minute.",
    group: "Start",
  },
  {
    slug: "installation",
    title: "Installation",
    description: "macOS, Linux, Windows, Homebrew, Scoop, apt, and build from source.",
    group: "Start",
  },
  {
    slug: "package-managers",
    title: "Package managers",
    description: "Homebrew, Scoop, Debian packages, and release assets.",
    group: "Start",
  },
  {
    slug: "usage",
    title: "CLI usage",
    description: "Ports, subdomains, multi-tunnel, config file, and registration tokens.",
    group: "Use",
  },
  {
    slug: "commands",
    title: "Commands",
    description: "status, logs, update, uninstall, and all CLI flags.",
    group: "Use",
  },
  {
    slug: "websocket",
    title: "WebSocket passthrough",
    description: "HMR, live reload, and Socket.IO through the tunnel.",
    group: "Use",
  },
  {
    slug: "configuration",
    title: "Configuration",
    description: "Flags, environment variables, config.yaml, and server settings.",
    group: "Use",
  },
  {
    slug: "self-hosting",
    title: "Self-hosting",
    description: "Docker Compose, Caddy, DNS, and registration tokens.",
    group: "Operate",
  },
  {
    slug: "security",
    title: "Security",
    description: "Threat model, limits, tokens, and abuse reporting.",
    group: "Operate",
  },
];

export function getDocSlugs(): string[] {
  return docPages.map((p) => p.slug);
}

export function getDocMeta(slug: string): DocMeta | undefined {
  return docPages.find((p) => p.slug === slug);
}

export function getDocContent(slug: string): string {
  const file = path.join(contentDir, `${slug}.md`);
  return fs.readFileSync(file, "utf8");
}

/**
 * The docs index. The README's own "Guides" table is dropped because the
 * page renders the same list as cards above the content.
 */
export function getDocIndexContent(): string {
  const file = path.join(contentDir, "README.md");
  const raw = fs.readFileSync(file, "utf8");
  return raw.replace(/^## Guides[\s\S]*?(?=^---$)/m, "").replace(/^---\n\n---\n/m, "---\n");
}

/**
 * h2/h3 headings for the "On this page" list, parsed with the same remark
 * pipeline react-markdown uses and slugged with github-slugger — the same
 * library rehype-slug uses in DocsMarkdown, so ids always agree.
 */
export function getDocHeadings(content: string): DocHeading[] {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(content);
  const slugger = new GithubSlugger();
  const headings: DocHeading[] = [];

  for (const node of tree.children) {
    if (node.type !== "heading") continue;
    const text = toString(node);
    const id = slugger.slug(text); // slug every depth so counters match rehype-slug
    if (node.depth === 2 || node.depth === 3) {
      headings.push({ id, text, level: node.depth });
    }
  }
  return headings;
}
