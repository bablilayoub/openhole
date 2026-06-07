export function Hero() {
  return (
    <section style={{ paddingTop: "6rem", paddingBottom: "2rem" }}>
      <div className="container">
        <p
          style={{
            fontSize: "0.75rem",
            color: "var(--accent)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          Developer tunnels
        </p>
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 2.75rem)",
            fontWeight: 600,
            lineHeight: 1.15,
            marginBottom: "1.25rem",
            letterSpacing: "-0.02em",
          }}
        >
          Open localhost to the internet in one command.
        </h1>
        <p
          style={{
            fontSize: "1.0625rem",
            color: "var(--text-muted)",
            maxWidth: "32rem",
            marginBottom: "2rem",
          }}
        >
          OpenHole is a fast, clean, no-login tunnel for developers. No accounts.
          No auth tokens. No config. Just run it.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <a href="#install" className="btn btn-primary">
            Install
          </a>
          <a
            href="https://github.com/bablilayoub/openhole"
            className="btn btn-ghost"
            target="_blank"
            rel="noopener noreferrer"
          >
            View GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
