import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const base = process.env.PUBLIC_URL || "";

export function BookingAuthPrompt({ subtitle }) {
    const { user } = useAuth();
    const location = useLocation();
    const next = encodeURIComponent(
        `${location.pathname}${location.search}${location.hash}`
    );

    if (user) return null;

    return (
        <div className="booking-auth-prompt mb-4">
            <h3 className="booking-auth-title">
                Create an account to book online
            </h3>
            {subtitle ? (
                <p className="booking-auth-copy">{subtitle}</p>
            ) : (
                <p className="booking-auth-copy">
                    New visitors start by creating an account first. Returning
                    patients can log in below.
                </p>
            )}
            <div className="booking-auth-actions">
                <Link
                    className="btn btn-theme"
                    to={`${base}/signup?redirect=${next}`}
                >
                    Create account first
                </Link>
                <Link
                    className="btn btn-outline-secondary border border-secondary"
                    to={`${base}/login?redirect=${next}`}
                >
                    Log in—already registered
                </Link>
            </div>{" "}
            <p className="booking-auth-muted small mb-0">
                This is browser-based demo authentication (localStorage). Deploy
                with your clinic&apos;s backend for production use.
            </p>
        </div>
    );
}

BookingAuthPrompt.propTypes = {
    subtitle: PropTypes.string,
};
