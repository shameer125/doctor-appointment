import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../layouts/index.jsx";
import Header from "../layouts/header";
import Footer from "../layouts/footer";
import ScrollToTop from "../components/scroll-to-top";
import SEO from "../components/seo";
import PageTitleContainer from "../containers/global/page-title";
import { useAuth } from "../context/AuthContext";

import {
    cancelAppointmentById,
    loadAppointments,
} from "../utils/appointmentStorage";
import { AppointmentCard } from "../components/booking/appointment-card";
import { doctorsLandingPath } from "../utils/bookingEntryPath";

const base = process.env.PUBLIC_URL || "";

const MyAppointmentsPage = () => {
    const { user, isAuthenticated } = useAuth();
    const [reloadKey, setReloadKey] = useState(0);

    const items = useMemo(() => {
        if (!user?.email) return [];
        return loadAppointments()
            .filter(
                (a) =>
                    a.accountEmail === user.email &&
                    (a.status === "scheduled" || !a.status)
            )
            .sort((a, b) => {
                const d = String(a.date).localeCompare(String(b.date));
                if (d !== 0) return d;
                return String(a.timeSlot).localeCompare(String(b.timeSlot));
            });
    }, [user?.email, reloadKey]);

    const onCancel = (id) => {
        cancelAppointmentById(id);
        setReloadKey((k) => k + 1);
    };

    return (
        <React.Fragment>
            <Layout>
                <SEO title="My appointments | Hope Medical" />
                <div className="wrapper">
                    <Header />
                    <div className="main-content site-wrapper-reveal">
                        <PageTitleContainer
                            subTitle={
                                isAuthenticated
                                    ? user?.email || ""
                                    : "Sign in to view bookings"
                            }
                            title="Your <span>appointments</span>"
                            image="img/slider/slide1.jpg"
                        />
                        <section className="my-appointments-section py-5">
                            <div className="container">
                                {!isAuthenticated ? (
                                    <div className="booking-auth-prompt">
                                        <h3 className="booking-auth-title">
                                            Sign in to see saved visits
                                        </h3>
                                        <p className="booking-auth-copy">
                                            Appointment history is tied to your
                                            account on this browser.
                                        </p>
                                        <div className="booking-auth-actions">
                                            <Link
                                                className="btn btn-theme"
                                                to={`${base}/login?redirect=${encodeURIComponent(
                                                    `${base}/my-appointments`
                                                )}`}
                                            >
                                                Log in
                                            </Link>
                                            <Link
                                                className="btn btn-outline-secondary border border-secondary"
                                                to={`${base}/signup?redirect=${encodeURIComponent(
                                                    `${base}/my-appointments`
                                                )}`}
                                            >
                                                Create account
                                            </Link>
                                        </div>
                                    </div>
                                ) : items.length === 0 ? (
                                    <div className="my-appointments-empty text-center py-5">
                                        <p className="text-muted mb-4">
                                            You don&apos;t have upcoming visits
                                            booked through this demo yet.
                                        </p>
                                        <Link
                                            className="btn btn-theme"
                                            to={doctorsLandingPath()}
                                        >
                                            Find a clinician
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="row">
                                        <div className="col-lg-8">
                                            <ul className="list-unstyled mb-0">
                                                {items.map((a) => (
                                                    <li
                                                        key={a.id}
                                                        className="mb-4"
                                                    >
                                                        <AppointmentCard
                                                            appointment={a}
                                                            onCancel={onCancel}
                                                        />
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
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


export default MyAppointmentsPage;
