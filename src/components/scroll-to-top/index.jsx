import { useEffect, useState } from "react";

const ScrollToTop = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handler = () => setVisible(window.scrollY > 300);
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);

    return (
        <button
            type="button"
            className={`scroll-to-top${visible ? " show" : ""}`}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Scroll to top"
        >
            <i className="icofont-rounded-up" />
        </button>
    );
};

export default ScrollToTop;
