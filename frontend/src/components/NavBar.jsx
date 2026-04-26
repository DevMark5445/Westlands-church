import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cross, LogIn } from "lucide-react";

/* ─── Navbar ─── */
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header 
      role="banner"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur shadow-md' 
          : 'bg-white/80 backdrop-blur-sm'
      }`}
      style={{ background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.8)' }}
    >
      <nav
        className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group transition-transform duration-200 hover:scale-105"
          aria-label="Westlands P.A.G Church — Go to homepage"
        >
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg"
            style={{ 
              background: "linear-gradient(135deg, #c9a84c 0%, #e8c876 100%)",
              color: "#14213d"
            }}
            aria-hidden="true"
          >
            <Cross size={22} strokeWidth={2} />
          </div>
          <div className="flex flex-col">
            <span 
              className="text-sm font-bold tracking-wider"
              style={{ fontFamily: "'Cinzel', serif", color: "#14213d" }}
            >
              Westlands
            </span>
            <span 
              className="text-[10px] font-medium tracking-widest"
              style={{ color: "#c9a84c" }}
            >
              P.A.G Church
            </span>
          </div>
        </Link>

        {/* Login Button */}
        <Link
          to="/login"
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200"
          style={{
            background: "linear-gradient(135deg, #c9a84c 0%, #e8c876 100%)",
            color: "#14213d"
          }}
          aria-label="Sign in to your account"
        >
          <LogIn size={18} strokeWidth={1.8} />
          Sign In
        </Link>
      </nav>
    </header>
  );
};

/* ─── Export ─── */
export default function NavbarComponent() {
  return <Navbar />;
}