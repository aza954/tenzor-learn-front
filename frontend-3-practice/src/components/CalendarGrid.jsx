import { buildCalendarGrid, compareDates, formatDate, isDateSelectable, MONTHS_NOMINATIVE } from '../data/date.js';

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export default function CalendarGrid({ year, month, selectedDay, onDayClick }) {
    const today = new Date();
    return (
        <>
            <div className="calendar-weekdays" aria-hidden="true">
                {WEEKDAYS.map(day => <span key={day}>{day}</span>)}
            </div>
            <div className="calendar-days" role="group" aria-label={`Выберите день: ${MONTHS_NOMINATIVE[month]} ${year}`}>
                {buildCalendarGrid(year, month).flat().map(date => {
                    const key = date.getTime();
                    const day = date.getDate();
                    if (date.getMonth() !== month) {
                        return <span key={key} className="day day--other-month">{day}</span>;
                    }
                    const disabled = !isDateSelectable(day, month, year, today);
                    const selected = compareDates(date, selectedDay) === 0;
                    return (
                        <button
                            key={key}
                            type="button"
                            className={`day${disabled ? ' day--disabled' : ''}${selected ? ' day--selected' : ''}`}
                            disabled={disabled}
                            aria-label={formatDate(date)}
                            aria-pressed={selected}
                            onClick={() => onDayClick(date)}
                        >
                            <span>{day}</span>
                        </button>
                    );
                })}
            </div>
        </>
    );
}
