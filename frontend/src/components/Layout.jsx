import { Link, useLocation } from "react-router-dom";
import { SparkleIcon } from "./icons.jsx";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/predict", label: "Check Wellness" },
];

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-paper relative">
      <div
        className="pointer-events-none fixed inset-0 bg-dot-grid opacity-[0.35] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
        aria-hidden="true"
      />

      <header className="sticky top-0 z-30 border-b border-line glass">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-high flex items-center justify-center text-paper font-bold text-sm shadow-glow group-hover:scale-105 transition-transform">
              SW
              <SparkleIcon className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 text-moderate drop-shadow animate-pulse-glow" />
            </span>
            <span className="text-lg font-semibold tracking-tight text-ink">ScreenWise</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative py-1 transition-colors ${
                    active ? "text-primary" : "text-muted hover:text-ink"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute -bottom-[17px] left-0 right-0 h-0.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="flex-1 relative">{children}</main>

      <footer className="border-t border-line bg-card relative">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink">
            <span className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-high flex items-center justify-center text-paper text-[10px] font-bold">
              SW
            </span>
            ScreenWise
          </div>
          <p className="text-xs text-muted leading-relaxed max-w-xl">
            ScreenWise is an educational AI/ML project that predicts wellness patterns from a
            fixed dataset. It is not a medical or psychological diagnostic tool and should not be
            used as a substitute for professional advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
