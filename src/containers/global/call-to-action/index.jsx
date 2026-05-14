import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { getBookAppointmentLinkTo } from "../../../utils/bookingEntryPath";

const CallToAction = () => {
    const { isAuthenticated } = useAuth();
    return (
        <section className="call-to-action-area">
            <div className="container">
                <div className="row align-items-center justify-content-between">
                    <div className="col-lg-7 content">
                        <h2>Ready to <span style={{ fontStyle: "italic" }}>schedule</span> a visit?</h2>
                        <p className="mt-2">
                            Browse our clinicians, choose an open slot, and confirm your
                            appointment in minutes — no phone tag required.
                        </p>
                    </div>
                    <div className="col-lg-3 text-lg-right mt-4 mt-lg-0">
                        <Link
                            to={getBookAppointmentLinkTo(isAuthenticated)}
                            className="btn btn-white"
                        >
                            Book Appointment
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;
