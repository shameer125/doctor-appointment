import PropTypes from "prop-types";

const PageTitleContainer = ({ subTitle, title, image }) => {
    const publicUrl = process.env.PUBLIC_URL;
    return (
        <div
            className="page-title-area"
            style={{ "--page-bg-image": image ? `url(${publicUrl}/${image})` : "none" }}
        >
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-10 text-center">
                        <div className="page-title-content">
                            {subTitle && (
                                <p className="sub-title">{subTitle}</p>
                            )}
                            <h2 dangerouslySetInnerHTML={{ __html: title }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

PageTitleContainer.propTypes = {
    subTitle: PropTypes.string,
    title: PropTypes.string,
    image: PropTypes.string,
};

export default PageTitleContainer;
