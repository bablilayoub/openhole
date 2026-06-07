import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/50 bg-zinc-950 py-12 mt-20">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity">
          <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center">
            <span className="text-zinc-400 font-bold text-xs">O</span>
          </div>
          <span className="text-zinc-400 text-sm font-medium">OpenHole</span>
        </div>
        
        <div className="flex items-center gap-6 text-sm text-zinc-500">
          <Link href="/terms" className="hover:text-zinc-300 transition-colors">Terms</Link>
          <a href="https://github.com/bablilayoub/openhole" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 transition-colors">GitHub</a>
          <a href="mailto:abuse@openhole.dev" className="hover:text-zinc-300 transition-colors">abuse@openhole.dev</a>
        </div>
      </div>
    </footer>
  );
}
