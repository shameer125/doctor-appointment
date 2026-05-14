import PropTypes from "prop-types";
import { getSpecialtyOptions } from "../../data/doctors";

export function DoctorFilters({
    searchQuery,
    onSearchChange,
    specialty,
    onSpecialtyChange,
}) {
    const specialties = getSpecialtyOptions();

    return (
        <div className="doctor-filters hope-reveal-fade">
            <div className="row align-items-end">
                <div className="col-md-6 mb-3 mb-md-0">
                    <label htmlFor="doctor-search" className="form-label">
                        Search clinicians
                    </label>
                    <div style={{ position: "relative" }}>
                        <i
                            className="icofont-search-1"
                            style={{
                                position: "absolute",
                                left: "0.875rem",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#9b1f1f",
                                fontSize: "0.9rem",
                                pointerEvents: "none",
                            }}
                        />
                        <input
                            id="doctor-search"
                            type="search"
                            className="form-control"
                            style={{ paddingLeft: "2.5rem" }}
                            placeholder="Name, specialty, or keyword…"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            autoComplete="off"
                        />
                    </div>
                </div>
                <div className="col-md-4">
                    <label htmlFor="doctor-specialty" className="form-label">
                        Filter by specialty
                    </label>
                    <select
                        id="doctor-specialty"
                        className="form-control"
                        value={specialty}
                        onChange={(e) => onSpecialtyChange(e.target.value)}
                    >
                        <option value="">All specialties</option>
                        {specialties.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-2 d-flex" style={{ paddingTop: "1.65rem" }}>
                    {(searchQuery || specialty) && (
                        <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => {
                                onSearchChange("");
                                onSpecialtyChange("");
                            }}
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

DoctorFilters.propTypes = {
    searchQuery: PropTypes.string.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    specialty: PropTypes.string.isRequired,
    onSpecialtyChange: PropTypes.func.isRequired,
};
