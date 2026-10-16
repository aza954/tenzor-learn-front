// Месяцы с нулевым индексом, как в new Date().
export const MONTHS_NOMINATIVE = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
export const MONTHS_GENITIVE = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
export const DAYS_OF_WEEK = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда',
    'Четверг', 'Пятница', 'Суббота'];

export function compareDates(date1, date2) {
    const first = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const second = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return Math.sign(first.getTime() - second.getTime());
}

export function isDateSelectable(day, month, year, today) {
    return compareDates(new Date(year, month, day), today) >= 0;
}

export function buildCalendarGrid(year, month) {
    const offset = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cellCount = Math.ceil((offset + daysInMonth) / 7) * 7;
    const weeks = [];
    for (let index = 0; index < cellCount; index += 7) {
        const week = [];
        for (let column = 0; column < 7; column += 1) {
            week.push(new Date(year, month, index + column - offset + 1));
        }
        weeks.push(week);
    }
    return weeks;
}

export function formatDate(date) {
    return `${DAYS_OF_WEEK[date.getDay()]}, ${date.getDate()} ${MONTHS_GENITIVE[date.getMonth()]} ${date.getFullYear()}`;
}
