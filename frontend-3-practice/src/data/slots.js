const SLOT_TIMES = ['10:00', '11:30', '13:00', '15:30', '17:00', '18:30'];

export function getSlotsForDate(date) {
    // Те же учебные интервалы и правила занятости, что в нативной версии.
    const shift = (date.getDate() + date.getMonth()) % SLOT_TIMES.length;
    return SLOT_TIMES.map((time, index) => ({
        time,
        available: index !== shift && index !== (shift + 2) % SLOT_TIMES.length
    }));
}
