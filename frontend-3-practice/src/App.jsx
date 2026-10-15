import { useState } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import BookingProgress from './components/BookingProgress.jsx';
import Calendar from './components/Calendar.jsx';
import TimeSlots from './components/TimeSlots.jsx';
import BookingBottomBar from './components/BookingBottomBar.jsx';
import { compareDates, formatDate } from './data/date.js';
import { getSlotsForDate } from './data/slots.js';

export default function App() {
    // Пять независимых значений состояния; при открытии выбран сегодняшний день.
    const [selectedDay, setSelectedDay] = useState(() => {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), today.getDate());
    });
    const [currentMonth, setCurrentMonth] = useState(() => selectedDay.getMonth());
    const [currentYear, setCurrentYear] = useState(() => selectedDay.getFullYear());
    const [selectedTime, setSelectedTime] = useState(null);
    const [slots, setSlots] = useState(() => getSlotsForDate(selectedDay));

    function handleDayClick(date) {
        if (compareDates(date, new Date()) < 0) return;
        setSelectedDay(date);
        setSelectedTime(null);
        setSlots(getSlotsForDate(date));
    }

    function handleTimeClick(time) {
        if (slots.some(slot => slot.time === time && slot.available)) {
            setSelectedTime(time);
        }
    }

    function handleMonthChange(direction) {
        const nextMonth = new Date(currentYear, currentMonth + direction, 1);
        setCurrentMonth(nextMonth.getMonth());
        setCurrentYear(nextMonth.getFullYear());
    }

    function handleNextClick() {
        if (!selectedTime) return;
        if (compareDates(selectedDay, new Date()) < 0) {
            setSelectedTime(null);
            alert('Этот день уже прошёл. Выберите новую дату.');
            return;
        }
        // Сохраняем поведение нативной версии: других страниц записи в макете нет.
        alert(`Вы выбрали: ${formatDate(selectedDay)} • ${selectedTime}`);
    }

    return (
        <div className="site-shell">
            <Header />
            <main className="booking-page" id="booking">
                <h1 className="booking-name">Запись<br />онлайн</h1>
                <BookingProgress />
                <section className="date-time-section" aria-labelledby="page-title">
                    <div className="page-heading">
                        <h2 id="page-title">Выберите дату и время</h2>
                        <p>Женская стрижка · Марина Орлова</p>
                    </div>
                    <div className="booking-grid">
                        <Calendar
                            year={currentYear}
                            month={currentMonth}
                            selectedDay={selectedDay}
                            onDayClick={handleDayClick}
                            onMonthChange={handleMonthChange}
                        />
                        <TimeSlots selectedDay={selectedDay} selectedTime={selectedTime} slots={slots} onTimeClick={handleTimeClick} />
                    </div>
                    <BookingBottomBar selectedDay={selectedDay} selectedTime={selectedTime} onNextClick={handleNextClick} />
                </section>
            </main>
            <Footer />
        </div>
    );
}
