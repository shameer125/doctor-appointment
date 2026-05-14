/**
 * Compatibility bridge for modules that expect `getSession()` (e.g. booking submit).
 * Session is owned by `emailAuth.js`.
 */
import { getUser } from "./emailAuth.js";

/** @returns {{ email: string; loggedInAt?: string } | null} */
export function getSession() {
    const u = getUser();
    if (!u) return null;
    return { email: u.email, loggedInAt: u.loggedInAt };
}
