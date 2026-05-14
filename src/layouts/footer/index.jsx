import SocialIcon from "../../components/social-icon";
import { Link } from "react-router-dom";
import Logo from "../../components/logo";
import BlogData from "../../data/blog.json";

const base = process.env.PUBLIC_URL || "";

const Footer = () => {
    const recentPosts = Array.isArray(BlogData) ? BlogData.slice(0, 4) : [];

    return (
        <footer className="footer-area">
            <div className="footer-main">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-4 col-lg-6 col-md-12">
                            <div className="footer-widget about-widget">
                                <Logo
                                    classOption="footer-logo mb-3"
                                    image={`${base}/img/logo-dark.png`}
                                />
                                <p className="mb-3 text-pra">
                                    Hope Medical provides primary care and
                                    specialty coordination with same-day
                                    scheduling when available. Browse our
                                    clinicians online or reach us directly to
                                    request a visit.
                                </p>
                                <ul className="footer-info-links">
                                    <li>
                                        <i className="icofont-email" aria-hidden />
                                        <a href="mailto:bookings@hopeclinic.health">
                                            bookings@hopeclinic.health
                                        </a>
                                    </li>
                                    <li>
                                        <i
                                            className="icofont-ui-call"
                                            aria-hidden
                                        />
                                        <a href="tel:+15551234567">
                                            +1 (555) 123-4567
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-xl-2 col-lg-6 col-md-6 mb-30">
                            <div className="footer-widget">
                                <h4 className="footer-widget__title">
                                    Quick links
                                </h4>
                                <nav>
                                    <ul className="footer-nav-list">
                                        <li>
                                            <Link to={`${base}/`}>
                                                <i className="icofont-rounded-double-right" />
                                                Home
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={`${base}/service`}>
                                                <i className="icofont-rounded-double-right" />
                                                Services
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={`${base}/doctors`}>
                                                <i className="icofont-rounded-double-right" />
                                                Clinicians &amp; booking
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={`${base}/my-appointments`}>
                                                <i className="icofont-rounded-double-right" />
                                                My appointments
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={`${base}/about`}>
                                                <i className="icofont-rounded-double-right" />
                                                About
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={`${base}/contact`}>
                                                <i className="icofont-rounded-double-right" />
                                                Contact
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={`${base}/blog`}>
                                                <i className="icofont-rounded-double-right" />
                                                Patient resources
                                            </Link>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-6 col-md-6 mb-30">
                            <div className="footer-widget">
                                <h4 className="footer-widget__title">
                                    From the blog
                                </h4>
                                <nav>
                                    <ul className="footer-nav-list">
                                        {recentPosts.map((post) => (
                                            <li key={post.id}>
                                                <Link
                                                    to={`${base}/blog-details/${post.id}`}
                                                >
                                                    <i className="icofont-rounded-double-right" />
                                                    {post.title}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-6 col-md-6 mb-30">
                            <div className="footer-widget">
                                <h4 className="footer-widget__title">
                                    Hours &amp; follow-up
                                </h4>
                                <p className="footer-hours mb-3">
                                    Mon–Fri 8:00–18:30 · Saturday by
                                    appointment. For urgent concerns after hours,
                                    use your insurer&apos;s nurse line or
                                    emergency services.
                                </p>
                                <div className="footer-social-row hope-social-plain">
                                    <SocialIcon
                                        path="https://twitter.com/"
                                        icon="icofont-twitter"
                                    />
                                    <SocialIcon
                                        path="https://www.facebook.com/"
                                        icon="icofont-facebook"
                                    />
                                    <SocialIcon
                                        path="https://www.instagram.com/"
                                        icon="icofont-instagram"
                                    />
                                    <SocialIcon
                                        path="https://www.linkedin.com/"
                                        icon="icofont-linkedin"
                                    />
                                    <SocialIcon
                                        path="https://www.youtube.com/"
                                        icon="icofont-play-alt-1"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="copyright-area">
                <div className="container">
                    <div className="text-center">
                        <p className="text-mood">
                            &copy; {new Date().getFullYear()} Hope Medical. All
                            rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
