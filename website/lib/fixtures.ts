import { tunnelDomain } from "@/lib/site";

/*
 * Mock data for the product UI on the landing page.
 * Marketing copy lives in content.ts; nothing here is user-facing prose.
 */

export const demoUrl = `https://blue-fox.${tunnelDomain}`;
export const demoPort = 3000;
export const firstRun = `openhole ${demoPort}`;

export type LogEntry = {
  method: "GET" | "POST" | "PUT" | "DELETE" | "WS";
  path: string;
  status: number;
  ms: number;
};

/** Cycled through in the hero terminal. Shaped like a Next.js app taking webhooks. */
export const sessionLog: LogEntry[] = [
  { method: "GET", path: "/", status: 200, ms: 14 },
  { method: "GET", path: "/_next/static/chunks/main.js", status: 200, ms: 3 },
  { method: "WS", path: "/_next/webpack-hmr", status: 101, ms: 1 },
  { method: "GET", path: "/api/health", status: 200, ms: 1 },
  { method: "POST", path: "/api/webhooks/stripe", status: 200, ms: 38 },
  { method: "GET", path: "/dashboard", status: 200, ms: 22 },
  { method: "POST", path: "/api/auth/callback", status: 302, ms: 9 },
  { method: "GET", path: "/favicon.ico", status: 404, ms: 0 },
  { method: "GET", path: "/api/orders?limit=20", status: 200, ms: 31 },
  { method: "POST", path: "/api/webhooks/github", status: 200, ms: 17 },
];

export type WebhookEvent = {
  source: string;
  event: string;
  status: number;
  ago: string;
};

/** Inside the browser-window mock: the app receiving what the tunnel forwards. */
export const webhookEvents: WebhookEvent[] = [
  { source: "stripe", event: "payment_intent.succeeded", status: 200, ago: "2s" },
  { source: "github", event: "push", status: 200, ago: "14s" },
  { source: "clerk", event: "user.created", status: 200, ago: "41s" },
  { source: "stripe", event: "invoice.paid", status: 200, ago: "1m" },
];

/** Shown in the status fragment. */
export const statusOutput = {
  version: "0.3.0",
  tunnels: [
    { pid: 41822, port: 3000, url: `https://myapp.${tunnelDomain}`, uptime: "12m 04s" },
    { pid: 41823, port: 8080, url: `https://quiet-owl.${tunnelDomain}`, uptime: "12m 04s" },
  ],
  saved: ["myapp"],
};

/** Shown in the self-host fragment. */
export const envFile = [
  ["PUBLIC_TUNNEL_DOMAIN", tunnelDomain],
  ["TUNNEL_ENDPOINT_HOST", "tunnel.yourdomain.com"],
  ["CADDY_ACME_EMAIL", "admin@yourdomain.com"],
  ["REGISTRATION_TOKENS", "team-secret"],
  ["TRUST_PROXY_HEADERS", "true"],
] as const;
