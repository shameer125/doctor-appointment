import { useEffect } from "react";
import { withRouter } from "react-router-dom";

const NavScrollTop = ({ children, location }) => {
    useEffect(() => {
        const { hash } = location;
        if (hash && hash.length > 1) {
            const id = hash.slice(1);
            const run = () => {
                const el = document.getElementById(id);
                if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                } else {
                    window.scrollTo(0, 0);
                }
            };
            requestAnimationFrame(run);
            return;
        }
        window.scrollTo(0, 0);
    }, [location.pathname, location.hash, location.search]);
    return children;
};

export default withRouter(NavScrollTop);
