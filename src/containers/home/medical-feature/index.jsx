import SectionTitle from "../../../components/section-title";
import HomeData from "../../../data/home.json";
import MedicalFeature from "../../../components/medical-feature";

const MedicalFeatureContainer = () => {
    return (
        <section className="feature-section bg-white pb-5">
            <div className="container">
                <div className="row justify-content-center text-center">
                    <div className="col-lg-10">
                        <SectionTitle
                            subTitle="Why patients choose Hope Medical"
                            title="<span>Care built</span> around you"
                            classOption="text-center"
                        />
                    </div>
                </div>
                <div className="row justify-content-center mt-4">
                    <div className="col-lg-10">
                        <div
                            className="row icon-box-style justify-content-center text-start"
                            data-aos="fade-up"
                            data-aos-duration="1100"
                        >
                            {HomeData[3].medicalFeature &&
                                HomeData[3].medicalFeature.map(
                                    (single, key) => {
                                        return (
                                            <div key={key} className="col-md-6 mb-4">
                                                <MedicalFeature
                                                    key={key}
                                                    data={single}
                                                />
                                            </div>
                                        );
                                    }
                                )}
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center mt-5">
                    <div
                        className="col-md-8 text-center"
                        data-aos="fade-up"
                        data-aos-duration="1500"
                    >
                        <img
                            src={`${process.env.PUBLIC_URL}/img/photos/doctor-01.png`}
                            alt="hope"
                            className="img-fluid rounded"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MedicalFeatureContainer;
