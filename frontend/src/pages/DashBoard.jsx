import { useState, useRef, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ─── Context ──────────────────────────────────────────────────────────────────
const DashboardCtx = createContext(null);
function useDash() { return useContext(DashboardCtx); }

// ─── Mock Data (replace with API calls) ──────────────────────────────────────
const contributions = [
  { id: 1, type: "Tithe",         amount: 12000, date: "2025-04-06", status: "Verified" },
  { id: 2, type: "Offering",      amount:  2500, date: "2025-04-06", status: "Verified" },
  { id: 3, type: "Donation",      amount:  5000, date: "2025-03-30", status: "Verified" },
  { id: 4, type: "Tithe",         amount: 12000, date: "2025-03-23", status: "Verified" },
  { id: 5, type: "Building Fund", amount: 10000, date: "2025-03-16", status: "Verified" },
  { id: 6, type: "Offering",      amount:  2000, date: "2025-03-09", status: "Verified" },
];
const upcomingEvents = [
  { id: 1, name: "Sunday Worship Service",  date: "2025-04-20", time: "9:00 AM",  location: "Main Sanctuary",  category: "Worship"     },
  { id: 2, name: "Youth Fellowship Night",  date: "2025-04-22", time: "6:00 PM",  location: "Fellowship Hall", category: "Fellowship"  },
  { id: 3, name: "Midweek Prayer Meeting",  date: "2025-04-23", time: "7:00 PM",  location: "Prayer Room",     category: "Prayer"      },
  { id: 4, name: "Worship Team Rehearsal",  date: "2025-04-25", time: "5:30 PM",  location: "Music Room",      category: "Ministry"    },
];
const recentActivities = [
  { id: 1, action: "Tithe payment submitted",    amount: 12000, date: "2025-04-06", icon: "payment" },
  { id: 2, action: "Attended Sunday Service",                   date: "2025-04-06", icon: "event"   },
  { id: 3, action: "Donation to Building Fund",  amount:  5000, date: "2025-03-30", icon: "payment" },
  { id: 4, action: "Attended Youth Fellowship",                 date: "2025-03-28", icon: "event"   },
  { id: 5, action: "Profile updated",                           date: "2025-03-25", icon: "profile" },
];
const notifData = [
  { id: 1, message: "Your April tithe has been verified.",           time: "2 hours ago", read: false },
  { id: 2, message: "Youth Fellowship Night is tomorrow at 6 PM.",   time: "1 day ago",   read: false },
  { id: 3, message: "New event: Easter Sunday Celebration added.",   time: "2 days ago",  read: false },
];
const summaryStats = {
  totalContributions: contributions.reduce((s, c) => s + c.amount, 0),
  eventsAttended: 23,
  upcomingEvents: upcomingEvents.length,
  notifications: notifData.filter(n => !n.read).length,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtDate = (d) => new Date(d).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });
const fmtCur  = (n) => `KES ${n.toLocaleString()}`;
const getInitials = (f, l) => `${(f || "").charAt(0)}${(l || "").charAt(0)}`.toUpperCase() || "U";

// ─── Icons ────────────────────────────────────────────────────────────────────
const CrossIcon = ({ size = 16 }) => (
  <svg viewBox="0 0 20 20" style={{ width: size, height: size }} aria-hidden="true">
    <rect x="8.5" y="1"   width="3"  height="18" rx="1" fill="currentColor" />
    <rect x="2"   y="6.5" width="16" height="3"  rx="1" fill="currentColor" />
  </svg>
);

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ firstName, lastName, size = "md" }) {
  const cls =
    size === "sm" ? "w-8 h-8 text-xs" :
    size === "lg" ? "w-20 h-20 text-2xl rounded-2xl shadow-lg" :
    "w-9 h-9 text-sm";
  return (
    <div className={`${cls} rounded-full flex items-center justify-center flex-shrink-0 select-none font-bold text-white`}
         style={{ background: "linear-gradient(135deg, #c9a84c 0%, #e8c876 100%)", color: "#14213d" }}>
      {getInitials(firstName, lastName)}
    </div>
  );
}

