/**
 * AdminRoute — protects admin pages.
 * Redirects to /admin/login if not authenticated as admin.
 */
import PropTypes from "prop-types";
import { Redirect, Route } from "react-router-dom";
import { isAdminLoggedIn } from "../../utils/adminStorage";

const base = process.env.PUBLIC_URL || "";

export default function AdminRoute({ component: Component, ...rest }) {
    return (
        <Route
            {...rest}
            render={(props) => {
                if (!isAdminLoggedIn()) {
                    return <Redirect to={`${base}/admin/login`} />;
                }
                return <Component {...props} />;
            }}
        />
    );
}

AdminRoute.propTypes = { component: PropTypes.elementType.isRequired };
