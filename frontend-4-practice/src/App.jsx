import { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import BookingProgress from './components/BookingProgress.jsx';
import Calendar from './components/Calendar.jsx';
import TimeSlots from './components/TimeSlots.jsx';
import BookingBottomBar from './components/BookingBottomBar.jsx';
import { compareDates, formatDate } from './data/date.js';
import { fetchToday, fetchSlots } from './api.js';

export default function App() {
    const [today, setToday] = useState(null);
    const [todayLoading, setTodayLoading] = useState(true);
    const [todayError, setTodayError] = useState('');
    const [todayRetry, setTodayRetry] = useState(0);
    const [currentMonth, setCurrentMonth] = useState(0);
    const [currentYear, setCurrentYear] = useState(0);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [slots, setSlots] = useState([]);
    const [slotsLoading, setSlotsLoading] = useState(true);
    const [slotsError, setSlotsError] = useState('');
    const [slotsRetry, setSlotsRetry] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        let active = true;
        setTodayLoading(true);
        setTodayError('');

        fetchToday({ signal: controller.signal })
            .then(data => {
                if (!active) return;
                const date = new Date(data.year, data.month, data.day);
                setToday(date);
                setCurrentMonth(data.month);
                setCurrentYear(data.year);
                setSelectedDay(date);
            })
            .catch(error => {
                if (!active || error.name === 'AbortError') return;
                setTodayError(`Не удалось загрузить дату. ${error.message}`);
            })
            .finally(() => {
                if (active) setTodayLoading(false);
            });

        return () => {
            active = false;
            controller.abort();
        };
    }, [todayRetry]);

    useEffect(() => {
        if (!selectedDay) return;
        const controller = new AbortController();
        let active = true;
        setSlotsLoading(true);
        setSlotsError('');
        setSlots([]);
        setSelectedTime(null);

        fetchSlots(selectedDay, { signal: controller.signal })
            .then(data => {
                if (!active) return;
                const responseDate = new Date(data.date.year, data.date.month, data.date.day);
                if (compareDates(responseDate, selectedDay) !== 0) {
                    throw new Error('Сервер вернул слоты для другой даты. Выберите день ещё раз.');
                }
                setSlots(data.slots);
            })
            .catch(error => {
                if (!active || error.name === 'AbortError') return;
                setSlotsError(`Не удалось загрузить время. ${error.message}`);
            })
            .finally(() => {
                if (active) setSlotsLoading(false);
            });

        // Отменяем предыдущий запрос и запрещаем его ответу менять состояние.
        return () => {
            active = false;
            controller.abort();
        };
    }, [selectedDay, slotsRetry]);

    function handleDayClick(date) {
        if (compareDates(date, today) < 0 || compareDates(date, selectedDay) === 0) return;
        setSelectedDay(date);
        setSelectedTime(null);
        setSlots([]);
        setSlotsError('');
        setSlotsLoading(true);
    }

    function handleTimeClick(time) {
        if (!slotsLoading && !slotsError && slots.some(slot => slot.time === time && slot.available)) {
            setSelectedTime(time);
        }
    }

    function handleMonthChange(direction) {
        const nextMonth = new Date(currentYear, currentMonth + direction, 1);
        setCurrentMonth(nextMonth.getMonth());
        setCurrentYear(nextMonth.getFullYear());
    }

    function handleNextClick() {
        if (!selectedTime || slotsLoading || slotsError) return;
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
                    {todayLoading ? (
                        <p className="request-message page-message" role="status">Загрузка…</p>
                    ) : todayError ? (
                        <div className="request-error page-message" role="alert">
                            <p>{todayError}</p>
                            <button type="button" className="back-button" onClick={() => setTodayRetry(value => value + 1)}>Повторить</button>
                        </div>
                    ) : selectedDay && (
                        <>
                            <div className="booking-grid">
                                <Calendar
                                    year={currentYear}
                                    month={currentMonth}
                                    today={today}
                                    selectedDay={selectedDay}
                                    onDayClick={handleDayClick}
                                    onMonthChange={handleMonthChange}
                                />
                                <TimeSlots
                                    selectedDay={selectedDay}
                                    selectedTime={selectedTime}
                                    slots={slots}
                                    loading={slotsLoading}
                                    error={slotsError}
                                    onRetry={() => setSlotsRetry(value => value + 1)}
                                    onTimeClick={handleTimeClick}
                                />
                            </div>
                            <BookingBottomBar selectedDay={selectedDay} selectedTime={selectedTime} onNextClick={handleNextClick} />
                        </>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
}
