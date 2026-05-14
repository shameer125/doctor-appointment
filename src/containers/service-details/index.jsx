import DepartmentWidget from "../../components/sidebar/department";
import PropTypes from "prop-types";
import SidebarWorkingTime from "../../components/sidebar/sidebar-working-time";
import { SidebarScheduleCta } from "../../components/sidebar/sidebar-schedule-cta";
import ServiceDetails from "../../components/service-details";
import AccordionWrapTwo from "../../components/accordion/AccordionWrapTwo.jsx";
import ServiceData from "../../data/service.json";

const ServiceDetailsContainer = ({ data }) => {
    return (
        <section className="department-area">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="department-wrpp">
                            <div className="sidebar-wrapper">
                                <DepartmentWidget data={ServiceData} />
                                <SidebarWorkingTime />
                                <SidebarScheduleCta />
                            </div>

                            <div className="department-content">
                                <ServiceDetails data={data} />

                                <div className="faq-area">
                                    <h2 className="title">
                                        <span>Patient</span> FAQs
                                    </h2>
                                    <div className="accordian-content">
                                        <AccordionWrapTwo />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

ServiceDetailsContainer.propTypes = {
    data: PropTypes.object,
};

export default ServiceDetailsContainer;
