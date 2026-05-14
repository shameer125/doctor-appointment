import { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import HomePage           from "./pages/index";
import AboutPage          from "./pages/about";
import ServicePage        from "./pages/service";
import ServiceDetails     from "./templates/service-details";
import BlogPage           from "./pages/blog";
import BlogDetailsPage    from "./templates/blog-details";
import BlogCategory       from "./templates/blog-category";
import BlogTag            from "./templates/blog-tag";
import BlogDate           from "./templates/blog-date";
import BlogAuthor         from "./templates/blog-author";
import ContactPage        from "./pages/contact";
import LoginPage          from "./pages/login";
import SignupPage         from "./pages/signup";
import DoctorsPage        from "./pages/doctors";
import BookDoctorPage     from "./pages/book-doctor";
import MyAppointmentsPage from "./pages/my-appointments";
import NavScrollTop       from "./components/nav-scroll-top";
import { ProtectedRoute } from "./components/auth/protected-route";

// Admin
import AdminRoute         from "./components/admin/AdminRoute";
import AdminLoginPage     from "./pages/admin-login";
import DashboardPage      from "./pages/admin/Dashboard";
import AppointmentsPage   from "./pages/admin/Appointments";
import DoctorsAdminPage   from "./pages/admin/Doctors";
import SlotManagerPage    from "./pages/admin/SlotManager";
import AnalyticsPage      from "./pages/admin/Analytics";

const b = process.env.PUBLIC_URL || "";

const App = () => {
    useEffect(() => { window.history.scrollRestoration = "manual"; }, []);

    return (
        <Router>
            <NavScrollTop>
                <Switch>
                    {/* ── Public site routes ─────────────────────── */}
                    <Route exact path={`${b}/`}                    component={HomePage} />
                    <Route       path={`${b}/doctors`}             component={DoctorsPage} />
                    <Route       path={`${b}/about`}               component={AboutPage} />
                    <Route       path={`${b}/service`}             component={ServicePage} />
                    <Route       path={`${b}/service-details/:id`} component={ServiceDetails} />
                    <Route       path={`${b}/blog`}                component={BlogPage} />
                    <Route       path={`${b}/category/:slug`}      component={BlogCategory} />
                    <Route       path={`${b}/tag/:slug`}           component={BlogTag} />
                    <Route       path={`${b}/date/:date`}          component={BlogDate} />
                    <Route       path={`${b}/author/:author`}      component={BlogAuthor} />
                    <Route       path={`${b}/blog-details/:id`}    component={BlogDetailsPage} />
                    <Route       path={`${b}/contact`}             component={ContactPage} />
                    <Route       path={`${b}/login`}               component={LoginPage} />
                    <Route       path={`${b}/signup`}              component={SignupPage} />

                    {/* ── Protected user routes ──────────────────── */}
                    <ProtectedRoute path={`${b}/book/:doctorId`}    component={BookDoctorPage} />
                    <ProtectedRoute path={`${b}/my-appointments`}   component={MyAppointmentsPage} />

                    {/* ── Admin routes ───────────────────────────── */}
                    <Route       path={`${b}/admin/login`}         component={AdminLoginPage} />
                    <AdminRoute  path={`${b}/admin/dashboard`}     component={DashboardPage} />
                    <AdminRoute  path={`${b}/admin/appointments`}  component={AppointmentsPage} />
                    <AdminRoute  path={`${b}/admin/doctors`}       component={DoctorsAdminPage} />
                    <AdminRoute  path={`${b}/admin/slots`}         component={SlotManagerPage} />
                    <AdminRoute  path={`${b}/admin/analytics`}     component={AnalyticsPage} />
                    {/* Redirect /admin → /admin/dashboard */}
                    <Route exact path={`${b}/admin`}>
                        <Redirect to={`${b}/admin/dashboard`} />
                    </Route>
                </Switch>
            </NavScrollTop>
        </Router>
    );
};

export default App;
