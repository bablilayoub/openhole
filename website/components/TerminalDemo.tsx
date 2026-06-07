const domain = process.env.NEXT_PUBLIC_TUNNEL_DOMAIN || "ophl.link";

export function TerminalDemo() {
  return (
    <section>
      <div className="container">
        <div className="terminal">
          <div>
            <span className="prompt">$ </span>openhole 3000
          </div>
          <br />
          <div className="success">✓ Tunnel ready</div>
          <div>
            → <span className="url">https://blue-fox.{domain}</span>
          </div>
          <div>→ forwarding to http://localhost:3000</div>
          <br />
          <div style={{ color: "var(--text-muted)" }}>Requests:</div>
          <div>GET / 200 18ms</div>
        </div>
      </div>
    </section>
  );
}
