/** @param {string} [raw] */
export function safeAuthRedirect(raw, fallback = "/") {
    if (!raw || typeof raw !== "string") return fallback;
    let decoded = raw;
    try {
        decoded = decodeURIComponent(raw);
    } catch {
        return fallback;
    }
    if (!decoded.startsWith("/")) return fallback;
    if (decoded.startsWith("//")) return fallback;
    return decoded;
}
