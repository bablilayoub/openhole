const DEFAULT_SITE_URL = "https://openhole.dev";

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  return configured || DEFAULT_SITE_URL;
}

export const tunnelDomain =
  process.env.NEXT_PUBLIC_TUNNEL_DOMAIN || "ophl.link";

export const githubRepo = "https://github.com/bablilayoub/openhole";

export const githubReleases = `${githubRepo}/releases`;

export const cliVersion = "0.2.1";

export function isGitHubReferrer(referrer: string): boolean {
  if (!referrer) return false;
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    return host === "github.com" || host.endsWith(".github.com");
  } catch {
    return false;
  }
}

export function scriptPath(name: "install" | "uninstall"): string {
  return `/${name}.sh`;
}

export function scriptUrl(name: "install" | "uninstall"): string {
  return `${getSiteUrl()}${scriptPath(name)}`;
}

export function installPs1Url(): string {
  return `${getSiteUrl()}/install.ps1`;
}
