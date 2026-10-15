import { Fragment } from 'react';

const STEPS = ['Мастер', 'Услуга', 'Дата', 'Контакты', 'Подтверждение'];

export default function BookingProgress() {
    return (
        <nav className="progress" aria-label="Этапы записи">
            {STEPS.map((label, index) => (
                <Fragment key={label}>
                    {index > 0 && (
                        <span className={`step-line${index > 2 ? ' step-line--future' : ''}`} aria-hidden="true" />
                    )}
                    <div
                        className={`progress-step progress-step--${index < 2 ? 'complete' : index === 2 ? 'active' : 'future'}`}
                        aria-current={index === 2 ? 'step' : undefined}
                    >
                        <span className="step-number">{index + 1}</span>
                        <span className="step-label">{label}</span>
                    </div>
                </Fragment>
            ))}
        </nav>
    );
}
