import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

/* ─── Inject Google Fonts + global reset once ─── */
const GlobalStyles = () => (
  <style>{`
   
  `}</style>
);

/* ─── CrossIcon ─── */
const CrossIcon = () => (
  <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="8.5" y="1"   width="3"  height="18" rx="1" />
    <rect x="2"   y="6.5" width="16" height="3"  rx="1" />
  </svg>
);

/* ─── LoginIcon ─── */
const LoginIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </svg>
);

/* ─── Navbar ─── */
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header role="banner">
      <nav
        className={`navbar${scrolled ? " scrolled" : ""}`}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          to="/"
          className="navbar__logo"
          aria-label="GraceHub Church Management — Go to homepage"
        >
          <div className="navbar__logo-mark" aria-hidden="true">
            <CrossIcon />
          </div>
          <div className="navbar__logo-text">
            <span className="navbar__logo-name">Westlands P.A.G</span>
            <span className="navbar__logo-tagline">Church Management</span>
          </div>
        </Link>

        {/* Login */}
        <Link
          to="/login"
          className="navbar__login"
          aria-label="Sign in to your account"
        >
          <LoginIcon />
          <span className="navbar__login-label">Sign In</span>
        </Link>
      </nav>
    </header>
  );
};

/* ─── App (demo wrapper) ─── */
export default function Navba() {
  return (
    <>
      <GlobalStyles />
      <Navbar />
     
    </>
  );
}