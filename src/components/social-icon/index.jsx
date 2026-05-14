import PropTypes from "prop-types";

const SocialIcon = ({ path, icon, linkClassName }) => {
    const href =
        typeof path === "string" && /^https?:\/\//i.test(path)
            ? path
            : `${process.env.PUBLIC_URL || ""}${path}`;
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center transition-colors ${
                linkClassName || ""
            }`}
        >
            <i className={icon}></i>
        </a>
    );
};

SocialIcon.propTypes = {
    path: PropTypes.string,
    icon: PropTypes.string,
    linkClassName: PropTypes.string,
};

SocialIcon.defaultProps = {
    linkClassName: "",
};

export default SocialIcon;
