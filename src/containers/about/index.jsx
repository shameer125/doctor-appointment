import React from "react";
import AboutData from "../../data/about.json";
import ServiceData from "../../data/service.json";
import { Link } from "react-router-dom";
import AboutAddress from "../../components/about-address";
import { useAuth } from "../../context/AuthContext";
import { getBookAppointmentLinkTo } from "../../utils/bookingEntryPath";

const base = process.env.PUBLIC_URL || "";

const AboutContainer = () => {
    const { isAuthenticated } = useAuth();
    return (
        <div className="about-area about-page-professional">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <p className="about-lead text-pra" data-aos="fade-up">
                            {AboutData[0].pageTitle}
                        </p>

                        <section
                            className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 mb-12 hover:shadow-lg transition-shadow duration-300"
                            data-aos="fade-up"
                            data-aos-duration="1100"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                {AboutData[1].title}
                            </h2>
                            {AboutData[1].excerpt.map((single, i) => (
                                <div
                                    key={i}
                                    className="text-gray-600 leading-relaxed mb-6 text-lg"
                                    dangerouslySetInnerHTML={{
                                        __html: single,
                                    }}
                                />
                            ))}
                            <div className="flex flex-wrap gap-4 mt-8 pb-8">
                                <Link
                                    to={`${base}/service`}
                                    className="px-8 py-3 bg-theme text-white font-semibold rounded-xl shadow-md hover:-translate-y-1 transition-all duration-300"
                                    style={{ backgroundColor: "#9b1f1f" }}
                                >
                                    View all services
                                </Link>
                                <Link
                                    to={getBookAppointmentLinkTo(
                                        isAuthenticated
                                    )}
                                    className="px-8 py-3 border-2 border-theme text-theme font-semibold rounded-xl transition-all duration-300"
                                    style={{ color: "#9b1f1f", borderColor: "#9b1f1f" }}
                                >
                                    Request an appointment
                                </Link>
                            </div>
                            <div
                                className="about-service-grid"
                                data-aos="fade-up"
                                data-aos-duration="1000"
                            >
                                <h3 className="about-service-grid-heading">
                                    Departments &amp; programs
                                </h3>
                                <ul className="about-service-grid-list">
                                    {ServiceData.map((single) => (
                                        <li key={single.id}>
                                            <Link
                                                to={`${base}/service-details/${single.id}`}
                                            >
                                                {single.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        <section
                            className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 mb-12 hover:shadow-lg transition-shadow duration-300"
                            data-aos="fade-up"
                            data-aos-duration="1100"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                {AboutData[2].title}
                            </h2>
                            {AboutData[2].excerpt.map((single, i) => (
                                <div
                                    key={i}
                                    className="text-gray-600 leading-relaxed mb-8 text-lg"
                                    dangerouslySetInnerHTML={{
                                        __html: single,
                                    }}
                                />
                            ))}
                            <div className="row about-gallery-row">
                                <div className="col-md-6" data-aos="fade-up">
                                    <div className="gallery-item mb-30 about-gallery-card">
                                        <a
                                            href={`${base}/${AboutData[3].gallery.imageOne}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="gallery-thumb-link"
                                        >
                                            <div className="thumb">
                                                <div className="lightbox-image">
                                                    <img
                                                        src={`${base}/${AboutData[3].gallery.imageOne}`}
                                                        alt="Hope Medical reception and waiting area"
                                                    />
                                                </div>
                                                <div className="overlay">
                                                    <i className="icofont-plus"></i>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                                <div
                                    className="col-md-6"
                                    data-aos="fade-up"
                                    data-aos-duration="600"
                                >
                                    <div className="gallery-item mb-30 about-gallery-card">
                                        <a
                                            href={`${base}/${AboutData[3].gallery.imageTwo}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="gallery-thumb-link"
                                        >
                                            <div className="thumb">
                                                <div className="lightbox-image">
                                                    <img
                                                        src={`${base}/${AboutData[3].gallery.imageTwo}`}
                                                        alt="Clinical exam room"
                                                    />
                                                </div>
                                                <div className="overlay">
                                                    <i className="icofont-plus"></i>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                                <div
                                    className="col-md-12"
                                    data-aos="fade-up"
                                    data-aos-duration="1200"
                                >
                                    <div className="gallery-item about-gallery-card about-gallery-full">
                                        <a
                                            href={`${base}/${AboutData[3].gallery.imageThree}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="gallery-thumb-link"
                                        >
                                            <div className="thumb">
                                                <div className="lightbox-image">
                                                    <img
                                                        src={`${base}/${AboutData[3].gallery.imageThree}`}
                                                        alt="Care team collaboration at Hope Medical"
                                                    />
                                                </div>
                                                <div className="overlay">
                                                    <i className="icofont-plus"></i>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="office-address-content about-locations-grid"
                                data-aos="fade-up"
                                data-aos-duration="1100"
                            >
                                <h3 className="about-locations-heading">
                                    Locations &amp; contact
                                </h3>
                                <div className="row">
                                    {AboutData[4].address.map((single) => (
                                        <div
                                            key={single.id}
                                            className="col-md-6 mb-30"
                                        >
                                            <AboutAddress data={single} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutContainer;
