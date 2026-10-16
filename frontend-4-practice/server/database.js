// Дата задаётся на сервере. Для проверки можно заменить на { day: 17, month: 9, year: 2026 }.
const now = new Date();
export const today = { day: now.getDate(), month: now.getMonth(), year: now.getFullYear() };

// Два учебных набора слотов. Формат совпадает с предыдущей практикой.
export const SLOT_SETS = [
    [
        { time: '10:00', available: false },
        { time: '11:30', available: true },
        { time: '13:00', available: false },
        { time: '15:30', available: true },
        { time: '17:00', available: true },
        { time: '18:30', available: true }
    ],
    [
        { time: '10:00', available: true },
        { time: '11:30', available: false },
        { time: '13:00', available: true },
        { time: '15:30', available: false },
        { time: '17:00', available: true },
        { time: '18:30', available: true }
    ]
];

export function getSlotsForDate({ day, month }) {
    return SLOT_SETS[(day + month) % SLOT_SETS.length];
}
