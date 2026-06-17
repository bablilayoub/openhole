import fs from "fs";
import path from "path";

export type DocMeta = {
  slug: string;
  title: string;
  description: string;
};

const contentDir = path.join(process.cwd(), "content", "docs");

export const docPages: DocMeta[] = [
  {
    slug: "getting-started",
    title: "Getting started",
    description: "Install OpenHole and expose your first local port in under a minute.",
  },
  {
    slug: "installation",
    title: "Installation",
    description: "macOS, Linux, Windows, Homebrew, Scoop, apt, and build from source.",
  },
  {
    slug: "usage",
    title: "CLI usage",
    description: "Ports, subdomains, multi-tunnel, config file, and registration tokens.",
  },
  {
    slug: "commands",
    title: "Commands",
    description: "status, logs, update, uninstall, and all CLI flags.",
  },
  {
    slug: "websocket",
    title: "WebSocket passthrough",
    description: "HMR, live reload, and Socket.IO through the tunnel.",
  },
  {
    slug: "configuration",
    title: "Configuration",
    description: "Flags, environment variables, config.yaml, and server settings.",
  },
  {
    slug: "self-hosting",
    title: "Self-hosting",
    description: "Docker Compose, Caddy, DNS, and registration tokens.",
  },
  {
    slug: "security",
    title: "Security",
    description: "Threat model, limits, tokens, and abuse reporting.",
  },
  {
    slug: "package-managers",
    title: "Package managers",
    description: "Homebrew, Scoop, Debian packages, and release assets.",
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

export function getDocIndexContent(): string {
  const file = path.join(contentDir, "README.md");
  return fs.readFileSync(file, "utf8");
}