// ─── NAV items ────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard",     label: "Dashboard",     icon: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></> },
  { id: "profile",       label: "Profile",       icon: <><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></> },
  { id: "contributions", label: "Contributions", icon: <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></> },
  { id: "events",        label: "Events",        icon: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></> },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar() {
  const { section, setSection, sidebarOpen, setSidebarOpen } = useDash();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const nav = (id) => { setSection(id); setSidebarOpen(false); };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside
        className={`fixed top-0 left-0 z-30 h-full w-64 flex flex-col text-white transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:z-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: "linear-gradient(180deg, #0f1724 0%, #14213d 100%)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
               style={{ background: "linear-gradient(135deg, #c9a84c 0%, #e8c876 100%)", color: "#14213d" }}>
            <CrossIcon size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>Westlands</p>
            <p className="text-[10px] tracking-widest uppercase" style={{ color: "#c9a84c" }}>P.A.G Church</p>
          </div>
          <button className="ml-auto lg:hidden text-white/50 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          <p className="px-3 pb-3 text-[10px] uppercase tracking-widest text-white/30 font-medium">Menu</p>
          {NAV.map((item) => {
            const active = section === item.id;
            return (
              <button key={item.id} onClick={() => nav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left ${active ? "text-white shadow-lg" : "text-white/60 hover:text-white hover:bg-white/5"}`}
                style={active ? { background: "linear-gradient(135deg, #c9a84c22 0%, #c9a84c11 100%)", borderLeft: "2px solid #c9a84c" } : {}}>
                <svg className="w-4.5 h-4.5 flex-shrink-0" style={{ width: 18, height: 18 }} fill="none" stroke={active ? "#c9a84c" : "currentColor"} strokeWidth={1.8} viewBox="0 0 24 24">{item.icon}</svg>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── Notification Panel ───────────────────────────────────────────────────────
function NotifPanel({ onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);

  return (
    <div ref={ref} className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#c9a84c22", color: "#c9a84c" }}>
          {notifData.filter(n => !n.read).length} new
        </span>
      </div>
      <ul className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
        {notifData.map(n => (
          <li key={n.id} className={`px-4 py-3 flex gap-3 ${!n.read ? "bg-amber-50/40" : ""}`}>
            <div className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#c9a84c" }} />
            <div><p className="text-sm text-gray-700">{n.message}</p><p className="text-xs text-gray-400 mt-0.5">{n.time}</p></div>
          </li>
        ))}
      </ul>
      <div className="px-4 py-2.5 border-t border-gray-100 text-center">
        <button className="text-xs font-medium" style={{ color: "#c9a84c" }}>Mark all as read</button>
      </div>
    </div>
  );
}

// ─── User Menu Dropdown ───────────────────────────────────────────────────────
function UserMenu({ user }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors">
        <Avatar firstName={user?.firstName || user?.name?.split(" ")[0]} lastName={user?.lastName || user?.name?.split(" ")[1]} />
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-800 leading-tight">
            {user?.firstName || user?.name?.split(" ")[0] || "User"} {user?.lastName || user?.name?.split(" ")[1] || ""}
          </p>
          <p className="text-xs text-gray-400">{user?.role || "Member"}</p>
        </div>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800">
              {user?.firstName || ""} {user?.lastName || ""}
            </p>
            <p className="text-xs text-gray-400 truncate">{user?.email || ""}</p>
          </div>
          <div className="py-1">
            <button className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2.5">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              View Profile
            </button>
            <button className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2.5">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              Settings
            </button>
          </div>
          <div className="border-t border-gray-100 py-1">
            <button onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const { section, setSidebarOpen } = useDash();
  const { user } = useAuth();
  const [showNotif, setShowNotif] = useState(false);
  const labels = { dashboard: "Dashboard", profile: "My Profile", contributions: "My Contributions", events: "Events" };

  return (
    <header className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-100 px-4 md:px-6 py-3 flex items-center gap-4">
      <button className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" onClick={() => setSidebarOpen(true)}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>

      <div className="flex-1 min-w-0">
        <h1 className="text-base font-semibold text-gray-800 truncate">{labels[section]}</h1>
        <p className="text-xs text-gray-400 hidden sm:block">{new Date().toLocaleDateString("en-KE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications */}
        <div className="relative">
          <button onClick={() => setShowNotif(v => !v)}
            className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            {summaryStats.notifications > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: "#c9a84c" }} />
            )}
          </button>
          {showNotif && <NotifPanel onClose={() => setShowNotif(false)} />}
        </div>

        <div className="w-px h-6 bg-gray-200 hidden sm:block" />

        {/* User Menu */}
        <UserMenu user={user} />
      </div>
    </header>
  );
}

