"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const domain = process.env.NEXT_PUBLIC_TUNNEL_DOMAIN || "ophl.link";

export function TunnelDiagram() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to(".hole-core", {
        scale: 1.12,
        duration: 1.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".tunnel-packet", {
        left: "calc(100% - 12px)",
        duration: 2.6,
        stagger: 0.85,
        repeat: -1,
        ease: "none",
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="w-full border-2 border-ink bg-paper p-6 md:p-8">
      <div className="relative flex items-center gap-0 min-h-[88px]">
        <div className="shrink-0 border-2 border-ink bg-paper px-4 py-3 font-mono text-sm leading-tight z-10">
          <div>localhost</div>
          <div className="text-muted">:3000</div>
        </div>

        <div className="relative flex-1 h-px mx-2 md:mx-4">
          <div className="absolute inset-y-0 left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-line" />
          <div className="absolute left-[38%] right-[38%] top-1/2 -translate-y-1/2 h-1 bg-hole/30" />

          <div className="tunnel-packet absolute top-1/2 -translate-y-1/2 left-0 w-2.5 h-2.5 rounded-full bg-ink" />
          <div className="tunnel-packet absolute top-1/2 -translate-y-1/2 left-0 w-2.5 h-2.5 rounded-full bg-ink" />
          <div className="tunnel-packet absolute top-1/2 -translate-y-1/2 left-0 w-2.5 h-2.5 rounded-full bg-ink" />

          <div className="hole-core absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-hole flex items-center justify-center">
              <span className="font-mono text-[10px] md:text-xs font-semibold text-white tracking-widest">
                HOLE
              </span>
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-hole border-dashed scale-125 opacity-40" />
          </div>
        </div>

        <div className="shrink-0 border-2 border-ink bg-paper px-4 py-3 font-mono text-sm leading-tight z-10 text-right">
          <div>blue-fox</div>
          <div className="text-muted">.{domain}</div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-line flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-muted">
        <span>GET / <span className="text-ink">200</span> 18ms</span>
        <span>POST /api/webhooks <span className="text-ink">201</span> 42ms</span>
        <span className="text-hole font-medium">● tunnel active</span>
      </div>
    </div>
  );
}
