/**
 * Booking & contact submissions: local backup, optional hosted form POST, mailto fallback.
 * Set VITE_APPOINTMENT_FORM_URL / VITE_CONTACT_FORM_URL to a Getform, Formspree, or similar endpoint.
 */

import { getSession } from "./authStorage.js";

const STORAGE_KEY = "hope_booking_requests_v1";

const FALLBACK_CONTACT_GETFORM =
    "https://getform.io/f/a17a2715-d7ee-4ac4-8fcb-12f1eed43b2c";

function clinicEmail() {
    return (
        import.meta.env.VITE_CLINIC_EMAIL || "bookings@hopeclinic.health"
    ).trim();
}

function contactFormEndpoint() {
    const fromEnv = import.meta.env.VITE_CONTACT_FORM_URL?.trim?.();
    return fromEnv || FALLBACK_CONTACT_GETFORM;
}

function appointmentFormEndpoint() {
    return import.meta.env.VITE_APPOINTMENT_FORM_URL?.trim?.() || "";
}

export function generateBookingReference() {
    const t = Date.now().toString(36).toUpperCase();
    const r = Math.random().toString(36).slice(2, 7).toUpperCase();
    return `HOPE-${t}-${r}`;
}

export function persistRequest(record) {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const list = raw ? JSON.parse(raw) : [];
        list.unshift(record);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 120)));
        return true;
    } catch {
        return false;
    }
}

export function getStoredRequests() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

/**
 * POST application/x-www-form-urlencoded (works with Getform and many form backends).
 */
export async function postFormUrlEncoded(url, fields) {
    const params = new URLSearchParams();
    Object.entries(fields).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;
        params.append(key, typeof value === "string" ? value : String(value));
    });
    const res = await fetch(url, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: params.toString(),
        mode: "cors",
    });
    return res.ok;
}

function truncateBody(text, max = 1600) {
    if (text.length <= max) return text;
    return `${text.slice(0, max - 3)}...`;
}

export function openMailtoAppointment(fields, referenceId) {
    const to = clinicEmail();
    const subject = encodeURIComponent(`Appointment request ${referenceId}`);
    const lines = [
        `Reference: ${referenceId}`,
        ...(fields.authenticatedAccountEmail
            ? [`Signed-in account: ${fields.authenticatedAccountEmail}`]
            : []),
        ...(fields.doctorName
            ? [
                  `Clinician: ${fields.doctorName}${
                      fields.specialty ? ` (${fields.specialty})` : ""
                  }`,
              ]
            : []),
        `Name: ${fields.name || ""}`,
        `Email: ${fields.email || ""}`,
        `Phone: ${fields.phone || ""}`,
        `Preferred date: ${fields.date || ""}`,
        `Preferred time: ${fields.timePreference || ""}`,
        `Notes:\n${fields.message || ""}`,
    ];
    const body = encodeURIComponent(truncateBody(lines.join("\n")));
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
}

export function openMailtoContact(fields, referenceId) {
    const to = clinicEmail();
    const subject = encodeURIComponent(
        `${
            fields.subject?.trim?.() ? fields.subject.trim() : "Website message"
        } (${referenceId})`
    );
    const lines = [
        `Reference: ${referenceId}`,
        `Name: ${fields.name || ""}`,
        `Email: ${fields.email || ""}`,
        fields.subject?.trim?.()
            ? `Subject: ${fields.subject}`
            : "Subject: (none)",
        `Message:\n${fields.message || ""}`,
    ];
    const body = encodeURIComponent(truncateBody(lines.join("\n")));
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
}

/**
 * @param {'appointment' | 'contact'} formType
 * @param {Record<string,string>} fields - raw form fields
 * @returns {{ ok: boolean, remoteOk: boolean | null, referenceId: string, error?: string }}
 */
export async function submitBookingRequest(formType, fields) {
    let mergedFields = fields;

    if (formType === "appointment") {
        const sess = getSession();
        if (!sess?.email) {
            return {
                ok: false,
                remoteOk: false,
                referenceId: "",
                error: "You must sign in to book an appointment. Create an account or log in, then come back.",
            };
        }
        mergedFields = {
            ...fields,
            authenticatedAccountEmail: sess.email,
        };
    }

    const referenceId = generateBookingReference();
    const createdAt = new Date().toISOString();
    const record = {
        formType,
        referenceId,
        createdAt,
        ...mergedFields,
    };
    persistRequest(record);

    const appointmentUrl = appointmentFormEndpoint();
    const contactUrl = contactFormEndpoint();

    const postFields = {
        ...mergedFields,
        formType,
        referenceId,
        createdAt,
    };

    try {
        if (formType === "appointment") {
            if (appointmentUrl) {
                const remoteOk = await postFormUrlEncoded(
                    appointmentUrl,
                    postFields
                );
                if (!remoteOk) {
                    openMailtoAppointment(mergedFields, referenceId);
                    return {
                        ok: true,
                        remoteOk: false,
                        referenceId,
                        hint: "Booking URL did not confirm. Email opened—send it with your preferred times.",
                    };
                }
                return {
                    ok: true,
                    remoteOk: true,
                    referenceId,
                };
            }
            openMailtoAppointment(mergedFields, referenceId);
            return {
                ok: true,
                remoteOk: null,
                referenceId,
                hint: "Your email app should open. Send the message so we receive your booking details.",
            };
        }

        if (formType === "contact") {
            try {
                const remoteOk = await postFormUrlEncoded(
                    contactUrl,
                    postFields
                );
                if (!remoteOk) {
                    openMailtoContact(fields, referenceId);
                    return {
                        ok: true,
                        remoteOk: false,
                        referenceId,
                        hint: "Website form unreachable. Email opened—send your message there.",
                    };
                }
                return {
                    ok: true,
                    remoteOk: true,
                    referenceId,
                };
            } catch {
                openMailtoContact(fields, referenceId);
                return {
                    ok: true,
                    remoteOk: false,
                    referenceId,
                    hint: "Email fallback opened—please send so we receive your note.",
                };
            }
        }

        return {
            ok: false,
            remoteOk: false,
            referenceId,
            error: "Unknown form.",
        };
    } catch {
        if (formType === "appointment") {
            openMailtoAppointment(mergedFields, referenceId);
            return {
                ok: true,
                remoteOk: false,
                referenceId,
                hint: "Could not submit online. Email fallback opened—please send so we receive your booking.",
            };
        }
        openMailtoContact(fields, referenceId);
        return {
            ok: true,
            remoteOk: false,
            referenceId,
            hint: "Could not submit online. Email fallback opened—please send your message.",
        };
    }
}
