import { useEffect, useState, useCallback } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getDoctors, getAppointments } from "../../utils/adminStorage";
import { TIME_SLOTS } from "../../constants/timeSlots";

function fmt(iso) {
    if (!iso) return iso;
    const d = new Date(iso + "T12:00:00");
    return isNaN(d) ? iso : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// Build next 14 days
function getDays() {
    const days = [];
    for (let i = 0; i < 14; i++) {
        const d = new Date(); d.setDate(d.getDate() + i);
        days.push(d.toISOString().split("T")[0]);
    }
    return days;
}

export default function SlotManagerPage() {
    const [doctors, setDoctors]       = useState([]);
    const [appointments, setAppts]    = useState([]);
    const [selDoc, setSelDoc]         = useState("");
    const [selDate, setSelDate]       = useState(new Date().toISOString().split("T")[0]);
    const days = getDays();

    const load = useCallback(() => {
        const docs = getDoctors();
        setDoctors(docs);
        if (docs.length > 0 && !selDoc) setSelDoc(docs[0].id);
        setAppts(getAppointments().filter(a => a.status !== "cancelled"));
    }, [selDoc]);

    useEffect(() => { load(); }, [load]);

    const doctor = doctors.find(d => d.id === selDoc);
    const availableSlots = doctor?.availableSlots || TIME_SLOTS.map(s => s.id);

    // Bookings for selected doctor+date
    const dayBookings = appointments.filter(a => a.doctorId === selDoc && a.date === selDate);
    const bookedSlotIds = new Set(dayBookings.map(a => a.timeSlot));

    // Weekly overview: booked count per day
    const weeklyData = days.map(date => ({
        date,
        count: appointments.filter(a => a.doctorId === selDoc && a.date === date).length,
    }));

    return (
        <AdminLayout title="Slot Manager">
            {/* Selectors */}
            <div style={S.filterBar} className="admin-fade">
                <div style={S.field}>
                    <label style={S.label}>Select Doctor</label>
                    <select style={S.input} value={selDoc} onChange={e => setSelDoc(e.target.value)}>
                        {doctors.map(d => <option key={d.id} value={d.id}>{d.name} — {d.specialty}</option>)}
                    </select>
                </div>
                <div style={S.field}>
                    <label style={S.label}>Select Date</label>
                    <input style={S.input} type="date" value={selDate} onChange={e => setSelDate(e.target.value)} />
                </div>
            </div>

            {doctor && (
                <div style={S.grid2} className="admin-fade">
                    {/* Left: Slot grid */}
                    <div style={S.card}>
                        <div style={S.cardHead}>
                            <i className="icofont-clock-time" style={{ color: "#9b1f1f" }} />
                            Slots on {fmt(selDate)} — {doctor.name}
                        </div>

                        {/* Legend */}
                        <div style={S.legend}>
                            <span style={S.legendItem}><span style={{ ...S.dot, background: "#dcfce7", border: "1px solid #bbf7d0" }} />Available</span>
                            <span style={S.legendItem}><span style={{ ...S.dot, background: "#fef2f2", border: "1px solid #fecaca" }} />Booked</span>
                            <span style={S.legendItem}><span style={{ ...S.dot, background: "#f1f5f9", border: "1px solid #e2e8f0" }} />Not offered</span>
                        </div>

                        <div style={S.slotGrid}>
                            {TIME_SLOTS.map(slot => {
                                const offered = availableSlots.includes(slot.id);
                                const booked  = bookedSlotIds.has(slot.id);
                                const booking = dayBookings.find(a => a.timeSlot === slot.id);

                                let bg = "#f1f5f9", border = "1px solid #e2e8f0", color = "#94a3b8";
                                if (offered && !booked) { bg = "#f0fdf4"; border = "1px solid #bbf7d0"; color = "#15803d"; }
                                if (booked)             { bg = "#fef2f2"; border = "1px solid #fecaca"; color = "#b91c1c"; }

                                return (
                                    <div key={slot.id} style={{ ...S.slotCell, background: bg, border, color }}>
                                        <div style={S.slotTime}>{slot.label}</div>
                                        {booked && booking && (
                                            <div style={S.slotPatient} title={booking.name}>
                                                <i className="icofont-user-alt-5" style={{ fontSize: "0.7rem" }} /> {booking.name}
                                            </div>
                                        )}
                                        {!offered && <div style={S.slotUnavail}>Not offered</div>}
                                        {offered && !booked && <div style={{ fontSize: "0.65rem", color: "#4ade80" }}>Open</div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: 14-day overview + booked list */}
                    <div>
                        <div style={{ ...S.card, marginBottom: "1.125rem" }}>
                            <div style={S.cardHead}>
                                <i className="icofont-calendar" style={{ color: "#9b1f1f" }} />
                                14-Day Booking Overview
                            </div>
                            <div style={S.calGrid}>
                                {weeklyData.map(({ date, count }) => {
                                    const isSelected = date === selDate;
                                    const today = new Date().toISOString().split("T")[0];
                                    const isToday = date === today;
                                    return (
                                        <button key={date}
                                            onClick={() => setSelDate(date)}
                                            style={{
                                                ...S.calCell,
                                                background: isSelected ? "#9b1f1f" : isToday ? "#fff5f5" : "#f8fafc",
                                                border: isSelected ? "1.5px solid #9b1f1f" : isToday ? "1.5px solid #fca5a5" : "1px solid #e2e8f0",
                                                color: isSelected ? "#fff" : "#0f172a",
                                            }}>
                                            <div style={{ fontSize: "0.65rem", fontWeight: "700", opacity: isSelected ? 1 : 0.7 }}>
                                                {new Date(date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" })}
                                            </div>
                                            <div style={{ fontSize: "0.9rem", fontWeight: "900" }}>
                                                {new Date(date + "T12:00:00").getDate()}
                                            </div>
                                            {count > 0 && (
                                                <div style={{ ...S.calBadge, background: isSelected ? "rgba(255,255,255,0.25)" : "#fecaca", color: isSelected ? "#fff" : "#9b1f1f" }}>
                                                    {count}
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Booked appointments list for selected day */}
                        <div style={S.card}>
                            <div style={S.cardHead}>
                                <i className="icofont-list" style={{ color: "#9b1f1f" }} />
                                Bookings on {fmt(selDate)} ({dayBookings.length})
                            </div>
                            {dayBookings.length === 0 ? (
                                <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: 0 }}>No bookings for this date.</p>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                                    {dayBookings.map(b => (
                                        <div key={b.id} style={S.bookingRow}>
                                            <div style={S.bookingTime}>{b.timeSlotLabel || b.timeSlot}</div>
                                            <div>
                                                <div style={{ fontWeight: "700", fontSize: "0.875rem", color: "#0f172a" }}>{b.name}</div>
                                                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{b.email}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

const S = {
    filterBar:  { background:"#fff", border:"1px solid #e2e8f0", borderRadius:"14px", padding:"1.25rem 1.5rem", marginBottom:"1.25rem", display:"flex", flexWrap:"wrap", gap:"1rem" },
    field:      { display:"flex", flexDirection:"column", gap:"0.35rem", flex:"1 1 220px" },
    label:      { fontSize:"0.75rem", fontWeight:"700", color:"#475569" },
    input:      { padding:"0.6rem 0.75rem", border:"1.5px solid #e2e8f0", borderRadius:"8px", fontSize:"0.875rem", color:"#0f172a", outline:"none", fontFamily:"inherit" },
    grid2:      { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"1.25rem" },
    card:       { background:"#fff", border:"1px solid #e9edf4", borderRadius:"14px", padding:"1.375rem", boxShadow:"0 2px 12px rgba(15,23,42,0.05)" },
    cardHead:   { display:"flex", alignItems:"center", gap:"0.5rem", fontWeight:"800", fontSize:"0.9375rem", color:"#0f172a", marginBottom:"1rem" },
    legend:     { display:"flex", flexWrap:"wrap", gap:"0.875rem", marginBottom:"1rem" },
    legendItem: { display:"flex", alignItems:"center", gap:"0.4rem", fontSize:"0.75rem", color:"#64748b", fontWeight:"600" },
    dot:        { display:"inline-block", width:"12px", height:"12px", borderRadius:"4px", flexShrink:0 },
    slotGrid:   { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))", gap:"0.5rem" },
    slotCell:   { borderRadius:"10px", padding:"0.625rem 0.5rem", textAlign:"center", transition:"opacity 200ms" },
    slotTime:   { fontSize:"0.875rem", fontWeight:"700" },
    slotPatient:{ fontSize:"0.65rem", fontWeight:"600", marginTop:"0.2rem", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:"0.2rem", justifyContent:"center" },
    slotUnavail:{ fontSize:"0.65rem", marginTop:"0.2rem", opacity:0.7 },
    calGrid:    { display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"0.375rem" },
    calCell:    { borderRadius:"10px", padding:"0.5rem 0.25rem", cursor:"pointer", textAlign:"center", border:"none", fontFamily:"inherit", position:"relative", transition:"background 150ms" },
    calBadge:   { position:"absolute", top:"2px", right:"2px", fontSize:"0.55rem", fontWeight:"900", borderRadius:"999px", padding:"0.1rem 0.3rem" },
    bookingRow: { display:"flex", alignItems:"center", gap:"0.875rem", padding:"0.625rem 0.875rem", background:"#f8fafc", borderRadius:"10px", border:"1px solid #f1f5f9" },
    bookingTime:{ flexShrink:0, fontSize:"0.8rem", fontWeight:"800", color:"#9b1f1f", background:"#fff5f5", border:"1px solid #fecaca", borderRadius:"8px", padding:"0.25rem 0.5rem" },
};
