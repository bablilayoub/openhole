import { Lock } from "lucide-react";
import { Window } from "@/components/ui/Window";
import type { WebhookEvent } from "@/lib/fixtures";

type BrowserWindowProps = {
  host: string;
  events: WebhookEvent[];
  className?: string;
};

/** Static mock of the tunneled app, open in a browser at the public URL. */
export function BrowserWindow({ host, events, className }: BrowserWindowProps) {
  return (
    <Window
      className={className}
      aria-hidden
      toolbar={
        <div className="ml-2 flex h-6 flex-1 items-center gap-1.5 rounded-md bg-surface-2 px-2.5 font-mono text-2xs text-muted">
          <Lock className="size-3 text-live" />
          <span className="text-ink/80">{host}</span>
          <span>/webhooks</span>
        </div>
      }
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Webhooks</p>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2 py-0.5 text-2xs text-muted">
            <span className="size-1.5 rounded-full bg-live" />
            Live
          </span>
        </div>

        <ul className="mt-3 divide-y divide-line rounded-lg border border-line">
          {events.map((e) => (
            <li key={`${e.source}-${e.event}`} className="flex items-center gap-3 px-3 py-2">
              <span className="w-12 shrink-0 font-mono text-2xs text-muted">{e.source}</span>
              <span className="min-w-0 flex-1 truncate font-mono text-2xs text-ink/85">
                {e.event}
              </span>
              <span className="tnum font-mono text-2xs text-live">{e.status}</span>
              <span className="tnum w-7 text-right text-2xs text-faint">{e.ago}</span>
            </li>
          ))}
        </ul>

        <p className="mt-3 text-2xs text-faint">
          {events.length * 3} received · 0 failed · via {host}
        </p>
      </div>
    </Window>
  );
}
