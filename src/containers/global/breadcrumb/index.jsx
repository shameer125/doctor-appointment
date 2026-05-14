import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Breadcrumb = ({ prevs, contentThree }) => {
    return (
        <div className="breadcrumb-area">
            <div className="container">
                <ol className="breadcrumb-list" aria-label="Breadcrumb">
                    {prevs.map((prev) => (
                        <li key={prev.text}>
                            <Link to={process.env.PUBLIC_URL + prev.path}>
                                {prev.text}
                            </Link>
                        </li>
                    ))}
                    {contentThree && (
                        <li className="active" aria-current="page">
                            {contentThree}
                        </li>
                    )}
                </ol>
            </div>
        </div>
    );
};

Breadcrumb.propTypes = {
    prevs: PropTypes.arrayOf(
        PropTypes.shape({
            text: PropTypes.string.isRequired,
            path: PropTypes.string.isRequired,
        })
    ),
    contentThree: PropTypes.string,
};

Breadcrumb.defaultProps = {
    prevs: [],
};

export default Breadcrumb;
