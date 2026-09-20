import Link from "next/link";
import { Logo } from "@/components/Logo";
import { footerGroups } from "@/lib/content";
import { author, cliVersion } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="page-container grid gap-10 pt-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-3">
          <Logo iconClassName="h-6 w-6" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Localhost over HTTPS. One command, no account. MIT licensed.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3 lg:col-span-9">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <p className="eyebrow">{group.title}</p>
              <ul className="mt-4 space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-muted text-sm"
                      >
                        {link.label}
                        <span aria-hidden className="ml-0.5">↗</span>
                      </a>
                    ) : (
                      <Link href={link.href} className="link-muted text-sm">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Oversized wordmark. leading 0.78 puts the ascenders flush with the block's
          top edge; the bottom margin leaves the same gap under the descender. */}
      <div className="page-container mt-8 sm:mt-10" aria-hidden>
        <p className="pointer-events-none mb-[calc(0.22em+2rem)] font-medium text-[min(18.5vw,17.5rem)] leading-[0.78] tracking-[-0.05em] whitespace-nowrap text-ink/[0.05] select-none sm:mb-[calc(0.22em+2.5rem)]">
          openhole
        </p>
      </div>

      <div className="border-t border-line">
        <div className="page-container flex flex-col gap-2 py-5 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} OpenHole · MIT · v{cliVersion}
          </span>
          <span>
            Built by{" "}
            <a
              href={author.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink transition-colors hover:text-accent"
            >
              {author.name}
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
