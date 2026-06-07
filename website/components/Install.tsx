export function Install() {
  return (
    <section className="section" id="install">
      <div className="container container-narrow">
        <p className="section-label">Install</p>
        <h2 className="section-title">Ready in 10 seconds</h2>
        <div className="install-primary">
          <code>curl -fsSL https://openhole.dev/install.sh | sh</code>
        </div>
        <p className="section-desc" style={{ marginBottom: "1rem" }}>
          Or install with Go:
        </p>
        <div className="code-stack">
          <div className="code-block">
            <code>go install github.com/bablilayoub/openhole/cmd/openhole@latest</code>
          </div>
          <div className="code-block">
            <code>openhole 3000</code>
            <span className="hint">start tunneling</span>
          </div>
          <div className="code-block">
            <code>openhole 3000 --subdomain myapp</code>
            <span className="hint">custom name</span>
          </div>
        </div>
      </div>
    </section>
  );
}
