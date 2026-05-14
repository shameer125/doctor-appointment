import PropTypes from "prop-types";
import { Redirect, Route } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const base = process.env.PUBLIC_URL || "";

/**
 * Redirects unauthenticated visitors to login with a safe return path.
 * Does not change page layout — only gatekeeping.
 */
export function ProtectedRoute({ component: Component, ...rest }) {
    const { isAuthenticated, bootstrapped } = useAuth();

    return (
        <Route
            {...rest}
            render={(props) => {
                if (!bootstrapped) return null;
                if (!isAuthenticated) {
                    const returnTo = encodeURIComponent(
                        `${props.location.pathname}${props.location.search}${props.location.hash}`
                    );
                    return (
                        <Redirect to={`${base}/login?redirect=${returnTo}`} />
                    );
                }
                return <Component {...props} />;
            }}
        />
    );
}

ProtectedRoute.propTypes = {
    component: PropTypes.elementType.isRequired,
};
