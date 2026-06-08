const DEFAULT_SITE_URL = "https://openhole.dev";

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  return configured || DEFAULT_SITE_URL;
}

export const tunnelDomain =
  process.env.NEXT_PUBLIC_TUNNEL_DOMAIN || "ophl.link";

export const githubRepo = "https://github.com/bablilayoub/openhole";

export function scriptPath(name: "install" | "uninstall"): string {
  return `/${name}.sh`;
}

export function scriptUrl(name: "install" | "uninstall"): string {
  return `${getSiteUrl()}${scriptPath(name)}`;
}
