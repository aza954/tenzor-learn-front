'use strict';

// Данные: месяцы с нулевым индексом, как в new Date().
const MONTHS_NOMINATIVE = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const MONTHS_GENITIVE = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const DAYS_OF_WEEK = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда',
    'Четверг', 'Пятница', 'Суббота'];
const SLOT_TIMES = ['10:00', '11:30', '13:00', '15:30', '17:00', '18:30'];

// Состояние страницы. selectedDay хранит полную дату, независимо от видимого месяца.
const state = {
    currentMonth: 0,
    currentYear: 0,
    selectedDay: null,
    selectedTime: null,
    slots: []
};
let elements;

// Чистые функции: не обращаются к DOM и не меняют состояние.
function compareDates(date1, date2) {
    const first = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const second = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return Math.sign(first.getTime() - second.getTime());
}

function isDateSelectable(day, month, year, today) {
    return compareDates(new Date(year, month, day), today) >= 0;
}

function buildCalendarGrid(year, month) {
    const firstDay = new Date(year, month, 1);
    const offset = (firstDay.getDay() + 6) % 7; // Неделя начинается с понедельника.
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

function getSlotsForDate(date) {
    // Учебные данные: занятые интервалы отличаются в зависимости от дня.
    const shift = (date.getDate() + date.getMonth()) % SLOT_TIMES.length;
    return SLOT_TIMES.map((time, index) => ({
        time,
        available: index !== shift && index !== (shift + 2) % SLOT_TIMES.length
    }));
}

function formatDate(date) {
    return `${DAYS_OF_WEEK[date.getDay()]}, ${date.getDate()} ${MONTHS_GENITIVE[date.getMonth()]} ${date.getFullYear()}`;
}

// Рендер: после innerHTML подписываем новые элементы на события.
function renderCalendar() {
    const today = new Date();
    elements.calendarTitle.textContent = `${MONTHS_NOMINATIVE[state.currentMonth]} ${state.currentYear}`;
    elements.calendarDays.setAttribute('aria-label', `Выберите день: ${elements.calendarTitle.textContent}`);
    elements.calendarDays.innerHTML = buildCalendarGrid(state.currentYear, state.currentMonth)
        .flat().map(date => {
            const day = date.getDate();
            if (date.getMonth() !== state.currentMonth) {
                return `<span class="day day--other-month">${day}</span>`;
            }
            const disabled = !isDateSelectable(day, state.currentMonth, state.currentYear, today);
            const selected = compareDates(date, state.selectedDay) === 0;
            return `<label class="day${disabled ? ' day--disabled' : ''}">
                <input type="radio" name="date" value="${day}" aria-label="${formatDate(date)}"
                    ${disabled ? 'disabled' : ''} ${selected ? 'checked' : ''}>
                <span>${day}</span>
            </label>`;
        }).join('');
    elements.calendarDays.querySelectorAll('input:not(:disabled)').forEach(input => {
        input.addEventListener('change', onDayClick);
    });
}

function renderTimeSlots() {
    elements.timeDate.textContent = formatDate(state.selectedDay);
    elements.timeSlots.innerHTML = state.slots.map(slot => {
        if (!slot.available) {
            return `<span class="time-slot time-slot--busy" aria-label="${slot.time} — занято">${slot.time}</span>`;
        }
        return `<label class="time-slot">
            <input type="radio" name="time" value="${slot.time}" ${state.selectedTime === slot.time ? 'checked' : ''}>
            <span>${slot.time}</span>
        </label>`;
    }).join('');
    elements.timeSlots.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', onTimeSlotClick);
    });
}

function updateBottomBar() {
    elements.summary.textContent = `${formatDate(state.selectedDay)} • ${state.selectedTime || 'Выберите время'}`;
    elements.nextButton.disabled = state.selectedTime === null;
}

// Обработчики.
function onDayClick(event) {
    const day = Number(event.currentTarget.value);
    if (!isDateSelectable(day, state.currentMonth, state.currentYear, new Date())) return;
    state.selectedDay = new Date(state.currentYear, state.currentMonth, day);
    state.selectedTime = null;
    state.slots = getSlotsForDate(state.selectedDay);
    renderCalendar();
    renderTimeSlots();
    updateBottomBar();
}

function onTimeSlotClick(event) {
    const time = event.currentTarget.value;
    if (!state.slots.some(slot => slot.time === time && slot.available)) return;
    state.selectedTime = time;
    updateBottomBar();
}

function setupMonthNavigation() {
    elements.monthArrows.forEach((button, index) => {
        button.addEventListener('click', () => {
            const date = new Date(state.currentYear, state.currentMonth + (index === 0 ? -1 : 1), 1);
            state.currentMonth = date.getMonth();
            state.currentYear = date.getFullYear();
            renderCalendar();
        });
    });
}

function init() {
    elements = {
        calendarTitle: document.querySelector('#calendar-title'),
        calendarDays: document.querySelector('.calendar-days'),
        timeDate: document.querySelector('.time-heading p'),
        timeSlots: document.querySelector('.time-slots'),
        monthArrows: document.querySelectorAll('.month-arrow'),
        summary: document.querySelector('.booking-summary'),
        nextButton: document.querySelector('.next-button')
    };
    const today = new Date();
    state.currentMonth = today.getMonth();
    state.currentYear = today.getFullYear();
    state.selectedDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    state.slots = getSlotsForDate(state.selectedDay);
    renderCalendar();
    renderTimeSlots();
    updateBottomBar();
    setupMonthNavigation();
    elements.nextButton.addEventListener('click', () => {
        if (!state.selectedTime) return;
        if (compareDates(state.selectedDay, new Date()) < 0) {
            state.selectedTime = null;
            renderCalendar();
            renderTimeSlots();
            updateBottomBar();
            alert('Этот день уже прошёл. Выберите новую дату.');
            return;
        }
        // Других страниц в макете нет: показываем выбранные данные.
        alert(`Вы выбрали: ${formatDate(state.selectedDay)} • ${state.selectedTime}`);
    });
}

document.addEventListener('DOMContentLoaded', init);
