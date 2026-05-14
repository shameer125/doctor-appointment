import { useEffect, useState, useCallback } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getAppointments, deleteAppointment, getDoctors } from "../../utils/adminStorage";
import { useAdmin } from "../../context/AdminContext";

function fmt(iso) {
    if (!iso) return "—";
    const d = new Date(iso + "T12:00:00");
    return isNaN(d) ? iso : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AppointmentsPage() {
    const { refresh } = useAdmin();
    const [all, setAll]             = useState([]);
    const [search, setSearch]       = useState("");
    const [filterDoc, setFilterDoc] = useState("");
    const [filterDate, setFilterDate] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [doctorList, setDoctorList] = useState([]);
    const [delId, setDelId]         = useState(null);
    const [page, setPage]           = useState(1);
    const PER_PAGE = 10;

    const load = useCallback(() => {
        setAll(getAppointments());
        setDoctorList(getDoctors());
    }, []);

    useEffect(() => { load(); }, [load]);

    // Filtering
    const filtered = all.filter(a => {
        if (filterStatus === "active" && a.status === "cancelled") return false;
        if (filterStatus === "cancelled" && a.status !== "cancelled") return false;
        if (filterDoc && a.doctorId !== filterDoc) return false;
        if (filterDate && a.date !== filterDate) return false;
        const q = search.toLowerCase();
        if (q && !a.name?.toLowerCase().includes(q) && !a.email?.toLowerCase().includes(q) && !a.phone?.includes(q)) return false;
        return true;
    });

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const handleDelete = (id) => {
        deleteAppointment(id);
        load();
        refresh();
        setDelId(null);
    };

    const clearFilters = () => { setSearch(""); setFilterDoc(""); setFilterDate(""); setFilterStatus("all"); setPage(1); };

    return (
        <AdminLayout title="Appointments">
            {/* Confirm Delete Modal */}
            {delId && (
                <div style={S.modalBack}>
                    <div style={S.modal}>
                        <div style={S.modalIcon}><i className="icofont-warning-alt" style={{ fontSize: "1.75rem", color: "#f59e0b" }} /></div>
                        <h3 style={S.modalTitle}>Delete Appointment?</h3>
                        <p style={S.modalBody}>This action cannot be undone. The appointment record will be permanently removed.</p>
                        <div style={S.modalFoot}>
                            <button style={S.btnCancel} onClick={() => setDelId(null)}>Cancel</button>
                            <button style={S.btnDel} onClick={() => handleDelete(delId)}>
                                <i className="icofont-trash" style={{ marginRight: "0.35rem" }} />Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div style={S.filterBar} className="admin-fade">
                <div style={S.filterGrid}>
                    <div style={S.fieldWrap}>
                        <label style={S.label}>Search patient</label>
                        <div style={{ position: "relative" }}>
                            <i className="icofont-search-1" style={S.inputIcon} />
                            <input style={{ ...S.input, paddingLeft: "2.4rem" }} placeholder="Name, email or phone…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
                        </div>
                    </div>
                    <div style={S.fieldWrap}>
                        <label style={S.label}>Filter by doctor</label>
                        <select style={S.input} value={filterDoc} onChange={e => { setFilterDoc(e.target.value); setPage(1); }}>
                            <option value="">All doctors</option>
                            {doctorList.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                    </div>
                    <div style={S.fieldWrap}>
                        <label style={S.label}>Filter by date</label>
                        <input style={S.input} type="date" value={filterDate} onChange={e => { setFilterDate(e.target.value); setPage(1); }} />
                    </div>
                    <div style={S.fieldWrap}>
                        <label style={S.label}>Status</label>
                        <select style={S.input} value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}>
                            <option value="all">All</option>
                            <option value="active">Active</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    {(search || filterDoc || filterDate || filterStatus !== "all") && (
                        <div style={{ display: "flex", alignItems: "flex-end" }}>
                            <button style={S.clearBtn} onClick={clearFilters}>✕ Clear</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Summary chips */}
            <div style={S.chips} className="admin-fade">
                <span style={S.chip}>{all.filter(a => a.status !== "cancelled").length} active</span>
                <span style={{ ...S.chip, background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" }}>{all.filter(a => a.status === "cancelled").length} cancelled</span>
                <span style={{ ...S.chip, background: "#eff6ff", color: "#1e40af", border: "1px solid #bfdbfe" }}>{filtered.length} shown</span>
            </div>

            {/* Table */}
            <div style={S.tableWrap} className="admin-fade">
                {paginated.length === 0 ? (
                    <div style={S.empty}>
                        <i className="icofont-calendar" style={{ fontSize: "3rem", color: "#e2e8f0", display: "block", marginBottom: "0.75rem" }} />
                        <p style={{ color: "#94a3b8", margin: 0 }}>No appointments match your filters.</p>
                        <button style={{ ...S.clearBtn, marginTop: "1rem" }} onClick={clearFilters}>Clear filters</button>
                    </div>
                ) : (
                    <>
                        <div style={{ overflowX: "auto" }}>
                            <table style={S.table}>
                                <thead>
                                    <tr>{["#","Patient","Email","Phone","Doctor","Date","Time","Note","Status","Action"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
                                </thead>
                                <tbody>
                                    {paginated.map((a, i) => {
                                        const cancelled = a.status === "cancelled";
                                        return (
                                            <tr key={a.id} style={{ background: i % 2 === 0 ? "#fff" : "#fafbfc", opacity: cancelled ? 0.6 : 1 }}>
                                                <td style={{ ...S.td, color: "#94a3b8", fontSize: "0.75rem" }}>{(page - 1) * PER_PAGE + i + 1}</td>
                                                <td style={S.td}><span style={{ fontWeight: 700, color: "#0f172a" }}>{a.name || "—"}</span></td>
                                                <td style={S.td}><span style={{ fontSize: "0.8125rem", color: "#475569" }}>{a.email || "—"}</span></td>
                                                <td style={S.td}>{a.phone || "—"}</td>
                                                <td style={S.td}>
                                                    <div style={{ fontWeight: 600, color: "#334155" }}>{a.doctorName}</div>
                                                    <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>{a.specialty}</div>
                                                </td>
                                                <td style={{ ...S.td, whiteSpace: "nowrap" }}>{fmt(a.date)}</td>
                                                <td style={{ ...S.td, whiteSpace: "nowrap" }}>{a.timeSlotLabel || a.timeSlot || "—"}</td>
                                                <td style={S.td}>
                                                    {a.message ? (
                                                        <span title={a.message} style={{ fontSize: "0.8125rem", color: "#64748b", display: "block", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                            {a.message}
                                                        </span>
                                                    ) : <span style={{ color: "#cbd5e1" }}>—</span>}
                                                </td>
                                                <td style={S.td}>
                                                    <span style={cancelled ? S.badgeCancelled : S.badgeActive}>
                                                        {cancelled ? "Cancelled" : "Scheduled"}
                                                    </span>
                                                </td>
                                                <td style={S.td}>
                                                    <button style={S.delBtn} onClick={() => setDelId(a.id)} title="Delete appointment">
                                                        <i className="icofont-trash" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div style={S.pagination}>
                                <button style={S.pageBtn} disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                                <span style={{ fontSize: "0.875rem", color: "#64748b" }}>Page {page} of {totalPages}</span>
                                <button style={S.pageBtn} disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AdminLayout>
    );
}

const S = {
    filterBar:  { background: "#fff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "1.25rem 1.5rem", marginBottom: "1rem" },
    filterGrid: { display: "flex", flexWrap: "wrap", gap: "0.875rem", alignItems: "flex-end" },
    fieldWrap:  { display: "flex", flexDirection: "column", gap: "0.35rem", flex: "1 1 180px" },
    label:      { fontSize: "0.75rem", fontWeight: "700", color: "#475569", letterSpacing: "0.01em" },
    inputIcon:  { position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#9b1f1f", pointerEvents: "none", fontSize: "0.9rem" },
    input:      { padding: "0.55rem 0.75rem", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "0.875rem", color: "#0f172a", background: "#fff", outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box" },
    clearBtn:   { padding: "0.55rem 1rem", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "0.8125rem", fontWeight: "700", color: "#475569", cursor: "pointer" },
    chips:      { display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.875rem" },
    chip:       { fontSize: "0.75rem", fontWeight: "700", background: "#dcfce7", color: "#14532d", borderRadius: "999px", padding: "0.25rem 0.75rem", border: "1px solid #bbf7d0" },
    tableWrap:  { background: "#fff", border: "1px solid #e2e8f0", borderRadius: "14px", overflow: "hidden" },
    empty:      { textAlign: "center", padding: "4rem 1rem" },
    table:      { width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" },
    th:         { padding: "0.7rem 0.875rem", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#64748b", fontWeight: "700", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "left", whiteSpace: "nowrap" },
    td:         { padding: "0.875rem", borderBottom: "1px solid #f1f5f9", verticalAlign: "middle" },
    badgeActive:   { display: "inline-block", fontSize: "0.6rem", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.07em", background: "#dcfce7", color: "#14532d", borderRadius: "999px", padding: "0.2rem 0.55rem", border: "1px solid #bbf7d0" },
    badgeCancelled:{ display: "inline-block", fontSize: "0.6rem", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.07em", background: "#fef2f2", color: "#991b1b", borderRadius: "999px", padding: "0.2rem 0.55rem", border: "1px solid #fecaca" },
    delBtn:     { background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", borderRadius: "8px", padding: "0.35rem 0.625rem", cursor: "pointer", fontSize: "0.875rem" },
    pagination: { display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", padding: "1rem" },
    pageBtn:    { padding: "0.4rem 0.875rem", border: "1px solid #e2e8f0", background: "#fff", borderRadius: "8px", fontSize: "0.8125rem", fontWeight: "700", color: "#334155", cursor: "pointer" },
    modalBack:  { position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", backdropFilter: "blur(3px)" },
    modal:      { background: "#fff", borderRadius: "18px", padding: "2rem", maxWidth: "400px", width: "100%", boxShadow: "0 32px 80px rgba(15,23,42,0.25)", textAlign: "center" },
    modalIcon:  { width: "64px", height: "64px", background: "#fffbeb", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", border: "1px solid #fcd34d" },
    modalTitle: { fontSize: "1.25rem", fontWeight: "800", color: "#0f172a", margin: "0 0 0.5rem", fontFamily: "'DM Serif Display',serif" },
    modalBody:  { fontSize: "0.9375rem", color: "#64748b", margin: "0 0 1.5rem", lineHeight: 1.6 },
    modalFoot:  { display: "flex", gap: "0.75rem", justifyContent: "center" },
    btnCancel:  { padding: "0.6rem 1.25rem", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "0.9rem", fontWeight: "700", color: "#334155", cursor: "pointer" },
    btnDel:     { padding: "0.6rem 1.25rem", background: "#9b1f1f", border: "none", borderRadius: "10px", fontSize: "0.9rem", fontWeight: "700", color: "#fff", cursor: "pointer", display: "inline-flex", alignItems: "center" },
};
