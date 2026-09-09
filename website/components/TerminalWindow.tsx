"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Window } from "@/components/ui/Window";
import type { LogEntry } from "@/lib/fixtures";
import { cn } from "@/lib/utils";

type TerminalWindowProps = {
  command: string;
  version: string;
  url: string;
  port: number;
  log: LogEntry[];
  className?: string;
};

type Phase = "typing" | "connecting" | "ready";

const TYPE_MS = 50;
const CONNECT_MS = 600;
const ROW_EVERY_MS = 1300;
const MAX_ROWS = 7;

/** Mirrors internal/client/logger.go — the CLI cuts paths at 20 columns. */
function truncatePath(path: string, max = 20) {
  return path.length <= max ? path : path.slice(0, max - 1) + "…";
}

function statusTone(status: number) {
  if (status >= 400) return "text-warn";
  if (status >= 300) return "text-accent";
  return "text-live";
}

export function TerminalWindow({
  command,
  version,
  url,
  port,
  log,
  className,
}: TerminalWindowProps) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("typing");
  const [typed, setTyped] = useState("");
  const [rows, setRows] = useState<(LogEntry & { id: number })[]>([]);

  useEffect(() => {
    if (reduced) return;
    let i = 0;
    let type: number | undefined;
    const start = window.setTimeout(() => {
      type = window.setInterval(() => {
        i += 1;
        setTyped(command.slice(0, i));
        if (i >= command.length) {
          window.clearInterval(type);
          setPhase("connecting");
        }
      }, TYPE_MS);
    }, 700);
    return () => {
      window.clearTimeout(start);
      if (type) window.clearInterval(type);
    };
  }, [command, reduced]);

  useEffect(() => {
    if (phase !== "connecting") return;
    const t = window.setTimeout(() => setPhase("ready"), CONNECT_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "ready" || reduced) return;
    let n = 0;
    const tick = () => {
      const entry = log[n % log.length];
      const id = n;
      n += 1;
      setRows((prev) => [...prev, { ...entry, id }].slice(-MAX_ROWS));
    };
    tick();
    const interval = window.setInterval(tick, ROW_EVERY_MS);
    return () => window.clearInterval(interval);
  }, [phase, log, reduced]);

  // Reduced motion: skip the animation and show the finished session.
  const ready = reduced || phase === "ready";
  const shownTyped = reduced ? command : typed;
  const shownRows = reduced ? log.slice(0, 5).map((entry, id) => ({ ...entry, id })) : rows;

  return (
    <Window variant="terminal" title="openhole — zsh" className={className}>
      <div className="h-[21rem] p-5 font-mono text-sm leading-6 sm:p-6" aria-hidden>
        <p>
          <span className="text-white/35">$ </span>
          <span>{shownTyped}</span>
          {!ready ? (
            <span className="ml-px inline-block h-[1.05em] w-[0.55ch] translate-y-[0.15em] bg-terminal-fg animate-blink" />
          ) : null}
        </p>

        {phase === "connecting" ? (
          <p className="mt-4 text-white/35">connecting…</p>
        ) : null}

        {ready ? (
          <>
            <p className="mt-4 text-white/60">OpenHole {version}</p>
            <p className="mt-4">
              <span className="text-live">✓</span> Tunnel ready
            </p>
            <p>
              <span className="text-white/35">→ </span>
              <span className="text-accent">{url}</span>
            </p>
            <p className="text-white/60">
              <span className="text-white/35">→ </span>
              forwarding to http://localhost:{port}
            </p>
            <p className="mt-4 text-white/35">Requests:</p>
            <ol className="whitespace-pre">
              {shownRows.map((row) => (
                <li key={row.id} className="animate-[rise_.35s_ease-out_both]">
                  <span className="inline-block w-[5ch]">{row.method}</span>
                  <span className="inline-block w-[21ch] text-white/80">
                    {truncatePath(row.path)}
                  </span>
                  <span className={cn("tnum inline-block w-[3ch] text-right", statusTone(row.status))}>
                    {row.status}
                  </span>
                  <span className="tnum text-white/35">{"  "}{row.ms}ms</span>
                </li>
              ))}
            </ol>
          </>
        ) : null}
      </div>
    </Window>
  );
}
