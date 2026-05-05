import { useState, useRef, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminCtx = createContext(null);
const useAdmin = () => useContext(AdminCtx);

const THEME_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Lato:wght@300;400;700&display=swap');
  :root {
    --navy: #14213d; --navy-mid: #1e3160; --navy-light: #2a4480;
    --gold: #c9a84c; --gold-light: #e8c876; --gold-pale: rgba(201,168,76,0.12);
    --cream: #f7f4ee; --cream-dark: #ede9e0; --white: #ffffff;
    --text-body: #5a6478; --text-light: rgba(247,244,238,0.72);
    --danger: #d94f4f; --success: #3d9970; --ease: cubic-bezier(0.4,0,0.2,1);
  }
  * { font-family: 'Lato', sans-serif; box-sizing: border-box; }
  h1, h2, h3, h4, h5, h6 { font-family: 'Cinzel', serif; }
  @media (max-width: 768px) {
    .admin-sidebar-overlay {
      position: fixed !important;
      top: 0; left: 0; height: 100vh; z-index: 200;
    }
    .admin-sidebar-backdrop {
      display: block !important;
    }
    .admin-header-title {
      font-size: 1.2rem !important;
    }
    .admin-stats-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
    .admin-quick-grid {
      grid-template-columns: 1fr !important;
    }
    .admin-financials-grid {
      grid-template-columns: 1fr !important;
    }
    .admin-reports-grid {
      grid-template-columns: 1fr !important;
    }
  }
  @media (max-width: 480px) {
    .admin-stats-grid {
      grid-template-columns: 1fr !important;
    }
  }
`;

const mockMembers = [
  { id: 1, name: "John Doe", email: "john@church.org", role: "Member", joinDate: "2024-01-15", status: "active", contributions: 45000 },
  { id: 2, name: "Jane Smith", email: "jane@church.org", role: "Elder", joinDate: "2023-06-20", status: "active", contributions: 62000 },
  { id: 3, name: "Peter Johnson", email: "peter@church.org", role: "Member", joinDate: "2024-03-10", status: "inactive", contributions: 12000 },
  { id: 4, name: "Mary Williams", email: "mary@church.org", role: "Deacon", joinDate: "2023-11-05", status: "active", contributions: 85000 },
  { id: 5, name: "Paul Brown", email: "paul@church.org", role: "Member", joinDate: "2024-02-28", status: "active", contributions: 28000 },
];

const mockFinancials = [
  { id: 1, category: "Tithes", amount: 450000, date: "2025-04", status: "Verified", trend: "+12%" },
  { id: 2, category: "Offerings", amount: 125000, date: "2025-04", status: "Verified", trend: "+5%" },
  { id: 3, category: "Building Fund", amount: 380000, date: "2025-04", status: "Verified", trend: "+18%" },
  { id: 4, category: "Donations", amount: 95000, date: "2025-04", status: "Pending", trend: "-3%" },
];

const mockEvents = [
  { id: 1, name: "Sunday Worship", date: "2025-04-20", attendees: 245, status: "Scheduled" },
  { id: 2, name: "Youth Camp", date: "2025-05-10", attendees: 89, status: "Scheduled" },
  { id: 3, name: "Easter Celebration", date: "2025-04-06", attendees: 456, status: "Completed" },
];

const fmtCur = (n) => `KES ${n.toLocaleString()}`;

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [activeSection, setActiveSection] = useState("overview");

  const totalMembers = mockMembers.length;
  const activeMembers = mockMembers.filter(m => m.status === "active").length;
  const totalContributions = mockMembers.reduce((sum, m) => sum + m.contributions, 0);
  const monthlyRevenue = mockFinancials.reduce((sum, f) => sum + f.amount, 0);

  useEffect(() => {
    const id = "admin-theme-css";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id;
      tag.textContent = THEME_CSS;
      document.head.appendChild(tag);
    }

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavClick = (id) => {
    setActiveSection(id);
    if (isMobile) setSidebarOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "members", label: "Members", icon: "👥" },
    { id: "financials", label: "Financials", icon: "💰" },
    { id: "events", label: "Events", icon: "📅" },
    { id: "reports", label: "Reports", icon: "📈" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const sectionTitle = {
    overview: "Dashboard Overview",
    members: "Members Management",
    financials: "Financial Reports",
    events: "Events Management",
    reports: "Reports & Analytics",
    settings: "Settings",
  };

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "var(--cream)", position: "relative", overflow: "hidden" }}>

      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(20,33,61,0.5)",
            zIndex: 199, display: "block"
          }}
        />
      )}

      {/* Sidebar */}
      <div
        className={isMobile ? "admin-sidebar-overlay" : ""}
        style={{
          width: sidebarOpen ? "16rem" : (isMobile ? "0" : "5rem"),
          minWidth: sidebarOpen ? "16rem" : (isMobile ? "0" : "5rem"),
          background: `linear-gradient(160deg, var(--navy) 0%, var(--navy-mid) 55%, var(--navy-light) 100%)`,
          color: "var(--cream)",
          transition: "width 0.3s ease-in-out, min-width 0.3s ease-in-out",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 4px 20px rgba(20,33,61,0.15)",
          overflow: "hidden",
          flexShrink: 0,
          zIndex: isMobile ? 200 : "auto",
          position: isMobile ? "fixed" : "relative",
          height: "100vh",
          top: 0,
          left: 0,
        }}
      >
        <div style={{
          padding: "1rem",
          borderBottom: "1px solid var(--gold-pale)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          whiteSpace: "nowrap",
          minWidth: "16rem"
        }}>
          <h1 style={{ fontSize: "1.25rem", fontWeight: "700", letterSpacing: "0.08em", margin: 0 }}>
            Westlands <span style={{ color: "var(--gold)" }}>Admin</span>
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              padding: "0.5rem", background: "transparent", border: "none",
              color: "var(--cream)", cursor: "pointer", fontSize: "1.25rem",
              transition: "all 0.2s ease", borderRadius: "4px"
            }}
            onMouseEnter={e => e.target.style.background = "rgba(201,168,76,0.2)"}
            onMouseLeave={e => e.target.style.background = "transparent"}
          >
            ←
          </button>
        </div>

        <nav style={{ flex: "1", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem", overflowY: "auto", minWidth: "16rem" }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: "0.75rem",
                padding: "0.75rem 1rem", borderRadius: "8px", border: "none",
                background: activeSection === item.id ? "var(--gold)" : "transparent",
                color: activeSection === item.id ? "var(--navy)" : "rgba(247,244,238,0.8)",
                cursor: "pointer", transition: "all 0.2s ease",
                fontSize: "0.95rem", fontWeight: activeSection === item.id ? "600" : "400",
                whiteSpace: "nowrap"
              }}
              onMouseEnter={e => {
                if (activeSection !== item.id) {
                  e.currentTarget.style.background = "rgba(201,168,76,0.15)";
                  e.currentTarget.style.color = "var(--cream)";
                }
              }}
              onMouseLeave={e => {
                if (activeSection !== item.id) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(247,244,238,0.8)";
                }
              }}
            >
              <span style={{ fontSize: "1.25rem", flexShrink: 0 }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div style={{ borderTop: "1px solid var(--gold-pale)", padding: "1rem", minWidth: "16rem" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%", background: "var(--danger)", border: "none",
              color: "var(--cream)", fontWeight: "600", padding: "0.6rem 1rem",
              borderRadius: "8px", cursor: "pointer", transition: "all 0.2s ease",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem"
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: "1", display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {/* Header */}
        <header style={{
          background: "var(--white)", borderBottom: "2px solid var(--gold-pale)",
          padding: isMobile ? "1rem" : "1.5rem 2rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          boxShadow: "0 2px 8px rgba(20,33,61,0.08)", gap: "1rem", flexShrink: 0
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
            {/* Hamburger — always visible, toggles sidebar */}
            <button
              onClick={() => setSidebarOpen(v => !v)}
              style={{
                background: "none", border: "none", fontSize: "1.4rem",
                cursor: "pointer", color: "var(--navy)", padding: "0.25rem 0.5rem",
                borderRadius: "6px", flexShrink: 0, lineHeight: 1
              }}
              aria-label="Toggle menu"
            >
              ☰
            </button>
            <h2
              className="admin-header-title"
              style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--navy)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
            >
              {sectionTitle[activeSection]}
            </h2>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
            {!isMobile && (
              <span style={{ fontSize: "0.9rem", color: "var(--text-body)", whiteSpace: "nowrap" }}>
                Welcome, <strong>{user?.firstName || user?.email}</strong>
              </span>
            )}
            <div style={{
              width: "2.5rem", height: "2.5rem",
              background: `linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%)`,
              borderRadius: "50%", display: "flex", alignItems: "center",
              justifyContent: "center", color: "var(--navy)", fontWeight: "700",
              fontSize: "1rem", flexShrink: 0
            }}>
              {(user?.firstName?.[0] || user?.email?.[0] || "A").toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div style={{ flex: "1", overflowY: "auto", padding: isMobile ? "1rem" : "2rem" }}>

          {/* Overview */}
          {activeSection === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div
                className="admin-stats-grid"
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}
              >
                {[
                  { label: "Total Members", value: totalMembers, icon: "👥", borderColor: "var(--navy)" },
                  { label: "Monthly Revenue", value: fmtCur(monthlyRevenue), icon: "💰", borderColor: "var(--gold)" },
                  { label: "Avg Contribution", value: fmtCur(Math.round(totalContributions / totalMembers)), icon: "📊", borderColor: "var(--success)" },
                  { label: "Pending Actions", value: "3", icon: "⚠️", borderColor: "var(--danger)" },
                ].map((stat, i) => (
                  <div key={i} style={{
                    background: "var(--white)", borderRadius: "12px",
                    borderLeft: `4px solid ${stat.borderColor}`, padding: "1.25rem",
                    boxShadow: "0 2px 8px rgba(20,33,61,0.08)", transition: "all 0.3s ease"
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 16px rgba(20,33,61,0.15)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(20,33,61,0.08)"; }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                      <p style={{ color: "var(--text-body)", fontSize: "0.8rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>{stat.label}</p>
                      <span style={{ fontSize: "1.25rem" }}>{stat.icon}</span>
                    </div>
                    <p style={{ fontSize: "1.75rem", fontWeight: "700", color: "var(--navy)", margin: 0 }}>{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="admin-quick-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
                <div style={{ background: "var(--white)", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(20,33,61,0.08)" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "var(--navy)", marginBottom: "1rem", marginTop: 0 }}>Recent Members</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {mockMembers.slice(0, 4).map(member => (
                      <div key={member.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem", background: "var(--cream)", borderRadius: "8px" }}>
                        <div>
                          <p style={{ fontWeight: "600", color: "var(--navy)", margin: 0, fontSize: "0.9rem" }}>{member.name}</p>
                          <p style={{ fontSize: "0.78rem", color: "var(--text-body)", margin: 0 }}>{member.role}</p>
                        </div>
                        <span style={{ padding: "0.3rem 0.7rem", borderRadius: "20px", fontSize: "0.7rem", fontWeight: "600", background: member.status === "active" ? "var(--gold-pale)" : "rgba(90,100,120,0.1)", color: member.status === "active" ? "var(--navy)" : "var(--text-body)", whiteSpace: "nowrap" }}>
                          {member.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: "var(--white)", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(20,33,61,0.08)" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "var(--navy)", marginBottom: "1rem", marginTop: 0 }}>Upcoming Events</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {mockEvents.slice(0, 3).map(event => (
                      <div key={event.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem", background: "var(--cream)", borderRadius: "8px" }}>
                        <div>
                          <p style={{ fontWeight: "600", color: "var(--navy)", margin: 0, fontSize: "0.9rem" }}>{event.name}</p>
                          <p style={{ fontSize: "0.78rem", color: "var(--text-body)", margin: 0 }}>📅 {event.date}</p>
                        </div>
                        <span style={{ padding: "0.3rem 0.7rem", borderRadius: "20px", fontSize: "0.7rem", fontWeight: "600", background: "var(--gold-pale)", color: "var(--navy)", whiteSpace: "nowrap" }}>
                          {event.attendees}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Members */}
          {activeSection === "members" && (
            <div style={{ background: "var(--white)", borderRadius: "12px", boxShadow: "0 2px 8px rgba(20,33,61,0.08)", overflow: "hidden" }}>
              <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--gold-pale)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "var(--navy)", margin: 0 }}>Member Directory</h3>
                <button style={{ background: "linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%)", border: "none", color: "var(--navy)", padding: "0.6rem 1.2rem", borderRadius: "8px", cursor: "pointer", fontWeight: "600", transition: "all 0.2s ease", whiteSpace: "nowrap" }}
                  onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
                  onMouseLeave={e => e.target.style.transform = "translateY(0)"}
                >
                  + Add Member
                </button>
              </div>
              <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
                <table style={{ width: "100%", minWidth: "600px", borderCollapse: "collapse" }}>
                  <thead style={{ background: "var(--cream)" }}>
                    <tr>
                      {["Name", "Email", "Role", "Join Date", "Contributions", "Status", "Actions"].map(header => (
                        <th key={header} style={{ padding: "0.9rem 1rem", textAlign: "left", fontSize: "0.8rem", fontWeight: "700", color: "var(--navy)", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mockMembers.map(member => (
                      <tr key={member.id} style={{ borderBottom: "1px solid var(--gold-pale)", transition: "background 0.2s ease" }}
                        onMouseEnter={e => e.currentTarget.style.background = "var(--cream)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <td style={{ padding: "0.9rem 1rem", color: "var(--navy)", fontWeight: "500", whiteSpace: "nowrap" }}>{member.name}</td>
                        <td style={{ padding: "0.9rem 1rem", color: "var(--text-body)", fontSize: "0.85rem" }}>{member.email}</td>
                        <td style={{ padding: "0.9rem 1rem", color: "var(--navy)", whiteSpace: "nowrap" }}>{member.role}</td>
                        <td style={{ padding: "0.9rem 1rem", color: "var(--text-body)", fontSize: "0.85rem", whiteSpace: "nowrap" }}>{member.joinDate}</td>
                        <td style={{ padding: "0.9rem 1rem", color: "var(--navy)", fontWeight: "600", whiteSpace: "nowrap" }}>{fmtCur(member.contributions)}</td>
                        <td style={{ padding: "0.9rem 1rem" }}>
                          <span style={{ padding: "0.35rem 0.75rem", borderRadius: "20px", fontSize: "0.72rem", fontWeight: "600", whiteSpace: "nowrap", background: member.status === "active" ? "var(--gold-pale)" : "rgba(90,100,120,0.1)", color: member.status === "active" ? "var(--navy)" : "var(--text-body)" }}>
                            {member.status}
                          </span>
                        </td>
                        <td style={{ padding: "0.9rem 1rem" }}>
                          <button style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer", fontWeight: "600", transition: "color 0.2s ease" }}
                            onMouseEnter={e => e.target.style.color = "var(--navy)"}
                            onMouseLeave={e => e.target.style.color = "var(--gold)"}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Financials */}
          {activeSection === "financials" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ background: "var(--white)", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(20,33,61,0.08)" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "var(--navy)", marginBottom: "1.5rem", marginTop: 0 }}>Financial Summary</h3>
                <div className="admin-financials-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
                  {mockFinancials.map(item => (
                    <div key={item.id} style={{ padding: "1.25rem", background: `linear-gradient(135deg, var(--cream) 0%, var(--cream-dark) 100%)`, borderLeft: "3px solid var(--gold)", borderRadius: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                        <p style={{ fontWeight: "600", color: "var(--navy)", margin: 0 }}>{item.category}</p>
                        <span style={{ fontSize: "0.9rem", fontWeight: "700", color: item.trend.startsWith("+") ? "var(--success)" : "var(--danger)" }}>{item.trend}</span>
                      </div>
                      <p style={{ fontSize: "1.6rem", fontWeight: "700", color: "var(--navy)", margin: 0 }}>{fmtCur(item.amount)}</p>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-body)", marginTop: "0.5rem", marginBottom: 0 }}>Period: {item.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Events */}
          {activeSection === "events" && (
            <div style={{ background: "var(--white)", borderRadius: "12px", boxShadow: "0 2px 8px rgba(20,33,61,0.08)", overflow: "hidden" }}>
              <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--gold-pale)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "var(--navy)", margin: 0 }}>Event Management</h3>
                <button style={{ background: "linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%)", border: "none", color: "var(--navy)", padding: "0.6rem 1.2rem", borderRadius: "8px", cursor: "pointer", fontWeight: "600", transition: "all 0.2s ease", whiteSpace: "nowrap" }}
                  onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
                  onMouseLeave={e => e.target.style.transform = "translateY(0)"}
                >
                  + New Event
                </button>
              </div>
              <div>
                {mockEvents.map(event => (
                  <div key={event.id} style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--gold-pale)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", transition: "background 0.2s ease" }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--cream)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <div style={{ flex: 1, minWidth: "150px" }}>
                      <h4 style={{ fontWeight: "600", color: "var(--navy)", margin: 0 }}>{event.name}</h4>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-body)", margin: 0 }}>📅 {event.date}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--navy)", margin: 0 }}>{event.attendees}</p>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-body)", margin: 0 }}>attendees</p>
                    </div>
                    <span style={{ padding: "0.5rem 1rem", borderRadius: "20px", fontSize: "0.78rem", fontWeight: "600", background: "var(--gold-pale)", color: "var(--navy)", whiteSpace: "nowrap" }}>
                      {event.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reports */}
          {activeSection === "reports" && (
            <div style={{ background: "var(--white)", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(20,33,61,0.08)" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "var(--navy)", marginBottom: "0.5rem", marginTop: 0 }}>Reports & Analytics</h3>
              <p style={{ color: "var(--text-body)", marginBottom: "1.5rem" }}>Detailed analytics and reporting features coming soon...</p>
              <div className="admin-reports-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
                {[
                  { icon: "📊", title: "Member Statistics", desc: "View trends and growth" },
                  { icon: "💹", title: "Financial Reports", desc: "Detailed income analysis" },
                  { icon: "📈", title: "Event Analytics", desc: "Attendance and engagement" }
                ].map((report, i) => (
                  <button key={i} style={{ padding: "1rem", border: "1px solid var(--gold-pale)", borderRadius: "8px", background: "transparent", cursor: "pointer", transition: "all 0.2s ease", textAlign: "left" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.background = "var(--gold-pale)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--gold-pale)"; e.currentTarget.style.background = "transparent"; }}
                  >
                    <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem", marginTop: 0 }}>{report.icon} <strong style={{ color: "var(--navy)" }}>{report.title}</strong></p>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-body)", margin: 0 }}>{report.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Settings */}
          {activeSection === "settings" && (
            <div style={{ background: "var(--white)", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(20,33,61,0.08)", maxWidth: "600px" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "var(--navy)", marginBottom: "1.5rem", marginTop: 0 }}>Administrator Settings</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ paddingBottom: "1.5rem", borderBottom: "1px solid var(--gold-pale)" }}>
                  <h4 style={{ fontWeight: "600", color: "var(--navy)", marginBottom: "1rem", marginTop: 0 }}>Church Information</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {["Church Name", "Contact Email", "Phone Number"].map((placeholder, i) => (
                      <input key={i} type="text" placeholder={placeholder} style={{ padding: "0.75rem 1rem", border: "1.5px solid var(--gold-pale)", borderRadius: "8px", fontFamily: "'Lato', sans-serif", fontSize: "0.95rem", color: "var(--navy)", outline: "none", transition: "border-color 0.2s ease", width: "100%" }}
                        onFocus={e => e.target.style.borderColor = "var(--gold)"}
                        onBlur={e => e.target.style.borderColor = "var(--gold-pale)"}
                      />
                    ))}
                  </div>
                </div>
                <div style={{ paddingBottom: "1.5rem", borderBottom: "1px solid var(--gold-pale)" }}>
                  <h4 style={{ fontWeight: "600", color: "var(--navy)", marginBottom: "1rem", marginTop: 0 }}>Security</h4>
                  <button style={{ background: "linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%)", border: "none", color: "var(--navy)", padding: "0.7rem 1.5rem", borderRadius: "8px", cursor: "pointer", fontWeight: "600", transition: "all 0.2s ease" }}
                    onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
                    onMouseLeave={e => e.target.style.transform = "translateY(0)"}
                  >
                    Change Password
                  </button>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", flexWrap: "wrap" }}>
                  <button style={{ background: "var(--cream-dark)", border: "none", color: "var(--navy)", padding: "0.7rem 1.5rem", borderRadius: "8px", cursor: "pointer", fontWeight: "600", transition: "all 0.2s ease" }}
                    onMouseEnter={e => e.target.style.opacity = "0.8"}
                    onMouseLeave={e => e.target.style.opacity = "1"}
                  >
                    Cancel
                  </button>
                  <button style={{ background: "var(--success)", border: "none", color: "var(--white)", padding: "0.7rem 1.5rem", borderRadius: "8px", cursor: "pointer", fontWeight: "600", transition: "all 0.2s ease" }}
                    onMouseEnter={e => e.target.style.opacity = "0.9"}
                    onMouseLeave={e => e.target.style.opacity = "1"}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;