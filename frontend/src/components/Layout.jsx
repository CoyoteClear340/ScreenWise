import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <header className="border-b border-line bg-card">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-paper font-bold text-sm">
              SW
            </span>
            <span className="text-lg font-semibold tracking-tight text-ink">ScreenWise</span>
          </Link>
          <nav className="text-sm text-muted">
            <a
              href="https://github.com"
              onClick={(e) => e.preventDefault()}
              className="hover:text-ink transition-colors cursor-default"
            >
              Academic AI/ML Project
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-line bg-card">
        <div className="max-w-5xl mx-auto px-6 py-6 text-xs text-muted leading-relaxed">
          ScreenWise is an educational AI/ML project that predicts wellness patterns from a
          fixed dataset. It is not a medical or psychological diagnostic tool and should not be
          used as a substitute for professional advice.
        </div>
      </footer>
    </div>
  );
}
