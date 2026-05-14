import { useMemo, useState } from "react";
import { DOCTORS } from "../../data/doctors";
import { DoctorFilters } from "../../components/booking/doctor-filters";
import { DoctorCard } from "../../components/booking/doctor-card";

function normalize(s) {
    return (s || "").toLowerCase().trim();
}

export function DoctorsDirectory() {
    const [searchQuery, setSearchQuery] = useState("");
    const [specialty, setSpecialty] = useState("");

    const filtered = useMemo(() => {
        const q = normalize(searchQuery);
        return DOCTORS.filter((d) => {
            const specOk = !specialty || d.specialty === specialty;
            if (!specOk) return false;
            if (!q) return true;
            const hay =
                `${d.name} ${d.title} ${d.specialty} ${d.bio}`.toLowerCase();
            return hay.includes(q);
        });
    }, [searchQuery, specialty]);

    return (
        <div className="doctors-directory">
            <DoctorFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                specialty={specialty}
                onSpecialtyChange={setSpecialty}
            />
            {filtered.length === 0 ? (
                <p className="text-muted">No clinicians match your filters.</p>
            ) : (
                <div className="row">
                    {filtered.map((doctor, i) => (
                        <div key={doctor.id} className="col-md-6 col-xl-4 mb-4">
                            <DoctorCard
                                doctor={doctor}
                                delayClass={`hope-stagger-${Math.min(
                                    i % 6,
                                    5
                                )}`}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
