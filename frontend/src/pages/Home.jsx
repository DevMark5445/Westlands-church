import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { LogIn } from "lucide-react";

// ─── SVG Atoms ────────────────────────────────────────────────────────────────
const CrossSvg = ({ size = 20 }) => (
  <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ width: size, height: size }}>
    <rect x="8.5" y="1"   width="3"  height="18" rx="1" />
    <rect x="2"   y="6.5" width="16" height="3"  rx="1" />
  </svg>
);

const MembersSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const FinanceSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const EventsSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

// ─── Intersection-observer reveal hook ───────────────────────────────────────
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("revealed"); obs.unobserve(el); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ isAuth, user, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const getInitials = (f, l) => `${(f||"").charAt(0)}${(l||"").charAt(0)}`.toUpperCase() || "U";

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-10 transition-all duration-300 ${scrolled ? "bg-[#14213d]/97 backdrop-blur-md shadow-lg" : "bg-[#14213d]"}`}
         style={{ height: 72, borderTop: "3px solid #c9a84c" }}>

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 no-underline outline-none group">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:rotate-6 group-hover:scale-105"
             style={{ background: "linear-gradient(135deg, #c9a84c 0%, #e8c876 100%)", color: "#14213d" }}>
          <CrossSvg size={20} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-bold text-[#f5f3ee] tracking-wide" style={{ fontFamily: "'Cinzel', serif", fontSize: "1rem" }}>Westlands P.A.G</span>
          <span className="text-[10px] font-light tracking-widest uppercase" style={{ color: "#c9a84c" }}>Church Management</span>
        </div>
      </Link>

      {/* Right side */}
      {isAuth && user ? (
        <div className="relative" ref={menuRef}>
          <button onClick={() => setMenuOpen(v => !v)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-colors hover:bg-white/5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                 style={{ background: "linear-gradient(135deg, #c9a84c 0%, #e8c876 100%)", color: "#14213d" }}>
              {getInitials(user?.firstName || user?.name?.split(" ")[0], user?.lastName || user?.name?.split(" ")[1])}
            </div>
            <span className="hidden sm:block text-sm text-[#f5f3ee]/80 font-light">
              {user?.firstName || user?.name?.split(" ")[0] || "User"}
            </span>
            <svg className={`w-4 h-4 text-[#f5f3ee]/50 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                 fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800">{user?.firstName || ""} {user?.lastName || ""}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email || ""}</p>
              </div>
              <div className="py-1">
                <Link to="/dashboard"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors no-underline"
                  onClick={() => setMenuOpen(false)}>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
                  Dashboard
                </Link>
              </div>
              <div className="border-t border-gray-100 py-1">
                <button onClick={() => { setMenuOpen(false); onLogout(); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Link to="/login"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium tracking-widest uppercase transition-all duration-200 no-underline"
          style={{ border: "1.5px solid rgba(201,168,76,0.4)", color: "rgba(245,243,238,0.72)" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#c9a84c"; e.currentTarget.style.background = "rgba(201,168,76,0.1)"; e.currentTarget.style.color = "#f5f3ee"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)"; e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(245,243,238,0.72)"; }}>
          <LogIn size={15} style={{ stroke: "#c9a84c" }} />
          <span className="hidden sm:inline">Login</span>
        </Link>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative overflow-hidden flex items-center" style={{ minHeight: "100vh", background: "linear-gradient(175deg, #14213d 0%, #1e3160 55%, #2a4480 100%)", paddingTop: 72 }}>
      {/* Glows */}
      <div className="absolute pointer-events-none" style={{ width: 700, height: 700, borderRadius: "50%", top: -200, right: -150, background: "radial-gradient(circle, rgba(201,168,76,.08) 0%, transparent 70%)" }} />
      <div className="absolute pointer-events-none" style={{ width: 500, height: 500, borderRadius: "50%", bottom: -180, left: -100, background: "radial-gradient(circle, rgba(42,68,128,.6) 0%, transparent 70%)" }} />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-10 py-24">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border text-xs font-light tracking-widest uppercase"
             style={{ color: "#e8c876", borderColor: "rgba(201,168,76,0.35)", background: "rgba(201,168,76,0.08)", animation: "fadeIn .7s ease both" }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#c9a84c" }} />
          Church Management System
        </div>

        {/* Headline */}
        <h1 className="font-bold leading-tight mb-6"
            style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(2.2rem, 5.5vw, 4rem)", color: "#f7f4ee", maxWidth: 680, animation: "fadeUp .8s ease .1s both" }}>
          Serve Your{" "}
          <em className="not-italic" style={{ background: "linear-gradient(90deg, #c9a84c 0%, #e8c876 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Community
          </em>{" "}
          With Clarity &amp; Care
        </h1>

        {/* Sub */}
        <p className="font-light leading-relaxed mb-10"
           style={{ fontSize: "clamp(.95rem, 2vw, 1.1rem)", color: "rgba(247,244,238,0.7)", maxWidth: 500, animation: "fadeUp .8s ease .22s both" }}>
          Westlands P.A.G brings your congregation together — from member records and giving history to events and communications — all in one secure, easy-to-use platform.
        </p>

        {/* CTA */}
        <div style={{ animation: "fadeUp .8s ease .34s both" }}>
          <Link to="/login"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-lg font-bold tracking-widest uppercase text-sm no-underline transition-all duration-200"
            style={{ background: "linear-gradient(135deg, #c9a84c 0%, #e8c876 100%)", color: "#14213d", boxShadow: "0 4px 20px rgba(201,168,76,.35)" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(201,168,76,.45)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 20px rgba(201,168,76,.35)"; }}>
            <LogIn size={18} />
            Login to Westlands P.A.G
          </Link>
        </div>
      </div>

      {/* Wave divider */}
      <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 1440 64" preserveAspectRatio="none" style={{ fill: "#f7f4ee", height: 64 }}>
        <path d="M0,64 L1440,0 L1440,64 Z" />
      </svg>
    </section>
  );
}

// ─── Feature Card ─────────────────────────────────────────────────────────────
function FeatureCard({ Icon, title, body, delay }) {
  const ref = useReveal();
  return (
    <article ref={ref} className="bg-white rounded-2xl p-8 border border-gray-100 transition-all duration-200 cursor-default"
             style={{ boxShadow: "0 4px 32px rgba(20,33,61,.07)", transitionDelay: `${delay * 0.1}s`, opacity: 0, transform: "translateY(22px)" }}
             onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 48px rgba(20,33,61,.14)"; }}
             onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 32px rgba(20,33,61,.07)"; }}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: "rgba(201,168,76,0.12)", color: "#c9a84c" }}>
        <Icon />
      </div>
      <h3 className="font-semibold text-[#14213d] mb-3" style={{ fontFamily: "'Cinzel', serif", fontSize: "1rem" }}>{title}</h3>
      <p className="font-light leading-relaxed" style={{ fontSize: ".88rem", color: "#5a6478" }}>{body}</p>
    </article>
  );
}

// ─── Features Section ─────────────────────────────────────────────────────────
function Features() {
  const cards = [
    { Icon: MembersSvg, title: "Member Management",   body: "Maintain a complete directory with profiles, contact details, and attendance history — searchable and easy to update.", delay: 1 },
    { Icon: FinanceSvg, title: "Financial Tracking",   body: "Record tithes, offerings, and donations with full transparency. Generate reports and track budgets in one click.",    delay: 2 },
    { Icon: EventsSvg,  title: "Event Management",     body: "Plan services and events. Track RSVPs, assign volunteers, and send reminders from one calendar view.",                 delay: 3 },
  ];

  return (
    <section className="py-24" style={{ background: "#f7f4ee" }} id="features">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <p className="text-center text-xs font-light tracking-widest uppercase mb-3" style={{ color: "#c9a84c" }}>What We Offer</p>
        <h2 className="text-center font-semibold mb-4" style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", color: "#14213d" }}>
          Everything Your Church Needs
        </h2>
        <p className="text-center font-light leading-relaxed max-w-md mx-auto mb-14" style={{ fontSize: ".95rem", color: "#5a6478" }}>
          Three powerful pillars designed to simplify administration so your team can focus on what truly matters.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map(c => <FeatureCard key={c.title} {...c} />)}
        </div>
      </div>

      <style>{`
        .revealed { opacity: 1 !important; transform: translateY(0) !important; transition: opacity .65s cubic-bezier(0.4,0,0.2,1), transform .65s cubic-bezier(0.4,0,0.2,1); }
        @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
      `}</style>
    </section>
  );
}

// ─── CTA Section ──────────────────────────────────────────────────────────────
function CtaSection() {
  return (
    <section className="py-24 relative overflow-hidden text-center" style={{ background: "linear-gradient(160deg, #14213d 0%, #2a4480 100%)" }}>
      <div className="relative z-10 max-w-2xl mx-auto px-6 md:px-10">
        <h2 className="font-bold mb-5" style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(1.7rem, 4vw, 2.8rem)", color: "#f7f4ee", lineHeight: 1.2 }}>
          Ready to{" "}
          <em className="not-italic" style={{ background: "linear-gradient(90deg, #c9a84c 0%, #e8c876 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Strengthen
          </em>{" "}
          Your Church Community?
        </h2>
        <p className="font-light leading-relaxed mb-10" style={{ color: "rgba(247,244,238,0.7)", fontSize: "clamp(.9rem, 1.8vw, 1rem)" }}>
          Log in now and experience a simpler way to manage your congregation, finances, and events.
        </p>
        <Link to="/login"
          className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-lg font-bold tracking-widest uppercase text-sm no-underline transition-all duration-200"
          style={{ background: "linear-gradient(135deg, #c9a84c 0%, #e8c876 100%)", color: "#14213d", boxShadow: "0 4px 20px rgba(201,168,76,.35)" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(201,168,76,.45)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 20px rgba(201,168,76,.35)"; }}>
          <LogIn size={18} />
          Login to Westlands P.A.G
        </Link>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-6" style={{ background: "#14213d", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
      <div className="max-w-6xl mx-auto px-6 md:px-10 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: "linear-gradient(135deg, #c9a84c 0%, #e8c876 100%)", color: "#14213d" }}>
            <CrossSvg size={14} />
          </div>
          <span className="font-semibold tracking-wide" style={{ fontFamily: "'Cinzel', serif", fontSize: ".85rem", color: "#f7f4ee" }}>Westlands P.A.G</span>
        </div>
        <p style={{ fontSize: ".75rem", fontWeight: 300, color: "rgba(247,244,238,0.4)" }}>
          &copy; {new Date().getFullYear()} Westlands P.A.G Church Management System. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const { user, logout, isAuthenticated, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    try { logout(); } catch (err) { console.error(err); }
    navigate("/home");
  };

  const auth = isAuthenticated || isLoggedIn?.();

  return (
    <div style={{ fontFamily: "'Lato', sans-serif" }}>
      <Navbar isAuth={auth} user={user} onLogout={handleLogout} />
      <main>
        <Hero />
        <Features />
        {!auth && <CtaSection />}
      </main>
      <Footer />
    </div>
  );
}