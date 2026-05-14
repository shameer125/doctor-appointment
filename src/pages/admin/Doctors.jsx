import { useEffect, useState, useCallback } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getDoctors, saveDoctor, updateDoctor, deleteDoctor } from "../../utils/adminStorage";
import { TIME_SLOTS } from "../../constants/timeSlots";
import { useAdmin } from "../../context/AdminContext";

const SPECIALTIES = ["Family Medicine","Internal Medicine","Psychiatry","Pediatrics","Cardiology","Urgent Care","Dermatology","Orthopedics","Neurology","Oncology","Gynecology","ENT"];
const BLANK = { name:"", title:"", specialty:"", experience:"", hospital:"", bio:"", availableSlots: TIME_SLOTS.map(s=>s.id) };

export default function DoctorsPage() {
    const { refresh } = useAdmin();
    const [list, setList]         = useState([]);
    const [modal, setModal]       = useState(null); // null | "add" | "edit" | "delete" | "slots"
    const [form, setForm]         = useState(BLANK);
    const [editId, setEditId]     = useState(null);
    const [delId, setDelId]       = useState(null);
    const [slotsDoc, setSlotsDoc] = useState(null);
    const [errors, setErrors]     = useState({});
    const [search, setSearch]     = useState("");

    const load = useCallback(() => setList(getDoctors()), []);
    useEffect(() => { load(); }, [load]);

    const shown = list.filter(d =>
        !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase())
    );

    /* ── Validation ─────────────────────────────────────── */
    const validate = () => {
        const e = {};
        if (!form.name.trim())     e.name     = "Name is required.";
        if (!form.specialty.trim()) e.specialty = "Specialty is required.";
        if (!form.hospital.trim()) e.hospital  = "Hospital is required.";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    /* ── Add ────────────────────────────────────────────── */
    const handleAdd = () => {
        if (!validate()) return;
        saveDoctor(form);
        load(); refresh(); closeModal();
    };

    /* ── Edit ───────────────────────────────────────────── */
    const openEdit = (doc) => {
        setEditId(doc.id);
        setForm({ name: doc.name, title: doc.title||"", specialty: doc.specialty, experience: doc.experience||"", hospital: doc.hospital||"", bio: doc.bio||"", availableSlots: doc.availableSlots || TIME_SLOTS.map(s=>s.id) });
        setErrors({});
        setModal("edit");
    };
    const handleEdit = () => {
        if (!validate()) return;
        updateDoctor(editId, form);
        load(); refresh(); closeModal();
    };

    /* ── Delete ─────────────────────────────────────────── */
    const handleDelete = () => {
        deleteDoctor(delId);
        load(); refresh(); closeModal();
    };

    /* ── Slot toggle ────────────────────────────────────── */
    const toggleSlot = (slotId) => {
        setForm(f => ({
            ...f,
            availableSlots: f.availableSlots.includes(slotId)
                ? f.availableSlots.filter(s => s !== slotId)
                : [...f.availableSlots, slotId]
        }));
    };

    const closeModal = () => { setModal(null); setEditId(null); setDelId(null); setSlotsDoc(null); setForm(BLANK); setErrors({}); };

    const openSlots = (doc) => {
        setSlotsDoc(doc);
        setForm({ ...doc });
        setModal("slots");
    };

    const saveSlots = () => {
        updateDoctor(slotsDoc.id, { availableSlots: form.availableSlots });
        load(); refresh(); closeModal();
    };

    return (
        <AdminLayout title="Doctor Management">
            {/* Modal */}
            {modal && (
                <div style={S.backdrop}>
                    <div style={{ ...S.modal, maxWidth: modal === "delete" ? "380px" : "540px" }}>
                        {/* Delete confirm */}
                        {modal === "delete" && (
                            <>
                                <div style={S.modalIcon}><i className="icofont-warning-alt" style={{ fontSize: "1.75rem", color: "#f59e0b" }} /></div>
                                <h3 style={S.modalTitle}>Delete Doctor?</h3>
                                <p style={S.modalBody}>This will permanently remove the doctor from the roster.</p>
                                <div style={S.modalFoot}>
                                    <button style={S.btnGhost} onClick={closeModal}>Cancel</button>
                                    <button style={S.btnRed} onClick={handleDelete}><i className="icofont-trash" style={{ marginRight: "0.35rem" }} />Delete</button>
                                </div>
                            </>
                        )}

                        {/* Slot manager */}
                        {modal === "slots" && (
                            <>
                                <button style={S.closeX} onClick={closeModal}>✕</button>
                                <h3 style={S.modalTitle}>Manage Slots — {slotsDoc?.name}</h3>
                                <p style={S.modalBody}>Toggle which time slots this doctor offers.</p>
                                <div style={S.slotGrid}>
                                    {TIME_SLOTS.map(s => {
                                        const on = form.availableSlots?.includes(s.id);
                                        return (
                                            <button key={s.id} style={{ ...S.slotBtn, ...(on ? S.slotOn : {}) }} onClick={() => toggleSlot(s.id)}>
                                                {on && <i className="icofont-check" style={{ marginRight: "0.25rem", fontSize: "0.75rem" }} />}
                                                {s.label}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div style={S.modalFoot}>
                                    <button style={S.btnGhost} onClick={closeModal}>Cancel</button>
                                    <button style={S.btnPrimary} onClick={saveSlots}>Save Slots</button>
                                </div>
                            </>
                        )}

                        {/* Add / Edit form */}
                        {(modal === "add" || modal === "edit") && (
                            <>
                                <button style={S.closeX} onClick={closeModal}>✕</button>
                                <h3 style={S.modalTitle}>{modal === "add" ? "Add New Doctor" : "Edit Doctor"}</h3>
                                <div style={S.formGrid}>
                                    {[
                                        { key:"name", label:"Full Name *", ph:"Dr. Jane Smith" },
                                        { key:"title", label:"Title / Degree", ph:"MD, Internal Medicine" },
                                        { key:"experience", label:"Experience", ph:"8 years" },
                                        { key:"hospital", label:"Hospital / Clinic *", ph:"Hope Medical Center" },
                                    ].map(({ key, label, ph }) => (
                                        <div key={key} style={S.field}>
                                            <label style={S.label}>{label}</label>
                                            <input style={{ ...S.input, borderColor: errors[key] ? "#fca5a5" : "#e2e8f0" }}
                                                placeholder={ph} value={form[key]}
                                                onChange={e => { setForm(f => ({...f, [key]: e.target.value})); setErrors(er => ({...er, [key]: ""})); }} />
                                            {errors[key] && <span style={S.err}>{errors[key]}</span>}
                                        </div>
                                    ))}
                                    <div style={S.field}>
                                        <label style={S.label}>Specialty *</label>
                                        <select style={{ ...S.input, borderColor: errors.specialty ? "#fca5a5" : "#e2e8f0" }}
                                            value={form.specialty}
                                            onChange={e => { setForm(f => ({...f, specialty: e.target.value})); setErrors(er => ({...er, specialty: ""})); }}>
                                            <option value="">Select specialty…</option>
                                            {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        {errors.specialty && <span style={S.err}>{errors.specialty}</span>}
                                    </div>
                                    <div style={{ ...S.field, gridColumn: "1 / -1" }}>
                                        <label style={S.label}>Bio / Description</label>
                                        <textarea style={{ ...S.input, minHeight: "80px", resize: "vertical" }}
                                            placeholder="Short description of this doctor's expertise…"
                                            value={form.bio}
                                            onChange={e => setForm(f => ({...f, bio: e.target.value}))} />
                                    </div>
                                </div>
                                <div style={S.modalFoot}>
                                    <button style={S.btnGhost} onClick={closeModal}>Cancel</button>
                                    <button style={S.btnPrimary} onClick={modal === "add" ? handleAdd : handleEdit}>
                                        <i className={`icofont-${modal === "add" ? "plus" : "save"}`} style={{ marginRight: "0.35rem" }} />
                                        {modal === "add" ? "Add Doctor" : "Save Changes"}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Toolbar */}
            <div style={S.toolbar} className="admin-fade">
                <div style={{ position: "relative", flex: 1, maxWidth: "340px" }}>
                    <i className="icofont-search-1" style={S.searchIcon} />
                    <input style={{ ...S.searchInput }} placeholder="Search by name or specialty…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <button style={S.addBtn} onClick={() => { setForm(BLANK); setErrors({}); setModal("add"); }}>
                    <i className="icofont-plus" style={{ marginRight: "0.35rem" }} />Add Doctor
                </button>
            </div>

            {/* Cards grid */}
            <div style={S.grid} className="admin-fade">
                {shown.length === 0 && (
                    <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
                        <i className="icofont-doctor-alt" style={{ fontSize: "3rem", display: "block", marginBottom: "0.75rem" }} />
                        No doctors found.
                    </div>
                )}
                {shown.map(doc => (
                    <div key={doc.id} style={S.docCard}>
                        <div style={S.docAvatarWrap}>
                            <div style={S.docAvatar}><i className="icofont-doctor-alt" style={{ fontSize: "2rem", color: "#9b1f1f" }} /></div>
                            <span style={S.specialtyBadge}>{doc.specialty}</span>
                        </div>
                        <div style={S.docInfo}>
                            <div style={S.docName}>{doc.name}</div>
                            <div style={S.docTitle}>{doc.title}</div>
                            {doc.hospital && <div style={S.docHospital}><i className="icofont-hospital" style={{ marginRight: "0.3rem", color: "#9b1f1f" }} />{doc.hospital}</div>}
                            {doc.experience && <div style={S.docExp}><i className="icofont-award" style={{ marginRight: "0.3rem", color: "#f59e0b" }} />{doc.experience}</div>}
                        </div>
                        <div style={S.docBio}>{doc.bio || "No bio provided."}</div>
                        <div style={S.docSlotRow}>
                            <i className="icofont-clock-time" style={{ color: "#9b1f1f", fontSize: "0.8rem" }} />
                            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{doc.availableSlots?.length || 0} slots available</span>
                        </div>
                        <div style={S.docActions}>
                            <button style={S.btnSlot}  onClick={() => openSlots(doc)}><i className="icofont-clock-time" /> Slots</button>
                            <button style={S.btnEdit}  onClick={() => openEdit(doc)}><i className="icofont-edit" /> Edit</button>
                            <button style={S.btnTrash} onClick={() => { setDelId(doc.id); setModal("delete"); }}><i className="icofont-trash" /></button>
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}

const S = {
    toolbar:      { display:"flex", flexWrap:"wrap", gap:"0.875rem", alignItems:"center", justifyContent:"space-between", marginBottom:"1.25rem" },
    searchIcon:   { position:"absolute", left:"0.75rem", top:"50%", transform:"translateY(-50%)", color:"#9b1f1f", pointerEvents:"none" },
    searchInput:  { width:"100%", padding:"0.6rem 0.75rem 0.6rem 2.4rem", border:"1.5px solid #e2e8f0", borderRadius:"10px", fontSize:"0.875rem", color:"#0f172a", outline:"none", fontFamily:"inherit", boxSizing:"border-box" },
    addBtn:       { display:"inline-flex", alignItems:"center", padding:"0.6rem 1.25rem", background:"#9b1f1f", color:"#fff", border:"none", borderRadius:"10px", fontSize:"0.875rem", fontWeight:"700", cursor:"pointer", boxShadow:"0 2px 10px rgba(155,31,31,0.3)", flexShrink:0 },
    grid:         { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:"1.125rem" },
    docCard:      { background:"#fff", border:"1px solid #e9edf4", borderRadius:"16px", padding:"1.375rem", boxShadow:"0 2px 12px rgba(15,23,42,0.05)", display:"flex", flexDirection:"column", gap:"0.625rem" },
    docAvatarWrap:{ display:"flex", alignItems:"center", justifyContent:"space-between" },
    docAvatar:    { width:"56px", height:"56px", borderRadius:"14px", background:"#fff5f5", border:"1px solid #fecaca", display:"flex", alignItems:"center", justifyContent:"center" },
    specialtyBadge:{ fontSize:"0.65rem", fontWeight:"800", textTransform:"uppercase", letterSpacing:"0.07em", background:"#fff5f5", color:"#9b1f1f", border:"1px solid #fecaca", borderRadius:"999px", padding:"0.25rem 0.625rem" },
    docInfo:      {},
    docName:      { fontSize:"1rem", fontWeight:"800", color:"#0f172a" },
    docTitle:     { fontSize:"0.8125rem", color:"#64748b" },
    docHospital:  { fontSize:"0.8125rem", color:"#475569", marginTop:"0.2rem", display:"flex", alignItems:"center" },
    docExp:       { fontSize:"0.8125rem", color:"#475569", display:"flex", alignItems:"center" },
    docBio:       { fontSize:"0.8125rem", color:"#64748b", lineHeight:1.6, borderTop:"1px solid #f1f5f9", paddingTop:"0.625rem" },
    docSlotRow:   { display:"flex", alignItems:"center", gap:"0.4rem" },
    docActions:   { display:"flex", gap:"0.5rem", paddingTop:"0.375rem", borderTop:"1px solid #f1f5f9" },
    btnSlot:      { flex:1, padding:"0.45rem 0.5rem", background:"#eff6ff", border:"1px solid #bfdbfe", color:"#1d4ed8", borderRadius:"8px", fontSize:"0.75rem", fontWeight:"700", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"0.3rem" },
    btnEdit:      { flex:1, padding:"0.45rem 0.5rem", background:"#f8fafc", border:"1px solid #e2e8f0", color:"#334155", borderRadius:"8px", fontSize:"0.75rem", fontWeight:"700", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"0.3rem" },
    btnTrash:     { padding:"0.45rem 0.625rem", background:"#fef2f2", border:"1px solid #fecaca", color:"#b91c1c", borderRadius:"8px", fontSize:"0.8125rem", cursor:"pointer" },
    backdrop:     { position:"fixed", inset:0, background:"rgba(15,23,42,0.55)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:"1.5rem", backdropFilter:"blur(3px)" },
    modal:        { background:"#fff", borderRadius:"18px", padding:"2rem", width:"100%", boxShadow:"0 32px 80px rgba(15,23,42,0.25)", position:"relative", maxHeight:"90vh", overflowY:"auto" },
    modalIcon:    { width:"64px", height:"64px", background:"#fffbeb", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1rem", border:"1px solid #fcd34d" },
    modalTitle:   { fontSize:"1.2rem", fontWeight:"800", color:"#0f172a", margin:"0 0 0.5rem", fontFamily:"'DM Serif Display',serif" },
    modalBody:    { fontSize:"0.9rem", color:"#64748b", margin:"0 0 1.25rem", lineHeight:1.6, textAlign:"center" },
    modalFoot:    { display:"flex", gap:"0.75rem", justifyContent:"flex-end", marginTop:"1.5rem" },
    closeX:       { position:"absolute", top:"1rem", right:"1rem", background:"#f1f5f9", border:"1px solid #e2e8f0", borderRadius:"8px", width:"32px", height:"32px", cursor:"pointer", fontSize:"0.9rem", color:"#64748b", display:"flex", alignItems:"center", justifyContent:"center" },
    formGrid:     { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:"0.875rem" },
    field:        { display:"flex", flexDirection:"column", gap:"0.3rem" },
    label:        { fontSize:"0.75rem", fontWeight:"700", color:"#475569" },
    input:        { padding:"0.6rem 0.75rem", border:"1.5px solid #e2e8f0", borderRadius:"8px", fontSize:"0.875rem", color:"#0f172a", outline:"none", fontFamily:"inherit", width:"100%", boxSizing:"border-box" },
    err:          { fontSize:"0.75rem", color:"#b91c1c" },
    slotGrid:     { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))", gap:"0.5rem", marginBottom:"0.5rem" },
    slotBtn:      { padding:"0.5rem 0.25rem", border:"1.5px solid #e2e8f0", borderRadius:"8px", fontSize:"0.8rem", fontWeight:"600", cursor:"pointer", background:"#f8fafc", color:"#475569", textAlign:"center", display:"flex", alignItems:"center", justifyContent:"center" },
    slotOn:       { background:"#fff5f5", borderColor:"#9b1f1f", color:"#9b1f1f" },
    btnGhost:     { padding:"0.575rem 1.125rem", background:"#f1f5f9", border:"1px solid #e2e8f0", borderRadius:"10px", fontSize:"0.875rem", fontWeight:"700", color:"#334155", cursor:"pointer" },
    btnPrimary:   { padding:"0.575rem 1.25rem", background:"#9b1f1f", border:"none", borderRadius:"10px", fontSize:"0.875rem", fontWeight:"700", color:"#fff", cursor:"pointer", display:"inline-flex", alignItems:"center" },
    btnRed:       { padding:"0.575rem 1.125rem", background:"#9b1f1f", border:"none", borderRadius:"10px", fontSize:"0.875rem", fontWeight:"700", color:"#fff", cursor:"pointer", display:"inline-flex", alignItems:"center" },
};
