import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const Logo = ({ image, classOption, alt }) => {
    return (
        <Link className={`${classOption}`} to={process.env.PUBLIC_URL + "/"}>
            <img
                className="block h-auto max-h-10 w-auto max-w-[min(200px,52vw)] object-contain object-left sm:max-h-[46px] lg:max-h-[50px]"
                src={process.env.PUBLIC_URL + image}
                alt={alt}
            />
        </Link>
    );
};

Logo.propTypes = {
    image: PropTypes.string,
    classOption: PropTypes.string,
    alt: PropTypes.string,
};

Logo.defaultProps = {
    classOption: "text-center",
    alt: "Hope Medical",
};

export default Logo;
