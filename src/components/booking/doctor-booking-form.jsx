import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";
import { Fragment, useEffect, useId, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BookingAuthPrompt } from "../auth/booking-auth-prompt";
import { submitBookingRequest } from "../../utils/bookingSubmit";
import { getTimeSlotLabel } from "../../constants/timeSlots";
import {
    isTimeSlotUnavailable,
    saveAppointmentRecord,
} from "../../utils/appointmentStorage";
import { Modal } from "../ui/modal";
import { TimeSlotPicker } from "./time-slot-picker";
import { doctorsLandingPath } from "../../utils/bookingEntryPath";
import {
    stripDigitsFromName,
    stripNonDigitsFromPhone,
} from "../../utils/inputSanitizeHandlers.js";

const base = process.env.PUBLIC_URL || "";

export function DoctorBookingForm({ doctor, variant = "page" }) {
    const formId = useId();
    const { isAuthenticated, user } = useAuth();
    const minDate = useMemo(() => new Date().toISOString().split("T")[0], []);

    const {
        register,
        handleSubmit,
        control,
        reset,
        getValues,
        watch,
        setError,
        clearErrors,
        formState: { errors }
    } = useForm({
        mode: "onBlur",
        defaultValues: {
            name: "",
            phone: "",
            email: "",
            date: "",
            message: "",
            timeSlot: "",
            consent: false,
        },
    });

    const watchDate = watch("date");

    useEffect(() => {
        if (!isAuthenticated || !user?.email) return;
        const v = getValues();
        reset({
            ...v,
            email: user.email,
            name: user?.name || v.name || "",
        });
    }, [isAuthenticated, user?.email, reset, getValues]);

    const [slotNotice, setSlotNotice] = useState("");
    const [status, setStatus] = useState("idle");
    const [apiError, setApiError] = useState("");
    const [successRef, setSuccessRef] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        setSlotNotice("");
    }, [watchDate, doctor?.id]);

    const onSubmit = async (data) => {
        setStatus("submitting");
        setApiError("");
        setSlotNotice("");
        clearErrors("timeSlot");

        if (!data.date || data.date < minDate) {
            setApiError("Please choose today or a future date.");
            setStatus("idle");
            return;
        }

        if (!doctor?.id) {
            setApiError("Missing provider.");
            setStatus("idle");
            return;
        }

        if (
            data.timeSlot &&
            isTimeSlotUnavailable(doctor.id, data.date, data.timeSlot)
        ) {
            const msg =
                "This time slot is unavailable for the selected provider and date. Please choose another time.";
            setSlotNotice(msg);
            setError("timeSlot", { type: "validate", message: msg });
            setStatus("idle");
            return;
        }

        const timeLabel = getTimeSlotLabel(data.timeSlot);
        const enrichedMessage = `Provider: ${doctor.name} (${doctor.specialty}, ID ${doctor.id}). ${data.message}`;

        try {
            const res = await submitBookingRequest("appointment", {
                name: data.name,
                email: data.email,
                phone: data.phone,
                date: data.date,
                timePreference: timeLabel,
                timeSlotId: data.timeSlot,
                message: enrichedMessage,
                doctorId: String(doctor.id),
                doctorName: doctor.name,
                specialty: doctor.specialty,
                consent: data.consent ? "yes" : "",
            });

            if (!res.ok) {
                setApiError(res.error || "Could not complete booking.");
                return;
            }

            saveAppointmentRecord({
                doctorId: String(doctor.id),
                doctorName: doctor.name,
                specialty: doctor.specialty,
                date: data.date,
                timeSlot: data.timeSlot,
                timeSlotLabel: timeLabel,
                name: data.name,
                email: data.email,
                phone: data.phone,
                message: data.message,
                referenceId: res.referenceId,
                accountEmail: user?.email || data.email,
            });

            setSuccessRef(res.referenceId);
            setModalOpen(true);
            reset({
                timeSlot: "",
                date: "",
                name: user?.name || "",
                email: user?.email || "",
                phone: "",
                message: "",
                consent: false,
            });
        } finally {
            setStatus("idle");
        }
    };

    const isCompact = variant === "compact";

    return (
        <Fragment>
            {!isAuthenticated && (
                <BookingAuthPrompt subtitle="Choose a clinician from the directory, sign in or register, then return to complete scheduling." />
            )}

            {isAuthenticated && (
                <>
                    {apiError ? (
                        <div
                            className="booking-form-alert booking-form-alert--error mb-4"
                            role="alert"
                        >
                            {apiError}
                        </div>
                    ) : null}

                    <div
                        className={`doctor-booking-summary${
                            isCompact
                                ? " doctor-booking-summary--compact mb-3"
                                : " mb-4"
                        }`}
                    >
                        <div className="doctor-booking-summary-avatar">
                            <img
                                src={`${base}/${doctor.image}`}
                                alt=""
                                width={80}
                                height={80}
                                loading="lazy"
                            />
                        </div>
                        <div>
                            <p className="doctor-booking-eyebrow mb-1">
                                Selected clinician
                            </p>
                            <h2
                                className={`doctor-booking-name${
                                    isCompact ? " h5 mb-1" : " h4 mb-1"
                                }`}
                            >
                                {doctor.name}
                            </h2>
                            <p className="text-muted small mb-0">
                                {doctor.title} · {doctor.specialty}
                            </p>
                            <Link
                                to={doctorsLandingPath()}
                                className="doctor-booking-change small"
                            >
                                Choose a different clinician
                            </Link>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                        className="doctor-booking-form appointment-booking-form"
                    >
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label
                                        className="form-label visually-hidden"
                                        htmlFor={`${formId}-name`}
                                    >
                                        Full name
                                    </label>
                                    <Controller
                                        name="name"
                                        control={control}
                                        rules={{ required: "Name is required" }}
                                        render={({
                                            field: { onChange, onBlur, value },
                                        }) => (
                                            <input
                                                className="form-control"
                                                id={`${formId}-name`}
                                                type="text"
                                                autoComplete="name"
                                                placeholder="Full name *"
                                                inputMode="text"
                                                value={value || ""}
                                                onBlur={onBlur}
                                                onChange={(e) =>
                                                    onChange(
                                                        stripDigitsFromName(
                                                            e.target.value
                                                        )
                                                    )
                                                }
                                            />
                                        )}
                                    />
                                    {errors.name && (
                                        <p className="field-error">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label
                                        className="form-label visually-hidden"
                                        htmlFor={`${formId}-email`}
                                    >
                                        Email
                                    </label>
                                    <input
                                        className="form-control"
                                        id={`${formId}-email`}
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        placeholder="Email *"
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Enter a valid email",
                                            },
                                        })}
                                    />
                                    {errors.email && (
                                        <p className="field-error">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label
                                        className="form-label visually-hidden"
                                        htmlFor={`${formId}-phone`}
                                    >
                                        Phone
                                    </label>
                                    <Controller
                                        name="phone"
                                        control={control}
                                        rules={{
                                            required: "Phone is required",
                                        }}
                                        render={({
                                            field: { onChange, onBlur, value },
                                        }) => (
                                            <input
                                                className="form-control"
                                                id={`${formId}-phone`}
                                                type="tel"
                                                autoComplete="tel"
                                                placeholder="Digits only — phone *"
                                                inputMode="numeric"
                                                value={value || ""}
                                                onBlur={onBlur}
                                                onChange={(e) =>
                                                    onChange(
                                                        stripNonDigitsFromPhone(
                                                            e.target.value
                                                        )
                                                    )
                                                }
                                            />
                                        )}
                                    />
                                    {errors.phone && (
                                        <p className="field-error">
                                            {errors.phone.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group datepicker-group">
                                    <label
                                        className="form-label icon icofont-calendar"
                                        htmlFor={`${formId}-date`}
                                    >
                                        <span className="visually-hidden">
                                            Visit date
                                        </span>
                                        <input
                                            className="form-control"
                                            id={`${formId}-date`}
                                            type="date"
                                            name="date"
                                            min={minDate}
                                            {...register("date", {
                                                required:
                                                    "Choose a preferred date",
                                            })}
                                        />
                                    </label>
                                    {errors.date && (
                                        <p className="field-error">
                                            {errors.date.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="col-md-8">
                                <div className="form-group mb-3">
                                    <label className="form-label mb-2 d-block">
                                        Available times{" "}
                                        <span className="text-danger">*</span>
                                    </label>
                                    <Controller
                                        name="timeSlot"
                                        control={control}
                                        rules={{
                                            required: "Select a time slot",
                                        }}
                                        render={({ field: { onChange, value } }) => (
                                            <TimeSlotPicker
                                                doctorId={doctor.id}
                                                date={watchDate}
                                                value={value}
                                                onChange={onChange}
                                                disabled={
                                                    status === "submitting"
                                                }
                                                name="Preferred appointment time"
                                                errorMessage={
                                                    errors.timeSlot?.message ||
                                                    slotNotice
                                                }
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="form-group mb-0">
                                    <label
                                        className="visually-hidden"
                                        htmlFor={`${formId}-message`}
                                    >
                                        Visit details
                                    </label>
                                    <textarea
                                        id={`${formId}-message`}
                                        name="message"
                                        rows={isCompact ? 4 : 6}
                                        placeholder="Reason for visit, symptoms, or requests *"
                                        {...register("message", {
                                            required:
                                                "Please describe your visit request",
                                            minLength: {
                                                value: 10,
                                                message:
                                                    "Please add a bit more detail (10+ characters)",
                                            },
                                        })}
                                    />
                                    {errors.message && (
                                        <p className="field-error">
                                            {errors.message.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="col-md-12 mt-3">
                                <label className="booking-consent">
                                    <input
                                        type="checkbox"
                                        name="consent"
                                        {...register("consent", {
                                            required:
                                                "Please confirm we may contact you about this appointment",
                                        })}
                                    />
                                    <span className="booking-consent-label">
                                        I agree to be contacted by Hope Medical
                                        about this appointment using the phone
                                        or email provided. *
                                    </span>
                                </label>
                                {errors.consent && (
                                    <p className="field-error">
                                        {errors.consent.message}
                                    </p>
                                )}
                            </div>
                            <div className="col-md-12 mt-3">
                                <button
                                    className="btn btn-theme booking-submit-btn"
                                    type="submit"
                                    disabled={status === "submitting"}
                                >
                                    {status === "submitting"
                                        ? "Booking…"
                                        : "Confirm appointment"}
                                </button>
                            </div>
                        </div>
                    </form>

                    <Modal
                        open={modalOpen}
                        title="Appointment booked"
                        onClose={() => setModalOpen(false)}
                        ariaDescribedby="booking-success-desc"
                        footer={
                            <>
                                <Link
                                    className="btn btn-theme"
                                    to={`${base}/my-appointments`}
                                    onClick={() => setModalOpen(false)}
                                >
                                    My appointments
                                </Link>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary border border-secondary ms-2"
                                    onClick={() => setModalOpen(false)}
                                >
                                    Close
                                </button>
                            </>
                        }
                    >
                        <p id="booking-success-desc">
                            Thank you—we saved your appointment request with
                            clinician <strong>{doctor.name}</strong>. Reference{" "}
                            <span className="booking-form-alert__ref">
                                {successRef}
                            </span>
                            .
                        </p>
                        <p className="small text-muted mb-0">
                            A confirmation copy is stored in this browser under
                            My Appointments.
                        </p>
                    </Modal>
                </>
            )}
        </Fragment>
    );
}

DoctorBookingForm.propTypes = {
    doctor: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
        name: PropTypes.string.isRequired,
        title: PropTypes.string,
        specialty: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        bio: PropTypes.string,
    }).isRequired,
    variant: PropTypes.oneOf(["page", "compact"]),
};

DoctorBookingForm.defaultProps = {
    variant: "page",
};
