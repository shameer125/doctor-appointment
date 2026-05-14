import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SidebarTitle from "./sidebar-title";
import {
    bookAfterAuthLocation,
    getBookAppointmentButtonPath,
} from "../../utils/bookingEntryPath";

const base = process.env.PUBLIC_URL || "";

export function SidebarScheduleCta() {
    const { isAuthenticated } = useAuth();
    const bookPath = getBookAppointmentButtonPath(isAuthenticated);

    return (
        <div className="widget-item">
            <SidebarTitle classOption="title" title="Schedule a visit" />
            <div className="sidebar-schedule-cta">
                <p className="small text-muted mb-3">
                    Browse our clinicians by specialty and pick an open slot
                    that works for you.
                </p>
                <Link
                    className="btn btn-theme booking-submit-btn w-100 mb-2"
                    to={`${base}${bookPath}`}
                >
                    Find a clinician
                </Link>
                {isAuthenticated ? (
                    <Link
                        className="btn btn-outline-secondary border border-secondary w-100 btn-sm"
                        to={`${base}/my-appointments`}
                    >
                        My appointments
                    </Link>
                ) : (
                    <p className="small text-muted mb-0">
                        <Link
                            to={`${base}/signup?redirect=${encodeURIComponent(
                                bookAfterAuthLocation()
                            )}`}
                        >
                            Create an account
                        </Link>{" "}
                        to book online—then open this menu again.
                    </p>
                )}
            </div>
        </div>
    );
}
