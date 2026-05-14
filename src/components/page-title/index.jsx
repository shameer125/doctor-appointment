import PropTypes from "prop-types";

const PageTitle = ({ subTitle, title }) => {
    return (
        <div className="text-center [&_.title_span]:text-primary [&_.title_span]:font-bold">
            <p className="mb-2 text-xs font-normal uppercase tracking-wide text-neutral-400">
                {subTitle}
            </p>
            <h4
                className="title text-3xl font-light tracking-tight text-black md:text-4xl [&_span]:text-primary [&_span]:font-bold"
                dangerouslySetInnerHTML={{ __html: title }}
            />
        </div>
    );
};

PageTitle.propTypes = {
    subTitle: PropTypes.string,
    title: PropTypes.string,
};

export default PageTitle;
