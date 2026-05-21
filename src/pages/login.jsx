import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import Layout from "../layouts/index.jsx";
import Header from "../layouts/header";
import Footer from "../layouts/footer";
import ScrollToTop from "../components/scroll-to-top";
import SEO from "../components/seo";
import { useAuth } from "../context/AuthContext.jsx";
import { safeAuthRedirect } from "../utils/authRedirect.js";

const base = process.env.PUBLIC_URL || "";

const LoginPage = () => {
    const history = useHistory();
    const location = useLocation();
    const { login, isAuthenticated, bootstrapped } = useAuth();

    const params = new URLSearchParams(location.search);
    const rawRedirect = params.get("redirect");
    const afterLogin =
        rawRedirect !== null && rawRedirect !== ""
            ? safeAuthRedirect(rawRedirect, "/")
            : "/";

    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: "onBlur",
        defaultValues: { email: "" },
    });

    const [apiError, setApiError] = useState("");
    const [busy, setBusy] = useState(false);
    const [flash, setFlash] = useState("");

    useEffect(() => {
        if (bootstrapped && isAuthenticated) {
            history.replace(afterLogin);
        }
    }, [afterLogin, bootstrapped, history, isAuthenticated]);

    const onSubmit = async (data) => {
        setApiError("");
        setFlash("");
        setBusy(true);
        try {
            const res = await login(data.email);
            if (!res.ok) {
                setApiError(res.error || "Something went wrong.");
                return;
            }
            setFlash("Signed in successfully.");
            window.setTimeout(() => {
                history.push(afterLogin);
            }, 600);
        } finally {
            setBusy(false);
        }
    };

    return (
        <React.Fragment>
            <Layout>
                <SEO title="Log in | Hope Medical" />
                <div className="wrapper">
                    <Header />
                    <div className="main-content site-wrapper-reveal">
                        <section className="auth-page-section bg-gray">
                            <div className="container">
                                <div className="auth-page-card">
                                    <h1>Patient login</h1>
                                    <p className="auth-page-lead">
                                        Enter your email to continue (demo — no
                                        password).
                                    </p>
                                    {flash ? (
                                        <div
                                            className="booking-form-alert booking-form-alert--success mb-3"
                                            role="status"
                                        >
                                            {flash}
                                        </div>
                                    ) : null}
                                    {apiError && (
                                        <div
                                            className="auth-page-error"
                                            role="alert"
                                        >
                                            {apiError}
                                        </div>
                                    )}
                                    <form
                                        onSubmit={handleSubmit(onSubmit)}
                                        noValidate
                                    >
                                        <div className="form-group">
                                            <label className="d-block mb-2 small text-secondary">
                                                Email
                                            </label>
                                            <input
                                                className="form-control"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                placeholder="you@example.com"
                                                {...register("email", {
                                                    required:
                                                        "Please enter your email.",
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message:
                                                            "Please enter a valid email address.",
                                                    },
                                                })}
                                            />
                                            {errors.email && (
                                                <p className="field-error">
                                                    {errors.email.message}
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-theme btn-block mt-3 booking-submit-btn"
                                            disabled={busy}
                                        >
                                            {busy ? "Signing in…" : "Continue"}
                                        </button>
                                    </form>
                                    <p className="auth-page-foot mb-0">
                                        New here?{" "}
                                        <Link
                                            to={`${base}/signup${
                                                location.search || ""
                                            }`}
                                        >
                                            Sign up with email
                                        </Link>
                                    </p>
                                </div>
                                
                            </div>
                        </section>
                    </div>
                    <Footer />
                    <ScrollToTop />
                </div>
            </Layout>
        </React.Fragment>
    );

};

export default LoginPage;
