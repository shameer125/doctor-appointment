import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { signupThenBookHref, bookDoctorPath } from "../../utils/bookingEntryPath";

const base = process.env.PUBLIC_URL || "";

export function DoctorCard({ doctor, delayClass = "" }) {
    const { isAuthenticated } = useAuth();
    const bookTo = isAuthenticated
        ? bookDoctorPath(doctor.id)
        : signupThenBookHref(doctor.id);

    return (
        <article className={`doctor-card hope-reveal-hover ${delayClass}`.trim()}>
            <Link to={bookTo} className="doctor-card-photo-link" tabIndex="-1" aria-hidden="true">
                <div className="doctor-card-photo">
                    <img
                        src={`${base}/${doctor.image}`}
                        alt=""
                        loading="lazy"
                        width={320}
                        height={400}
                    />
                    <span className="doctor-card-photo-shine" aria-hidden="true" />
                    <span className="doctor-card-badge">{doctor.specialty}</span>
                </div>
            </Link>
            <div className="doctor-card-body">
                <h3 className="doctor-card-name">{doctor.name}</h3>
                <p className="doctor-card-title">{doctor.title}</p>
                <p className="doctor-card-bio">{doctor.bio}</p>
                <div className="doctor-card-actions">
                    <Link
                        className="btn btn-theme btn-sm"
                        to={bookTo}
                        aria-label={`Book appointment with ${doctor.name}`}
                    >
                        Book Appointment
                    </Link>
                    <Link
                        className="btn btn-outline-secondary btn-sm"
                        to={bookTo}
                    >
                        View Schedule
                    </Link>
                </div>
            </div>
        </article>
    );
}

DoctorCard.propTypes = {
    doctor: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        title: PropTypes.string,
        specialty: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        bio: PropTypes.string,
    }).isRequired,
    delayClass: PropTypes.string,
};

DoctorCard.defaultProps = {
    delayClass: "",
};
