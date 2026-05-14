import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import StatCard from "../../components/admin/StatCard";
import { calculateStats, getDoctors, getAppointments } from "../../utils/adminStorage";
import { useAdmin } from "../../context/AdminContext";

export default function AnalyticsPage() {
    const { refreshKey } = useAdmin();
    const [stats, setStats]    = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [all, setAll]        = useState([]);

    useEffect(() => {
        setStats(calculateStats());
        setDoctors(getDoctors());
        setAll(getAppointments().filter(a => a.status !== "cancelled"));
    }, [refreshKey]);

    if (!stats) return <AdminLayout title="Analytics"><p style={{ color:"#94a3b8", padding:"3rem" }}>Loading…</p></AdminLayout>;

    // Appointments per doctor
    const perDoctor = doctors.map(d => ({
        name: d.name,
        specialty: d.specialty,
        count: all.filter(a => a.doctorId === d.id).length,
    })).sort((a, b) => b.count - a.count);

    const maxDoc = Math.max(...perDoctor.map(x => x.count), 1);

    // Appointments per specialty
    const specMap = {};
    all.forEach(a => { specMap[a.specialty] = (specMap[a.specialty] || 0) + 1; });
    const perSpec = Object.entries(specMap).sort((a, b) => b[1] - a[1]);
    const maxSpec = Math.max(...perSpec.map(x => x[1]), 1);

    // Appointments per weekday
    const weekdays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const perDay   = weekdays.map((label, idx) => ({
        label,
        count: all.filter(a => new Date(a.date + "T12:00:00").getDay() === idx).length,
    }));
    const maxDay = Math.max(...perDay.map(x => x.count), 1);

    // Booking trend (last 30 days)
    const last30 = [];
    for (let i = 29; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const iso = d.toISOString().split("T")[0];
        last30.push({ date: iso, count: all.filter(a => a.date === iso).length });
    }
    const maxTrend = Math.max(...last30.map(x => x.count), 1);

    return (
        <AdminLayout title="Analytics">
            {/* KPI row */}
            <div style={S.grid4} className="admin-fade">
                <StatCard icon="icofont-calendar"      label="Total Appointments" value={stats.total}          color="#9b1f1f" bg="#fff5f5" />
                <StatCard icon="icofont-clock-time"    label="Today's Bookings"   value={stats.todayCount}     color="#0369a1" bg="#eff6ff" />
                <StatCard icon="icofont-users-social"  label="Unique Patients"    value={stats.uniquePatients} color="#7c3aed" bg="#f5f3ff" />
                <StatCard icon="icofont-close-circled" label="Cancelled"          value={stats.cancelled}      color="#dc2626" bg="#fef2f2" />
            </div>

            {/* Most booked + Specialty */}
            <div style={S.grid2} className="admin-fade">
                {/* Doctor bar chart */}
                <div style={S.card}>
                    <div style={S.cardHead}><i className="icofont-doctor-alt" style={{ color:"#9b1f1f" }} /> Bookings by Doctor</div>
                    {perDoctor.every(d => d.count === 0) ? (
                        <p style={S.empty}>No booking data yet.</p>
                    ) : (
                        <div style={{ display:"flex", flexDirection:"column", gap:"0.625rem" }}>
                            {perDoctor.map(d => (
                                <div key={d.name} style={S.barRow}>
                                    <div style={S.barLabel} title={d.name}>{d.name.replace("Dr. ","Dr.")}</div>
                                    <div style={S.barTrack}>
                                        <div style={{ ...S.barFill, width:`${Math.max((d.count/maxDoc)*100,d.count>0?6:0)}%`, background: d.count === stats.mostBooked.count && d.count > 0 ? "#9b1f1f" : "#fca5a5" }} />
                                    </div>
                                    <div style={S.barCount}>{d.count}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Specialty pie-ish */}
                <div style={S.card}>
                    <div style={S.cardHead}><i className="icofont-stethoscope-alt" style={{ color:"#9b1f1f" }} /> Bookings by Specialty</div>
                    {perSpec.length === 0 ? (
                        <p style={S.empty}>No booking data yet.</p>
                    ) : (
                        <div style={{ display:"flex", flexDirection:"column", gap:"0.625rem" }}>
                            {perSpec.map(([spec, count]) => {
                                const pct = Math.round((count / (stats.total || 1)) * 100);
                                return (
                                    <div key={spec} style={S.specRow}>
                                        <div style={S.specBarWrap}>
                                            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.2rem" }}>
                                                <span style={{ fontSize:"0.8125rem", fontWeight:"600", color:"#334155" }}>{spec}</span>
                                                <span style={{ fontSize:"0.75rem", color:"#94a3b8" }}>{count} ({pct}%)</span>
                                            </div>
                                            <div style={S.specTrack}>
                                                <div style={{ ...S.specFill, width:`${Math.max((count/maxSpec)*100,4)}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Bookings by weekday */}
            <div style={S.card} className="admin-fade">
                <div style={S.cardHead}><i className="icofont-chart-bar-graph" style={{ color:"#9b1f1f" }} /> Bookings by Day of Week</div>
                <div style={S.weekChart}>
                    {perDay.map(({ label, count }) => {
                        const pct = Math.round((count / maxDay) * 100);
                        const isWeekend = label === "Sun" || label === "Sat";
                        return (
                            <div key={label} style={S.weekCol}>
                                <div style={S.weekVal}>{count > 0 ? count : ""}</div>
                                <div style={S.weekTrack}>
                                    <div style={{ ...S.weekFill, height:`${Math.max(pct, count > 0 ? 5 : 0)}%`, background: isWeekend ? "#fca5a5" : "#9b1f1f" }} />
                                </div>
                                <div style={{ ...S.weekLabel, color: isWeekend ? "#9b1f1f" : "#64748b", fontWeight: isWeekend ? "800" : "600" }}>{label}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 30-day trend sparkline */}
            <div style={S.card} className="admin-fade">
                <div style={S.cardHead}><i className="icofont-chart-line" style={{ color:"#9b1f1f" }} /> 30-Day Booking Trend</div>
                <div style={{ position:"relative", height:"80px", display:"flex", alignItems:"flex-end", gap:"2px" }}>
                    {last30.map(({ date, count }) => {
                        const today = new Date().toISOString().split("T")[0];
                        return (
                            <div key={date} title={`${date}: ${count} booking${count !== 1 ? "s" : ""}`}
                                style={{
                                    flex:1, borderRadius:"3px 3px 0 0",
                                    height:`${Math.max((count/maxTrend)*100,count>0?5:2)}%`,
                                    background: date === today ? "#9b1f1f" : count > 0 ? "#fca5a5" : "#f1f5f9",
                                    cursor:"default", transition:"background 200ms",
                                }} />
                        );
                    })}
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:"0.5rem", fontSize:"0.7rem", color:"#94a3b8" }}>
                    <span>{last30[0]?.date}</span>
                    <span style={{ color:"#9b1f1f", fontWeight:"700" }}>Today</span>
                    <span style={{ visibility:"hidden" }}>.</span>
                </div>
            </div>

            {/* Most booked highlight */}
            {stats.mostBooked.count > 0 && (
                <div style={{ ...S.card, background:"linear-gradient(135deg,#9b1f1f 0%,#6d1515 100%)", border:"none" }} className="admin-fade">
                    <div style={{ display:"flex", alignItems:"center", gap:"1rem", flexWrap:"wrap" }}>
                        <div style={{ width:"56px", height:"56px", borderRadius:"16px", background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", border:"1px solid rgba(255,255,255,0.2)", flexShrink:0 }}>
                            <i className="icofont-award" style={{ fontSize:"1.75rem", color:"#fbbf24" }} />
                        </div>
                        <div>
                            <div style={{ fontSize:"0.75rem", fontWeight:"800", textTransform:"uppercase", letterSpacing:"0.1em", color:"rgba(255,255,255,0.7)", marginBottom:"0.2rem" }}>Top Performing Doctor</div>
                            <div style={{ fontSize:"1.25rem", fontWeight:"900", color:"#fff", fontFamily:"'DM Serif Display',serif" }}>{stats.mostBooked.name}</div>
                            <div style={{ fontSize:"0.875rem", color:"rgba(255,255,255,0.75)" }}>{stats.mostBooked.count} appointment{stats.mostBooked.count !== 1 ? "s" : ""} booked</div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

const S = {
    grid4:       { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:"1rem", marginBottom:"1.25rem" },
    grid2:       { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"1.25rem", marginBottom:"1.25rem" },
    card:        { background:"#fff", border:"1px solid #e9edf4", borderRadius:"14px", padding:"1.375rem 1.5rem", boxShadow:"0 2px 12px rgba(15,23,42,0.05)", marginBottom:"1.25rem" },
    cardHead:    { display:"flex", alignItems:"center", gap:"0.5rem", fontWeight:"800", fontSize:"0.9375rem", color:"#0f172a", marginBottom:"1.1rem" },
    empty:       { color:"#94a3b8", fontSize:"0.875rem", margin:0 },
    barRow:      { display:"flex", alignItems:"center", gap:"0.625rem" },
    barLabel:    { width:"130px", fontSize:"0.8rem", fontWeight:"600", color:"#475569", flexShrink:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" },
    barTrack:    { flex:1, height:"10px", background:"#f1f5f9", borderRadius:"999px", overflow:"hidden" },
    barFill:     { height:"100%", borderRadius:"999px", transition:"width 0.5s ease" },
    barCount:    { width:"24px", fontSize:"0.8rem", fontWeight:"800", color:"#0f172a", textAlign:"right" },
    specRow:     {},
    specBarWrap: {},
    specTrack:   { height:"8px", background:"#f1f5f9", borderRadius:"999px", overflow:"hidden" },
    specFill:    { height:"100%", background:"#9b1f1f", borderRadius:"999px", transition:"width 0.5s ease" },
    weekChart:   { display:"flex", alignItems:"flex-end", gap:"0.5rem", height:"120px" },
    weekCol:     { flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:"0.25rem", height:"100%" },
    weekVal:     { fontSize:"0.7rem", fontWeight:"700", color:"#475569", height:"14px", lineHeight:1 },
    weekTrack:   { flex:1, width:"100%", background:"#f1f5f9", borderRadius:"6px", display:"flex", alignItems:"flex-end", overflow:"hidden" },
    weekFill:    { width:"100%", borderRadius:"6px 6px 0 0", transition:"height 0.4s ease" },
    weekLabel:   { fontSize:"0.7rem" },
};
