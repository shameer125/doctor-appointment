/**
 * AdminLayout — sidebar + topbar shell shared by all admin pages.
 */
import PropTypes from "prop-types";
import { useState } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";

const base = process.env.PUBLIC_URL || "";

const NAV = [
    { path: "/admin/dashboard",    label: "Dashboard",    icon: "icofont-dashboard-web" },
    { path: "/admin/appointments", label: "Appointments", icon: "icofont-calendar" },
    { path: "/admin/doctors",      label: "Doctors",      icon: "icofont-doctor-alt" },
    { path: "/admin/slots",        label: "Slot Manager", icon: "icofont-clock-time" },
    { path: "/admin/analytics",    label: "Analytics",    icon: "icofont-chart-bar-graph" },
];

const PRIMARY    = "#9b1f1f";
const SIDEBAR_BG = "#0c1424";

export default function AdminLayout({ children, title }) {
    const { session, logout } = useAdmin();
    const location = useLocation();
    const history  = useHistory();
    const [sideOpen, setSideOpen] = useState(false);

    const handleLogout = () => { logout(); history.replace(`${base}/admin/login`); };

    return (
        <div style={sh.root}>
            {sideOpen && <div style={sh.backdrop} onClick={() => setSideOpen(false)} />}

            <aside style={{ ...sh.sidebar, transform: sideOpen ? "translateX(0)" : undefined }} className="admin-sidebar">
                <div style={sh.sideHead}>
                    <div style={sh.sideLogoIcon}><i className="icofont-heart-alt" style={{ fontSize: "1.2rem", color: "#fff" }} /></div>
                    <div style={{ flex: 1 }}>
                        <div style={sh.sideLogoText}>Hope Medical</div>
                        <div style={sh.sideLogoSub}>Admin Console</div>
                    </div>
                    <button style={sh.sideClose} onClick={() => setSideOpen(false)}>✕</button>
                </div>

                <nav style={sh.nav}>
                    <div style={sh.navSection}>MAIN MENU</div>
                    {NAV.map(item => {
                        const active = location.pathname === base + item.path || location.pathname.startsWith(base + item.path + "/");
                        return (
                            <Link key={item.path} to={`${base}${item.path}`}
                                style={{ ...sh.navLink, ...(active ? sh.navActive : {}) }}
                                onClick={() => setSideOpen(false)}>
                                <i className={item.icon} style={{ fontSize: "1.05rem", width: "1.1rem", flexShrink: 0, color: active ? "#fff" : "#64748b" }} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}

                    <div style={{ ...sh.navSection, marginTop: "1.25rem" }}>ACCOUNT</div>
                    <a href={`${base}/`} style={sh.navLink}>
                        <i className="icofont-external-link" style={{ fontSize: "1.05rem", width: "1.1rem", flexShrink: 0, color: "#64748b" }} />
                        <span>View Website</span>
                    </a>
                    <button onClick={handleLogout} style={{ ...sh.navLink, background: "transparent", border: "none", width: "100%", textAlign: "left", cursor: "pointer" }}>
                        <i className="icofont-logout" style={{ fontSize: "1.05rem", width: "1.1rem", flexShrink: 0, color: "#64748b" }} />
                        <span>Sign Out</span>
                    </button>
                </nav>

                <div style={sh.sideUser}>
                    <div style={sh.sideAvatar}><i className="icofont-user-alt-5" style={{ fontSize: "0.9rem", color: PRIMARY }} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={sh.sideEmail}>{session?.email || "Admin"}</div>
                        <div style={sh.sideRole}>Administrator</div>
                    </div>
                </div>
            </aside>

            <div style={sh.main} className="admin-main-area">
                <header style={sh.topbar}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                        <button className="admin-hamburger" onClick={() => setSideOpen(true)} aria-label="Menu" style={{ background:"transparent", border:"none", fontSize:"1.3rem", cursor:"pointer", color:"#334155", padding:"0.3rem", borderRadius:"6px" }}>
                            <i className="icofont-navigation-menu" />
                        </button>
                        <h1 style={sh.pageTitle}>{title}</h1>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                        <a href={`${base}/`} style={sh.viewSite} target="_blank" rel="noopener noreferrer">
                            <i className="icofont-external-link" style={{ marginRight: "0.3rem" }} />View Site
                        </a>
                        <button style={sh.logoutTopBtn} onClick={handleLogout}>
                            <i className="icofont-logout" style={{ marginRight: "0.3rem" }} />Logout
                        </button>
                    </div>
                </header>
                <main style={sh.content}>{children}</main>
            </div>


            <style>{`
                .admin-sidebar { transform: translateX(-100%); }
                .admin-hamburger { display: none; }
                @media (max-width: 991px) {
                    .admin-hamburger { display: inline-flex !important; }
                }
                @media (min-width: 992px) {
                    .admin-sidebar { transform: translateX(0) !important; }
                    .admin-main-area { margin-left: 256px !important; }
                }
                @keyframes adminFadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
                .admin-fade { animation: adminFadeUp 0.35s ease forwards; }
            `}</style>
        </div>
    );
}

AdminLayout.propTypes = { children: PropTypes.node.isRequired, title: PropTypes.string };

const sh = {
    root:       { display: "flex", minHeight: "100vh", background: "#f1f5f9", fontFamily: "'DM Sans', sans-serif", position: "relative" },
    backdrop:   { position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.55)" },
    sidebar:    { position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50, width: "256px", background: SIDEBAR_BG, display: "flex", flexDirection: "column", transition: "transform 0.28s cubic-bezier(0.25,0.46,0.45,0.94)", boxShadow: "4px 0 24px rgba(0,0,0,0.25)" },
    sideHead:   { display: "flex", alignItems: "center", gap: "0.625rem", padding: "1.25rem 1.125rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.07)" },
    sideLogoIcon: { width: "38px", height: "38px", borderRadius: "10px", background: PRIMARY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
    sideLogoText: { fontSize: "0.9375rem", fontWeight: "800", color: "#f1f5f9" },
    sideLogoSub:  { fontSize: "0.6rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em" },
    sideClose:  { background: "transparent", border: "none", color: "#475569", cursor: "pointer", fontSize: "1rem", marginLeft: "auto", padding: "0.2rem 0.35rem", borderRadius: "6px" },
    nav:        { flex: 1, overflowY: "auto", padding: "1rem 0.75rem" },
    navSection: { fontSize: "0.6rem", fontWeight: "800", letterSpacing: "0.12em", color: "#475569", textTransform: "uppercase", padding: "0.4rem 0.875rem 0.3rem", marginBottom: "2px" },
    navLink:    { display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.625rem 0.875rem", borderRadius: "10px", textDecoration: "none", color: "#94a3b8", fontSize: "0.875rem", fontWeight: "600", marginBottom: "2px", transition: "background 130ms, color 130ms" },
    navActive:  { background: PRIMARY, color: "#fff", boxShadow: "0 4px 14px rgba(155,31,31,0.35)" },
    sideUser:   { display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.875rem 1.125rem", borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" },
    sideAvatar: { width: "32px", height: "32px", borderRadius: "8px", background: "#fff5f5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
    sideEmail:  { fontSize: "0.8125rem", fontWeight: "700", color: "#e2e8f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
    sideRole:   { fontSize: "0.625rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" },
    main:       { flex: 1, marginLeft: 0, display: "flex", flexDirection: "column", minWidth: 0 },
    topbar:     { position: "sticky", top: 0, zIndex: 30, height: "64px", background: "#fff", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.5rem", boxShadow: "0 1px 4px rgba(15,23,42,0.06)" },
    pageTitle:  { fontSize: "1.05rem", fontWeight: "800", color: "#0f172a", margin: 0, letterSpacing: "-0.01em" },
    viewSite:   { display: "inline-flex", alignItems: "center", fontSize: "0.8125rem", fontWeight: "600", color: "#64748b", textDecoration: "none", padding: "0.375rem 0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#f8fafc" },
    logoutTopBtn: { display: "inline-flex", alignItems: "center", fontSize: "0.8125rem", fontWeight: "700", color: "#fff", background: PRIMARY, border: "none", borderRadius: "8px", padding: "0.375rem 0.875rem", cursor: "pointer" },
    content:    { flex: 1, padding: "1.75rem 1.5rem", overflowX: "hidden" },
};
