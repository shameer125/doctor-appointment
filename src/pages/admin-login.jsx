import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { adminLogin, isAdminLoggedIn } from "../utils/adminStorage";
import { useAdmin } from "../context/AdminContext";
import SEO from "../components/seo";

const base = process.env.PUBLIC_URL || "";

export default function AdminLoginPage() {
    const history = useHistory();
    const { refresh } = useAdmin();
    const [email, setEmail]     = useState("");
    const [error, setError]     = useState("");
    const [busy, setBusy]       = useState(false);
    const [touched, setTouched] = useState(false);

    useEffect(() => {
        if (isAdminLoggedIn()) history.replace(`${base}/admin/dashboard`);
    }, [history]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setTouched(true);
        setError("");
        setBusy(true);
        // Small delay for UX feel
        setTimeout(() => {
            const res = adminLogin(email);
            if (!res.ok) {
                setError(res.error);
                setBusy(false);
                return;
            }
            refresh();
            history.replace(`${base}/admin/dashboard`);
        }, 320);
    };


    return (
        <>
            <SEO title="Admin Login | Hope Medical" />
            <div style={styles.page}>
                {/* Decorative background circles */}
                <div style={styles.circle1} />
                <div style={styles.circle2} />

                <div style={styles.card}>
                    {/* Header */}
                    <div style={styles.cardHeader}>
                        <div style={styles.iconWrap}>
                            <i className="icofont-shield-alt" style={{ fontSize: "1.5rem", color: "#fff" }} />
                        </div>
                        <h1 style={styles.title}>Admin Portal</h1>
                        <p style={styles.subtitle}>Hope Medical Dashboard</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} noValidate style={styles.form}>
                        <div style={styles.fieldWrap}>
                            <label style={styles.label} htmlFor="admin-email">
                                Admin Email Address
                            </label>
                            <div style={styles.inputWrap}>
                                <i className="icofont-email" style={styles.inputIcon} />
                                <input
                                    id="admin-email"
                                    type="email"
                                    value={email}
                                    onChange={e => { setEmail(e.target.value); setError(""); }}
                                    onBlur={() => setTouched(true)}
                                    placeholder="admin@gmail.com"
                                    style={{
                                        ...styles.input,
                                        borderColor: error && touched ? "#fca5a5" : "#e2e8f0",
                                        boxShadow: error && touched ? "0 0 0 3px rgba(239,68,68,0.12)" : "none",
                                    }}
                                    autoComplete="email"
                                    autoFocus
                                />
                            </div>
                            {error && (
                                <div style={styles.errorMsg}>
                                    <i className="icofont-warning-alt" style={{ marginRight: "0.35rem" }} />
                                    {error}
                                </div>
                            )}
                            
                        </div>

                        <button
                            type="submit"
                            disabled={busy}
                            style={{ ...styles.btn, opacity: busy ? 0.7 : 1, cursor: busy ? "not-allowed" : "pointer" }}
                        >
                            {busy
                                ? <><span style={styles.spinner} />Verifying…</>
                                : <><i className="icofont-login" style={{ marginRight: "0.4rem" }} />Access Dashboard</>
                            }
                        </button>
                    </form>

                    {/* Demo hint */}
                    <div style={styles.hint}>
                        <i className="icofont-info-circle" style={{ color: "#9b1f1f", marginRight: "0.4rem" }} />
                        Demo credentials: <strong>admin@gmail.com</strong>
                    </div>

                    {/* Back to site */}
                    <div style={styles.backWrap}>
                        <a href={`${base}/`} style={styles.backLink}>
                            <i className="icofont-arrow-left" style={{ marginRight: "0.3rem" }} />
                            Back to website
                        </a>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #080e1c 0%, #1a0a0a 50%, #0c1424 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        position: "relative",
        overflow: "hidden",
    },
    circle1: {
        position: "absolute", top: "-120px", right: "-120px",
        width: "400px", height: "400px", borderRadius: "50%",
        background: "rgba(155,31,31,0.12)", pointerEvents: "none",
    },
    circle2: {
        position: "absolute", bottom: "-100px", left: "-100px",
        width: "350px", height: "350px", borderRadius: "50%",
        background: "rgba(155,31,31,0.08)", pointerEvents: "none",
    },
    card: {
        background: "#fff",
        borderRadius: "20px",
        width: "100%",
        maxWidth: "420px",
        boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
        overflow: "hidden",
        position: "relative",
        zIndex: 1,
    },
    cardHeader: {
        background: "linear-gradient(135deg, #9b1f1f 0%, #6d1515 100%)",
        padding: "2rem 2rem 1.75rem",
        textAlign: "center",
    },
    iconWrap: {
        width: "56px", height: "56px",
        background: "rgba(255,255,255,0.2)",
        borderRadius: "16px",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 1rem",
        border: "1px solid rgba(255,255,255,0.3)",
    },
    title: {
        fontSize: "1.5rem", fontWeight: "800", color: "#fff",
        margin: "0 0 0.25rem", letterSpacing: "-0.02em",
        fontFamily: "'DM Serif Display', serif",
    },
    subtitle: { fontSize: "0.875rem", color: "rgba(255,255,255,0.75)", margin: 0 },
    form: { padding: "2rem 2rem 0" },
    fieldWrap: { marginBottom: "1.25rem" },
    label: {
        display: "block", fontSize: "0.8125rem", fontWeight: "700",
        color: "#334155", marginBottom: "0.45rem", letterSpacing: "0.01em",
    },
    inputWrap: { position: "relative" },
    inputIcon: {
        position: "absolute", left: "0.9rem", top: "50%",
        transform: "translateY(-50%)", color: "#9b1f1f",
        fontSize: "1rem", pointerEvents: "none",
    },
    input: {
        width: "100%", padding: "0.65rem 0.9rem 0.65rem 2.5rem",
        fontSize: "0.9375rem", border: "1.5px solid #e2e8f0",
        borderRadius: "10px", color: "#0f172a",
        boxSizing: "border-box", outline: "none",
        transition: "border-color 150ms, box-shadow 150ms",
        fontFamily: "inherit",
    },
    errorMsg: {
        marginTop: "0.45rem", fontSize: "0.8125rem",
        color: "#b91c1c", display: "flex", alignItems: "center",
    },
    btn: {
        width: "100%", padding: "0.75rem",
        background: "linear-gradient(135deg, #9b1f1f 0%, #7a1818 100%)",
        color: "#fff", border: "none", borderRadius: "10px",
        fontSize: "0.9375rem", fontWeight: "700",
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: "0.35rem", boxShadow: "0 4px 16px rgba(155,31,31,0.35)",
        transition: "opacity 150ms", fontFamily: "inherit",
    },
    spinner: {
        display: "inline-block", width: "16px", height: "16px",
        border: "2px solid rgba(255,255,255,0.3)",
        borderTopColor: "#fff", borderRadius: "50%",
        animation: "spin 0.7s linear infinite", marginRight: "0.4rem",
    },
    hint: {
        margin: "1.25rem 2rem 0",
        background: "#fff5f5", border: "1px solid #fecaca",
        borderRadius: "8px", padding: "0.65rem 0.875rem",
        fontSize: "0.8125rem", color: "#7f1d1d",
        display: "flex", alignItems: "center",
    },
    backWrap: { padding: "1rem 2rem 1.75rem", textAlign: "center" },
    backLink: {
        fontSize: "0.875rem", color: "#64748b",
        textDecoration: "none", display: "inline-flex", alignItems: "center",
    },
};
