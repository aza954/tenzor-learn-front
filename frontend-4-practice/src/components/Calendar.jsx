import CalendarHeader from './CalendarHeader.jsx';
import CalendarGrid from './CalendarGrid.jsx';

export default function Calendar({ year, month, today, selectedDay, onDayClick, onMonthChange }) {
    return (
        <section className="calendar-card" aria-labelledby="calendar-title">
            <CalendarHeader year={year} month={month} onMonthChange={onMonthChange} />
            <CalendarGrid year={year} month={month} today={today} selectedDay={selectedDay} onDayClick={onDayClick} />
        </section>
    );
}
