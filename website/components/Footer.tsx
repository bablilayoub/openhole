export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p className="footer-brand">OpenHole — simple localhost tunnels.</p>
        <ul className="footer-links">
          <li>
            <a href="/terms">Terms</a>
          </li>
          <li>
            <a
              href="https://github.com/bablilayoub/openhole"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </li>
          <li>
            <a href="mailto:abuse@openhole.dev">abuse@openhole.dev</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
