import React from "react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import HomeData from "../../../data/home.json";
import Intro from "../../../components/intro";

const IntroContainer = () => {
    return (
        <div className="hero-slider-area">
            <Swiper
                className="hero-slider [&_.swiper-slide]:overflow-hidden"
                modules={[Navigation, Autoplay, EffectFade]}
                effect="fade"
                loop
                speed={600}
                spaceBetween={0}
                slidesPerView={1}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                navigation={{
                    nextEl: ".hero-slider .swiper-button-next",
                    prevEl: ".hero-slider .swiper-button-prev",
                }}
            >
                {HomeData[1].slider &&
                    HomeData[1].slider.map((single, key) => {
                        return (
                            <SwiperSlide
                                key={key}
                                className="!flex min-h-[440px] md:!h-[clamp(460px,58vh,560px)] lg:!h-[clamp(520px,62vh,660px)] xl:!h-[clamp(560px,68vh,760px)] 2xl:!h-[clamp(600px,72vh,820px)]"
                            >
                                <Intro key={key} data={single} />
                            </SwiperSlide>
                        );
                    })}
                <div className="swiper-button-prev !absolute !left-3 !top-1/2 z-10 !mt-0 !flex !h-11 !w-11 !-translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-0 bg-white/15 !text-white shadow-md after:!hidden backdrop-blur-sm transition hover:bg-primary md:!left-6">
                    <i className="icofont-arrow-left text-xl" />
                </div>
                <div className="swiper-button-next !absolute !right-3 !top-1/2 z-10 !mt-0 !flex !h-11 !w-11 !-translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-0 bg-white/15 !text-white shadow-md after:!hidden backdrop-blur-sm transition hover:bg-primary md:!right-6">
                    <i className="icofont-arrow-right text-xl" />
                </div>
            </Swiper>
        </div>
    );
};

export default IntroContainer;
