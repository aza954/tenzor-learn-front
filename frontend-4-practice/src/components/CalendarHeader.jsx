import { MONTHS_NOMINATIVE } from '../data/date.js';

export default function CalendarHeader({ year, month, onMonthChange }) {
    return (
        <div className="card-heading">
            <h3 id="calendar-title">{MONTHS_NOMINATIVE[month]} {year}</h3>
            <div className="month-controls" aria-label="Переключение месяца">
                <button type="button" className="month-arrow" aria-label="Предыдущий месяц" onClick={() => onMonthChange(-1)}>‹</button>
                <button type="button" className="month-arrow" aria-label="Следующий месяц" onClick={() => onMonthChange(1)}>›</button>
            </div>
        </div>
    );
}
