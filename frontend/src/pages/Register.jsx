import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

/* ══════════════════════════════════════════════════
   GLOBAL STYLES
══════════════════════════════════════════════════ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Lato:wght@300;400;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { height: 100%; }
  body {
    font-family: 'Lato', sans-serif;
    -webkit-font-smoothing: antialiased;
    min-height: 100%;
  }
  a { text-decoration: none; color: inherit; }

  :root {
    --navy:       #14213d;
    --navy-mid:   #1e3160;
    --navy-light: #2a4480;
    --gold:       #c9a84c;
    --gold-light: #e8c876;
    --gold-pale:  rgba(201,168,76,0.12);
    --cream:      #f7f4ee;
    --cream-dark: #ede9e0;
    --white:      #ffffff;
    --text-body:  #5a6478;
    --text-light: rgba(247,244,238,0.72);
    --danger:     #d94f4f;
    --success:    #3d9970;
    --ease:       cubic-bezier(0.4,0,0.2,1);
  }

  @keyframes fadeUp {
    from { opacity:0; transform:translateY(24px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity:0; }
    to   { opacity:1; }
  }
  @keyframes spin {
    to { transform:rotate(360deg); }
  }
  @keyframes shake {
    0%,100% { transform:translateX(0); }
    20%     { transform:translateX(-8px); }
    40%     { transform:translateX(8px); }
    60%     { transform:translateX(-5px); }
    80%     { transform:translateX(5px); }
  }

  /* ── Register page shell ── */
  .register-page {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  /* ════════════════════════════════════
     LEFT PANEL — brand
  ════════════════════════════════════ */
  .reg-brand {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: clamp(2rem, 5vw, 3.5rem);
    background: linear-gradient(160deg, var(--navy) 0%, var(--navy-mid) 55%, var(--navy-light) 100%);
    overflow: hidden;
  }

  .brand-glow-a {
    position:absolute; border-radius:50%; pointer-events:none;
    width:500px; height:500px; top:-150px; right:-120px;
    background:radial-gradient(circle, rgba(201,168,76,.09) 0%, transparent 70%);
  }
  .brand-glow-b {
    position:absolute; border-radius:50%; pointer-events:none;
    width:400px; height:400px; bottom:-120px; left:-80px;
    background:radial-gradient(circle, rgba(42,68,128,.55) 0%, transparent 70%);
  }

  .brand-watermark {
    position:absolute; bottom: 10%; right: -40px;
    opacity:.04; pointer-events:none;
  }
  .brand-watermark svg { width:320px; height:320px; fill:var(--white); }

  .brand-top { position:relative; z-index:1; }
  .brand-logo {
    display:flex; align-items:center; gap:.65rem;
  }
  .brand-logo-mark {
    width:40px; height:40px; border-radius:8px; flex-shrink:0;
    background:linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
    display:grid; place-items:center;
    box-shadow:0 4px 16px rgba(201,168,76,.3);
  }
  .brand-logo-mark svg { width:22px; height:22px; fill:var(--navy); }
  .brand-logo-text { display:flex; flex-direction:column; line-height:1.1; }
  .brand-logo-name {
    font-family:'Cinzel',serif; font-weight:700;
    font-size:1.1rem; letter-spacing:.08em; color:#f7f4ee;
  }
  .brand-logo-tagline {
    font-size:.6rem; font-weight:300; letter-spacing:.22em;
    text-transform:uppercase; color:var(--gold);
  }

  .brand-mid {
    position:relative; z-index:1;
    animation: fadeUp .9s var(--ease) .1s both;
  }
  .brand-headline {
    font-family:'Cinzel',serif; font-weight:700;
    font-size:clamp(1.7rem,3vw,2.6rem); line-height:1.2;
    color:#f7f4ee; max-width:380px; margin-block-end:1.1rem;
  }
  .brand-headline em {
    font-style:normal;
    background:linear-gradient(90deg, var(--gold) 0%, var(--gold-light) 100%);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-clip:text;
  }
  .brand-body {
    font-size:.92rem; font-weight:300; line-height:1.8;
    color:var(--text-light); max-width:360px;
  }

  /* Onboarding Steps */
  .brand-steps {
    display:flex; flex-direction:column; gap:.65rem;
    margin-block-start:2rem;
  }
  .brand-step {
    display:flex; align-items:flex-start; gap:.75rem;
    padding:.7rem .9rem;
    border-radius:10px;
    background:rgba(255,255,255,.05);
    border:1px solid rgba(201,168,76,.15);
    backdrop-filter:blur(4px);
    animation: fadeUp .7s var(--ease) both;
  }
  .brand-step:nth-child(1) { animation-delay:.25s; }
  .brand-step:nth-child(2) { animation-delay:.35s; }
  .brand-step:nth-child(3) { animation-delay:.45s; }
  .brand-step:nth-child(4) { animation-delay:.55s; }
  .brand-step-num {
    width:22px; height:22px; border-radius:50%; flex-shrink:0;
    background:linear-gradient(135deg, var(--gold), var(--gold-light));
    display:grid; place-items:center;
    font-size:.65rem; font-weight:700; color:var(--navy);
    margin-top:1px;
  }
  .brand-step-text { display:flex; flex-direction:column; gap:.15rem; }
  .brand-step-title {
    font-size:.8rem; font-weight:700;
    color:rgba(247,244,238,.85); letter-spacing:.02em;
  }
  .brand-step-sub {
    font-size:.72rem; font-weight:300;
    color:rgba(247,244,238,.45);
  }

  .brand-bottom {
    position:relative; z-index:1;
    font-size:.7rem; font-weight:300; letter-spacing:.06em;
    color:rgba(247,244,238,.3);
  }

  /* ════════════════════════════════════
     RIGHT PANEL — form
  ════════════════════════════════════ */
  .register-form-panel {
    display:flex; flex-direction:column; justify-content:center; align-items:center;
    background:var(--cream);
    padding: clamp(2rem, 6vw, 4rem) clamp(1.5rem, 5vw, 3rem);
    overflow-y: auto;
    animation: fadeIn .6s var(--ease) both;
  }

  .register-card {
    width:100%; max-width:480px;
  }

  /* Success State */
  .success-state {
    display:flex; flex-direction:column; align-items:center;
    text-align:center; padding:2rem 1rem;
    animation: fadeUp .6s var(--ease);
  }
  .success-icon {
    width:72px; height:72px; border-radius:50%;
    background:linear-gradient(135deg, var(--gold), var(--gold-light));
    display:grid; place-items:center;
    margin:0 auto 1.5rem;
    box-shadow:0 8px 30px rgba(201,168,76,.35);
  }
  .success-icon svg {
    width:34px; height:34px; stroke:var(--navy); fill:none;
    stroke-width:2.5; stroke-linecap:round; stroke-linejoin:round;
  }
  .success-title {
    font-family:'Cinzel',serif; font-weight:700;
    font-size:1.6rem; color:var(--navy); margin-bottom:.65rem;
  }
  .success-body {
    font-size:.9rem; font-weight:300; line-height:1.7;
    color:var(--text-body); max-width:340px; margin:0 auto 1.8rem;
  }
  .success-body strong { font-weight:700; color:var(--navy); }
  .success-cta {
    display:inline-flex; align-items:center; gap:.5rem;
    padding:.78rem 2rem; border-radius:8px;
    background:linear-gradient(135deg, var(--gold), var(--gold-light));
    color:var(--navy); font-family:'Lato',sans-serif;
    font-size:.85rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase;
    border:none; cursor:pointer;
    box-shadow:0 4px 20px rgba(201,168,76,.35);
    transition:transform .2s var(--ease), box-shadow .2s var(--ease);
    text-decoration:none;
  }
  .success-cta:hover {
    transform:translateY(-2px);
    box-shadow:0 8px 30px rgba(201,168,76,.45);
  }
  .success-cta svg {
    width:15px; height:15px; stroke:var(--navy); fill:none;
    stroke-width:2; stroke-linecap:round; stroke-linejoin:round;
  }

  /* Form Header */
  .form-header { margin-block-end:2rem; }
  .form-eyebrow {
    display:inline-flex; align-items:center; gap:.45rem;
    margin-block-end:.9rem; padding:.28rem .8rem;
    border-radius:100px;
    border:1px solid rgba(201,168,76,.3);
    background:rgba(201,168,76,.08);
    font-size:.65rem; font-weight:400; letter-spacing:.22em;
    text-transform:uppercase; color:var(--gold);
    animation: fadeIn .6s ease .2s both;
  }
  .form-eyebrow-dot {
    width:5px; height:5px; border-radius:50%;
    background:var(--gold); flex-shrink:0;
  }
  .form-title {
    font-family:'Cinzel',serif; font-weight:700;
    font-size:clamp(1.4rem,3vw,1.9rem); color:var(--navy);
    line-height:1.2; letter-spacing:-.01em;
    animation: fadeUp .65s var(--ease) .15s both;
  }
  .form-subtitle {
    margin-block-start:.5rem;
    font-size:.875rem; font-weight:300; line-height:1.6; color:var(--text-body);
    animation: fadeUp .65s var(--ease) .25s both;
  }

  /* Fields Grid */
  .fields-grid {
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:0 1rem;
  }
  .field-full { grid-column: 1 / -1; }

  /* ── Field ── */
  .field { margin-block-end:1.1rem; }
  .field-label {
    display:block; margin-block-end:.42rem;
    font-size:.72rem; font-weight:700;
    letter-spacing:.1em; text-transform:uppercase;
    color:var(--navy);
  }
  .field-wrap { position:relative; }
  .field-icon {
    position:absolute; left:.9rem; top:50%; transform:translateY(-50%);
    display:flex; align-items:center; pointer-events:none;
  }
  .field-icon svg {
    width:15px; height:15px; stroke:var(--text-body); fill:none;
    stroke-width:1.6; stroke-linecap:round; stroke-linejoin:round;
    transition:stroke .2s;
  }
  .field-input {
    width:100%; padding:.75rem 2.8rem .75rem 2.55rem;
    border-radius:8px;
    border:1.5px solid rgba(20,33,61,.14);
    background:var(--white);
    font-family:'Lato',sans-serif; font-size:.875rem; font-weight:400;
    color:var(--navy);
    outline:none;
    transition:border-color .2s, box-shadow .2s;
    -webkit-appearance:none;
  }
  .field-input::placeholder { color:rgba(90,100,120,.4); font-weight:300; }
  .field-input:focus {
    border-color:var(--gold);
    box-shadow:0 0 0 3px rgba(201,168,76,.15);
  }
  .field-wrap:focus-within .field-icon svg { stroke:var(--gold); }
  .field-input.error {
    border-color:var(--danger);
    box-shadow:0 0 0 3px rgba(217,79,79,.12);
  }

  /* Select */
  .field-select {
    width:100%; padding:.75rem 2.55rem .75rem 2.55rem;
    border-radius:8px;
    border:1.5px solid rgba(20,33,61,.14);
    background:var(--white);
    font-family:'Lato',sans-serif; font-size:.875rem;
    color:var(--navy); outline:none; cursor:pointer;
    transition:border-color .2s, box-shadow .2s;
    -webkit-appearance:none;
  }
  .field-select:focus {
    border-color:var(--gold);
    box-shadow:0 0 0 3px rgba(201,168,76,.15);
  }
  .field-select.error {
    border-color:var(--danger);
    box-shadow:0 0 0 3px rgba(217,79,79,.12);
  }
  .select-chevron {
    position:absolute; right:.9rem; top:50%; transform:translateY(-50%);
    pointer-events:none; display:flex; align-items:center;
  }
  .select-chevron svg {
    width:14px; height:14px; stroke:var(--text-body); fill:none;
    stroke-width:2; stroke-linecap:round; stroke-linejoin:round;
  }

  /* Password toggle */
  .pwd-toggle {
    position:absolute; right:.85rem; top:50%; transform:translateY(-50%);
    background:none; border:none; cursor:pointer; padding:.2rem;
    display:flex; align-items:center; outline:none; border-radius:4px;
  }
  .pwd-toggle svg {
    width:16px; height:16px; stroke:var(--text-body); fill:none;
    stroke-width:1.6; stroke-linecap:round; stroke-linejoin:round;
    transition:stroke .2s;
  }
  .pwd-toggle:hover svg { stroke:var(--gold); }
  .pwd-toggle:focus-visible { outline:2px solid var(--gold); outline-offset:2px; }

  /* Password Strength */
  .pwd-strength { margin-top:.5rem; }
  .pwd-bars { display:flex; gap:3px; margin-bottom:.3rem; }
  .pwd-bar {
    flex:1; height:3px; border-radius:2px;
    background:rgba(20,33,61,.1);
    transition:background .3s;
  }
  .pwd-bar.strength-1 { background:#d94f4f; }
  .pwd-bar.strength-2 { background:#e07b2a; }
  .pwd-bar.strength-3 { background:#c9a84c; }
  .pwd-bar.strength-4 { background:#3d9970; }
  .pwd-hint {
    font-size:.7rem; font-weight:300; color:var(--text-body);
  }

  /* Field error */
  .field-error {
    display:flex; align-items:center; gap:.35rem;
    margin-block-start:.35rem;
    font-size:.72rem; color:var(--danger); font-weight:400;
    animation:fadeIn .2s ease;
  }
  .field-error svg {
    width:12px; height:12px; stroke:var(--danger); fill:none;
    stroke-width:2; stroke-linecap:round; stroke-linejoin:round; flex-shrink:0;
  }

  /* Terms row */
  .terms-row {
    display:flex; align-items:flex-start; gap:.6rem;
    margin-block-end:1.4rem;
  }
  .terms-checkbox {
    accent-color:var(--gold); width:15px; height:15px;
    cursor:pointer; flex-shrink:0; margin-top:2px;
  }
  .terms-label {
    font-size:.8rem; font-weight:300;
    color:var(--text-body); line-height:1.5; cursor:pointer;
  }
  .terms-label a { color:var(--gold); font-weight:400; transition:color .2s; }
  .terms-label a:hover { color:var(--navy); }

  /* Submit button */
  .submit-btn {
    width:100%; padding:.9rem 1.5rem;
    border-radius:8px; border:none; cursor:pointer; outline:none;
    display:flex; align-items:center; justify-content:center; gap:.55rem;
    background:linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
    color:var(--navy);
    font-family:'Lato',sans-serif; font-size:.88rem; font-weight:700;
    letter-spacing:.1em; text-transform:uppercase;
    box-shadow:0 4px 20px rgba(201,168,76,.35);
    transition:transform .22s var(--ease), box-shadow .22s var(--ease), filter .22s;
  }
  .submit-btn:hover:not(:disabled) {
    transform:translateY(-2px);
    box-shadow:0 8px 30px rgba(201,168,76,.45);
    filter:brightness(1.04);
  }
  .submit-btn:active:not(:disabled) { transform:translateY(0); }
  .submit-btn:focus-visible { outline:2px solid var(--navy); outline-offset:3px; }
  .submit-btn:disabled { opacity:.7; cursor:not-allowed; }
  .submit-btn svg {
    width:16px; height:16px; stroke:var(--navy); fill:none;
    stroke-width:2; stroke-linecap:round; stroke-linejoin:round;
  }

  /* Spinner */
  .spinner {
    width:16px; height:16px; border-radius:50%; flex-shrink:0;
    border:2px solid rgba(20,33,61,.25);
    border-top-color:var(--navy);
    animation:spin .7s linear infinite;
  }

  /* Shake */
  .form-shake { animation:shake .4s var(--ease); }

  /* Alert */
  .alert {
    display:flex; align-items:flex-start; gap:.65rem;
    padding:.85rem 1rem; border-radius:8px; margin-block-end:1.4rem;
    font-size:.82rem; line-height:1.55;
    animation:fadeIn .3s ease;
  }
  .alert-danger {
    background:rgba(217,79,79,.09);
    border:1px solid rgba(217,79,79,.25);
    color:var(--danger);
  }
  .alert-success {
    background:rgba(61,153,112,.09);
    border:1px solid rgba(61,153,112,.25);
    color:var(--success);
  }
  .alert svg {
    width:16px; height:16px; flex-shrink:0; margin-block-start:.05rem;
    stroke:currentColor; fill:none;
    stroke-width:2; stroke-linecap:round; stroke-linejoin:round;
  }

  /* Divider */
  .form-divider {
    display:flex; align-items:center; gap:.9rem;
    margin-block:1.4rem;
  }
  .form-divider-line {
    flex:1; height:1px;
    background:linear-gradient(90deg, transparent, rgba(20,33,61,.12), transparent);
  }
  .form-divider-text {
    font-size:.7rem; font-weight:300; letter-spacing:.12em;
    text-transform:uppercase; color:rgba(90,100,120,.5); white-space:nowrap;
  }

  /* Back link */
  .back-link {
    display:inline-flex; align-items:center; gap:.4rem;
    margin-block-start:.2rem;
    font-size:.8rem; font-weight:400; color:var(--text-body);
    letter-spacing:.03em; transition:color .2s; outline:none; border-radius:3px;
  }
  .back-link:hover { color:var(--navy); }
  .back-link:focus-visible { outline:2px solid var(--gold); outline-offset:2px; }
  .back-link svg {
    width:14px; height:14px; stroke:currentColor; fill:none;
    stroke-width:2; stroke-linecap:round; stroke-linejoin:round;
    transition:transform .2s;
  }
  .back-link:hover svg { transform:translateX(-3px); }

  /* Footer note */
  .form-footer-note {
    margin-block-start:1.8rem; text-align:center;
    font-size:.72rem; font-weight:300; color:rgba(90,100,120,.55);
    line-height:1.6;
  }
  .form-footer-note a {
    color:var(--gold); font-weight:400; transition:color .2s;
  }
  .form-footer-note a:hover { color:var(--navy); }

  /* ════════════════════════════════════
     RESPONSIVE
  ════════════════════════════════════ */
  @media(max-width:860px) {
    .register-page { grid-template-columns:1fr; }
    .reg-brand { display:none; }
    .register-form-panel {
      min-height:100vh;
      justify-content:flex-start;
      padding-block-start:2.5rem;
    }
  }
  @media(max-width:520px) {
    .fields-grid { grid-template-columns:1fr; }
    .field-full  { grid-column:auto; }
  }

  /* Mobile brand bar */
  .mobile-brand-bar {
    display:none;
    align-items:center; justify-content:center; gap:.6rem;
    padding:1rem; background:var(--navy);
    border-bottom:2px solid var(--gold);
  }
  .mobile-brand-bar .brand-logo-mark {
    width:32px; height:32px; border-radius:6px;
    background:linear-gradient(135deg,var(--gold) 0%,var(--gold-light) 100%);
    display:grid; place-items:center;
  }
  .mobile-brand-bar .brand-logo-mark svg { width:18px; height:18px; fill:var(--navy); }
  .mobile-brand-bar .brand-logo-name {
    font-family:'Cinzel',serif; font-weight:700;
    font-size:.95rem; letter-spacing:.08em; color:#f7f4ee;
  }
  @media(max-width:860px) {
    .mobile-brand-bar { display:flex; }
  }
`;

/* ══════════════════════════════════════════════════
   SVG ATOMS
══════════════════════════════════════════════════ */
const CrossSvg = ({ size = 22 }) => (
  <svg viewBox="0 0 20 20" aria-hidden="true" style={{ width: size, height: size }}>
    <rect x="8.5" y="1"   width="3"  height="18" rx="1" />
    <rect x="2"   y="6.5" width="16" height="3"  rx="1" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 5.29 5.29l.95-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/>
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const AlertCircle = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8"  x2="12"    y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const UserPlusIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="8.5" cy="7" r="4"/>
    <line x1="20" y1="8" x2="20" y2="14"/>
    <line x1="23" y1="11" x2="17" y2="11"/>
  </svg>
);

/* ══════════════════════════════════════════════════
   VALIDATION
══════════════════════════════════════════════════ */
const validate = (fields) => {
  const errs = {};
  if (!fields.firstName.trim())
    errs.firstName = "First name is required.";

  if (!fields.lastName.trim())
    errs.lastName = "Last name is required.";

  if (!fields.email.trim())
    errs.email = "Email address is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
    errs.email = "Please enter a valid email address.";

  if (fields.phone && !/^[+\d\s\-()]{7,}$/.test(fields.phone))
    errs.phone = "Please enter a valid phone number.";

  if (!fields.password)
    errs.password = "Password is required.";
  else if (fields.password.length < 8)
    errs.password = "Password must be at least 8 characters.";

  if (!fields.confirmPassword)
    errs.confirmPassword = "Please confirm your password.";
  else if (fields.password && fields.confirmPassword !== fields.password)
    errs.confirmPassword = "Passwords do not match.";

  if (!fields.terms)
    errs.terms = "You must accept the terms to continue.";

  return errs;
};

/* ══════════════════════════════════════════════════
   PASSWORD STRENGTH HELPER
══════════════════════════════════════════════════ */
const getPasswordStrength = (pwd) => {
  if (!pwd) return { score: 0, label: "" };
  let score = 0;
  if (pwd.length >= 8)          score++;
  if (/[A-Z]/.test(pwd))        score++;
  if (/[0-9]/.test(pwd))        score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const labels = ["", "Weak", "Fair", "Strong", "Very strong"];
  return { score, label: labels[score] || "" };
};

/* ══════════════════════════════════════════════════
   ONBOARDING STEPS (left panel)
══════════════════════════════════════════════════ */
const STEPS = [
  { title: "Create Your Account",  sub: "Fill in your details on the right" },
  { title: "Verify Your Email",    sub: "Check your inbox for a link" },
  { title: "Set Up Your Profile",  sub: "Add your church details" },
  { title: "Start Managing",       sub: "Full dashboard access unlocked" },
];

/* ══════════════════════════════════════════════════
   REGISTER PAGE COMPONENT
══════════════════════════════════════════════════ */
export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  /* ── form state ── */
  const [firstName,       setFirstName]       = useState("");
  const [lastName,        setLastName]        = useState("");
  const [email,           setEmail]           = useState("");
  const [phone,           setPhone]           = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms,           setTerms]           = useState(false);

  /* ── UI state ── */
  const [showPwd,     setShowPwd]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors,      setErrors]      = useState({});
  const [loading,     setLoading]     = useState(false);
  const [alert,       setAlert]       = useState(null);
  const [shake,       setShake]       = useState(false);

  const pwdStrength = getPasswordStrength(password);

  /* Inject global CSS */
  useEffect(() => {
    const id = "gracehub-register-css";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id;
      tag.textContent = GLOBAL_CSS;
      document.head.appendChild(tag);
    }
  }, []);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 420);
  };

  const clearFieldError = (field) =>
    setErrors((prev) => ({ ...prev, [field]: "" }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    const errs = validate({
      firstName, lastName, email, phone,
      password, confirmPassword, terms,
    });

    if (Object.keys(errs).length) {
      setErrors(errs);
      triggerShake();
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const userData = {
        firstName,
        lastName,
        email,
        phoneNumber: phone,
        password,
      };

      const result = await register(userData);

      if (result.success) {
        setAlert({ type: "success", message: result.message || "Registration successful! Redirecting to login..." });
        // Redirect to login after brief delay
        setTimeout(() => navigate('/DashBoard'), 1500);
      } else {
        setAlert({ type: "danger", message: result.message || "Registration failed. Please try again." });
        triggerShake();
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = error.message || "Network error. Please check your connection and try again.";
      setAlert({ type: "danger", message: errorMessage });
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  /* ────────────────────────────────────────────── */
  /*  MAIN FORM VIEW                                */
  /* ────────────────────────────────────────────── */
  return (
    <>
      {/* Mobile top brand bar */}
      <div className="mobile-brand-bar" aria-hidden="true">
        <div className="brand-logo-mark"><CrossSvg size={18} /></div>
        <span className="brand-logo-name">Westlands P.A.G</span>
      </div>

      <div className="register-page">
        <BrandPanel />

        <main className="register-form-panel" id="main-content">
          <div className="register-card">

            {/* Header */}
            <div className="form-header">
              <div className="form-eyebrow">
                <span className="form-eyebrow-dot" />
                New Account
              </div>
              <h1 className="form-title">Create Account</h1>
              <p className="form-subtitle">
                Join the Westlands P.A.G community hub and manage your
                congregation with ease.
              </p>
            </div>

            {/* Alert banner */}
            {alert && (
              <div
                className={`alert alert-${alert.type}`}
                role="alert"
                aria-live="assertive"
              >
                <AlertCircle />
                <span>{alert.message}</span>
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className={shake ? "form-shake" : ""}
              aria-label="Registration form"
            >
              <div className="fields-grid">

                {/* ── First Name ── */}
                <div className="field">
                  <label className="field-label" htmlFor="firstName">
                    First Name
                  </label>
                  <div className="field-wrap">
                    <span className="field-icon"><UserIcon /></span>
                    <input
                      id="firstName"
                      type="text"
                      className={`field-input${errors.firstName ? " error" : ""}`}
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => { setFirstName(e.target.value); clearFieldError("firstName"); }}
                      autoComplete="given-name"
                      aria-required="true"
                      aria-invalid={!!errors.firstName}
                      aria-describedby={errors.firstName ? "firstName-error" : undefined}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="field-error" id="firstName-error" role="alert">
                      <AlertCircle />{errors.firstName}
                    </p>
                  )}
                </div>

                {/* ── Last Name ── */}
                <div className="field">
                  <label className="field-label" htmlFor="lastName">
                    Last Name
                  </label>
                  <div className="field-wrap">
                    <span className="field-icon"><UserIcon /></span>
                    <input
                      id="lastName"
                      type="text"
                      className={`field-input${errors.lastName ? " error" : ""}`}
                      placeholder="Kamau"
                      value={lastName}
                      onChange={(e) => { setLastName(e.target.value); clearFieldError("lastName"); }}
                      autoComplete="family-name"
                      aria-required="true"
                      aria-invalid={!!errors.lastName}
                      aria-describedby={errors.lastName ? "lastName-error" : undefined}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="field-error" id="lastName-error" role="alert">
                      <AlertCircle />{errors.lastName}
                    </p>
                  )}
                </div>

                {/* ── Email ── */}
                <div className="field field-full">
                  <label className="field-label" htmlFor="reg-email">
                    Email Address
                  </label>
                  <div className="field-wrap">
                    <span className="field-icon"><EmailIcon /></span>
                    <input
                      id="reg-email"
                      type="email"
                      className={`field-input${errors.email ? " error" : ""}`}
                      placeholder="john.kamau@email.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); clearFieldError("email"); }}
                      autoComplete="email"
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                  </div>
                  {errors.email && (
                    <p className="field-error" id="email-error" role="alert">
                      <AlertCircle />{errors.email}
                    </p>
                  )}
                </div>

                {/* ── Phone ── */}
                <div className="field">
                  <label className="field-label" htmlFor="phone">
                    Phone Number
                  </label>
                  <div className="field-wrap">
                    <span className="field-icon"><PhoneIcon /></span>
                    <input
                      id="phone"
                      type="tel"
                      className={`field-input${errors.phone ? " error" : ""}`}
                      placeholder="+254 7XX XXX XXX"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); clearFieldError("phone"); }}
                      autoComplete="tel"
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                      aria-invalid={!!errors.phone}
                    />
                  </div>
                  {errors.phone && (
                    <p className="field-error" id="phone-error" role="alert">
                      <AlertCircle />{errors.phone}
                    </p>
                  )}
                </div>

                {/* ── Password ── */}
                <div className="field">
                  <label className="field-label" htmlFor="reg-password">
                    Password
                  </label>
                  <div className="field-wrap">
                    <span className="field-icon"><LockIcon /></span>
                    <input
                      id="reg-password"
                      type={showPwd ? "text" : "password"}
                      className={`field-input${errors.password ? " error" : ""}`}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); clearFieldError("password"); }}
                      autoComplete="new-password"
                      aria-required="true"
                      aria-invalid={!!errors.password}
                      aria-describedby="pwd-strength-hint"
                    />
                    <button
                      type="button"
                      className="pwd-toggle"
                      onClick={() => setShowPwd((v) => !v)}
                      aria-label={showPwd ? "Hide password" : "Show password"}
                    >
                      {showPwd ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {/* Strength meter */}
                  {password && (
                    <div className="pwd-strength" aria-live="polite">
                      <div className="pwd-bars" role="presentation">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`pwd-bar${i <= pwdStrength.score ? ` strength-${pwdStrength.score}` : ""}`}
                          />
                        ))}
                      </div>
                      <span className="pwd-hint" id="pwd-strength-hint">
                        {pwdStrength.label}
                      </span>
                    </div>
                  )}
                  {errors.password && (
                    <p className="field-error" role="alert">
                      <AlertCircle />{errors.password}
                    </p>
                  )}
                </div>

                {/* ── Confirm Password ── */}
                <div className="field">
                  <label className="field-label" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <div className="field-wrap">
                    <span className="field-icon"><LockIcon /></span>
                    <input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      className={`field-input${errors.confirmPassword ? " error" : ""}`}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); clearFieldError("confirmPassword"); }}
                      autoComplete="new-password"
                      aria-required="true"
                      aria-invalid={!!errors.confirmPassword}
                      aria-describedby={errors.confirmPassword ? "confirm-error" : undefined}
                    />
                    <button
                      type="button"
                      className="pwd-toggle"
                      onClick={() => setShowConfirm((v) => !v)}
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                    >
                      {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="field-error" id="confirm-error" role="alert">
                      <AlertCircle />{errors.confirmPassword}
                    </p>
                  )}
                </div>

              </div>{/* /fields-grid */}

              {/* ── Terms ── */}
              <div className="terms-row">
                <input
                  type="checkbox"
                  id="terms"
                  className="terms-checkbox"
                  checked={terms}
                  onChange={(e) => { setTerms(e.target.checked); clearFieldError("terms"); }}
                  aria-required="true"
                  aria-describedby={errors.terms ? "terms-error" : undefined}
                />
                <label className="terms-label" htmlFor="terms">
                  I agree to the{" "}
                  <a href="/terms" target="_blank" rel="noreferrer">Terms of Service</a>
                  {" "}and{" "}
                  <a href="/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>
                  {" "}of Westlands P.A.G Church Management System.
                </label>
              </div>
              {errors.terms && (
                <p className="field-error" id="terms-error" role="alert"
                   style={{ marginBottom: "1rem" }}>
                  <AlertCircle />{errors.terms}
                </p>
              )}

              {/* ── Submit ── */}
              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner" aria-hidden="true" />
                    Creating account…
                  </>
                ) : (
                  <>
                    <UserPlusIcon />
                    Create Account
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="form-divider" aria-hidden="true">
              <div className="form-divider-line" />
              <span className="form-divider-text">Secure · Encrypted · Private</span>
              <div className="form-divider-line" />
            </div>

            {/* Back to login */}
            <Link to="/DashBoard" className="back-link">
              <ArrowLeftIcon />
              Already have an account? Sign in
            </Link>

            {/* Footer note */}
            <p className="form-footer-note">
              Need help? Contact your{" "}
              <a href="mailto:support@westlandspag.org">church administrator</a>
              {" "}or visit our{" "}
              <a href="/support">support centre</a>.
            </p>

          </div>
        </main>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════
   BRAND PANEL (extracted to avoid duplication)
══════════════════════════════════════════════════ */
function BrandPanel() {
  return (
    <aside className="reg-brand" aria-label="Westlands P.A.G brand panel">
      <div className="brand-glow-a" aria-hidden="true" />
      <div className="brand-glow-b" aria-hidden="true" />
      <div className="brand-watermark" aria-hidden="true">
        <CrossSvg size={320} />
      </div>

      {/* Logo */}
      <div className="brand-top">
        <a href="/DashBoard">
          <div className="brand-logo-mark">
            <CrossSvg size={22} />
          </div>
          <div className="brand-logo-text">
            <span className="brand-logo-name">Westlands P.A.G</span>
            <span className="brand-logo-tagline">Church Management</span>
          </div>
        </a>
      </div>

      {/* Headline + Steps */}
      <div className="brand-mid">
        <h2 className="brand-headline">
          Join Your <em>Community</em> Hub Today
        </h2>
        <p className="brand-body">
          Create your account in minutes and unlock full access to congregation
          management, giving records, and event coordination.
        </p>

        <div className="brand-steps" role="list">
          {STEPS.map(({ title, sub }, i) => (
            <div key={title} className="brand-step" role="listitem">
              <div className="brand-step-num">{i + 1}</div>
              <div className="brand-step-text">
                <span className="brand-step-title">{title}</span>
                <span className="brand-step-sub">{sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="brand-bottom">
        &copy; {new Date().getFullYear()} Westlands P.A.G. All rights reserved.
      </div>
    </aside>
  );
}