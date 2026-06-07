const domain = process.env.NEXT_PUBLIC_TUNNEL_DOMAIN || "ophl.link";

export function TerminalDemo() {
  return (
    <div className="terminal-wrap">
      <div className="terminal-glow" aria-hidden />
      <div className="terminal">
        <div className="terminal-bar">
          <span className="terminal-dot red" />
          <span className="terminal-dot yellow" />
          <span className="terminal-dot green" />
          <span className="terminal-title">openhole — zsh</span>
        </div>
        <div className="terminal-body">
          <div>
            <span className="prompt">$ </span>
            <span className="cmd">openhole 3000</span>
          </div>
          <br />
          <div className="success">✓ Tunnel ready</div>
          <div>
            → <span className="url">https://blue-fox.{domain}</span>
          </div>
          <div className="dim">→ forwarding to http://localhost:3000</div>
          <br />
          <div className="dim">Requests:</div>
          <div>
            <span className="dim">GET </span>/{" "}
            <span className="success">200</span>{" "}
            <span className="dim">18ms</span>
          </div>
          <div>
            <span className="prompt">$ </span>
            <span className="cursor" />
          </div>
        </div>
      </div>
    </div>
  );
}
