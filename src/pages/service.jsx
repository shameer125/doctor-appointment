import React from "react";
import Layout from "../layouts/index.jsx";
import Header from "../layouts/header";
import Footer from "../layouts/footer";
import PageTitleContainer from "../containers/global/page-title/index.jsx";
import ServiceContainer from "../containers/service-box/index.jsx";
import CallToAction from "../containers/global/call-to-action/index.jsx";
import ScrollToTop from "../components/scroll-to-top";
import SEO from "../components/seo";

const ServicePage = () => {
    return (
        <React.Fragment>
            <Layout>
                <SEO title="Hope – Service" />
                <div className="wrapper">
                    <Header />
                    <div className="main-content site-wrapper-reveal">
                        <PageTitleContainer
                            image="img/slider/main-slide-01.jpg"
                            subTitle="Clinical services &amp; care coordination"
                            title="Services <span>we offer</span>"
                        />
                        <ServiceContainer />
                        <CallToAction />
                    </div>
                    <Footer />
                    <ScrollToTop />
                </div>
            </Layout>
        </React.Fragment>
    );
};

export default ServicePage;
