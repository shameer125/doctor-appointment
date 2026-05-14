import PropTypes from "prop-types";
import { TIME_SLOTS } from "../../constants/timeSlots";
import { isTimeSlotUnavailable } from "../../utils/appointmentStorage";

export function TimeSlotPicker({
    doctorId,
    date,
    value,
    onChange,
    disabled,
    name,
    errorMessage,
}) {
    return (
        <fieldset
            className="time-slot-picker"
            disabled={disabled}
            aria-describedby={
                errorMessage ? "time-slot-picker-error" : undefined
            }
        >
            <legend className="time-slot-picker-legend visually-hidden">
                {name}
            </legend>
            <div className="time-slot-picker-grid" role="group">
                {TIME_SLOTS.map((slot) => {
                    const unavailable =
                        Boolean(date && doctorId) &&
                        isTimeSlotUnavailable(doctorId, date, slot.id);
                    const selected = value === slot.id;
                    return (
                        <button
                            key={slot.id}
                            type="button"
                            className={`time-slot-btn${
                                selected ? " is-selected" : ""
                            }${unavailable ? " is-blocked" : ""}`}
                            disabled={disabled || unavailable || !date}
                            aria-pressed={selected}
                            onClick={() => {
                                if (unavailable) return;
                                onChange(slot.id);
                            }}
                        >
                            <span>{slot.label}</span>
                            {unavailable ? (
                                <span className="time-slot-btn-hint">
                                    Taken
                                </span>
                            ) : null}
                        </button>
                    );
                })}
            </div>
            {!date ? (
                <p className="time-slot-helper small text-muted mb-0">
                    Pick a date to see available times.
                </p>
            ) : null}
            {errorMessage ? (
                <p
                    className="field-error"
                    id="time-slot-picker-error"
                    role="alert"
                >
                    {errorMessage}
                </p>
            ) : null}
        </fieldset>
    );
}

TimeSlotPicker.propTypes = {
    doctorId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    date: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    name: PropTypes.string.isRequired,
    errorMessage: PropTypes.string,
};

TimeSlotPicker.defaultProps = {
    doctorId: undefined,
    date: "",
    value: "",
    disabled: false,
    errorMessage: undefined,
};
