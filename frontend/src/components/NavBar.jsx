import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cross, LogIn } from "lucide-react";

/* ─── Inject Google Fonts + global reset once ─── */
const GlobalStyles = () => (
  <style>{`
   
  `}</style>
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
            <Cross size={20} strokeWidth={2} />
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
          <LogIn size={18} strokeWidth={1.8} />
        
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