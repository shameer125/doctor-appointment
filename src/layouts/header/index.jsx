import SocialIcon from "../../components/social-icon";
import Button from "../../components/button";
import Logo from "../../components/logo";
import MainMenu from "../../components/menu/main-menu";
import HomeData from "../../data/home.json";
import HeaderContactCompact from "../../components/header-contact-compact";
import { Fragment, useEffect, useState } from "react";
import MobileMenu from "../../components/menu/mobile-menu";
import MenuOverlay from "../../components/menu/menu-overlay";
import HeaderAuth from "../../components/auth/header-auth";
import { useAuth } from "../../context/AuthContext";
import { getBookAppointmentButtonPath } from "../../utils/bookingEntryPath";

const Header = () => {
    const { isAuthenticated } = useAuth();
    const [ofcanvasShow, setOffcanvasShow] = useState(false);
    const onCanvasHandler = () => setOffcanvasShow((prev) => !prev);

    const [scroll, setScroll] = useState(0);
    useEffect(() => {
        const handleScroll = () => setScroll(window.scrollY);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const bookPath = getBookAppointmentButtonPath(isAuthenticated);
    const scrolledMobile = scroll > 10;

    return (
        <Fragment>
            <header className="header-area relative z-[1040] max-w-full overflow-x-hidden bg-white">
                <div className="header-top-strip d-none d-lg-block">
                    <div className="container">
                        <div className="header-main-row content-align-center justify-content-between">
                            <HeaderContactCompact
                                items={
                                    HomeData[0].headerInfo
                                        ? HomeData[0].headerInfo.slice(0, 3)
                                        : []
                                }
                            />
                            <ul
                                className="hope-social-plain m-0 flex list-none flex-wrap items-center gap-2 p-0"
                                aria-label="Social media"
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
                    </div>
                </div>

                <div
                    className={`header-main-bar sticky top-0 z-[1040] border-b border-slate-200 ${
                        scrolledMobile ? "header-main-bar--shadow" : ""
                    }`}
                >
                    <div className="container">
                        <div className="header-main-row">
                            <div className="min-w-0 flex-1">
                                <Logo
                                    classOption="d-inline-block align-middle"
                                    image="img/logo-dark.png"
                                />
                            </div>

                            <div className="d-none min-w-0 flex-1 d-lg-flex justify-content-center">
                                <MainMenu id="desktop-primary-nav" />
                            </div>

                            <div className="header-toolbar">
                                <HeaderAuth />
                                <Button
                                    path={bookPath}
                                    classOption="btn btn-theme d-none d-lg-inline-flex"
                                    text="Book appointment"
                                />
                                <Button
                                    path={bookPath}
                                    classOption="btn btn-theme btn-sm d-inline-flex d-lg-none"
                                    text="Book"
                                />
                                <div className="d-lg-none">
                                    <button
                                        type="button"
                                        onClick={onCanvasHandler}
                                        className="header-burger-btn"
                                        aria-expanded={ofcanvasShow}
                                        aria-controls="mobile-primary-nav"
                                        aria-label={
                                            ofcanvasShow
                                                ? "Close menu"
                                                : "Open menu"
                                        }
                                    >
                                        <svg
                                            viewBox="0 0 24 22"
                                            width="28"
                                            height="26"
                                            className="d-block"
                                            aria-hidden="true"
                                        >
                                            <path
                                                className="burger-bar"
                                                fill="none"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                stroke="currentColor"
                                                d="M2 5h20M2 11h20M2 17h14"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <MenuOverlay show={ofcanvasShow} onClose={onCanvasHandler} />
            <MobileMenu
                id="mobile-primary-nav"
                show={ofcanvasShow}
                onClose={onCanvasHandler}
            />
        </Fragment>
    );
};

export default Header;