// ─── Summary Cards ────────────────────────────────────────────────────────────
function SummaryCards() {
  const cards = [
    {
      label: "Total Contributions", value: fmtCur(summaryStats.totalContributions),
      trend: "+12% this month", color: "gold",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    },
    {
      label: "Events Attended", value: summaryStats.eventsAttended, sub: "This year", color: "blue",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    },
    {
      label: "Upcoming Events", value: summaryStats.upcomingEvents, sub: "Next 7 days", color: "green",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    },
    {
      label: "Notifications", value: summaryStats.notifications, sub: "Unread", color: "purple",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    },
  ];

  const palettes = {
    gold:   { bg: "bg-amber-50",   icon: "#c9a84c",  iconBg: "#c9a84c22", text: "#c9a84c"   },
    blue:   { bg: "bg-blue-50",    icon: "#3b82f6",  iconBg: "#3b82f622", text: "#3b82f6"   },
    green:  { bg: "bg-emerald-50", icon: "#10b981",  iconBg: "#10b98122", text: "#10b981"   },
    purple: { bg: "bg-violet-50",  icon: "#8b5cf6",  iconBg: "#8b5cf622", text: "#8b5cf6"   },
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {cards.map(card => {
        const p = palettes[card.color];
        return (
          <div key={card.label} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1 cursor-default">
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                   style={{ background: p.iconBg, color: p.icon }}>
                {card.icon}
              </div>
              {card.trend && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200">{card.trend}</span>
              )}
            </div>
            <p className="text-3xl font-bold text-gray-900 leading-none mb-2">{card.value}</p>
            <p className="text-sm font-medium text-gray-600 mb-2">{card.label}</p>
            {card.sub && <p className="text-xs font-semibold" style={{ color: p.text }}>{card.sub}</p>}
          </div>
        );
      })}
    </div>
  );
}

