// src/pages/UserDashboard.jsx
import { useState, useRef, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ─── Theme CSS (matches AdminDashboard exactly) ─────────────────────────────── */
const THEME_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Lato:wght@300;400;700&display=swap');
  :root {
    --navy: #14213d; --navy-mid: #1e3160; --navy-light: #2a4480;
    --gold: #c9a84c; --gold-light: #e8c876; --gold-pale: rgba(201,168,76,0.12);
    --cream: #f7f4ee; --cream-dark: #ede9e0; --white: #ffffff;
    --text-body: #5a6478; --text-light: rgba(247,244,238,0.72);
    --danger: #d94f4f; --success: #3d9970; --ease: cubic-bezier(0.4,0,0.2,1);
  }
  * { box-sizing: border-box; }
  body, .user-dash * { font-family: 'Lato', sans-serif; }
  .user-dash h1, .user-dash h2, .user-dash h3,
  .user-dash h4, .user-dash h5 { font-family: 'Cinzel', serif; }

  /* Sidebar nav button */
  .ud-nav-btn {
    width:100%; display:flex; align-items:center; gap:0.75rem;
    padding:0.75rem 1rem; border-radius:8px; border:none;
    background:transparent; color:rgba(247,244,238,0.7);
    cursor:pointer; transition:all 0.2s ease;
    font-size:0.9rem; font-weight:400;
    font-family:'Lato',sans-serif; text-align:left; white-space:nowrap;
  }
  .ud-nav-btn:hover { background:rgba(201,168,76,0.15); color:var(--cream); }
  .ud-nav-btn.active {
    background:var(--gold); color:var(--navy); font-weight:600;
  }
  .ud-nav-btn .nav-icon { font-size:1.2rem; flex-shrink:0; }

  /* Cards */
  .ud-card {
    background:var(--white); border-radius:12px;
    box-shadow:0 2px 8px rgba(20,33,61,0.08);
    transition:all 0.3s ease;
  }
  .ud-card:hover { transform:translateY(-3px); box-shadow:0 8px 20px rgba(20,33,61,0.13); }

  /* Stat card border accent */
  .ud-stat-card { border-left:4px solid var(--navy); }

  /* Table rows */
  .ud-tr:hover { background:var(--cream); }

  /* Input fields */
  .ud-input {
    width:100%; padding:0.7rem 1rem;
    border:1.5px solid rgba(20,33,61,0.14);
    border-radius:8px; background:var(--white);
    font-family:'Lato',sans-serif; font-size:0.875rem;
    color:var(--navy); outline:none;
    transition:border-color 0.2s, box-shadow 0.2s;
  }
  .ud-input:focus { border-color:var(--gold); box-shadow:0 0 0 3px rgba(201,168,76,0.15); }
  .ud-input:disabled { background:var(--cream); color:var(--text-body); cursor:not-allowed; }

  /* Badge */
  .ud-badge {
    display:inline-block; padding:0.3rem 0.75rem;
    border-radius:20px; font-size:0.72rem; font-weight:600;
    white-space:nowrap;
  }

  /* Section header */
  .ud-section-header {
    padding:1.1rem 1.5rem; border-bottom:1px solid var(--gold-pale);
    display:flex; align-items:center; justify-content:space-between;
    flex-wrap:wrap; gap:0.5rem;
  }

  /* Mobile backdrop */
  .ud-backdrop {
    position:fixed; inset:0; background:rgba(20,33,61,0.5);
    z-index:199;
  }

  /* Sidebar overlay on mobile */
  @media(max-width:768px) {
    .ud-sidebar {
      position:fixed !important; top:0; left:0;
      height:100vh; z-index:200;
    }
  }

  /* Pulse animation */
  @keyframes ud-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  .ud-pulse { animation:ud-pulse 1.5s ease-in-out infinite; }

  /* Fade up */
  @keyframes ud-fadeup { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .ud-fadeup { animation:ud-fadeup 0.45s var(--ease) both; }
`;

/* ─── Context ────────────────────────────────────────────────────────────────── */
const DashboardCtx = createContext(null);
const useDash = () => useContext(DashboardCtx);

/* ─── Mock Data ──────────────────────────────────────────────────────────────── */
const contributions = [
  { id: 1, type: "Tithe",         amount: 12000, date: "2025-04-06", status: "Verified" },
  { id: 2, type: "Offering",      amount:  2500, date: "2025-04-06", status: "Verified" },
  { id: 3, type: "Donation",      amount:  5000, date: "2025-03-30", status: "Verified" },
  { id: 4, type: "Tithe",         amount: 12000, date: "2025-03-23", status: "Verified" },
  { id: 5, type: "Building Fund", amount: 10000, date: "2025-03-16", status: "Verified" },
  { id: 6, type: "Offering",      amount:  2000, date: "2025-03-09", status: "Verified" },
];
const upcomingEvents = [
  { id: 1, name: "Sunday Worship Service",  date: "2025-04-20", time: "9:00 AM",  location: "Main Sanctuary",  category: "Worship"    },
  { id: 2, name: "Youth Fellowship Night",  date: "2025-04-22", time: "6:00 PM",  location: "Fellowship Hall", category: "Fellowship" },
  { id: 3, name: "Midweek Prayer Meeting",  date: "2025-04-23", time: "7:00 PM",  location: "Prayer Room",     category: "Prayer"     },
  { id: 4, name: "Worship Team Rehearsal",  date: "2025-04-25", time: "5:30 PM",  location: "Music Room",      category: "Ministry"   },
];
const recentActivities = [
  { id: 1, action: "Tithe payment submitted",    amount: 12000, date: "2025-04-06", icon: "💰" },
  { id: 2, action: "Attended Sunday Service",                   date: "2025-04-06", icon: "⛪" },
  { id: 3, action: "Donation to Building Fund",  amount:  5000, date: "2025-03-30", icon: "💰" },
  { id: 4, action: "Attended Youth Fellowship",                 date: "2025-03-28", icon: "👥" },
  { id: 5, action: "Profile updated",                           date: "2025-03-25", icon: "👤" },
];
const notifData = [
  { id: 1, message: "Your April tithe has been verified.",          time: "2 hours ago", read: false },
  { id: 2, message: "Youth Fellowship Night is tomorrow at 6 PM.", time: "1 day ago",   read: false },
  { id: 3, message: "New event: Easter Sunday Celebration added.", time: "2 days ago",  read: false },
];

/* ─── Helpers ────────────────────────────────────────────────────────────────── */
const fmtDate = (d) => new Date(d).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });
const fmtCur  = (n) => `KES ${n.toLocaleString()}`;
const getInitials = (f, l) => `${(f || "").charAt(0)}${(l || "").charAt(0)}`.toUpperCase() || "U";

/* ─── Nav Items ──────────────────────────────────────────────────────────────── */
const NAV = [
  { id: "dashboard",     label: "Dashboard",      icon: "📊" },
  { id: "profile",       label: "My Profile",     icon: "👤" },
  { id: "contributions", label: "Contributions",  icon: "💰" },
  { id: "events",        label: "Events",         icon: "📅" },
];

const SECTION_TITLES = {
  dashboard:     "Dashboard",
  profile:       "My Profile",
  contributions: "My Contributions",
  events:        "Upcoming Events",
};

/* ─── Cross Icon ─────────────────────────────────────────────────────────────── */
const CrossIcon = ({ size = 18 }) => (
  <svg viewBox="0 0 20 20" style={{ width: size, height: size, fill: "var(--navy)" }} aria-hidden="true">
    <rect x="8.5" y="1"   width="3"  height="18" rx="1" />
    <rect x="2"   y="6.5" width="16" height="3"  rx="1" />
  </svg>
);

/* ─── Avatar ─────────────────────────────────────────────────────────────────── */
function Avatar({ firstName, lastName, size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size > 50 ? "12px" : "50%",
      background: "linear-gradient(135deg,var(--gold) 0%,var(--gold-light) 100%)",
      color: "var(--navy)", display: "flex", alignItems: "center",
      justifyContent: "center", fontWeight: 700,
      fontSize: size > 50 ? "1.4rem" : "0.85rem",
      flexShrink: 0, userSelect: "none",
      fontFamily: "'Lato',sans-serif",
    }}>
      {getInitials(firstName, lastName)}
    </div>
  );
}

/* ─── Skeleton ───────────────────────────────────────────────────────────────── */
function Skel({ w = "100%", h = 18, r = 6 }) {
  return (
    <div className="ud-pulse" style={{
      width: w, height: h, borderRadius: r,
      background: "rgba(20,33,61,0.08)",
    }} />
  );
}
function SkeletonOverview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div className="ud-pulse" style={{ height: 130, borderRadius: 16, background: "rgba(20,33,61,0.08)" }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "1rem" }}>
        {[1,2,3,4].map(i => (
          <div key={i} className="ud-card" style={{ padding: "1.25rem" }}>
            <Skel w={40} h={40} r={8} /><br/>
            <Skel w="60%" h={28} /><br/>
            <Skel w="80%" h={14} />
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <div className="ud-card" style={{ padding: "1.25rem", display:"flex", flexDirection:"column", gap:"0.75rem" }}>
          <Skel w="50%" h={16} />
          {[1,2,3].map(i => <Skel key={i} h={48} r={8} />)}
        </div>
        <div className="ud-card" style={{ padding: "1.25rem", display:"flex", flexDirection:"column", gap:"0.75rem" }}>
          <Skel w="50%" h={16} />
          {[1,2,3].map(i => <Skel key={i} h={48} r={8} />)}
        </div>
      </div>
    </div>
  );
}

/* ─── Sidebar ────────────────────────────────────────────────────────────────── */
function Sidebar() {
  const { section, setSection, sidebarOpen, setSidebarOpen } = useDash();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const nav = (id) => { setSection(id); setSidebarOpen(false); };

  return (
    <>
      {sidebarOpen && (
        <div className="ud-backdrop" style={{ display: "block" }}
          onClick={() => setSidebarOpen(false)} />
      )}
      <div
        className="ud-sidebar"
        style={{
          width: "16rem", minWidth: "16rem", height: "100vh",
          background: "linear-gradient(160deg,var(--navy) 0%,var(--navy-mid) 55%,var(--navy-light) 100%)",
          display: "flex", flexDirection: "column",
          boxShadow: "0 4px 20px rgba(20,33,61,0.15)",
          flexShrink: 0, overflow: "hidden",
          transition: "transform 0.3s ease",
          // On mobile handled by CSS class
        }}
      >
        {/* Logo */}
        <div style={{
          padding: "1rem 1.25rem",
          borderBottom: "1px solid var(--gold-pale)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: "0.75rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8, flexShrink: 0,
              background: "linear-gradient(135deg,var(--gold) 0%,var(--gold-light) 100%)",
              display: "grid", placeItems: "center",
              boxShadow: "0 4px 12px rgba(201,168,76,0.3)",
            }}>
              <CrossIcon size={16} />
            </div>
            <div>
              <p style={{ margin: 0, fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.06em", color: "var(--cream)" }}>
                Westlands
              </p>
              <p style={{ margin: 0, fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)" }}>
                P.A.G Church
              </p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)}
            style={{ background:"none", border:"none", color:"rgba(247,244,238,0.5)", cursor:"pointer", fontSize:"1.2rem", padding:"0.25rem", borderRadius:"4px" }}
            aria-label="Close sidebar">✕</button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "1rem", display: "flex", flexDirection: "column", gap: "0.35rem", overflowY: "auto" }}>
          <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(247,244,238,0.3)", fontWeight: 600, paddingLeft: "0.5rem" }}>
            Menu
          </p>
          {NAV.map(item => (
            <button
              key={item.id}
              onClick={() => nav(item.id)}
              className={`ud-nav-btn${section === item.id ? " active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ borderTop: "1px solid var(--gold-pale)", padding: "1rem" }}>
          <button
            onClick={() => { logout(); navigate("/login", { replace: true }); }}
            style={{
              width: "100%", background: "var(--danger)", border: "none",
              color: "var(--cream)", fontWeight: 600, padding: "0.6rem 1rem",
              borderRadius: 8, cursor: "pointer", transition: "all 0.2s ease",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
              fontSize: "0.9rem", fontFamily: "'Lato',sans-serif",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── Notification Panel ─────────────────────────────────────────────────────── */
function NotifPanel({ onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);

  return (
    <div ref={ref} style={{
      position: "absolute", right: 0, top: "calc(100% + 8px)",
      width: 320, maxHeight: 380, background: "var(--white)",
      borderRadius: 12, boxShadow: "0 8px 30px rgba(20,33,61,0.15)",
      border: "1px solid var(--gold-pale)", zIndex: 50,
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      <div style={{
        padding: "0.85rem 1rem", borderBottom: "1px solid var(--gold-pale)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <h3 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 700, color: "var(--navy)", fontFamily: "'Cinzel',serif" }}>
          Notifications
        </h3>
        <span style={{
          fontSize: "0.68rem", padding: "0.2rem 0.6rem", borderRadius: 20,
          background: "var(--gold-pale)", color: "var(--navy)", fontWeight: 600,
        }}>
          {notifData.filter(n => !n.read).length} new
        </span>
      </div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, overflowY: "auto", flex: 1 }}>
        {notifData.map(n => (
          <li key={n.id} style={{
            padding: "0.85rem 1rem", display: "flex", gap: "0.75rem",
            borderBottom: "1px solid var(--gold-pale)",
            background: !n.read ? "rgba(201,168,76,0.05)" : "transparent",
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--gold)", flexShrink: 0, marginTop: 5 }} />
            <div>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--navy)", lineHeight: 1.5 }}>{n.message}</p>
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.7rem", color: "var(--text-body)" }}>{n.time}</p>
            </div>
          </li>
        ))}
      </ul>
      <div style={{ padding: "0.75rem 1rem", textAlign: "center", borderTop: "1px solid var(--gold-pale)" }}>
        <button style={{ background: "none", border: "none", color: "var(--gold)", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Lato',sans-serif" }}>
          Mark all as read
        </button>
      </div>
    </div>
  );
}

/* ─── Navbar / Header ────────────────────────────────────────────────────────── */
function Navbar() {
  const { section, setSidebarOpen } = useDash();
  const { user } = useAuth();
  const [showNotif, setShowNotif] = useState(false);
  const unread = notifData.filter(n => !n.read).length;

  const firstName = user?.firstName || "User";
  const lastName  = user?.lastName  || "";
  const role      = user?.role      || "Member";

  return (
    <header style={{
      background: "var(--white)", borderBottom: "2px solid var(--gold-pale)",
      padding: "1rem 1.5rem",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      boxShadow: "0 2px 8px rgba(20,33,61,0.06)", gap: "1rem", flexShrink: 0,
    }}>
      {/* Left: hamburger + title */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
        <button
          onClick={() => setSidebarOpen(v => !v)}
          style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "var(--navy)", padding: "0.25rem 0.5rem", borderRadius: 6, flexShrink: 0, lineHeight: 1 }}
          aria-label="Toggle menu"
        >☰</button>
        <div style={{ minWidth: 0 }}>
          <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "var(--navy)", fontFamily: "'Cinzel',serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {SECTION_TITLES[section] || "Dashboard"}
          </h2>
          <p style={{ margin: 0, fontSize: "0.72rem", color: "var(--text-body)" }}>
            {new Date().toLocaleDateString("en-KE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>

      {/* Right: notifications + user */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
        {/* Notification bell */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowNotif(v => !v)}
            style={{
              position: "relative", background: "none", border: "none",
              cursor: "pointer", padding: "0.5rem", borderRadius: 8,
              color: "var(--text-body)", fontSize: "1.25rem",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--cream)"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
            aria-label="Notifications"
          >
            🔔
            {unread > 0 && (
              <span style={{
                position: "absolute", top: 6, right: 6,
                width: 8, height: 8, borderRadius: "50%",
                background: "var(--gold)", border: "2px solid var(--white)",
              }} />
            )}
          </button>
          {showNotif && <NotifPanel onClose={() => setShowNotif(false)} />}
        </div>

        <div style={{ width: 1, height: 24, background: "var(--gold-pale)" }} />

        {/* User chip */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Avatar firstName={firstName} lastName={lastName} size={34} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--navy)", lineHeight: 1.2 }}>{firstName}</span>
            <span style={{ fontSize: "0.68rem", color: "var(--text-body)" }}>{role}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ─── Dashboard Overview ─────────────────────────────────────────────────────── */
function DashboardOverview() {
  const { user } = useAuth();
  const { setSection } = useDash();
  const firstName = user?.firstName || "Member";
  const lastName  = user?.lastName  || "";
  const total     = contributions.reduce((s, c) => s + c.amount, 0);

  const stats = [
    { label: "Total Contributions", value: fmtCur(total), icon: "💰", border: "var(--gold)", sub: "+12% this month" },
    { label: "Events Attended",     value: "23",          icon: "⛪", border: "var(--navy)", sub: "This year" },
    { label: "Upcoming Events",     value: String(upcomingEvents.length), icon: "📅", border: "var(--success)", sub: "Next 7 days" },
    { label: "Notifications",       value: String(notifData.filter(n => !n.read).length), icon: "🔔", border: "var(--danger)", sub: "Unread" },
  ];

  return (
    <div className="ud-fadeup" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Welcome Banner */}
      <div style={{
        borderRadius: 16, padding: "1.75rem 2rem", position: "relative", overflow: "hidden",
        background: "linear-gradient(135deg,var(--navy) 0%,var(--navy-mid) 55%,var(--navy-light) 100%)",
      }}>
        <div style={{ position:"absolute", top:-80, right:-80, width:220, height:220, borderRadius:"50%", background:"rgba(201,168,76,0.07)", pointerEvents:"none" }} />
        <div style={{ position:"relative", zIndex:1, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"1rem" }}>
          <div>
            <p style={{ margin:"0 0 0.4rem", fontSize:"0.65rem", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.2em", color:"var(--gold)" }}>
              Welcome Back
            </p>
            <h2 style={{ margin:"0 0 0.3rem", fontFamily:"'Cinzel',serif", fontSize:"clamp(1.4rem,3vw,2rem)", fontWeight:700, color:"var(--cream)" }}>
              {firstName} {lastName} 👋
            </h2>
            <p style={{ margin:0, fontSize:"0.82rem", color:"var(--text-light)" }}>
              {user?.department || "Westlands P.A.G"} · {user?.role || "Member"}
            </p>
          </div>
          <div style={{
            padding:"0.9rem 1.4rem", borderRadius:10, textAlign:"center",
            background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)",
          }}>
            <p style={{ margin:"0 0 0.2rem", fontSize:"0.65rem", textTransform:"uppercase", letterSpacing:"0.1em", color:"rgba(247,244,238,0.5)" }}>Member Since</p>
            <p style={{ margin:0, fontFamily:"'Cinzel',serif", fontWeight:700, fontSize:"1rem", color:"var(--gold)" }}>
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-KE",{month:"short",year:"numeric"}) : "Apr 2026"}
            </p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"1rem" }}>
        {stats.map((s, i) => (
          <div key={i} className="ud-card ud-stat-card" style={{ borderLeftColor: s.border, padding:"1.25rem" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"0.75rem" }}>
              <p style={{ margin:0, fontSize:"0.7rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", color:"var(--text-body)" }}>{s.label}</p>
              <span style={{ fontSize:"1.25rem" }}>{s.icon}</span>
            </div>
            <p style={{ margin:"0 0 0.3rem", fontSize:"1.6rem", fontWeight:700, color:"var(--navy)", fontFamily:"'Cinzel',serif" }}>{s.value}</p>
            <p style={{ margin:0, fontSize:"0.72rem", color:"var(--text-body)" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Two-column: Activities + Events preview */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"1.5rem" }}>
        {/* Recent Activity */}
        <div className="ud-card">
          <div className="ud-section-header">
            <h3 style={{ margin:0, fontSize:"0.9rem", fontWeight:700, color:"var(--navy)", fontFamily:"'Cinzel',serif" }}>Recent Activity</h3>
          </div>
          <div style={{ display:"flex", flexDirection:"column" }}>
            {recentActivities.slice(0,4).map(a => (
              <div key={a.id} style={{
                padding:"0.85rem 1.25rem", display:"flex", alignItems:"center", gap:"0.85rem",
                borderBottom:"1px solid var(--gold-pale)",
                transition:"background 0.2s",
              }}
                onMouseEnter={e=>e.currentTarget.style.background="var(--cream)"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}
              >
                <div style={{
                  width:36, height:36, borderRadius:8, flexShrink:0,
                  background:"var(--gold-pale)", display:"grid", placeItems:"center", fontSize:"1.1rem",
                }}>{a.icon}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ margin:0, fontSize:"0.82rem", fontWeight:600, color:"var(--navy)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{a.action}</p>
                  {a.amount && <p style={{ margin:"0.1rem 0 0", fontSize:"0.72rem", fontWeight:700, color:"var(--gold)" }}>{fmtCur(a.amount)}</p>}
                </div>
                <span style={{ fontSize:"0.7rem", color:"var(--text-body)", whiteSpace:"nowrap", flexShrink:0 }}>{fmtDate(a.date)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events preview */}
        <div className="ud-card">
          <div className="ud-section-header">
            <h3 style={{ margin:0, fontSize:"0.9rem", fontWeight:700, color:"var(--navy)", fontFamily:"'Cinzel',serif" }}>Upcoming Events</h3>
            <button onClick={() => setSection("events")} style={{
              background:"var(--gold-pale)", border:"none", color:"var(--navy)",
              padding:"0.3rem 0.75rem", borderRadius:20, fontSize:"0.72rem",
              fontWeight:600, cursor:"pointer", fontFamily:"'Lato',sans-serif",
              transition:"all 0.2s",
            }}
              onMouseEnter={e=>{e.currentTarget.style.background="var(--gold)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="var(--gold-pale)";}}
            >View all</button>
          </div>
          <div>
            {upcomingEvents.slice(0,3).map(ev => {
              const d = new Date(ev.date);
              return (
                <div key={ev.id} style={{
                  padding:"0.85rem 1.25rem", display:"flex", alignItems:"center", gap:"0.85rem",
                  borderBottom:"1px solid var(--gold-pale)", transition:"background 0.2s",
                }}
                  onMouseEnter={e=>e.currentTarget.style.background="var(--cream)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                >
                  <div style={{
                    width:40, textAlign:"center", background:"var(--cream)",
                    borderRadius:8, padding:"0.35rem 0.4rem", border:"1px solid var(--gold-pale)", flexShrink:0,
                  }}>
                    <p style={{ margin:0, fontSize:"0.6rem", color:"var(--text-body)", textTransform:"uppercase" }}>{d.toLocaleDateString("en-KE",{weekday:"short"})}</p>
                    <p style={{ margin:0, fontSize:"1.1rem", fontWeight:700, color:"var(--navy)", fontFamily:"'Cinzel',serif" }}>{d.getDate()}</p>
                    <p style={{ margin:0, fontSize:"0.6rem", color:"var(--text-body)", textTransform:"uppercase" }}>{d.toLocaleDateString("en-KE",{month:"short"})}</p>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ margin:"0 0 0.2rem", fontSize:"0.82rem", fontWeight:600, color:"var(--navy)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{ev.name}</p>
                    <p style={{ margin:0, fontSize:"0.7rem", color:"var(--text-body)" }}>🕐 {ev.time} · 📍 {ev.location}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contributions preview */}
      <ContributionsSection limit={4} />
    </div>
  );
}

/* ─── Profile Section ────────────────────────────────────────────────────────── */
function ProfileSection() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName:  user?.firstName  || "",
    lastName:   user?.lastName   || "",
    phone:      user?.phone      || "",
    department: user?.department || "",
  });

  const firstName  = user?.firstName  || "User";
  const lastName   = user?.lastName   || "";
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-KE", { month: "long", year: "numeric" })
    : "—";

  return (
    <div className="ud-fadeup" style={{ display:"flex", flexDirection:"column", gap:"1.5rem" }}>
      <div className="ud-card" style={{ overflow:"hidden" }}>
        {/* Banner */}
        <div style={{ height:100, background:"linear-gradient(135deg,var(--navy) 0%,var(--navy-mid) 55%,var(--navy-light) 100%)" }} />
        <div style={{ padding:"0 1.5rem 1.75rem" }}>
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginTop:-30, marginBottom:"1rem", flexWrap:"wrap", gap:"0.75rem" }}>
            <div style={{
              width:70, height:70, borderRadius:12, flexShrink:0,
              background:"linear-gradient(135deg,var(--gold) 0%,var(--gold-light) 100%)",
              color:"var(--navy)", display:"flex", alignItems:"center", justifyContent:"center",
              fontWeight:700, fontSize:"1.5rem", boxShadow:"0 4px 16px rgba(201,168,76,0.35)",
              fontFamily:"'Lato',sans-serif",
            }}>
              {getInitials(firstName, lastName)}
            </div>
            <button
              onClick={() => setEditing(e => !e)}
              style={{
                padding:"0.6rem 1.2rem", borderRadius:8, border:"none", cursor:"pointer",
                background: editing ? "linear-gradient(135deg,var(--gold) 0%,var(--gold-light) 100%)" : "var(--cream-dark)",
                color:"var(--navy)", fontWeight:600, fontSize:"0.85rem",
                fontFamily:"'Lato',sans-serif", transition:"all 0.2s",
                display:"flex", alignItems:"center", gap:"0.4rem",
              }}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
              onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}
            >
              {editing ? "✓ Save Changes" : "✏️ Edit Profile"}
            </button>
          </div>

          <h2 style={{ margin:"0 0 0.2rem", fontFamily:"'Cinzel',serif", fontSize:"1.25rem", fontWeight:700, color:"var(--navy)" }}>
            {firstName} {lastName}
          </h2>
          <p style={{ margin:"0 0 1.25rem", fontSize:"0.82rem", color:"var(--text-body)" }}>
            {user?.role || "Member"} · Member since {memberSince}
          </p>

          {editing ? (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"1rem" }}>
              {[["First Name","firstName"],["Last Name","lastName"],["Phone","phone"],["Department","department"]].map(([label,key]) => (
                <div key={key}>
                  <label style={{ display:"block", marginBottom:"0.35rem", fontSize:"0.7rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"var(--navy)" }}>{label}</label>
                  <input
                    type="text" value={form[key]}
                    onChange={e => setForm(f => ({...f,[key]:e.target.value}))}
                    className="ud-input"
                  />
                </div>
              ))}
              <div style={{ gridColumn:"1/-1" }}>
                <label style={{ display:"block", marginBottom:"0.35rem", fontSize:"0.7rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"var(--navy)" }}>Email</label>
                <input type="email" value={user?.email || ""} disabled className="ud-input" />
              </div>
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"1.25rem" }}>
              {[
                ["Email",       user?.email       || "—"],
                ["Phone",       user?.phone       || "—"],
                ["Department",  user?.department  || "—"],
                ["Member Since",memberSince],
              ].map(([label,val]) => (
                <div key={label}>
                  <p style={{ margin:"0 0 0.2rem", fontSize:"0.68rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"var(--text-body)" }}>{label}</p>
                  <p style={{ margin:0, fontSize:"0.88rem", fontWeight:600, color:"var(--navy)" }}>{val}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Contributions Section ──────────────────────────────────────────────────── */
const TYPE_COLORS = {
  Tithe:          { bg:"rgba(201,168,76,0.12)",  color:"var(--navy)"   },
  Offering:       { bg:"rgba(59,130,246,0.12)",  color:"#1d4ed8"       },
  Donation:       { bg:"rgba(61,153,112,0.12)",  color:"var(--success)" },
  "Building Fund":{ bg:"rgba(139,92,246,0.12)",  color:"#6d28d9"       },
};

function ContributionsSection({ limit }) {
  const data  = limit ? contributions.slice(0, limit) : contributions;
  const total = contributions.reduce((s, c) => s + c.amount, 0);

  return (
    <div className={limit ? "" : "ud-fadeup"} style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
      <div className="ud-card" style={{ overflow:"hidden" }}>
        <div className="ud-section-header">
          <div>
            <h3 style={{ margin:"0 0 0.15rem", fontSize:"0.9rem", fontWeight:700, color:"var(--navy)", fontFamily:"'Cinzel',serif" }}>My Contributions</h3>
            <p style={{ margin:0, fontSize:"0.72rem", color:"var(--text-body)" }}>
              Total: <strong style={{ color:"var(--gold)" }}>{fmtCur(total)}</strong>
            </p>
          </div>
          <span className="ud-badge" style={{ background:"var(--cream)", color:"var(--text-body)" }}>{data.length} records</span>
        </div>

        {/* Desktop table */}
        <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
          <table style={{ width:"100%", minWidth:520, borderCollapse:"collapse" }}>
            <thead style={{ background:"var(--cream)" }}>
              <tr>
                {["Type","Amount","Date","Status","Receipt"].map(h => (
                  <th key={h} style={{ padding:"0.75rem 1.25rem", textAlign:"left", fontSize:"0.68rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", color:"var(--navy)", whiteSpace:"nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map(c => {
                const tc = TYPE_COLORS[c.type] || { bg:"var(--cream)", color:"var(--navy)" };
                return (
                  <tr key={c.id} className="ud-tr" style={{ borderBottom:"1px solid var(--gold-pale)", transition:"background 0.2s" }}>
                    <td style={{ padding:"0.85rem 1.25rem" }}>
                      <span className="ud-badge" style={{ background:tc.bg, color:tc.color }}>{c.type}</span>
                    </td>
                    <td style={{ padding:"0.85rem 1.25rem", fontWeight:700, color:"var(--navy)", fontSize:"0.88rem" }}>{fmtCur(c.amount)}</td>
                    <td style={{ padding:"0.85rem 1.25rem", color:"var(--text-body)", fontSize:"0.82rem" }}>{fmtDate(c.date)}</td>
                    <td style={{ padding:"0.85rem 1.25rem" }}>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:"0.35rem", fontSize:"0.75rem", fontWeight:600, color:"var(--success)" }}>
                        <span style={{ width:6, height:6, borderRadius:"50%", background:"var(--success)", flexShrink:0 }} />
                        {c.status}
                      </span>
                    </td>
                    <td style={{ padding:"0.85rem 1.25rem" }}>
                      <button style={{
                        background:"none", border:"1px solid var(--gold-pale)", color:"var(--text-body)",
                        padding:"0.3rem 0.7rem", borderRadius:6, cursor:"pointer", fontSize:"0.72rem",
                        fontFamily:"'Lato',sans-serif", transition:"all 0.2s",
                      }}
                        onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--gold)";e.currentTarget.style.color="var(--navy)";}}
                        onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--gold-pale)";e.currentTarget.style.color="var(--text-body)";}}
                      >
                        ↓ Receipt
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Events Section ─────────────────────────────────────────────────────────── */
const CAT_COLORS = {
  Worship:    { bg:"rgba(201,168,76,0.12)", color:"var(--navy)"   },
  Fellowship: { bg:"rgba(59,130,246,0.12)", color:"#1d4ed8"       },
  Prayer:     { bg:"rgba(139,92,246,0.12)", color:"#6d28d9"       },
  Ministry:   { bg:"rgba(61,153,112,0.12)", color:"var(--success)" },
};

function EventsSection({ limit }) {
  const data = limit ? upcomingEvents.slice(0, limit) : upcomingEvents;

  return (
    <div className="ud-fadeup" style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
      <div className="ud-card" style={{ overflow:"hidden" }}>
        <div className="ud-section-header">
          <div>
            <h3 style={{ margin:"0 0 0.15rem", fontSize:"0.9rem", fontWeight:700, color:"var(--navy)", fontFamily:"'Cinzel',serif" }}>Upcoming Events</h3>
            <p style={{ margin:0, fontSize:"0.72rem", color:"var(--text-body)" }}>{data.length} events coming up</p>
          </div>
        </div>
        <div>
          {data.map(ev => {
            const d = new Date(ev.date);
            const cc = CAT_COLORS[ev.category] || { bg:"var(--cream)", color:"var(--navy)" };
            return (
              <div key={ev.id} style={{
                padding:"1rem 1.25rem", display:"flex", alignItems:"center", gap:"1rem",
                borderBottom:"1px solid var(--gold-pale)", transition:"background 0.2s",
                flexWrap:"wrap",
              }}
                onMouseEnter={e=>e.currentTarget.style.background="var(--cream)"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}
              >
                {/* Date badge */}
                <div style={{
                  width:48, textAlign:"center", background:"var(--cream)",
                  borderRadius:8, padding:"0.4rem", border:"1px solid var(--gold-pale)", flexShrink:0,
                }}>
                  <p style={{ margin:0, fontSize:"0.6rem", color:"var(--text-body)", textTransform:"uppercase", fontWeight:600 }}>{d.toLocaleDateString("en-KE",{weekday:"short"})}</p>
                  <p style={{ margin:0, fontSize:"1.35rem", fontWeight:700, color:"var(--navy)", fontFamily:"'Cinzel',serif", lineHeight:1.1 }}>{d.getDate()}</p>
                  <p style={{ margin:0, fontSize:"0.6rem", color:"var(--text-body)", textTransform:"uppercase" }}>{d.toLocaleDateString("en-KE",{month:"short"})}</p>
                </div>
                <div style={{ flex:1, minWidth:150 }}>
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"0.75rem", marginBottom:"0.4rem", flexWrap:"wrap" }}>
                    <h4 style={{ margin:0, fontSize:"0.9rem", fontWeight:700, color:"var(--navy)" }}>{ev.name}</h4>
                    <span className="ud-badge" style={{ background:cc.bg, color:cc.color }}>{ev.category}</span>
                  </div>
                  <p style={{ margin:0, fontSize:"0.75rem", color:"var(--text-body)" }}>🕐 {ev.time} &nbsp;·&nbsp; 📍 {ev.location}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Root Component ─────────────────────────────────────────────────────────── */
export default function UserDashboard() {
  const [section,     setSection]     = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading,   setIsLoading]   = useState(true);
  const { isAuthenticated, user, isInitialized } = useAuth();
  const navigate = useNavigate();

  // Inject theme CSS once
  useEffect(() => {
    const id = "user-dash-theme-css";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id;
      tag.textContent = THEME_CSS;
      document.head.appendChild(tag);
    }
  }, []);

  useEffect(() => {
    if (isInitialized && !isAuthenticated && !user) {
      navigate("/login", { replace: true });
    }
  }, [isInitialized, isAuthenticated, user, navigate]);

  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(t);
  }, [section]);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isInitialized) {
    return (
      <div style={{ display:"flex", height:"100vh", alignItems:"center", justifyContent:"center", background:"var(--cream,#f7f4ee)" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ width:48, height:48, borderRadius:"50%", border:"3px solid rgba(201,168,76,0.3)", borderTopColor:"var(--gold,#c9a84c)", margin:"0 auto 1rem", animation:"spin 0.8s linear infinite" }} />
          <p style={{ color:"var(--text-body,#5a6478)", fontFamily:"'Lato',sans-serif" }}>Loading dashboard…</p>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    if (isLoading) return <SkeletonOverview />;
    switch (section) {
      case "dashboard":     return <DashboardOverview />;
      case "profile":       return <ProfileSection />;
      case "contributions": return <ContributionsSection />;
      case "events":        return <EventsSection />;
      default:              return <DashboardOverview />;
    }
  };

  return (
    <DashboardCtx.Provider value={{ section, setSection, sidebarOpen, setSidebarOpen }}>
      <div
        className="user-dash"
        style={{ display:"flex", height:"100vh", background:"var(--cream)", overflow:"hidden", position:"relative" }}
      >
        {/* Sidebar — always rendered; on desktop it's static, on mobile it overlays */}
        <div style={{
          // Desktop: always visible; Mobile: hidden unless open
          display: "flex",
          flexShrink: 0,
        }}>
          {/* Desktop persistent sidebar */}
          <div style={{
            width:"16rem", minWidth:"16rem", height:"100vh",
            background:"linear-gradient(160deg,var(--navy) 0%,var(--navy-mid) 55%,var(--navy-light) 100%)",
            display: window.innerWidth < 768 ? "none" : "flex",
            flexDirection:"column",
            boxShadow:"0 4px 20px rgba(20,33,61,0.15)",
          }}
            className="ud-desktop-sidebar"
          >
            <SidebarContent />
          </div>
        </div>

        {/* Mobile overlay sidebar */}
        {sidebarOpen && (
          <>
            <div
              onClick={() => setSidebarOpen(false)}
              style={{ position:"fixed", inset:0, background:"rgba(20,33,61,0.5)", zIndex:199 }}
            />
            <div style={{
              position:"fixed", top:0, left:0, height:"100vh", width:"16rem",
              background:"linear-gradient(160deg,var(--navy) 0%,var(--navy-mid) 55%,var(--navy-light) 100%)",
              display:"flex", flexDirection:"column", zIndex:200,
              boxShadow:"4px 0 20px rgba(20,33,61,0.2)",
            }}>
              <SidebarContent />
            </div>
          </>
        )}

        {/* Main content */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>
          <Navbar />
          <main style={{ flex:1, overflowY:"auto", padding:"1.5rem 2rem" }}>
            <div style={{ maxWidth:1100, margin:"0 auto" }}>
              {renderSection()}
            </div>
          </main>
        </div>
      </div>
    </DashboardCtx.Provider>
  );
}

/* ─── Sidebar Content (shared between desktop + mobile) ──────────────────────── */
function SidebarContent() {
  const { section, setSection, setSidebarOpen } = useDash();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const nav = (id) => { setSection(id); setSidebarOpen(false); };

  return (
    <>
      {/* Logo */}
      <div style={{
        padding:"1rem 1.25rem", borderBottom:"1px solid var(--gold-pale)",
        display:"flex", alignItems:"center", justifyContent:"space-between",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:"0.6rem" }}>
          <div style={{
            width:36, height:36, borderRadius:8, flexShrink:0,
            background:"linear-gradient(135deg,var(--gold) 0%,var(--gold-light) 100%)",
            display:"grid", placeItems:"center",
            boxShadow:"0 4px 12px rgba(201,168,76,0.3)",
          }}>
            <CrossIcon size={16} />
          </div>
          <div>
            <p style={{ margin:0, fontFamily:"'Cinzel',serif", fontWeight:700, fontSize:"1rem", letterSpacing:"0.06em", color:"var(--cream)" }}>
              Westlands
            </p>
            <p style={{ margin:0, fontSize:"0.6rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--gold)" }}>
              P.A.G Church
            </p>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          style={{ background:"none", border:"none", color:"rgba(247,244,238,0.4)", cursor:"pointer", fontSize:"1.1rem", padding:"0.2rem", borderRadius:4, lineHeight:1 }}
          aria-label="Close"
        >✕</button>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:"1rem", display:"flex", flexDirection:"column", gap:"0.25rem", overflowY:"auto" }}>
        <p style={{ margin:"0 0 0.5rem 0.5rem", fontSize:"0.62rem", textTransform:"uppercase", letterSpacing:"0.18em", color:"rgba(247,244,238,0.28)", fontWeight:600 }}>
          Menu
        </p>
        {NAV.map(item => (
          <button
            key={item.id}
            onClick={() => nav(item.id)}
            className={`ud-nav-btn${section === item.id ? " active" : ""}`}
          >
            <span style={{ fontSize:"1.1rem", flexShrink:0 }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ borderTop:"1px solid var(--gold-pale)", padding:"1rem" }}>
        <button
          onClick={() => { logout(); navigate("/login",{replace:true}); }}
          style={{
            width:"100%", background:"var(--danger)", border:"none",
            color:"var(--cream)", fontWeight:600, padding:"0.6rem 1rem",
            borderRadius:8, cursor:"pointer", transition:"all 0.2s",
            display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem",
            fontSize:"0.88rem", fontFamily:"'Lato',sans-serif",
          }}
          onMouseEnter={e=>e.currentTarget.style.opacity="0.88"}
          onMouseLeave={e=>e.currentTarget.style.opacity="1"}
        >
          🚪 Logout
        </button>
      </div>
    </>
  );
}