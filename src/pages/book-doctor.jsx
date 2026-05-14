import React from "react";
import { Redirect } from "react-router-dom";
import Layout from "../layouts/index.jsx";
import Header from "../layouts/header";
import Footer from "../layouts/footer";
import ScrollToTop from "../components/scroll-to-top";
import SEO from "../components/seo";
import PageTitleContainer from "../containers/global/page-title";
import Breadcrumb from "../containers/global/breadcrumb/index.jsx";
import { getDoctorById } from "../data/doctors";
import { DoctorBookingForm } from "../components/booking/doctor-booking-form";

const base = process.env.PUBLIC_URL || "";

const BookDoctorPage = ({
    match: {
        params: { doctorId },
    },
}) => {
    const doctor = getDoctorById(doctorId);

    if (!doctor) {
        return <Redirect to={`${base}/doctors`} />;
    }

    return (
        <React.Fragment>
            <Layout>
                <SEO title={`Book with ${doctor.name} | Hope Medical`} />
                <div className="wrapper">
                    <Header />
                    <div className="main-content site-wrapper-reveal">
                        <Breadcrumb
                            prevs={[
                                { text: "Home", path: "/" },
                                { text: "Clinicians", path: "/doctors" },
                            ]}
                            contentThree={doctor.name}
                            title={`<span>${doctor.name}</span>`}
                        />
                        <PageTitleContainer
                            subTitle="Appointment request"
                            title={`<span>Schedule</span> with ${
                                doctor.name.split(",")[0]
                            }`}
                            image="img/slider/slide1.jpg"
                        />
                        <section className="book-doctor-section py-5">
                            <div className="container">
                                <div className="row justify-content-center">
                                    <div className="col-lg-10">
                                        <DoctorBookingForm doctor={doctor} />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                    <Footer />
                    <ScrollToTop />
                </div>
            </Layout>
        </React.Fragment>
    );
};

export default BookDoctorPage;
