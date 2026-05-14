/**
 * Frontend-only email "authentication" (no backend verification).
 * Session shape in localStorage: { email, isLoggedIn, loggedInAt }.
 */

const SESSION_KEY = "hope_email_auth_v1";

/** @typedef {{ email: string; isLoggedIn: boolean; loggedInAt: string }} EmailAuthSession */

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export function normalizeEmail(raw) {
    return String(raw ?? "")
        .trim()
        .toLowerCase();
}

export function isValidEmailFormat(email) {
    const norm = normalizeEmail(email);
    return norm.length > 0 && EMAIL_REGEX.test(norm);
}

/**
 * Returns parsed session if logged in and well-formed; otherwise null.
 * @returns {EmailAuthSession | null}
 */
export function getUser() {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (!raw) return null;
        const data = JSON.parse(raw);
        if (
            !data ||
            data.isLoggedIn !== true ||
            typeof data.email !== "string" ||
            !isValidEmailFormat(data.email)
        ) {
            return null;
        }
        if (typeof data.loggedInAt !== "string") return null;
        return {
            email: normalizeEmail(data.email),
            isLoggedIn: true,
            loggedInAt: data.loggedInAt,
        };
    } catch {
        return null;
    }
}

/** Whether a non-expiring client session exists (frontend-only; not security). */
export function isAuthenticated() {
    return getUser() !== null;
}

/**
 * @returns {{ ok: true; user: EmailAuthSession } | { ok:false; error: string }}
 */
export function loginUser(email) {
    const norm = normalizeEmail(email);
    if (!norm) {
        return { ok: false, error: "Please enter your email." };
    }
    if (!isValidEmailFormat(norm)) {
        return {
            ok: false,
            error: "Please enter a valid email address (e.g. name@gmail.com).",
        };
    }
    const loggedInAt = new Date().toISOString();
    /** @type {EmailAuthSession} */
    const session = {
        email: norm,
        isLoggedIn: true,
        loggedInAt,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { ok: true, user: session };
}

/** Remove email auth session. Does not wipe unrelated app keys (e.g. booking demo data). */
export function logoutUser() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem("hope_auth_session_v1");
}
