import PropTypes from "prop-types";

function formatVisitDate(isoDate) {
    if (!isoDate) return "";
    const d = new Date(`${isoDate}T12:00:00`);
    if (Number.isNaN(d.getTime())) return isoDate;
    return d.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export function AppointmentCard({ appointment, onCancel }) {
    return (
        <article className="appointment-card hope-reveal-hover">
            <div className="appointment-card-header">
                <div style={{ flex: 1 }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginBottom: "0.35rem",
                        }}
                    >
                        <i
                            className="icofont-doctor"
                            style={{ color: "#9b1f1f", fontSize: "1.1rem" }}
                        />
                        <h3
                            className="appointment-card-title"
                            style={{ fontSize: "1.05rem", margin: 0 }}
                        >
                            {appointment.doctorName}
                        </h3>
                    </div>
                    <p
                        className="small text-muted mb-0"
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "0.5rem",
                            alignItems: "center",
                        }}
                    >
                        <span
                            style={{
                                background: "#f1f5f9",
                                borderRadius: "6px",
                                padding: "0.15rem 0.5rem",
                                fontWeight: 600,
                                fontSize: "0.75rem",
                            }}
                        >
                            {appointment.specialty}
                        </span>
                        <span
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.3rem",
                            }}
                        >
                            <i
                                className="icofont-calendar"
                                style={{
                                    color: "#9b1f1f",
                                    fontSize: "0.85rem",
                                }}
                            />
                            <time dateTime={appointment.date}>
                                {formatVisitDate(appointment.date)}
                            </time>
                        </span>
                        <span
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.3rem",
                            }}
                        >
                            <i
                                className="icofont-clock-time"
                                style={{
                                    color: "#9b1f1f",
                                    fontSize: "0.85rem",
                                }}
                            />
                            {appointment.timeSlotLabel || appointment.timeSlot}
                        </span>
                    </p>
                </div>
                <span className="appointment-card-status">Scheduled</span>
            </div>

            <p className="small text-muted mt-2 mb-2">
                Reference:{" "}
                <span className="booking-form-alert__ref">
                    {appointment.referenceId}
                </span>
            </p>

            {appointment.message && (
                <p
                    className="small mb-3"
                    style={{
                        color: "#475569",
                        background: "#f8fafc",
                        borderRadius: "8px",
                        padding: "0.625rem 0.875rem",
                        border: "1px solid #f1f5f9",
                    }}
                >
                    {appointment.message}
                </p>
            )}

            <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                style={{ borderColor: "#fca5a5", color: "#b91c1c" }}
                onClick={() => {
                    const ok =
                        typeof window !== "undefined" &&
                        window.confirm(
                            `Cancel appointment with ${
                                appointment.doctorName
                            } on ${formatVisitDate(appointment.date)}?`
                        );
                    if (ok) onCancel(appointment.id);
                }}
            >
                <i
                    className="icofont-close-circled"
                    style={{ fontSize: "0.875rem" }}
                />{" "}
                Cancel Appointment
            </button>
        </article>
    );
}

AppointmentCard.propTypes = {
    appointment: PropTypes.shape({
        id: PropTypes.string.isRequired,
        doctorName: PropTypes.string.isRequired,
        specialty: PropTypes.string,
        date: PropTypes.string.isRequired,
        timeSlot: PropTypes.string,
        timeSlotLabel: PropTypes.string,
        referenceId: PropTypes.string,
        message: PropTypes.string,
    }).isRequired,
    onCancel: PropTypes.func.isRequired,
};
