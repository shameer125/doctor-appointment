const STORAGE_KEY = "hope_patient_appointments_v1";

function uid() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function loadAppointments() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function persist(list) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 200)));
        return true;
    } catch {
        return false;
    }
}

/** Active bookings: not cancelled — used for slot conflict detection */
export function isTimeSlotUnavailable(doctorId, dateISO, slotId) {
    if (!doctorId || !dateISO || !slotId) return false;
    return loadAppointments().some(
        (a) =>
            a.status !== "cancelled" &&
            String(a.doctorId) === String(doctorId) &&
            a.date === dateISO &&
            a.timeSlot === slotId
    );
}

/**
 * Save a scheduled appointment locally (browser demo).
 */
export function saveAppointmentRecord(record) {
    const list = loadAppointments();
    const next = {
        id: record.id || uid(),
        doctorId: record.doctorId,
        doctorName: record.doctorName,
        specialty: record.specialty,
        date: record.date,
        timeSlot: record.timeSlot,
        timeSlotLabel: record.timeSlotLabel,
        name: record.name,
        email: record.email,
        phone: record.phone,
        message: record.message || "",
        referenceId: record.referenceId,
        accountEmail: record.accountEmail,
        createdAt: record.createdAt || new Date().toISOString(),
        status: "scheduled",
    };
    list.unshift(next);
    persist(list);
    return next;
}

export function listMyAppointments(accountEmail) {
    if (!accountEmail) return [];
    return loadAppointments().filter((a) => a.accountEmail === accountEmail);
}

export function cancelAppointmentById(id) {
    const list = loadAppointments();
    const i = list.findIndex((a) => a.id === id);
    if (i === -1) return false;
    list[i] = {
        ...list[i],
        status: "cancelled",
        cancelledAt: new Date().toISOString(),
    };
    persist(list);
    return true;
}
