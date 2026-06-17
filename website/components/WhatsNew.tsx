import { githubReleases } from "@/lib/site";

const highlights = [
  "WebSocket passthrough for Next.js HMR & Vite",
  "Binary frame relay on the control tunnel",
  "Up to 10 concurrent WS streams per tunnel",
];

export function WhatsNew() {
  return (
    <section id="whats-new" className="relative border-y border-white/[0.06] bg-[#050505]">
      <div className="page-container py-16 sm:py-20">
        <div className="p-8 sm:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl pl-1">
              <span className="badge-new">v0.2.0 is here</span>
              <h2 className="mb-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Real-time dev,{" "}
                <span className="text-gradient">through the hole.</span>
              </h2>
              <p className="text-base leading-relaxed text-neutral-400 sm:text-lg">
                The biggest gap in v0.1 is closed. WebSocket upgrades now relay
                end-to-end — hot reload, Socket.io, and live APIs work through
                your public tunnel URL.
              </p>
            </div>

            <div className="flex flex-col gap-6 lg:items-end">
              <ul className="space-y-2.5">
                {highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 text-sm text-neutral-300 sm:text-base"
                  >
                    <span className="text-accent shrink-0">→</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={githubReleases}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full px-6 py-2.5 text-sm sm:w-auto"
              >
                Release notes
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
