import React, { useId, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { submitBookingRequest } from "../../utils/bookingSubmit";
import { stripDigitsFromName } from "../../utils/inputSanitizeHandlers.js";

const ContactForm = () => {
    const formId = useId();
    const { register, handleSubmit, formState: { errors }, reset, control } = useForm({
        mode: "onBlur",
        defaultValues: { name: "" },
    });

    const [status, setStatus] = useState("idle");
    const [result, setResult] = useState(null);

    const onSubmit = async (data) => {
        setStatus("submitting");
        setResult(null);
        try {
            const res = await submitBookingRequest("contact", data);
            setResult(res);
            if (res.ok) {
                reset({});
            }
        } finally {
            setStatus("idle");
        }
    };

    return (
        <form
            className="contact-form-wrapper"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            data-aos="fade-up"
            data-aos-duration="1200"
        >
            {result?.ok && (
                <div
                    className="booking-form-alert booking-form-alert--success"
                    role="status"
                    aria-live="polite"
                >
                    <p className="mb-2">
                        <strong>Message sent</strong>
                    </p>
                    <p className="mb-2">
                        Reference:{" "}
                        <span className="booking-form-alert__ref">
                            {result.referenceId}
                        </span>
                    </p>
                    <p className="mb-0">
                        Thank you—we will reply as soon as we can during clinic
                        hours.
                    </p>
                    {result.hint && (
                        <p className="mb-0 mt-3" role="note">
                            {result.hint}
                        </p>
                    )}
                </div>
            )}

            <div className="row">
                <div className="col-md-4">
                    <div className="form-group">
                        <label
                            className="visually-hidden"
                            htmlFor={`${formId}-name`}
                        >
                            Your name
                        </label>
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: "Name is required" }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <input
                                    className="form-control"
                                    id={`${formId}-name`}
                                    type="text"
                                    autoComplete="name"
                                    placeholder="Your name *"
                                    inputMode="text"
                                    value={value || ""}
                                    onBlur={onBlur}
                                    onChange={(e) =>
                                        onChange(
                                            stripDigitsFromName(e.target.value)
                                        )
                                    }
                                />
                            )}
                        />
                        {errors.name && (
                            <p className="field-error">{errors.name.message}</p>
                        )}
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="form-group">
                        <label
                            className="visually-hidden"
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
                            className="visually-hidden"
                            htmlFor={`${formId}-subject`}
                        >
                            Subject (optional)
                        </label>
                        <input
                            className="form-control"
                            id={`${formId}-subject`}
                            type="text"
                            name="subject"
                            placeholder="Subject (optional)"
                            {...register("subject")}
                        />
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="form-group mb-0">
                        <label
                            className="visually-hidden"
                            htmlFor={`${formId}-message`}
                        >
                            Message
                        </label>
                        <textarea
                            id={`${formId}-message`}
                            name="message"
                            rows="6"
                            placeholder="Your message *"
                            {...register("message", {
                                required: "Please enter your message",
                                minLength: {
                                    value: 8,
                                    message: "Please add a bit more detail",
                                },
                            })}
                        ></textarea>
                        {errors.message && (
                            <p className="field-error">
                                {errors.message.message}
                            </p>
                        )}
                    </div>
                </div>
                <div className="col-md-12 text-center mt-3">
                    <div className="form-group mb-0">
                        <button
                            className="btn btn-theme btn-block booking-submit-btn"
                            type="submit"
                            disabled={status === "submitting"}
                        >
                            {status === "submitting"
                                ? "Sending…"
                                : "Send message"}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default ContactForm;
