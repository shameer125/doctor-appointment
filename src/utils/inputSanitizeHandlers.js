/** Removes ASCII & fullwidth digits from name-like inputs. */
export function stripDigitsFromName(value) {
    return String(value ?? "").replace(/[0-9\uFF10-\uFF19]/g, "");
}

/** Keeps digits only (typing / paste sanitized for phone fields). */
export function stripNonDigitsFromPhone(value) {
    return String(value ?? "").replace(/\D/g, "");
}
