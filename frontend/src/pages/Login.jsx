import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Lato:wght@300;400;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { height: 100%; }
  body { font-family: 'Lato', sans-serif; -webkit-font-smoothing: antialiased; min-height: 100%; }
  a { text-decoration: none; color: inherit; }
  :root {
    --navy: #14213d; --navy-mid: #1e3160; --navy-light: #2a4480;
    --gold: #c9a84c; --gold-light: #e8c876; --gold-pale: rgba(201,168,76,0.12);
    --cream: #f7f4ee; --cream-dark: #ede9e0; --white: #ffffff;
    --text-body: #5a6478; --text-light: rgba(247,244,238,0.72);
    --danger: #d94f4f; --success: #3d9970; --ease: cubic-bezier(0.4,0,0.2,1);
  }
  @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes spin   { to { transform:rotate(360deg); } }
  @keyframes shake  { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }

  .login-page { min-height:100vh; display:grid; grid-template-columns:1fr 1fr; }

  .login-brand {
    position:relative; display:flex; flex-direction:column; justify-content:space-between;
    padding:clamp(2rem,5vw,3.5rem);
    background:linear-gradient(160deg,var(--navy) 0%,var(--navy-mid) 55%,var(--navy-light) 100%);
    overflow:hidden;
  }
  .brand-glow-a { position:absolute;border-radius:50%;pointer-events:none;width:500px;height:500px;top:-150px;right:-120px;background:radial-gradient(circle,rgba(201,168,76,.09) 0%,transparent 70%); }
  .brand-glow-b { position:absolute;border-radius:50%;pointer-events:none;width:400px;height:400px;bottom:-120px;left:-80px;background:radial-gradient(circle,rgba(42,68,128,.55) 0%,transparent 70%); }
  .brand-watermark { position:absolute;bottom:10%;right:-40px;opacity:.04;pointer-events:none; }
  .brand-watermark svg { width:320px;height:320px;fill:var(--white); }
  .brand-top { position:relative;z-index:1; }
  .brand-logo { display:flex;align-items:center;gap:.65rem; }
  .brand-logo-mark { width:40px;height:40px;border-radius:8px;flex-shrink:0;background:linear-gradient(135deg,var(--gold) 0%,var(--gold-light) 100%);display:grid;place-items:center;box-shadow:0 4px 16px rgba(201,168,76,.3); }
  .brand-logo-mark svg { width:22px;height:22px;fill:var(--navy); }
  .brand-logo-text { display:flex;flex-direction:column;line-height:1.1; }
  .brand-logo-name { font-family:'Cinzel',serif;font-weight:700;font-size:1.1rem;letter-spacing:.08em;color:#f7f4ee; }
  .brand-logo-tagline { font-size:.6rem;font-weight:300;letter-spacing:.22em;text-transform:uppercase;color:var(--gold); }
  .brand-mid { position:relative;z-index:1;animation:fadeUp .9s var(--ease) .1s both; }
  .brand-headline { font-family:'Cinzel',serif;font-weight:700;font-size:clamp(1.7rem,3vw,2.6rem);line-height:1.2;color:#f7f4ee;max-width:380px;margin-block-end:1.1rem; }
  .brand-headline em { font-style:normal;background:linear-gradient(90deg,var(--gold) 0%,var(--gold-light) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
  .brand-body { font-size:.92rem;font-weight:300;line-height:1.8;color:var(--text-light);max-width:360px; }
  .brand-pills { display:flex;flex-direction:column;gap:.65rem;margin-block-start:2rem; }
  .brand-pill { display:flex;align-items:center;gap:.7rem;padding:.6rem .9rem;border-radius:10px;background:rgba(255,255,255,.05);border:1px solid rgba(201,168,76,.15);backdrop-filter:blur(4px);animation:fadeUp .7s var(--ease) both; }
  .brand-pill:nth-child(1){animation-delay:.25s} .brand-pill:nth-child(2){animation-delay:.35s} .brand-pill:nth-child(3){animation-delay:.45s}
  .brand-pill-icon { width:30px;height:30px;border-radius:6px;flex-shrink:0;background:var(--gold-pale);display:grid;place-items:center; }
  .brand-pill-icon svg { width:15px;height:15px;stroke:var(--gold);fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round; }
  .brand-pill-label { font-size:.8rem;font-weight:300;letter-spacing:.04em;color:rgba(247,244,238,.65); }
  .brand-bottom { position:relative;z-index:1;font-size:.7rem;font-weight:300;letter-spacing:.06em;color:rgba(247,244,238,.3); }

  .login-form-panel { display:flex;flex-direction:column;justify-content:center;align-items:center;background:var(--cream);padding:clamp(2rem,6vw,4rem) clamp(1.5rem,5vw,3rem);animation:fadeIn .6s var(--ease) both; }
  .login-card { width:100%;max-width:420px; }
  .form-header { margin-block-end:2.4rem; }
  .form-eyebrow { display:inline-flex;align-items:center;gap:.45rem;margin-block-end:.9rem;padding:.28rem .8rem;border-radius:100px;border:1px solid rgba(201,168,76,.3);background:rgba(201,168,76,.08);font-size:.65rem;font-weight:400;letter-spacing:.22em;text-transform:uppercase;color:var(--gold);animation:fadeIn .6s ease .2s both; }
  .form-eyebrow-dot { width:5px;height:5px;border-radius:50%;background:var(--gold);flex-shrink:0; }
  .form-title { font-family:'Cinzel',serif;font-weight:700;font-size:clamp(1.5rem,3vw,2rem);color:var(--navy);line-height:1.2;letter-spacing:-.01em;animation:fadeUp .65s var(--ease) .15s both; }
  .form-subtitle { margin-block-start:.6rem;font-size:.875rem;font-weight:300;line-height:1.6;color:var(--text-body);animation:fadeUp .65s var(--ease) .25s both; }
  .field { margin-block-end:1.2rem; }
  .field-label { display:block;margin-block-end:.45rem;font-size:.75rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--navy); }
  .field-wrap { position:relative; }
  .field-icon { position:absolute;left:.9rem;top:50%;transform:translateY(-50%);display:flex;align-items:center;pointer-events:none; }
  .field-icon svg { width:16px;height:16px;stroke:var(--text-body);fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;transition:stroke .2s; }
  .field-input { width:100%;padding:.78rem 2.8rem .78rem 2.6rem;border-radius:8px;border:1.5px solid rgba(20,33,61,.14);background:var(--white);font-family:'Lato',sans-serif;font-size:.9rem;font-weight:400;color:var(--navy);outline:none;transition:border-color .2s,box-shadow .2s;-webkit-appearance:none; }
  .field-input::placeholder { color:rgba(90,100,120,.45);font-weight:300; }
  .field-input:focus { border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,168,76,.15); }
  .field-input.error { border-color:var(--danger);box-shadow:0 0 0 3px rgba(217,79,79,.12); }
  .pwd-toggle { position:absolute;right:.85rem;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;padding:.2rem;display:flex;align-items:center;outline:none;border-radius:4px; }
  .pwd-toggle svg { width:17px;height:17px;stroke:var(--text-body);fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;transition:stroke .2s; }
  .pwd-toggle:hover svg { stroke:var(--gold); }
  .field-error { display:flex;align-items:center;gap:.35rem;margin-block-start:.4rem;font-size:.75rem;color:var(--danger);font-weight:400;animation:fadeIn .2s ease; }
  .field-error svg { width:13px;height:13px;stroke:var(--danger);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0; }
  .forgot-row { display:flex;justify-content:flex-end;margin-block-start:-.5rem;margin-block-end:1.6rem; }
  .forgot-link { font-size:.76rem;font-weight:400;color:var(--gold);letter-spacing:.02em;transition:color .2s;outline:none;border-radius:3px; }
  .forgot-link:hover { color:var(--navy); }
  .submit-btn { width:100%;padding:.9rem 1.5rem;border-radius:8px;border:none;cursor:pointer;outline:none;display:flex;align-items:center;justify-content:center;gap:.55rem;background:linear-gradient(135deg,var(--gold) 0%,var(--gold-light) 100%);color:var(--navy);font-family:'Lato',sans-serif;font-size:.88rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;box-shadow:0 4px 20px rgba(201,168,76,.35);transition:transform .22s var(--ease),box-shadow .22s var(--ease),filter .22s; }
  .submit-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 30px rgba(201,168,76,.45);filter:brightness(1.04);}
  .submit-btn:active:not(:disabled){transform:translateY(0);}
  .submit-btn:disabled{opacity:.7;cursor:not-allowed;}
  .submit-btn svg{width:16px;height:16px;stroke:var(--navy);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}
  .spinner{width:16px;height:16px;border-radius:50%;flex-shrink:0;border:2px solid rgba(20,33,61,.25);border-top-color:var(--navy);animation:spin .7s linear infinite;}
  .form-shake{animation:shake .4s var(--ease);}
  .alert{display:flex;align-items:flex-start;gap:.65rem;padding:.85rem 1rem;border-radius:8px;margin-block-end:1.4rem;font-size:.82rem;line-height:1.55;animation:fadeIn .3s ease;}
  .alert-danger{background:rgba(217,79,79,.09);border:1px solid rgba(217,79,79,.25);color:var(--danger);}
  .alert-success{background:rgba(61,153,112,.09);border:1px solid rgba(61,153,112,.25);color:var(--success);}
  .alert svg{width:16px;height:16px;flex-shrink:0;margin-block-start:.05rem;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}
  .form-divider{display:flex;align-items:center;gap:.9rem;margin-block:1.6rem;}
  .form-divider-line{flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(20,33,61,.12),transparent);}
  .form-divider-text{font-size:.7rem;font-weight:300;letter-spacing:.12em;text-transform:uppercase;color:rgba(90,100,120,.5);white-space:nowrap;}
  .back-home{display:inline-flex;align-items:center;gap:.4rem;margin-block-start:1.6rem;font-size:.8rem;font-weight:400;color:var(--text-body);letter-spacing:.03em;transition:color .2s;outline:none;border-radius:3px;}
  .back-home:hover{color:var(--navy);}
  .back-home svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;transition:transform .2s;}
  .back-home:hover svg{transform:translateX(-3px);}
  .form-footer-note{margin-block-start:2rem;text-align:center;font-size:.72rem;font-weight:300;color:rgba(90,100,120,.55);line-height:1.6;}
  .form-footer-note a{color:var(--gold);font-weight:400;transition:color .2s;}
  .form-footer-note a:hover{color:var(--navy);}
  @media(max-width:860px){
    .login-page{grid-template-columns:1fr;}
    .login-brand{display:none;}
    .login-form-panel{min-height:100vh;padding:clamp(2rem,8vw,3.5rem) clamp(1.25rem,6vw,2.5rem);}
  }
  .mobile-brand-bar{display:none;align-items:center;justify-content:center;gap:.6rem;padding:1rem;background:var(--navy);border-bottom:2px solid var(--gold);}
  .mobile-brand-bar .brand-logo-mark{width:32px;height:32px;border-radius:6px;background:linear-gradient(135deg,var(--gold) 0%,var(--gold-light) 100%);display:grid;place-items:center;}
  .mobile-brand-bar .brand-logo-mark svg{width:18px;height:18px;fill:var(--navy);}
  .mobile-brand-bar .brand-logo-name{font-family:'Cinzel',serif;font-weight:700;font-size:.95rem;letter-spacing:.08em;color:#f7f4ee;}
  @media(max-width:860px){.mobile-brand-bar{display:flex;}.login-form-panel{justify-content:flex-start;padding-block-start:2.5rem;}}
`;

const CrossSvg = ({ size = 22 }) => (
  <svg viewBox="0 0 20 20" aria-hidden="true" style={{ width: size, height: size }}>
    <rect x="8.5" y="1" width="3" height="18" rx="1" />
    <rect x="2" y="6.5" width="16" height="3" rx="1" />
  </svg>
);
const EmailIcon = () => (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>);
const LockIcon  = () => (<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>);
const EyeIcon   = () => (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>);
const EyeOffIcon= () => (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>);
const ArrowRightIcon= () => (<svg viewBox="0 0 24 24" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>);
const ArrowLeftIcon = () => (<svg viewBox="0 0 24 24" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>);
const AlertCircle   = () => (<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>);
const CheckCircle   = () => (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>);
const MembersSvg    = () => (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const FinanceSvg    = () => (<svg viewBox="0 0 24 24" aria-hidden="true"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>);
const CalendarSvg   = () => (<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>);

const validate = (email, password) => {
  const errs = {};
  if (!email.trim())                                       errs.email    = "Email address is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))    errs.email    = "Please enter a valid email address.";
  if (!password)                                           errs.password = "Password is required.";
  else if (password.length < 6)                           errs.password = "Password must be at least 6 characters.";
  return errs;
};

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (isAuthenticated) navigate("/dashboard"); }, [isAuthenticated, navigate]);

  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [showPwd,    setShowPwd]    = useState(false);
  const [errors,     setErrors]     = useState({});
  const [loading,    setLoading]    = useState(false);
  const [alert,      setAlert]      = useState(null);
  const [shake,      setShake]      = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const id = "gracehub-login-css";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style"); tag.id = id; tag.textContent = GLOBAL_CSS;
      document.head.appendChild(tag);
    }
  }, []);

  const triggerShake = () => { setShake(true); setTimeout(() => setShake(false), 420); };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setAlert(null);
    const errs = validate(email, password);
    if (Object.keys(errs).length) { 
      setErrors(errs); 
      triggerShake(); 
      return; 
    }
    setErrors({}); 
    setLoading(true);
    try {
      const result = await login(email, password);
      console.log("Login result:", result);
      if (result.success) {
        setAlert({ type: "success", message: "Login successful! Redirecting…" });
        if (rememberMe) sessionStorage.setItem("rememberMe", "true");
        // Navigate immediately
        navigate("/dashboard", { replace: true });
      } else {
        setAlert({ type: "danger", message: result.message || "Invalid email or password. Please try again." });
        triggerShake();
      }
    } catch (error) {
      console.error("Submit error:", error);
      setAlert({ type: "danger", message: error.message || "Network error. Please check your connection." });
      triggerShake();
    } finally { setLoading(false); }
  };

  const pills = [{ Icon: MembersSvg, label: "Member Management" }, { Icon: FinanceSvg, label: "Financial Tracking" }, { Icon: CalendarSvg, label: "Event Management" }];

  return (
    <>
      <div className="mobile-brand-bar" aria-hidden="true">
        <div className="brand-logo-mark"><CrossSvg size={18} /></div>
        <span className="brand-logo-name">Westlands P.A.G</span>
      </div>

      <div className="login-page">
        {/* Left brand panel */}
        <aside className="login-brand">
          <div className="brand-glow-a" /><div className="brand-glow-b" />
          <div className="brand-watermark"><CrossSvg size={320} /></div>
          <div className="brand-top">
            <div className="brand-logo">
              <div className="brand-logo-mark"><CrossSvg size={22} /></div>
              <div className="brand-logo-text">
                <span className="brand-logo-name">Westlands P.A.G</span>
                <span className="brand-logo-tagline">Church Management</span>
              </div>
            </div>
          </div>
          <div className="brand-mid">
            <h2 className="brand-headline">Welcome <em>Back</em> to Your Community Hub</h2>
            <p className="brand-body">Sign in to manage your congregation, track giving, and coordinate events — all from one secure place.</p>
            <div className="brand-pills">
              {pills.map(({ Icon, label }) => (
                <div key={label} className="brand-pill">
                  <div className="brand-pill-icon"><Icon /></div>
                  <span className="brand-pill-label">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="brand-bottom">&copy; {new Date().getFullYear()} Westlands P.A.G. All rights reserved.</div>
        </aside>

        {/* Right form panel */}
        <main className="login-form-panel" id="main-content">
          <div className="login-card">
            <div className="form-header">
              <div className="form-eyebrow"><span className="form-eyebrow-dot" />Secure Login</div>
              <h1 className="form-title">Sign In</h1>
              <p className="form-subtitle">Enter your credentials to access your church dashboard.</p>
            </div>

            {alert && (
              <div className={`alert alert-${alert.type}`} role="alert" aria-live="assertive">
                {alert.type === "danger" ? <AlertCircle /> : <CheckCircle />}
                <span>{alert.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className={shake ? "form-shake" : ""}>
              {/* Email */}
              <div className="field">
                <label className="field-label" htmlFor="email">Email Address</label>
                <div className="field-wrap">
                  <span className="field-icon"><EmailIcon /></span>
                  <input id="email" type="email" className={`field-input${errors.email ? " error" : ""}`}
                    placeholder="pastor@mychurch.org" value={email}
                    onChange={e => { setEmail(e.target.value); setErrors(p => ({...p, email:""})); }}
                    autoComplete="email" aria-required="true" />
                </div>
                {errors.email && <p className="field-error" role="alert"><AlertCircle />{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="field">
                <label className="field-label" htmlFor="password">Password</label>
                <div className="field-wrap">
                  <span className="field-icon"><LockIcon /></span>
                  <input id="password" type={showPwd ? "text" : "password"} className={`field-input${errors.password ? " error" : ""}`}
                    placeholder="••••••••" value={password}
                    onChange={e => { setPassword(e.target.value); setErrors(p => ({...p, password:""})); }}
                    autoComplete="current-password" aria-required="true" />
                  <button type="button" className="pwd-toggle" onClick={() => setShowPwd(v => !v)} aria-label={showPwd ? "Hide password" : "Show password"}>
                    {showPwd ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {errors.password && <p className="field-error" role="alert"><AlertCircle />{errors.password}</p>}
              </div>

              {/* Remember + Forgot */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.6rem" }}>
                <label style={{ display:"flex", alignItems:"center", gap:".45rem", cursor:"pointer" }}>
                  <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
                    style={{ accentColor:"var(--gold)", width:"15px", height:"15px", cursor:"pointer" }} />
                  <span style={{ fontSize:".8rem", fontWeight:300, color:"var(--text-body)" }}>Remember me</span>
                </label>
                <a href="/forgot-password" className="forgot-link">Forgot password?</a>
              </div>

              <button type="submit" className="submit-btn" disabled={loading} aria-busy={loading}>
                {loading ? <><span className="spinner" />{" "}Signing in…</> : <>Sign In<ArrowRightIcon /></>}
              </button>
            </form>

            <div className="form-divider" aria-hidden="true">
              <div className="form-divider-line" />
              <span className="form-divider-text">Secure · Encrypted · Private</span>
              <div className="form-divider-line" />
            </div>

            <a href="/" className="back-home"><ArrowLeftIcon />Back to homepage</a>

            <p className="form-footer-note">
              Need help? Contact your <a href="mailto:support@westlandspag.org">church administrator</a> or visit our <a href="/support">support centre</a>.
            </p>
            <p style={{ marginTop:"1rem", fontSize:".85rem", textAlign:"center", color:"var(--text-body)" }}>
              Don't have an account? <Link to="/register" style={{ color:"var(--gold)", fontWeight:400 }}>Create one here</Link>
            </p>
          </div>
        </main>
      </div>
    </>
  );
}