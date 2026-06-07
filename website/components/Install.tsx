export function Install() {
  return (
    <section id="install">
      <div className="container">
        <h2>Install</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "1rem", fontSize: "0.9375rem" }}>
          Production install:
        </p>
        <div className="code-block" style={{ marginBottom: "1.5rem" }}>
          curl -fsSL https://openhole.dev/install.sh | sh
        </div>
        <p style={{ color: "var(--text-muted)", marginBottom: "1rem", fontSize: "0.9375rem" }}>
          Or with Go:
        </p>
        <div className="code-block">
          go install github.com/bablilayoub/openhole/cmd/openhole@latest
        </div>
      </div>
    </section>
  );
}
