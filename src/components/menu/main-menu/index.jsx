import React from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

const base = process.env.PUBLIC_URL || "";

const MainMenu = ({ id }) => {
    return (
        <nav
            id={id}
            aria-label="Primary"
            className="hope-main-nav w-full"
        >
            <ul className="tier1">
                <li>
                    <NavLink
                        className="nav-link-tier1"
                        activeClassName="active"
                        exact
                        to={(base || "") + "/"}
                    >
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        className="nav-link-tier1"
                        activeClassName="active"
                        to={`${base}/doctors`}
                    >
                        Clinicians
                    </NavLink>
                </li>
                <li className="hope-nav-has-sub">
                    <NavLink
                        className="nav-link-tier1"
                        activeClassName="active"
                        to={`${base}/service`}
                    >
                        Services
                        <i
                            className="icofont-rounded-down"
                            aria-hidden="true"
                        />
                    </NavLink>
                    <ul className="submenu" role="menu">
                        <li role="none">
                            <NavLink
                                activeClassName="active"
                                to={`${base}/service`}
                                role="menuitem"
                            >
                                All services
                            </NavLink>
                        </li>
                        <li role="none">
                            <NavLink
                                activeClassName="active"
                                to={`${base}/service-details/1`}
                                role="menuitem"
                            >
                                Psychiatry
                            </NavLink>
                        </li>
                    </ul>
                </li>

                <li className="hope-nav-has-sub">
                    <NavLink
                        className="nav-link-tier1"
                        activeClassName="active"
                        to={`${base}/blog`}
                    >
                        Resources
                        <i
                            className="icofont-rounded-down"
                            aria-hidden="true"
                        />
                    </NavLink>
                    <ul className="submenu" role="menu">
                        <li role="none">
                            <NavLink
                                activeClassName="active"
                                to={`${base}/blog`}
                                role="menuitem"
                            >
                                All articles
                            </NavLink>
                        </li>
                        <li role="none">
                            <NavLink
                                activeClassName="active"
                                to={`${base}/blog-details/1`}
                                role="menuitem"
                            >
                                Featured article
                            </NavLink>
                        </li>
                    </ul>
                </li>

                <li>
                    <NavLink
                        className="nav-link-tier1"
                        activeClassName="active"
                        to={`${base}/about`}
                    >
                        About
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        className="nav-link-tier1"
                        activeClassName="active"
                        to={`${base}/contact`}
                    >
                        Contact
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        className="nav-link-tier1"
                        activeClassName="active"
                        to={`${base}/my-appointments`}
                    >
                        My appointments
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

MainMenu.propTypes = {
    id: PropTypes.string,
};

MainMenu.defaultProps = {
    id: undefined,
};

export default MainMenu;
