import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import SocialIcon from "../../social-icon";
import { useAuth } from "../../../context/AuthContext";

const base = process.env.PUBLIC_URL || "";

const MobileMenu = ({ show, onClose, id }) => {
    const { user, logout, bootstrapped } = useAuth();
    const [openSection, setOpenSection] = useState(null);

    const toggle = (key) => {
        setOpenSection((prev) => (prev === key ? null : key));
    };

    return (
        <aside
            id={id}
            className={`mobile-drawer ${
                show ? "mobile-drawer--open" : "mobile-drawer--closed"
            }`}
            aria-hidden={!show}
        >
            <div className="mobile-drawer__head">
                <button
                    type="button"
                    className="mobile-drawer__close"
                    onClick={onClose}
                    aria-label="Close navigation menu"
                >
                    ×
                </button>
            </div>
            <nav aria-label="Mobile primary">
                <ul className="tier1">
                    <li>
                        <NavLink
                            exact
                            className="nav-mobile-link"
                            activeClassName="active"
                            to={base + "/"}
                            onClick={onClose}
                        >
                            <span>Home</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            className="nav-mobile-link"
                            activeClassName="active"
                            to={base + "/doctors"}
                            onClick={onClose}
                        >
                            <span>Clinicians</span>
                        </NavLink>
                    </li>
                    <li>
                        <div className="nav-mobile-split">
                            <NavLink
                                className="nav-mobile-link min-w-0 flex-1"
                                activeClassName="active"
                                to={base + "/service"}
                            >
                                Services
                            </NavLink>
                            <button
                                type="button"
                                className="subtoggle"
                                onClick={() => toggle("svc")}
                                aria-expanded={openSection === "svc"}
                                aria-label="Toggle services submenu"
                            >
                                <i
                                    className={`icofont-rounded-down ${
                                        openSection === "svc"
                                            ? "rotate-icon-open"
                                            : ""
                                    }`}
                                />
                            </button>
                        </div>
                        <ul
                            className={`subtier nav-mobile-sub ${
                                openSection === "svc"
                                    ? "is-expanded"
                                    : "is-collapsed"
                            }`}
                        >
                            <li>
                                <NavLink
                                    activeClassName="active"
                                    to={base + "/service"}
                                    onClick={onClose}
                                >
                                    All services
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    activeClassName="active"
                                    to={base + "/service-details/1"}
                                    onClick={onClose}
                                >
                                    Specialty care (Psychiatry)
                                </NavLink>
                            </li>
                        </ul>
                    </li>

                    <li>
                        <div className="nav-mobile-split">
                            <NavLink
                                className="nav-mobile-link min-w-0 flex-1"
                                activeClassName="active"
                                to={base + "/blog"}
                            >
                                Resources
                            </NavLink>
                            <button
                                type="button"
                                className="subtoggle"
                                onClick={() => toggle("blog")}
                                aria-expanded={openSection === "blog"}
                                aria-label="Toggle resources submenu"
                            >
                                <i
                                    className={`icofont-rounded-down ${
                                        openSection === "blog"
                                            ? "rotate-icon-open"
                                            : ""
                                    }`}
                                />
                            </button>
                        </div>
                        <ul
                            className={`subtier nav-mobile-sub ${
                                openSection === "blog"
                                    ? "is-expanded"
                                    : "is-collapsed"
                            }`}
                        >
                            <li>
                                <NavLink
                                    activeClassName="active"
                                    to={base + "/blog"}
                                    onClick={onClose}
                                >
                                    All articles
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    activeClassName="active"
                                    to={base + "/blog-details/1"}
                                    onClick={onClose}
                                >
                                    Featured article
                                </NavLink>
                            </li>
                        </ul>
                    </li>

                    <li>
                        <NavLink
                            className="nav-mobile-link"
                            activeClassName="active"
                            to={base + "/about"}
                            onClick={onClose}
                        >
                            <span>About</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            className="nav-mobile-link"
                            activeClassName="active"
                            to={base + "/my-appointments"}
                            onClick={onClose}
                        >
                            <span>My appointments</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            className="nav-mobile-link"
                            activeClassName="active"
                            to={base + "/contact"}
                            onClick={onClose}
                        >
                            <span>Contact</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>
            {bootstrapped && (
                <div className="mobile-drawer__cta">
                    {user ? (
                        <>
                            <p className="small text-muted mb-2">{user.email}</p>
                            <button
                                type="button"
                                className="btn btn-outline-secondary btn-block"
                                onClick={() => {
                                    logout();
                                    onClose();
                                }}
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink
                                className="btn btn-theme btn-sm btn-block mb-2"
                                to={base + "/login"}
                                onClick={onClose}
                            >
                                Log in
                            </NavLink>
                            <NavLink
                                className="btn btn-outline-secondary btn-sm btn-block"
                                to={base + "/signup"}
                                onClick={onClose}
                            >
                                Sign up
                            </NavLink>
                        </>
                    )}
                </div>
            )}
            <div className="px-4 pb-2">
                <ul
                    className="hope-social-plain m-0 flex list-none items-center gap-3 p-0"
                    aria-label="Social links"
                >
                    <li>
                        <SocialIcon
                            path="https://twitter.com/"
                            icon="icofont-twitter"
                        />
                    </li>
                    <li>
                        <SocialIcon
                            path="https://www.facebook.com/"
                            icon="icofont-facebook"
                        />
                    </li>
                    <li>
                        <SocialIcon
                            path="https://www.instagram.com/"
                            icon="icofont-instagram"
                        />
                    </li>
                    <li>
                        <SocialIcon
                            path="https://www.linkedin.com/"
                            icon="icofont-linkedin"
                        />
                    </li>
                    <li>
                        <SocialIcon
                            path="https://www.youtube.com/"
                            icon="icofont-play-alt-1"
                        />
                    </li>
                </ul>
            </div>

            <ul className="mobile-drawer__meta">
                <li>
                    <span className="ico">
                        <i className="icofont-clock-time" aria-hidden />
                    </span>
                    <div className="min-w-0">
                        <span className="small text-muted d-block">
                            Clinic hours
                        </span>
                        <span className="text-pra font-semibold">
                            Mon–Fri 8:00–18:30 · Sat by appointment
                        </span>
                    </div>
                </li>
                <li>
                    <span className="ico">
                        <i className="icofont-ui-call" aria-hidden />
                    </span>
                    <div>
                        <span className="small text-muted d-block">
                            Appointments
                        </span>
                        <a
                            className="text-pra font-semibold"
                            href="tel:+15551234567"
                        >
                            +1 (555) 123-4567
                        </a>
                    </div>
                </li>
                <li>
                    <span className="ico">
                        <i className="icofont-envelope" aria-hidden />
                    </span>
                    <div className="min-w-0">
                        <span className="small text-muted d-block">
                            Email
                        </span>
                        <a
                            className="break-all text-pra font-semibold"
                            href="mailto:bookings@hopeclinic.health"
                        >
                            bookings@hopeclinic.health
                        </a>
                    </div>
                </li>
            </ul>
        </aside>
    );
};

MobileMenu.propTypes = {
    show: PropTypes.bool,
    onClose: PropTypes.func,
    id: PropTypes.string,
};

MobileMenu.defaultProps = {
    id: undefined,
};

export default MobileMenu;
