import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t-2 border-ink">
      <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-16 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs text-muted">
        <span>© {new Date().getFullYear()} OpenHole — MIT</span>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/terms" className="hover:text-ink transition-colors">
            Terms
          </Link>
          <a
            href="https://github.com/bablilayoub/openhole#self-hosting"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink transition-colors"
          >
            Self-host
          </a>
          <a href="mailto:abuse@openhole.dev" className="hover:text-hole transition-colors">
            abuse@openhole.dev
          </a>
        </div>
      </div>
    </footer>
  );
}
