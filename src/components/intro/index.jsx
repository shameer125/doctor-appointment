import Button from "../button";
import PropTypes from "prop-types";
import { useAuth } from "../../context/AuthContext";
import { getBookAppointmentButtonPath } from "../../utils/bookingEntryPath";

const Intro = ({ data }) => {
    const { isAuthenticated } = useAuth();
    return (
        <div
            className="intro-section flex min-h-[440px] w-full flex-col justify-center self-stretch bg-cover bg-center bg-no-repeat py-16 md:min-h-[clamp(460px,58vh,560px)] lg:min-h-[clamp(520px,62vh,660px)] xl:min-h-[clamp(560px,68vh,760px)] 2xl:min-h-[clamp(600px,72vh,820px)]"
            style={{
                backgroundImage: `url(${process.env.PUBLIC_URL + data.backgroundImage})`,
            }}
        >
            <div className="mx-auto w-full max-w-[1200px] px-[15px]">
                <div className="flex flex-wrap">
                    <div className="w-full max-w-full px-[15px] md:w-3/4 lg:w-1/2">
                        <div className="slider-content">
                            <p className="sub-title-hero animate-fade-in-left">
                                {data.subTitle}
                            </p>
                            <h2
                                className="animate-fade-in-left-1500 mb-7"
                                dangerouslySetInnerHTML={{ __html: data.title }}
                            />
                            <div className="flex flex-wrap items-center gap-3 animate-fade-in-left-2000">
                                <Button
                                    path={getBookAppointmentButtonPath(isAuthenticated)}
                                    classOption="btn btn-theme"
                                    text="Book Appointment"
                                />
                                <Button
                                    path="/service"
                                    classOption="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white/70 bg-transparent px-6 py-[0.575rem] text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white hover:bg-white/10"
                                    text="Our Services"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

Intro.propTypes = {
    data: PropTypes.object,
};

export default Intro;
