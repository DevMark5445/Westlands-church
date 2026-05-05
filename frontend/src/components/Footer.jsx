// src/components/Footer.jsx
// Matches the Westlands P.A.G theme exactly:
// Background: #14213d (navy) | Accent: #c9a84c / #e8c876 (gold)
// Fonts: Cinzel (headings) + Lato (body) — load via index.html or @import in CSS:
// @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Lato:wght@300;400;700&display=swap');

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        fontFamily: "'Lato', 'Inter', system-ui, sans-serif",
        background: "#14213d",
        color: "#f7f4ee",
        padding: "3rem 1.5rem 1.5rem",
        width: "100%",
      }}
    >
      {/* ── Top four-column grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "2.5rem",
          maxWidth: 1100,
          margin: "0 auto 2.5rem",
        }}
      >
        {/* ── Column 1: Brand + Social ── */}
        <div style={{ minWidth: 0 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "linear-gradient(135deg, #c9a84c, #e8c876)",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
            >
              <svg viewBox="0 0 20 20" style={{ width: 18, height: 18, fill: "#14213d" }}>
                <rect x="8.5" y="1"   width="3"  height="18" rx="1" />
                <rect x="2"   y="6.5" width="16" height="3"  rx="1" />
              </svg>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "1rem", fontWeight: 700, letterSpacing: "0.06em", color: "#f7f4ee", fontFamily: "Georgia, serif" }}>
                Westlands
              </p>
              <p style={{ margin: 0, fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a84c" }}>
                P.A.G Church
              </p>
            </div>
          </div>

          <p style={{ margin: "0 0 1.25rem", fontSize: "0.82rem", lineHeight: 1.7, color: "rgba(247,244,238,0.6)", maxWidth: 220 }}>
            A community rooted in faith, love, and service. Everyone is welcome.
          </p>

          {/* Social icons */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {socialLinks.map(({ label, href, icon }) => (
              <SocialIcon key={label} href={href} label={label} icon={icon} />
            ))}
          </div>
        </div>

        {/* ── Column 2: Quick Links ── */}
        <div style={{ minWidth: 0 }}>
          <ColHeading>Quick Links</ColHeading>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.55rem" }}>
            {quickLinks.map(({ label, href }) => (
              <li key={label}>
                <FooterLink href={href}>
                  <span style={{ color: "#c9a84c", fontSize: 10 }}>▸</span>
                  {label}
                </FooterLink>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Column 3: Service Times ── */}
        <div style={{ minWidth: 0 }}>
          <ColHeading>Service Times</ColHeading>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
            {serviceTimes.map(({ day, time, featured }) => (
              <div
                key={day}
                style={{
                  padding: "0.65rem 0.85rem",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 8,
                  borderLeft: `2px solid ${featured ? "#c9a84c" : "rgba(201,168,76,0.4)"}`,
                }}
              >
                <p style={{ margin: "0 0 0.1rem", fontSize: "0.8rem", fontWeight: 700, color: "#f7f4ee" }}>{day}</p>
                <p style={{ margin: 0, fontSize: "0.72rem", color: "rgba(247,244,238,0.5)" }}>{time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Column 4: Location & Contact ── */}
        <div style={{ minWidth: 0 }}>
          <ColHeading>Find Us</ColHeading>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>

            {/* Address */}
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <IconBox>
                <svg viewBox="0 0 24 24" style={iconStyle}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </IconBox>
              <div>
                <p style={{ margin: "0 0 0.1rem", fontSize: "0.78rem", fontWeight: 700, color: "#f7f4ee" }}>Westlands, Nairobi</p>
                <p style={{ margin: 0, fontSize: "0.72rem", color: "rgba(247,244,238,0.5)", lineHeight: 1.5 }}>
                  Ring Road Westlands,<br />Off Waiyaki Way, Nairobi
                </p>
              </div>
            </div>

            {/* Phone */}
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <IconBox>
                <svg viewBox="0 0 24 24" style={iconStyle}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 5.29 5.29l.95-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
                </svg>
              </IconBox>
              <HoverLink href="tel:+254700000000">+254 700 000 000</HoverLink>
            </div>

            {/* Email */}
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <IconBox>
                <svg viewBox="0 0 24 24" style={iconStyle}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </IconBox>
              <HoverLink href="mailto:info@westlandspag.org">info@westlandspag.org</HoverLink>
            </div>

          </div>
        </div>
      </div>

      {/* ── Map embed strip ── */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto 2rem",
          borderRadius: 10,
          overflow: "hidden",
          border: "1px solid rgba(201,168,76,0.18)",
        }}
      >
        {/* Map header bar */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            padding: "0.7rem 1.1rem",
            display: "flex",
            alignItems: "center",
            gap: 8,
            borderBottom: "1px solid rgba(201,168,76,0.15)",
          }}
        >
          <svg viewBox="0 0 24 24" style={{ ...iconStyle, flexShrink: 0 }}>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span style={{ fontSize: "0.72rem", color: "rgba(247,244,238,0.55)" }}>
            Ring Road Westlands, Off Waiyaki Way, Nairobi, Kenya
          </span>
          <a
            href="https://maps.google.com/?q=Westlands+Nairobi+Kenya"
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginLeft: "auto", fontSize: "0.7rem", color: "#c9a84c", textDecoration: "none", whiteSpace: "nowrap" }}
            onMouseOver={e => (e.currentTarget.style.color = "#e8c876")}
            onMouseOut={e  => (e.currentTarget.style.color = "#c9a84c")}
          >
            Open in Maps ↗
          </a>
        </div>

        {/* Iframe */}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.164890522478!2d36.7989!3d-1.2661!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f173c0a1d9f77%3A0x20e6c14ef36d27f4!2sWestlands%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1620000000000!5m2!1sen!2ske"
          width="100%"
          height="200"
          style={{ display: "block", border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Westlands PAG Church location map"
        />
      </div>

      {/* ── Bottom bar ── */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          borderTop: "1px solid rgba(201,168,76,0.15)",
          paddingTop: "1.25rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem",
        }}
      >
        <p style={{ margin: 0, fontSize: "0.7rem", color: "rgba(247,244,238,0.35)" }}>
          &copy; {year} Westlands P.A.G Church. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
          {["Privacy Policy", "Terms of Service", "Support"].map(link => (
            <a
              key={link}
              href="#"
              style={{ fontSize: "0.7rem", color: "rgba(247,244,238,0.35)", textDecoration: "none" }}
              onMouseOver={e => (e.currentTarget.style.color = "#c9a84c")}
              onMouseOut={e  => (e.currentTarget.style.color = "rgba(247,244,238,0.35)")}
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ─── Data ───────────────────────────────────────────────────────────────────── */
const quickLinks = [
  { label: "Home",        href: "/" },
  { label: "About Us",    href: "/about" },
  { label: "Sermons",     href: "/sermons" },
  { label: "Events",      href: "/events" },
  { label: "Give Online", href: "/give" },
  { label: "Contact",     href: "/contact" },
];

const serviceTimes = [
  { day: "Sunday Worship",   time: "9:00 AM & 11:30 AM", featured: true  },
  { day: "Wednesday Prayer", time: "7:00 PM",            featured: false },
  { day: "Friday Youth",     time: "6:00 PM",            featured: false },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://facebook.com/westlandspag",
    icon: (
      <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, fill: "#c9a84c" }}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/westlandspag",
    icon: (
      <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, fill: "none", stroke: "#c9a84c", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@westlandspag",
    icon: (
      <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, fill: "none", stroke: "#c9a84c", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }}>
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "https://x.com/westlandspag",
    icon: (
      <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, fill: "#c9a84c" }}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/254700000000",
    icon: (
      <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, fill: "none", stroke: "#c9a84c", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }}>
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
];

/* ─── Shared style token ─────────────────────────────────────────────────────── */
const iconStyle = {
  width: 13,
  height: 13,
  fill: "none",
  stroke: "#c9a84c",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

/* ─── Small reusable sub-components ─────────────────────────────────────────── */

/** Gold uppercase column heading */
function ColHeading({ children }) {
  return (
    <h4
      style={{
        margin: "0 0 1rem",
        fontSize: "0.7rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.15em",
        color: "#c9a84c",
        fontFamily: "'Lato', sans-serif",
      }}
    >
      {children}
    </h4>
  );
}

/** Gold icon background pill */
function IconBox({ children }) {
  return (
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: 6,
        background: "rgba(201,168,76,0.12)",
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  );
}

/** Muted text link that turns gold on hover */
function HoverLink({ href, children }) {
  return (
    <a
      href={href}
      style={{ fontSize: "0.78rem", color: "rgba(247,244,238,0.65)", textDecoration: "none" }}
      onMouseOver={e => (e.currentTarget.style.color = "#e8c876")}
      onMouseOut={e  => (e.currentTarget.style.color = "rgba(247,244,238,0.65)")}
    >
      {children}
    </a>
  );
}

/** Quick-links anchor with arrow */
function FooterLink({ href, children }) {
  return (
    <a
      href={href}
      style={{
        fontSize: "0.82rem",
        color: "rgba(247,244,238,0.65)",
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        gap: 6,
        transition: "color 0.2s",
      }}
      onMouseOver={e => (e.currentTarget.style.color = "#e8c876")}
      onMouseOut={e  => (e.currentTarget.style.color = "rgba(247,244,238,0.65)")}
    >
      {children}
    </a>
  );
}

/** Social icon button */
function SocialIcon({ href, label, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      aria-label={label}
      style={{
        width: 34,
        height: 34,
        borderRadius: 8,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(201,168,76,0.2)",
        display: "grid",
        placeItems: "center",
        textDecoration: "none",
        transition: "background 0.2s",
      }}
      onMouseOver={e => (e.currentTarget.style.background = "rgba(201,168,76,0.18)")}
      onMouseOut={e  => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
    >
      {icon}
    </a>
  );
}