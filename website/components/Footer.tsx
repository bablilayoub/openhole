import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-neutral-900 py-12">
      <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-2 text-white font-semibold tracking-tight">
          OpenHole
        </div>
        
        <div className="flex items-center gap-6 text-sm text-neutral-500">
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms & Abuse
          </Link>
          <a href="https://github.com/bablilayoub/openhole#self-hosting" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            Self-host
          </a>
          <a href="mailto:abuse@openhole.dev" className="hover:text-white transition-colors">
            abuse@openhole.dev
          </a>
        </div>

      </div>
    </footer>
  );
}
