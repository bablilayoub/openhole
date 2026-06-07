"use client";

import { useEffect, useState } from "react";

const domain = process.env.NEXT_PUBLIC_TUNNEL_DOMAIN || "ophl.link";

export function TerminalDemo() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-b from-accent/30 to-transparent rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
      
      <div className="relative bg-terminal-bg border border-terminal-border rounded-2xl overflow-hidden shadow-2xl">
        {/* Window Chrome */}
        <div className="flex items-center px-4 py-3 bg-zinc-900/50 border-b border-terminal-border">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <div className="mx-auto text-xs text-zinc-500 font-mono">openhole — bash</div>
        </div>

        {/* Terminal Content */}
        <div className="p-6 font-mono text-sm leading-relaxed text-zinc-300">
          <div className="flex">
            <span className="text-zinc-500 mr-2">$</span>
            <span className="text-zinc-100">openhole 3000</span>
          </div>
          
          <div className="mt-4 text-accent font-semibold flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Tunnel ready
          </div>
          
          <div className="mt-2 grid grid-cols-[auto_1fr] gap-2">
            <span className="text-zinc-500">→</span>
            <span className="text-blue-400 hover:underline cursor-pointer">https://blue-fox.{domain}</span>
            
            <span className="text-zinc-500">→</span>
            <span className="text-zinc-400">forwarding to http://localhost:3000</span>
          </div>
          
          <div className="mt-6 text-zinc-500">Requests:</div>
          <div className="mt-1 flex gap-4">
            <span className="text-zinc-500">GET</span>
            <span className="text-zinc-300 flex-1">/</span>
            <span className="text-accent">200</span>
            <span className="text-zinc-500">18ms</span>
          </div>
          <div className="flex gap-4">
            <span className="text-zinc-500">POST</span>
            <span className="text-zinc-300 flex-1">/api/webhooks</span>
            <span className="text-accent">201</span>
            <span className="text-zinc-500">42ms</span>
          </div>
          
          <div className="mt-4 flex items-center">
            <span className="text-zinc-500 mr-2">$</span>
            <span className="w-2 h-4 bg-accent animate-pulse"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
