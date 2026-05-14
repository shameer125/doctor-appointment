/**
 * adminStorage.js
 * Central utility module for all admin dashboard data operations.
 * All data is stored in / read from localStorage — frontend only.
 */

import { TIME_SLOTS } from "../constants/timeSlots";

// ─── Storage Keys ──────────────────────────────────────────────────────────
const KEYS = {
    ADMIN_SESSION: "hope_admin_session_v1",
    APPOINTMENTS:  "hope_patient_appointments_v1", // shared with user side
    DOCTORS:       "hope_admin_doctors_v1",
};

const ADMIN_EMAIL = "admin@gmail.com";

// ─── UID helper ────────────────────────────────────────────────────────────
function uid() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
    return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

// ─── Default doctors (seeded from static data if localStorage is empty) ───
const DEFAULT_DOCTORS = [
    { id: "1", name: "Dr. Amara Okonkwo",  title: "MD, Family Medicine",   specialty: "Family Medicine",   experience: "12 years", hospital: "Hope Medical Center",  image: "img/team/01.jpg",              bio: "Same-day visits, chronic disease management, and preventive care for all ages.",                        availableSlots: TIME_SLOTS.map(s => s.id) },
    { id: "2", name: "Dr. James Ruiz",     title: "MD, Internal Medicine", specialty: "Internal Medicine", experience: "9 years",  hospital: "Hope Medical Center",  image: "img/team/02.jpg",              bio: "Complex medical conditions, medication reviews, and coordinated specialty referrals.",                  availableSlots: TIME_SLOTS.map(s => s.id) },
    { id: "3", name: "Dr. Priya Nair",     title: "MD, Psychiatry",        specialty: "Psychiatry",        experience: "7 years",  hospital: "Hope Wellness Clinic", image: "img/team/03.jpg",              bio: "Medication management, anxiety and mood disorders, and collaborative care planning.",                  availableSlots: TIME_SLOTS.map(s => s.id) },
    { id: "4", name: "Dr. Elena Vasquez",  title: "DO, Pediatrics",        specialty: "Pediatrics",        experience: "10 years", hospital: "Hope Medical Center",  image: "img/team/01.jpg",              bio: "Well-child visits, immunizations, and developmental support for children and teens.",                 availableSlots: TIME_SLOTS.map(s => s.id) },
    { id: "5", name: "Dr. Michael Chen",   title: "MD, Cardiology",        specialty: "Cardiology",        experience: "15 years", hospital: "Hope Heart Institute", image: "img/photos/dept-cardiology.jpg", bio: "Hypertension, heart risk assessment, and follow-up after cardiology specialty care.",               availableSlots: TIME_SLOTS.map(s => s.id) },
    { id: "6", name: "Dr. Sarah Williams", title: "PA-C, Urgent Care",     specialty: "Urgent Care",       experience: "6 years",  hospital: "Hope Urgent Care",     image: "img/team/02.jpg",              bio: "Acute illness, minor injuries, and rapid access when your PCP is fully booked.",                     availableSlots: TIME_SLOTS.map(s => s.id) },
];

// ══════════════════════════════════════════════════════════════════════════
//  AUTH
// ══════════════════════════════════════════════════════════════════════════

/** Check if the given email is the hardcoded admin email */
export function isAdminEmail(email) {
    return String(email || "").trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

/** Returns true if an active admin session exists in localStorage */
export function isAdminLoggedIn() {
    try {
        const raw = localStorage.getItem(KEYS.ADMIN_SESSION);
        if (!raw) return false;
        const data = JSON.parse(raw);
        return data?.isAdmin === true && typeof data?.email === "string";
    } catch {
        return false;
    }
}

/** Persist admin session. Returns { ok, error? } */
export function adminLogin(email) {
    const norm = String(email || "").trim().toLowerCase();
    if (!norm) return { ok: false, error: "Please enter your email." };
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(norm)) return { ok: false, error: "Please enter a valid email address." };
    if (!isAdminEmail(norm)) return { ok: false, error: "Access denied. This email is not an admin account." };
    localStorage.setItem(KEYS.ADMIN_SESSION, JSON.stringify({ isAdmin: true, email: norm, loggedInAt: new Date().toISOString() }));
    return { ok: true };
}

/** Clear admin session from localStorage */
export function adminLogout() {
    localStorage.removeItem(KEYS.ADMIN_SESSION);
}

