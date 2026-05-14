import React from "react";
import Layout from "../layouts/index.jsx";
import Header from "../layouts/header";
import IntroContainer from "../containers/home/intro";
import HealthFeatureContainer from "../containers/home/health-feature";
import MedicalFeatureContainer from "../containers/home/medical-feature";
import AppointmentContainer from "../containers/home/appointment";
import TeamContainer from "../containers/home/team";
import GoogleMapContainer from "../containers/global/map";
import Footer from "../layouts/footer";
import ScrollToTop from "../components/scroll-to-top";
import SEO from "../components/seo";

const HomePage = () => {
    return (
        <React.Fragment>
            <Layout>
                <SEO title="Hope Medical — Primary Care, Appointments &amp; Specialty Coordination" />
                <div className="wrapper home-default-wrapper">
                    <Header />
                    <div className="main-content site-wrapper-reveal">
                        <IntroContainer />
                        <HealthFeatureContainer />
                        <MedicalFeatureContainer />
                        <AppointmentContainer />
                        <TeamContainer />
                        <GoogleMapContainer />
                    </div>
                    <Footer />
                    <ScrollToTop />
                </div>
            </Layout>
        </React.Fragment>
    );
};

export default HomePage;
