import { Check, Lock } from "lucide-react";
import { Window } from "@/components/ui/Window";
import { envFile, statusOutput } from "@/lib/fixtures";
import { tunnelDomain } from "@/lib/site";

/*
 * Small static UI mocks that live inside feature cards.
 * Deliberately cropped by their containers, Linear-style.
 */

export function HmrFragment() {
  return (
    <div className="absolute inset-x-6 top-7">
      <Window variant="terminal" size="sm" title="vite — zsh">
        <div className="p-3.5 font-mono text-2xs leading-5">
          <p className="whitespace-pre">
            <span className="inline-block w-[5ch]">WS</span>
            <span className="inline-block w-[19ch] text-white/80">/</span>
            <span className="text-live">101</span>
            <span className="text-white/35">  1ms</span>
          </p>
          <p className="text-white/60">
            <span className="text-accent">[vite]</span> connected.
          </p>
          <p className="text-white/60">
            <span className="text-accent">[vite]</span> hmr update /src/App.tsx
          </p>
          <p className="text-white/60">
            <span className="text-accent">[vite]</span> hmr update /src/index.css
          </p>
          <p className="whitespace-pre">
            <span className="inline-block w-[5ch]">GET</span>
            <span className="inline-block w-[19ch] text-white/80">/src/App.tsx</span>
            <span className="text-live">200</span>
            <span className="text-white/35">  4ms</span>
          </p>
        </div>
      </Window>
    </div>
  );
}

export function AuthFragment() {
  return (
    <div className="absolute inset-x-0 top-6 flex justify-center px-6">
      <Window className="w-full max-w-[17rem]">
        <div className="p-4">
          <div className="flex items-center gap-2">
            <Lock className="size-3.5 text-muted" />
            <p className="text-sm font-medium">Sign in</p>
          </div>
          <p className="mt-1 truncate font-mono text-2xs text-muted">
            https://demo.{tunnelDomain}
          </p>
          <div className="mt-3 space-y-2">
            <div className="flex h-8 items-center rounded-md border border-line bg-void px-2.5 text-xs">
              demo
            </div>
            <div className="flex h-8 items-center rounded-md border border-line bg-void px-2.5 text-xs tracking-[0.2em]">
              ••••••••
            </div>
          </div>
          <div className="mt-3 flex h-8 items-center justify-center rounded-md bg-ink text-xs font-medium text-void">
            Sign in
          </div>
        </div>
      </Window>
    </div>
  );
}

export function SubdomainFragment() {
  return (
    <div className="absolute inset-x-6 top-9">
      <div className="flex h-9 items-center gap-2 rounded-lg border border-line bg-surface px-3 font-mono text-xs shadow-sm">
        <Lock className="size-3 text-live" />
        <span className="text-ink">myapp.{tunnelDomain}</span>
        <span className="text-faint">/</span>
      </div>
      <div className="mt-4 ml-6 flex items-start gap-2.5 rounded-lg border border-line bg-surface p-3 shadow-sm">
        <span className="mt-0.5 flex size-4 items-center justify-center rounded-full bg-live/15">
          <Check className="size-2.5 text-live" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-medium">Subdomain reserved</p>
          <p className="mt-0.5 truncate font-mono text-2xs text-muted">
            reclaim token → ~/.config/openhole/reclaim.json
          </p>
        </div>
      </div>
    </div>
  );
}

export function StatusFragment() {
  return (
    <Window variant="terminal" size="sm" title="openhole — zsh">
      <div className="p-3.5 font-mono text-xs leading-[1.6]">
        <p>
          <span className="text-white/35">$ </span>openhole status
        </p>
        <p className="mt-2 font-medium">openhole v{statusOutput.version}</p>
        {statusOutput.tunnels.map((t) => (
          <div key={t.pid} className="mt-2">
            <p className="text-live">
              Tunnel running (pid {t.pid}, port {t.port})
            </p>
            <p className="whitespace-pre text-white/70">
              {"  "}<span className="text-white/35">URL:    </span>
              <span className="text-accent">{t.url}</span>
            </p>
            <p className="whitespace-pre text-white/70">
              {"  "}<span className="text-white/35">Local:  </span>http://localhost:{t.port}
            </p>
            <p className="whitespace-pre text-white/70">
              {"  "}<span className="text-white/35">Uptime: </span>{t.uptime}
            </p>
          </div>
        ))}
        <p className="mt-2 text-white/70">
          <span className="text-white/35">Saved subdomains: </span>
          {statusOutput.saved.join(", ")}
        </p>
      </div>
    </Window>
  );
}

export function SelfHostFragment() {
  return (
    <Window
      toolbar={
        <div className="flex flex-1 items-center justify-between">
          <span className="ml-1 font-mono text-2xs text-muted">deployments/.env</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2 py-0.5 text-2xs text-muted">
            <span className="size-1.5 rounded-full bg-live" />
            caddy · wildcard tls
          </span>
        </div>
      }
    >
      <ol className="p-3.5 font-mono text-xs leading-6">
        {envFile.map(([key, value], i) => (
          <li key={key} className="flex gap-4">
            <span className="tnum w-4 shrink-0 text-right text-faint">{i + 1}</span>
            <span className="min-w-0 truncate">
              <span className="text-accent">{key}</span>
              <span className="text-muted">=</span>
              <span className="text-ink/85">{value}</span>
            </span>
          </li>
        ))}
      </ol>
      <div className="border-t border-line px-3.5 py-2.5 font-mono text-2xs text-muted">
        <span className="text-faint">$ </span>docker compose up -d --build
      </div>
    </Window>
  );
}
