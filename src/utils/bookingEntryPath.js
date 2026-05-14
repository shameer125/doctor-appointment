const base = process.env.PUBLIC_URL || "";

export function doctorsLandingPath() {
    return `${base}/doctors`;
}

/** Post–sign-up / post–login destinations */
export function bookAfterAuthLocation() {
    return doctorsLandingPath();
}

export function bookDoctorPath(doctorId) {
    return `${base}/book/${doctorId}`;
}

/** Signup URL — full `Link to`/`href`, including PUBLIC_URL prefix. */
export function signupThenBookHref(doctorId) {
    return `${base}/signup?redirect=${encodeURIComponent(
        bookDoctorPath(doctorId)
    )}`;
}

/**
 * Path segment for the shared `Button` component (`to` = `PUBLIC_URL + path`).
 */
export function getBookAppointmentButtonPath(isAuthenticated) {
    if (isAuthenticated) return "/doctors";
    const next = encodeURIComponent(doctorsLandingPath());
    return `/signup?redirect=${next}`;
}

/**
 * For `Link to={...}` where the full path includes `PUBLIC_URL`.
 */
export function getBookAppointmentLinkTo(isAuthenticated) {
    if (isAuthenticated) {
        return doctorsLandingPath();
    }
    return `${base}/signup?redirect=${encodeURIComponent(
        doctorsLandingPath()
    )}`;
}
