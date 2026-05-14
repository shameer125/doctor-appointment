/**
 * Local catalog of clinicians (demo data — replace with API in production).
 */
export const DOCTORS = [
    {
        id: "1",
        name: "Dr. Amara Okonkwo",
        title: "MD, Family Medicine",
        specialty: "Family Medicine",
        image: "img/team/01.jpg",
        bio: "Same-day visits, chronic disease management, and preventive care for all ages.",
    },
    {
        id: "2",
        name: "Dr. James Ruiz",
        title: "MD, Internal Medicine",
        specialty: "Internal Medicine",
        image: "img/team/02.jpg",
        bio: "Complex medical conditions, medication reviews, and coordinated specialty referrals.",
    },
    {
        id: "3",
        name: "Dr. Priya Nair",
        title: "MD, Psychiatry",
        specialty: "Psychiatry",
        image: "img/team/03.jpg",
        bio: "Medication management, anxiety and mood disorders, and collaborative care planning.",
    },
    {
        id: "4",
        name: "Dr. Elena Vasquez",
        title: "DO, Pediatrics",
        specialty: "Pediatrics",
        image: "img/team/04.jpg",
        bio: "Well-child visits, immunizations, and developmental support for children and teens.",
    },
    {
        id: "5",
        name: "Dr. Michael Chen",
        title: "MD, Cardiology",
        specialty: "Cardiology",
        image: "img/team/05.jpg",
        bio: "Hypertension, heart risk assessment, and follow-up after cardiology specialty care.",
    },
    {
        id: "6",
        name: "Dr. Sarah Williams",
        title: "PA-C, Urgent Care",
        specialty: "Urgent Care",
        image: "img/team/06.jpg",
        bio: "Acute illness, minor injuries, and rapid access when your PCP is fully booked.",
    },
    {
        id: "7",
        name: "Dr. David Lee",
        title: "MD, Neurology",
        specialty: "Neurology",
        image: "img/team/07.jpg",
        bio: "Expert care for neurological disorders, migraines, and nerve-related conditions.",
    },
    {
        id: "8",
        name: "Dr. Aisha Khan",
        title: "MD, Dermatology",
        specialty: "Dermatology",
        image: "img/team/08.jpg",
        bio: "Skin cancer screenings, acne treatments, and comprehensive dermatological care.",
    },
    {
        id: "9",
        name: "Dr. Robert Smith",
        title: "MD, Orthopedics",
        specialty: "Orthopedics",
        image: "img/team/09.jpg",
        bio: "Joint pain relief, sports injuries, and advanced orthopedic surgical interventions.",
    },
];

export function getDoctorById(id) {
    return DOCTORS.find((d) => String(d.id) === String(id)) || null;
}

export function getSpecialtyOptions() {
    const set = new Set(DOCTORS.map((d) => d.specialty));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
}