// ─── Profile Section ──────────────────────────────────────────────────────────
function ProfileSection() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName:  user?.firstName  || user?.name?.split(" ")[0] || "",
    lastName:   user?.lastName   || user?.name?.split(" ")[1] || "",
    phone:      user?.phone      || "",
    department: user?.department || "",
  });

  const firstName  = user?.firstName  || user?.name?.split(" ")[0] || "User";
  const lastName   = user?.lastName   || user?.name?.split(" ")[1] || "";
  const memberSince = user?.memberSince || user?.createdAt
    ? new Date(user?.createdAt || Date.now()).toLocaleDateString("en-KE", { month: "long", year: "numeric" })
    : "—";

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden max-w-2xl">
      <div className="h-20" style={{ background: "linear-gradient(135deg, #0f1724 0%, #1e3160 100%)" }} />
      <div className="px-6 pb-6">
        <div className="flex items-end justify-between -mt-10 mb-5">
          <Avatar firstName={firstName} lastName={lastName} size="lg" />
          <button onClick={() => setEditing(e => !e)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border"
            style={editing
              ? { background: "linear-gradient(135deg, #c9a84c 0%, #e8c876 100%)", color: "#14213d", borderColor: "transparent" }
              : { borderColor: "#e5e7eb", color: "#374151" }}>
            {editing
              ? <><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Save</>
              : <><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Edit Profile</>}
          </button>
        </div>

        <h2 className="text-xl font-bold text-gray-900">{firstName} {lastName}</h2>
        <p className="text-sm text-gray-500 mt-0.5">{user?.role || "Member"} · Member since {memberSince}</p>

        <div className="mt-5">
          {editing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[["First Name","firstName"],["Last Name","lastName"],["Phone","phone"],["Department","department"]].map(([label, key]) => (
                <div key={key}>
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-1">{label}</label>
                  <input type="text" value={form[key]}
                    onChange={e => setForm(f => ({...f, [key]: e.target.value}))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 transition-all"
                    style={{ "--tw-ring-color": "#c9a84c40" }} />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-1">Email</label>
                <input type="email" value={user?.email || ""} disabled
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {[
                ["Email",       user?.email || "—"],
                ["Phone",       user?.phone || "—"],
                ["Department",  user?.department || "—"],
                ["Member Since", memberSince],
              ].map(([label, val]) => (
                <div key={label}>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                  <p className="text-sm font-medium text-gray-800">{val}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Contributions Section ────────────────────────────────────────────────────
const TYPE_COLORS = {
  Tithe:          "bg-amber-100 text-amber-700",
  Offering:       "bg-blue-100 text-blue-700",
  Donation:       "bg-emerald-100 text-emerald-700",
  "Building Fund":"bg-violet-100 text-violet-700",
};

function ContributionsSection({ limit }) {
  const data  = limit ? contributions.slice(0, limit) : contributions;
  const total = contributions.reduce((s, c) => s + c.amount, 0);
  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-base font-semibold text-gray-800">My Contributions</h2>
          <p className="text-xs text-gray-400 mt-0.5">Total: <span className="font-semibold" style={{ color: "#c9a84c" }}>{fmtCur(total)}</span></p>
        </div>
        <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">{data.length} records</span>
      </div>
      {/* Desktop */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              {["Type","Amount","Date","Status","Receipt"].map(h => (
                <th key={h} className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map(c => (
              <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-3.5"><span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${TYPE_COLORS[c.type] || "bg-gray-100 text-gray-600"}`}>{c.type}</span></td>
                <td className="px-6 py-3.5 font-semibold text-gray-800">{fmtCur(c.amount)}</td>
                <td className="px-6 py-3.5 text-gray-500">{fmtDate(c.date)}</td>
                <td className="px-6 py-3.5">
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{c.status}
                  </span>
                </td>
                <td className="px-6 py-3.5">
                  <button className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-amber-600 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-amber-50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Receipt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile */}
      <ul className="sm:hidden divide-y divide-gray-100">
        {data.map(c => (
          <li key={c.id} className="px-4 py-4">
            <div className="flex items-start justify-between mb-2">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${TYPE_COLORS[c.type] || "bg-gray-100 text-gray-600"}`}>{c.type}</span>
              <button className="text-gray-400 hover:text-amber-600 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </button>
            </div>
            <p className="text-lg font-bold text-gray-800">{fmtCur(c.amount)}</p>
            <div className="flex justify-between mt-1">
              <p className="text-xs text-gray-400">{fmtDate(c.date)}</p>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{c.status}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ─── Events Section ───────────────────────────────────────────────────────────
const CAT_STYLES = {
  Worship:    "bg-amber-100 text-amber-700",
  Fellowship: "bg-blue-100 text-blue-700",
  Prayer:     "bg-violet-100 text-violet-700",
  Ministry:   "bg-emerald-100 text-emerald-700",
};

function EventsSection({ limit }) {
  const data = limit ? upcomingEvents.slice(0, limit) : upcomingEvents;
  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-800">Upcoming Events</h2>
        <p className="text-xs text-gray-400 mt-0.5">{data.length} events coming up</p>
      </div>
      <ul className="divide-y divide-gray-50">
        {data.map(ev => {
          const d = new Date(ev.date);
          return (
            <li key={ev.id} className="px-6 py-4 flex items-start gap-4 hover:bg-gray-50/50 transition-colors">
              <div className="flex-shrink-0 w-12 text-center bg-gray-50 rounded-xl px-2 py-2 border border-gray-100">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">{d.toLocaleDateString("en-KE",{weekday:"short"})}</p>
                <p className="text-xl font-bold text-gray-800 leading-tight">{d.getDate()}</p>
                <p className="text-[10px] text-gray-400 uppercase">{d.toLocaleDateString("en-KE",{month:"short"})}</p>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-gray-800">{ev.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CAT_STYLES[ev.category] || "bg-gray-100 text-gray-600"}`}>{ev.category}</span>
                </div>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {ev.time}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {ev.location}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// ─── Recent Activities ────────────────────────────────────────────────────────
const ACT_ICONS = {
  payment: { bg: "#c9a84c22", color: "#c9a84c", el: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
  event:   { bg: "#3b82f622", color: "#3b82f6", el: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  profile: { bg: "#8b5cf622", color: "#8b5cf6", el: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg> },
};

function RecentActivities() {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-800">Recent Activity</h2>
      </div>
      <ul className="divide-y divide-gray-50">
        {recentActivities.map(a => {
          const ic = ACT_ICONS[a.icon] || ACT_ICONS.event;
          return (
            <li key={a.id} className="px-6 py-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                   style={{ background: ic.bg, color: ic.color }}>
                {ic.el}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">{a.action}</p>
                {a.amount && <p className="text-xs font-semibold mt-0.5" style={{ color: "#c9a84c" }}>{fmtCur(a.amount)}</p>}
              </div>
              <time className="text-xs text-gray-400 flex-shrink-0">{fmtDate(a.date)}</time>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// ─── Dashboard Overview ───────────────────────────────────────────────────────
function DashboardOverview() {
  const { user } = useAuth();
  const firstName = user?.firstName || user?.name?.split(" ")[0] || "Friend";
  const lastName  = user?.lastName  || user?.name?.split(" ")[1] || "";

  return (
    <div className="space-y-6">
      {/* Welcome Banner with User Profile */}
      <div className="rounded-3xl px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 overflow-hidden relative"
           style={{ background: "linear-gradient(135deg, #0f1724 0%, #1e3a5f 50%, #2a4480 100%)" }}>
        <div className="relative z-10 flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#e8c876" }}>Welcome to Your Dashboard</p>
          <h2 className="text-white text-2xl sm:text-3xl font-bold leading-tight mb-2">{firstName} {lastName} 👋</h2>
          <p className="text-white/60 text-sm mb-1">{user?.department || "Westlands P.A.G"} • {user?.role || "Member"}</p>
          <p className="text-white/40 text-xs">Email: {user?.email || "—"}</p>
        </div>
        <div className="hidden sm:flex flex-col items-end justify-center relative z-10 bg-white/5 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/10">
          <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Member Since</p>
          <p className="text-white font-bold text-lg" style={{ color: "#e8c876" }}>
            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-KE", { month: "short", year: "numeric" }) : "—"}
          </p>
        </div>
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -left-12 -bottom-12 w-40 h-40 rounded-full" style={{ background: "rgba(201,168,76,0.08)", filter: "blur(3xl)" }} />
      </div>

      <SummaryCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivities />
        <EventsSection limit={3} />
      </div>

      <ContributionsSection limit={4} />
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function UserDashboard() {
  const [section, setSection]       = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated }         = useAuth();
  const navigate                    = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const renderSection = () => {
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
      <div className="flex h-screen bg-gray-50 overflow-hidden" style={{ fontFamily: "'Lato', sans-serif" }}>
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
            <div className="max-w-6xl mx-auto">
              {renderSection()}
            </div>
          </main>
        </div>
      </div>
    </DashboardCtx.Provider>
  );
}