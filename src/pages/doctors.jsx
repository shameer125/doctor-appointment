import React from "react";
import Layout from "../layouts/index.jsx";
import Header from "../layouts/header";
import Footer from "../layouts/footer";
import ScrollToTop from "../components/scroll-to-top";
import SEO from "../components/seo";
import PageTitleContainer from "../containers/global/page-title";
import { DoctorsDirectory } from "../containers/doctors/doctors-directory";

const DoctorsPage = () => {
    return (
        <React.Fragment>
            <Layout>
                <SEO title="Find a clinician | Hope Medical" />
                <div className="wrapper">
                    <Header />
                    <div className="main-content site-wrapper-reveal">
                        <PageTitleContainer
                            subTitle="Search by name or specialty"
                            title="Book with <span>our physicians</span>"
                            image="img/slider/slide2.jpg"
                        />
                        <section className="doctors-page-section py-5">
                            <div className="container">
                                <DoctorsDirectory />
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

export default DoctorsPage;
