import { formatDate } from '../data/date.js';

export default function BookingBottomBar({ selectedDay, selectedTime, onNextClick }) {
    return (
        <div className="form-actions">
            <button type="button" className="back-button">Назад</button>
            <p className="booking-summary" aria-live="polite">
                {formatDate(selectedDay)} • {selectedTime || 'Выберите время'}
            </p>
            <button type="button" className="next-button" disabled={selectedTime === null} onClick={onNextClick}>Далее</button>
        </div>
    );
}