/** Return admin session data or null */
export function getAdminSession() {
    try {
        const raw = localStorage.getItem(KEYS.ADMIN_SESSION);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

// ══════════════════════════════════════════════════════════════════════════
//  APPOINTMENTS
// ══════════════════════════════════════════════════════════════════════════

/** Load all appointments (all statuses) */
export function getAppointments() {
    try {
        const raw = localStorage.getItem(KEYS.APPOINTMENTS);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

/** Persist the full appointments array */
export function saveAppointments(list) {
    try {
        localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(list));
        return true;
    } catch {
        return false;
    }
}

/** Save a single new appointment (prepend) */
export function saveAppointment(record) {
    const list = getAppointments();
    const next = {
        id:            record.id || uid(),
        doctorId:      String(record.doctorId),
        doctorName:    record.doctorName || "",
        specialty:     record.specialty  || "",
        date:          record.date       || "",
        timeSlot:      record.timeSlot   || "",
        timeSlotLabel: record.timeSlotLabel || record.timeSlot || "",
        name:          record.name       || "",
        email:         String(record.email || "").trim().toLowerCase(),
        phone:         record.phone      || "",
        message:       record.message    || "",
        referenceId:   record.referenceId || `REF-${Date.now()}`,
        accountEmail:  String(record.accountEmail || record.email || "").trim().toLowerCase(),
        createdAt:     record.createdAt  || new Date().toISOString(),
        status:        record.status     || "scheduled",
    };
    list.unshift(next);
    saveAppointments(list);
    return next;
}

/** Hard-delete an appointment by id */
export function deleteAppointment(id) {
    const list = getAppointments().filter(a => a.id !== id);
    saveAppointments(list);
    return true;
}

/** Update appointment fields by id */
export function updateAppointment(id, patch) {
    const list = getAppointments().map(a => a.id === id ? { ...a, ...patch } : a);
    saveAppointments(list);
}

/** Check if a slot is booked (non-cancelled) */
export function isSlotBooked(doctorId, dateISO, slotId) {
    return getAppointments().some(
        a => a.status !== "cancelled" &&
             String(a.doctorId) === String(doctorId) &&
             a.date === dateISO &&
             a.timeSlot === slotId
    );
}

// ══════════════════════════════════════════════════════════════════════════
//  DOCTORS
// ══════════════════════════════════════════════════════════════════════════

/** Load doctors from localStorage (seed defaults on first run) */
export function getDoctors() {
    try {
        const raw = localStorage.getItem(KEYS.DOCTORS);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
        // Seed defaults
        saveDoctors(DEFAULT_DOCTORS);
        return DEFAULT_DOCTORS;
    } catch {
        return DEFAULT_DOCTORS;
    }
}

/** Persist the full doctors array */
export function saveDoctors(list) {
    try {
        localStorage.setItem(KEYS.DOCTORS, JSON.stringify(list));
        return true;
    } catch {
        return false;
    }
}

/** Add a new doctor */
export function saveDoctor(doctor) {
    const list = getDoctors();
    const next = {
        id:             doctor.id || uid(),
        name:           doctor.name || "",
        title:          doctor.title || "",
        specialty:      doctor.specialty || "",
        experience:     doctor.experience || "",
        hospital:       doctor.hospital || "",
        image:          doctor.image || "img/team/01.jpg",
        bio:            doctor.bio || "",
        availableSlots: doctor.availableSlots || TIME_SLOTS.map(s => s.id),
    };
    list.push(next);
    saveDoctors(list);
    return next;
}

/** Update an existing doctor */
export function updateDoctor(id, patch) {
    const list = getDoctors().map(d => d.id === id ? { ...d, ...patch } : d);
    saveDoctors(list);
}

/** Delete a doctor by id */
export function deleteDoctor(id) {
    saveDoctors(getDoctors().filter(d => d.id !== id));
    return true;
}

// ══════════════════════════════════════════════════════════════════════════
//  ANALYTICS
// ══════════════════════════════════════════════════════════════════════════

/** Return aggregate stats for the dashboard */
export function calculateStats() {
    const all  = getAppointments();
    const docs = getDoctors();
    const today = new Date().toISOString().split("T")[0];

    const active    = all.filter(a => a.status !== "cancelled");
    const todayApps = active.filter(a => a.date === today);

    // Most booked doctor
    const countByDoc = {};
    active.forEach(a => { countByDoc[a.doctorName] = (countByDoc[a.doctorName] || 0) + 1; });
    let mostBooked = { name: "—", count: 0 };
    Object.entries(countByDoc).forEach(([name, count]) => {
        if (count > mostBooked.count) mostBooked = { name, count };
    });

    // Unique patients (by email)
    const uniqueEmails = new Set(active.map(a => (a.email || a.accountEmail || "").toLowerCase()).filter(Boolean));

    // Appointments per doctor (for slot view)
    const byDoctor = {};
    docs.forEach(d => { byDoctor[d.id] = { doctor: d, appointments: [] }; });
    active.forEach(a => {
        if (byDoctor[a.doctorId]) byDoctor[a.doctorId].appointments.push(a);
    });

    // Last 7 days bookings
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const iso = d.toISOString().split("T")[0];
        last7.push({ date: iso, label: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }), count: active.filter(a => a.date === iso).length });
    }

    return {
        total:         active.length,
        todayCount:    todayApps.length,
        totalDoctors:  docs.length,
        uniquePatients: uniqueEmails.size,
        mostBooked,
        byDoctor,
        last7,
        cancelled:     all.filter(a => a.status === "cancelled").length,
    };
}
