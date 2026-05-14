import PropTypes from "prop-types";

const SectionTitle = ({ subTitle, title, classOption }) => {
    return (
        <div className={`section-title ${classOption || ""}`.trim()}>
            {subTitle && <p className="sub-title">{subTitle}</p>}
            <h2 dangerouslySetInnerHTML={{ __html: title }} />
        </div>
    );
};

SectionTitle.propTypes = {
    subTitle: PropTypes.string,
    title: PropTypes.string,
    classOption: PropTypes.string,
};

SectionTitle.defaultProps = {
    classOption: "",
};

export default SectionTitle;
