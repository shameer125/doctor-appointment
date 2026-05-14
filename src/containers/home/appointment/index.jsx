import { Link } from "react-router-dom";
import SectionTitle from "../../../components/section-title";
import Button from "../../../components/button";
import { useAuth } from "../../../context/AuthContext";
import { getBookAppointmentButtonPath } from "../../../utils/bookingEntryPath";

const base = process.env.PUBLIC_URL || "";

const AppointmentContainer = () => {
    const { isAuthenticated } = useAuth();
    const browsePath = getBookAppointmentButtonPath(isAuthenticated);

    return (
        <section id="schedule-visit" className="appointment-area" style={{ background: "#f8fafc", padding: "6rem 0" }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8 text-center">
                        <SectionTitle
                            subTitle="Easy Online Booking"
                            title="<span>Schedule Your Visit</span> in Minutes"
                            classOption="text-center"
                        />
                        <p className="text-muted mb-4" style={{ fontSize: "1.0625rem", lineHeight: "1.75", maxWidth: "38rem", margin: "0 auto 2rem" }}>
                            Browse our clinicians by specialty, check real-time availability,
                            and secure your appointment — all from one easy-to-use booking system.
                        </p>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.875rem", justifyContent: "center", marginBottom: "2.5rem" }}>
                            <Button
                                path={browsePath}
                                classOption="btn btn-theme"
                                text={isAuthenticated ? "Browse Clinicians & Book" : "Create Account to Book"}
                            />
                            {isAuthenticated && (
                                <Link
                                    className="btn btn-outline-secondary"
                                    to={`${base}/my-appointments`}
                                >
                                    My Appointments
                                </Link>
                            )}
                        </div>

                        {/* Trust badges */}
                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2rem" }}>
                            {[
                                { icon: "icofont-clock-time", label: "Same-day slots available" },
                                { icon: "icofont-shield-alt", label: "Secure & confidential" },
                                { icon: "icofont-check-circled", label: "Instant confirmation" },
                            ].map(({ icon, label }) => (
                                <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "#64748b" }}>
                                    <i className={icon} style={{ color: "#9b1f1f", fontSize: "1.1rem" }} />
                                    <span>{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AppointmentContainer;
