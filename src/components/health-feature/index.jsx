import PropTypes from "prop-types";

const HealthFeature = ({ data }) => {
    return (
        <div className="media">
            <span className={data.icon} aria-hidden="true"></span>
            <div className="media-body">
                <h4 className="title">{data.title}</h4>
                <p>{data.subTitle}</p>
            </div>
        </div>
    );
};

HealthFeature.propTypes = {
    data: PropTypes.object,
};

export default HealthFeature;
