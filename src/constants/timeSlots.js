/** Discrete slots used for availability checks and booking UI */
export const TIME_SLOTS = [
    { id: "09:00", label: "9:00 AM" },
    { id: "09:30", label: "9:30 AM" },
    { id: "10:00", label: "10:00 AM" },
    { id: "10:30", label: "10:30 AM" },
    { id: "11:00", label: "11:00 AM" },
    { id: "11:30", label: "11:30 AM" },
    { id: "13:00", label: "1:00 PM" },
    { id: "13:30", label: "1:30 PM" },
    { id: "14:00", label: "2:00 PM" },
    { id: "14:30", label: "2:30 PM" },
    { id: "15:00", label: "3:00 PM" },
    { id: "15:30", label: "3:30 PM" },
    { id: "16:00", label: "4:00 PM" },
    { id: "16:30", label: "4:30 PM" },
];

export function getTimeSlotLabel(slotId) {
    return TIME_SLOTS.find((s) => s.id === slotId)?.label || slotId;
}
