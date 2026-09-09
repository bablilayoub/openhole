import {
  cliVersion,
  githubReleases,
  githubRepo,
  installPs1Url,
  scriptUrl,
} from "@/lib/site";

/* ── Hero ────────────────────────────────────────────────── */

export const hero = {
  badge: `v${cliVersion} — Basic Auth and WebSocket passthrough`,
  title: "Expose localhost with one command.",
  subtitle:
    "OpenHole gives any local port a public HTTPS URL. No account, no dashboard, one static binary that gets out of your way.",
};

export type WorksWithItem = { name: string; icon?: string };

/** `icon` is a simple-icons export name; items without one render as a wordmark. */
export const worksWith: WorksWithItem[] = [
  { name: "Next.js", icon: "siNextdotjs" },
  { name: "Vite", icon: "siVite" },
  { name: "Socket.IO", icon: "siSocketdotio" },
  { name: "Stripe", icon: "siStripe" },
  { name: "GitHub", icon: "siGithub" },
  { name: "Clerk", icon: "siClerk" },
  { name: "Discord", icon: "siDiscord" },
  { name: "Shopify", icon: "siShopify" },
];

/* ── Features ────────────────────────────────────────────── */

export type FeatureFragment = "hmr" | "auth" | "subdomain";

export type Feature = {
  id: FeatureFragment;
  title: string;
  description: string;
  command: string;
  href: string;
};

export const features: Feature[] = [
  {
    id: "hmr",
    title: "WebSocket passthrough",
    description:
      "HMR, Vite, Socket.IO and anything long-lived survive the tunnel. Your dev server behaves exactly as it does on localhost.",
    command: "openhole 5173",
    href: "/docs/websocket",
  },
  {
    id: "auth",
    title: "Basic Auth in one flag",
    description:
      "Lock the public URL before you send it. The edge checks credentials; your app never sees them.",
    command: "openhole 3000 --auth demo:secret",
    href: "/docs/security",
  },
  {
    id: "subdomain",
    title: "Named subdomains",
    description:
      "A stable URL you can put in a webhook config. A reclaim token gets it back after a disconnect, even from a new IP.",
    command: "openhole 3000 --subdomain myapp",
    href: "/docs/usage",
  },
];

/* ── Operate ─────────────────────────────────────────────── */

export type OperateFragment = "status" | "selfhost";

export type OperateRow = {
  id: OperateFragment;
  title: string;
  description: string;
  bullets: { command: string; note: string }[];
  href: string;
  /** Put the visual on the left instead of the right. */
  flip?: boolean;
};

export const operate: OperateRow[] = [
  {
    id: "status",
    title: "Several ports. One process.",
    description:
      "Front end, API and worker at once, each on its own subdomain. Status and request logs from another terminal while it runs.",
    bullets: [
      { command: "openhole 3000 8080", note: "one tunnel per port" },
      { command: "openhole status", note: "pid, URL, uptime" },
      { command: "openhole logs -f --json", note: "pipe requests anywhere" },
    ],
    href: "/docs/commands",
  },
  {
    id: "selfhost",
    title: "Self-host the whole edge.",
    description:
      "Docker Compose, Caddy and a wildcard certificate over DNS-01. The same binary talks to your server with one flag.",
    bullets: [
      { command: "docker compose up -d --build", note: "the entire edge" },
      { command: "REGISTRATION_TOKENS=team-secret", note: "who may register" },
      { command: "openhole 3000 --server wss://…", note: "point the CLI at it" },
    ],
    href: "/docs/self-hosting",
    flip: true,
  },
];

/* ── Install ─────────────────────────────────────────────── */

export type InstallTarget = {
  id: string;
  label: string;
  prompt: string;
  command: string;
};

export const installTargets: InstallTarget[] = [
  {
    id: "unix",
    label: "macOS / Linux",
    prompt: "$",
    command: `curl -fsSL ${scriptUrl("install")} | sh`,
  },
  {
    id: "windows",
    label: "Windows",
    prompt: ">",
    command: `irm ${installPs1Url()} | iex`,
  },
];

/* ── CTA ─────────────────────────────────────────────────── */

export const cta = {
  title: "Your next demo link is one command away.",
  subtitle: "Free, MIT licensed, self-hostable the day you outgrow the public edge.",
};

/* ── Footer ──────────────────────────────────────────────── */

export type FooterLink = { href: string; label: string; external?: boolean };

export const footerGroups: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { href: "/docs/getting-started", label: "Getting started" },
      { href: "/docs/usage", label: "CLI usage" },
      { href: "/docs/commands", label: "Commands" },
      { href: "/docs/configuration", label: "Configuration" },
      { href: "/docs/websocket", label: "WebSocket passthrough" },
    ],
  },
  {
    title: "Operate",
    links: [
      { href: "/docs/installation", label: "Installation" },
      { href: "/docs/package-managers", label: "Package managers" },
      { href: "/docs/self-hosting", label: "Self-hosting" },
      { href: "/docs/security", label: "Security" },
    ],
  },
  {
    title: "Project",
    links: [
      { href: githubRepo, label: "GitHub", external: true },
      { href: githubReleases, label: "Releases", external: true },
      { href: "/terms", label: "Terms" },
    ],
  },
];
