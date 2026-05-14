/**
 * seedDemoData — injects realistic sample appointments into localStorage
 * so the admin dashboard has data to display during demos.
 * Called only from the admin dashboard via the "Seed Demo Data" button.
 */
import { saveAppointment, getAppointments, getDoctors } from "./adminStorage";
import { TIME_SLOTS } from "../constants/timeSlots";

const NAMES  = ["Sarah Johnson","Michael Brown","Emily Davis","James Wilson","Olivia Martinez","William Taylor","Ava Thomas","Noah Anderson","Isabella Moore","Liam Jackson","Sophia White","Mason Harris","Charlotte Clark","Ethan Lewis","Amelia Robinson","Alexander Walker","Mia Hall","Henry Young","Harper Allen","Benjamin King"];
const NOTES  = ["Recurring headaches for past 2 weeks","Annual checkup","Follow-up after lab results","Back pain after gym injury","Persistent cough and fatigue","Anxiety management consultation","Child vaccination schedule","Blood pressure monitoring","Heart palpitations","Insomnia and stress","Skin rash on arms","Knee pain — possible sports injury","Diabetic follow-up","Asthma flare-up","General wellness check","","","First visit","Referred by Dr. Chen",""];

export function seedDemoData() {
    const existing = getAppointments();
    if (existing.length >= 15) return 0; // already has data

    const doctors = getDoctors();
    if (doctors.length === 0) return 0;

    let count = 0;
    const today = new Date();

    // 30 sample appointments spread ±14 days from today
    for (let i = 0; i < 30; i++) {
        const doctor = doctors[i % doctors.length];
        const offset = Math.floor(Math.random() * 28) - 7; // -7 to +20
        const d = new Date(today);
        d.setDate(d.getDate() + offset);
        const date = d.toISOString().split("T")[0];

        const slot = TIME_SLOTS[i % TIME_SLOTS.length];
        const nameIdx  = i % NAMES.length;
        const firstName = NAMES[nameIdx].split(" ")[0].toLowerCase();

        // skip if slot already booked (conflict check)
        const conflict = existing.some(a => a.doctorId === doctor.id && a.date === date && a.timeSlot === slot.id);
        if (conflict) continue;

        saveAppointment({
            doctorId:      doctor.id,
            doctorName:    doctor.name,
            specialty:     doctor.specialty,
            date,
            timeSlot:      slot.id,
            timeSlotLabel: slot.label,
            name:          NAMES[nameIdx],
            email:         `${firstName}${nameIdx + 1}@example.com`,
            phone:         `+1-555-${String(1000 + i).padStart(4,"0")}`,
            message:       NOTES[i % NOTES.length],
            referenceId:   `DEMO-${Date.now()}-${i}`,
            accountEmail:  `${firstName}${nameIdx + 1}@example.com`,
            status:        i % 8 === 0 ? "cancelled" : "scheduled",
        });
        count++;
    }
    return count;
}
