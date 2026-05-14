import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import StatCard from "../../components/admin/StatCard";
import { calculateStats, getAppointments } from "../../utils/adminStorage";
import { seedDemoData } from "../../utils/seedDemoData";
import { useAdmin } from "../../context/AdminContext";
import { Link } from "react-router-dom";

const base = process.env.PUBLIC_URL || "";

function fmt(iso) {
    if (!iso) return "—";
    const d = new Date(iso + "T12:00:00");
    return isNaN(d) ? iso : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function DashboardPage() {
    const { refreshKey } = useAdmin();
    const [stats, setStats] = useState(null);
    const [recent, setRecent] = useState([]);

    useEffect(() => {
        const s = calculateStats();
        setStats(s);
        const all = getAppointments().filter(a => a.status !== "cancelled");
        setRecent(all.slice(0, 6));
    }, [refreshKey]);

    if (!stats) return <AdminLayout title="Dashboard"><div style={S.loading}><span style={S.spinner} /> Loading…</div></AdminLayout>;

    const today = new Date().toISOString().split("T")[0];

    return (
        <AdminLayout title="Dashboard">
            {/* Welcome bar */}
            <div style={S.welcomeBar} className="admin-fade">
                <div>
                    <h2 style={S.welcomeTitle}>Good {greeting()}, Admin 👋</h2>
                    <p style={S.welcomeSub}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
                </div>
                <div style={{ display:"flex", gap:"0.625rem", flexWrap:"wrap" }}>
                    <button style={{ ...S.welcomeBtn, background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.2)", cursor:"pointer" }}
                        onClick={() => { const n = seedDemoData(); refresh(); if (n === 0) alert("Already has demo data (15+ appointments)."); }}>
                        <i className="icofont-database" style={{ marginRight:"0.35rem" }} />Seed Demo Data
                    </button>
                    <Link to={`${base}/admin/appointments`} style={S.welcomeBtn}>
                        <i className="icofont-plus-circle" style={{ marginRight: "0.35rem" }} />All Appointments
                    </Link>
                </div>
            </div>

            {/* Stat cards */}
            <div style={S.grid4} className="admin-fade">
                <StatCard icon="icofont-calendar" label="Total Appointments" value={stats.total} sub="All active bookings" color="#9b1f1f" bg="#fff5f5" />
                <StatCard icon="icofont-clock-time" label="Today's Bookings" value={stats.todayCount} sub={`${today}`} color="#0369a1" bg="#eff6ff" />
                <StatCard icon="icofont-doctor-alt" label="Total Doctors" value={stats.totalDoctors} sub="In roster" color="#059669" bg="#ecfdf5" />
                <StatCard icon="icofont-users-social" label="Unique Patients" value={stats.uniquePatients} sub="By email" color="#7c3aed" bg="#f5f3ff" />
            </div>

            {/* Middle row: Most booked + Weekly bar chart */}
            <div style={S.grid2} className="admin-fade">
                {/* Most booked doctor */}
                <div style={S.card}>
                    <div style={S.cardHead}><i className="icofont-award" style={{ color: "#f59e0b" }} /> Top Performing Doctor</div>
                    {stats.mostBooked.count > 0 ? (
                        <div style={S.topDoc}>
                            <div style={S.topDocAvatar}><i className="icofont-doctor-alt" style={{ fontSize: "1.75rem", color: "#9b1f1f" }} /></div>
                            <div>
                                <div style={S.topDocName}>{stats.mostBooked.name}</div>
                                <div style={S.topDocSub}>{stats.mostBooked.count} appointment{stats.mostBooked.count !== 1 ? "s" : ""} booked</div>
                                <div style={S.topDocBadge}>Most Booked</div>
                            </div>
                        </div>
                    ) : (
                        <p style={S.emptyNote}>No appointments yet.</p>
                    )}

                    {/* Cancelled stat */}
                    <div style={S.cancelRow}>
                        <i className="icofont-close-circled" style={{ color: "#ef4444" }} />
                        <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Cancelled appointments:</span>
                        <strong style={{ color: "#0f172a" }}>{stats.cancelled}</strong>
                    </div>
                </div>

                {/* Last 7 days mini bar chart */}
                <div style={S.card}>
                    <div style={S.cardHead}><i className="icofont-chart-bar-graph" style={{ color: "#9b1f1f" }} /> Last 7 Days — Bookings</div>
                    <div style={S.barChart}>
                        {stats.last7.map(d => {
                            const maxCount = Math.max(...stats.last7.map(x => x.count), 1);
                            const pct = Math.round((d.count / maxCount) * 100);
                            const isToday = d.date === today;
                            return (
                                <div key={d.date} style={S.barCol}>
                                    <div style={S.barValLabel}>{d.count > 0 ? d.count : ""}</div>
                                    <div style={S.barTrack}>
                                        <div style={{ ...S.barFill, height: `${Math.max(pct, 4)}%`, background: isToday ? "#9b1f1f" : "#fca5a5" }} />
                                    </div>
                                    <div style={{ ...S.barDayLabel, fontWeight: isToday ? "800" : "500", color: isToday ? "#9b1f1f" : "#94a3b8" }}>
                                        {d.label.split(",")[0]}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Recent appointments table */}
            <div style={S.card} className="admin-fade">
                <div style={{ ...S.cardHead, justifyContent: "space-between" }}>
                    <span><i className="icofont-list" style={{ color: "#9b1f1f" }} /> Recent Appointments</span>
                    <Link to={`${base}/admin/appointments`} style={S.seeAll}>See all →</Link>
                </div>
                {recent.length === 0 ? (
                    <div style={S.emptyBox}>
                        <i className="icofont-calendar" style={{ fontSize: "2.5rem", color: "#e2e8f0", display: "block", marginBottom: "0.75rem" }} />
                        <p style={{ color: "#94a3b8", margin: 0 }}>No appointments yet. Bookings will appear here.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={S.table}>
                            <thead>
                                <tr>
                                    {["Patient", "Doctor", "Date", "Time", "Status"].map(h => (
                                        <th key={h} style={S.th}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {recent.map((a, i) => (
                                    <tr key={a.id} style={{ background: i % 2 === 0 ? "#fff" : "#fafbfc" }}>
                                        <td style={S.td}>
                                            <div style={{ fontWeight: 700, color: "#0f172a" }}>{a.name}</div>
                                            <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{a.email}</div>
                                        </td>
                                        <td style={S.td}>
                                            <div style={{ fontWeight: 600, color: "#334155" }}>{a.doctorName}</div>
                                            <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{a.specialty}</div>
                                        </td>
                                        <td style={S.td}>{fmt(a.date)}</td>
                                        <td style={S.td}>{a.timeSlotLabel || a.timeSlot}</td>
                                        <td style={S.td}><span style={S.badge}>Scheduled</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

function greeting() {
    const h = new Date().getHours();
    if (h < 12) return "morning";
    if (h < 17) return "afternoon";
    return "evening";
}

const S = {
    loading:   { display: "flex", alignItems: "center", gap: "0.5rem", color: "#64748b", padding: "3rem", justifyContent: "center" },
    spinner:   { display: "inline-block", width: "18px", height: "18px", border: "2px solid #e2e8f0", borderTopColor: "#9b1f1f", borderRadius: "50%", animation: "adminSpin 0.7s linear infinite" },
    welcomeBar:{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", background: "linear-gradient(135deg,#9b1f1f 0%,#6d1515 100%)", borderRadius: "16px", padding: "1.5rem 2rem", marginBottom: "1.5rem" },
    welcomeTitle: { fontSize: "1.25rem", fontWeight: "800", color: "#fff", margin: "0 0 0.2rem", fontFamily: "'DM Serif Display',serif" },
    welcomeSub:{ fontSize: "0.875rem", color: "rgba(255,255,255,0.75)", margin: 0 },
    welcomeBtn:{ display: "inline-flex", alignItems: "center", background: "rgba(255,255,255,0.18)", color: "#fff", borderRadius: "10px", padding: "0.55rem 1.1rem", textDecoration: "none", fontSize: "0.875rem", fontWeight: "700", border: "1px solid rgba(255,255,255,0.25)", flexShrink: 0 },
    grid4:     { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "1rem", marginBottom: "1.25rem" },
    grid2:     { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "1.25rem", marginBottom: "1.25rem" },
    card:      { background: "#fff", borderRadius: "14px", padding: "1.375rem 1.5rem", border: "1px solid #e9edf4", boxShadow: "0 2px 12px rgba(15,23,42,0.05)", marginBottom: "1.25rem" },
    cardHead:  { display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "800", fontSize: "0.9375rem", color: "#0f172a", marginBottom: "1.1rem" },
    topDoc:    { display: "flex", gap: "1rem", alignItems: "center", padding: "1rem", background: "#fff5f5", borderRadius: "12px", border: "1px solid #fecaca", marginBottom: "1rem" },
    topDocAvatar: { width: "56px", height: "56px", borderRadius: "14px", background: "#fff", border: "1px solid #fecaca", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
    topDocName:{ fontSize: "1.05rem", fontWeight: "800", color: "#0f172a" },
    topDocSub: { fontSize: "0.8125rem", color: "#64748b", marginTop: "0.15rem" },
    topDocBadge: { display: "inline-block", marginTop: "0.35rem", fontSize: "0.65rem", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.08em", background: "#9b1f1f", color: "#fff", borderRadius: "999px", padding: "0.2rem 0.6rem" },
    cancelRow: { display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1rem", background: "#fef2f2", borderRadius: "10px", border: "1px solid #fecaca" },
    emptyNote: { color: "#94a3b8", fontSize: "0.875rem" },
    barChart:  { display: "flex", gap: "0.5rem", alignItems: "flex-end", height: "140px", padding: "0.25rem 0" },
    barCol:    { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem", height: "100%" },
    barValLabel: { fontSize: "0.7rem", fontWeight: "700", color: "#475569", height: "14px", lineHeight: 1 },
    barTrack:  { flex: 1, width: "100%", background: "#f1f5f9", borderRadius: "6px", display: "flex", alignItems: "flex-end", overflow: "hidden" },
    barFill:   { width: "100%", borderRadius: "6px 6px 0 0", transition: "height 0.4s ease" },
    barDayLabel: { fontSize: "0.65rem", textAlign: "center" },
    seeAll:    { fontSize: "0.8125rem", fontWeight: "700", color: "#9b1f1f", textDecoration: "none" },
    emptyBox:  { textAlign: "center", padding: "3rem 1rem" },
    table:     { width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" },
    th:        { padding: "0.625rem 0.875rem", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#64748b", fontWeight: "700", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "left", whiteSpace: "nowrap" },
    td:        { padding: "0.875rem", borderBottom: "1px solid #f1f5f9", verticalAlign: "middle" },
    badge:     { display: "inline-block", fontSize: "0.65rem", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.07em", background: "#dcfce7", color: "#14532d", borderRadius: "999px", padding: "0.25rem 0.6rem", border: "1px solid #bbf7d0" },
};
