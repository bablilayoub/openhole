/** Fixed nav height + top padding — keep in sync with scroll-margin-top in globals.css */
export const NAV_SCROLL_OFFSET = 88;

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function scrollToTop(): void {
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
}

export function scrollToSection(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;

  const top = el.getBoundingClientRect().top + window.scrollY - NAV_SCROLL_OFFSET;
  window.scrollTo({
    top,
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
}

export function hashHref(hash: `#${string}`, pathname: string): `/${string}` | `#${string}` {
  return pathname === "/" ? hash : (`/${hash}` as `/${string}`);
}
