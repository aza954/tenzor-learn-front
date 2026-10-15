import { formatDate } from '../data/date.js';

export default function TimeSlots({ selectedDay, selectedTime, slots, onTimeClick }) {
    return (
        <section className="time-card" aria-labelledby="time-title">
            <div className="time-heading">
                <h3 id="time-title">Свободное время</h3>
                <p>{formatDate(selectedDay)}</p>
            </div>
            <div className="time-slots" role="group" aria-label="Выберите время">
                {slots.map(slot => (
                    <button
                        key={slot.time}
                        type="button"
                        className={`time-slot${!slot.available ? ' time-slot--busy' : ''}${selectedTime === slot.time ? ' time-slot--selected' : ''}`}
                        disabled={!slot.available}
                        aria-label={slot.available ? slot.time : `${slot.time} — занято`}
                        aria-pressed={selectedTime === slot.time}
                        onClick={() => onTimeClick(slot.time)}
                    >
                        {slot.available ? <span>{slot.time}</span> : slot.time}
                    </button>
                ))}
            </div>
        </section>
    );
}
