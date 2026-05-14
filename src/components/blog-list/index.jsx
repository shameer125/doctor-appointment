import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { slugify } from "../../utils";

const BlogListItem = ({ data }) => {
    const cate = data.categories.map((value, i) => {
        return (
            <Link
                className="category text-sm font-semibold uppercase tracking-wider text-theme"
                to={process.env.PUBLIC_URL + `/category/${slugify(value)}`}
                key={i}
            >
                {value}
                {i !== data.categories.length - 1 && <span className="mx-1">,</span>}
            </Link>
        );
    });

    const excerpt = data.body && data.body[0] 
        ? data.body[0].replace(/<[^>]+>/g, '').substring(0, 150) + "..." 
        : "";

    return (
        <div className="post-item bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 mb-8 overflow-hidden border border-gray-100 flex flex-col md:flex-row group">
            <div className="thumb md:w-2/5 overflow-hidden">
                <Link to={process.env.PUBLIC_URL + `/blog-details/${data.id}`} className="block h-full">
                    <img
                        src={`${process.env.PUBLIC_URL}/${data.media.mediumImage}`}
                        alt="hope-Blog"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                </Link>
            </div>
            <div className="content p-6 md:p-8 md:w-3/5 flex flex-col justify-center">
                <div className="mb-2">
                    {cate}
                </div>
                <h4 className="title text-2xl font-bold mb-3 text-gray-900 leading-snug">
                    <Link
                        to={process.env.PUBLIC_URL + `/blog-details/${data.id}`}
                        className="hover:text-theme transition-colors duration-300"
                    >
                        {data.title}
                    </Link>
                </h4>
                <p className="text-gray-600 mb-5 leading-relaxed">
                    {excerpt}
                </p>
                <div className="meta flex items-center text-sm text-gray-500 space-x-3 mt-auto">
                    <Link
                        className="hover:text-theme transition-colors duration-200 flex items-center"
                        to={
                            process.env.PUBLIC_URL +
                            `/date/${slugify(data.date)}`
                        }
                    >
                        <i className="icofont-calendar mr-2"></i> {data.date}
                    </Link>
                    <span>|</span>
                    <Link
                        className="author hover:text-theme transition-colors duration-200 font-medium flex items-center"
                        to={
                            process.env.PUBLIC_URL +
                            `/author/${slugify(data.author)}`
                        }
                    >
                        <i className="icofont-user-alt-3 mr-2"></i> {data.author}
                    </Link>
                </div>
            </div>
        </div>
    );
};

BlogListItem.propTypes = {
    data: PropTypes.object,
};

export default BlogListItem;
