import { TerminalDemo } from "./TerminalDemo";

export function Hero() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            No login · No config · One command
          </div>
          <h1>
            Open localhost to the <span>internet</span>
          </h1>
          <p className="hero-lead">
            OpenHole is a fast tunnel for developers. Run one command, get a
            public HTTPS URL, share your local app instantly.
          </p>
          <div className="hero-actions">
            <a href="#install" className="btn btn-primary">
              Get started
            </a>
            <a
              href="https://github.com/bablilayoub/openhole"
              className="btn btn-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </div>
        </div>
        <TerminalDemo />
      </div>
    </section>
  );
}
